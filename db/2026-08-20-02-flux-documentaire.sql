-- =====================================================================
-- GEOZEY-CORE (ggxanhkixhkmnknslotu)
-- Migration 2026-08-20-02 : le flux documentaire.
--
-- A passer APRES 2026-08-20-01, qui pose app_users et les fonctions
-- d identite dont ce fichier depend.
--
-- CE QUE LE FLUX DOIT GARANTIR, dans l ordre du cadrage du 19/08 :
--   1. le freelance depose un fichier destine a un client
--   2. la charte Geozey est appliquee au document
--   3. une previsualisation existe avant tout envoi
--   4. Yacine valide, ou renvoie en correction
--   5. et seulement alors le client peut le voir
--
-- La regle non negociable est la cinquieme. Un client ne doit jamais
-- pouvoir atteindre un document qui n a pas ete valide, ni par l ecran,
-- ni par l API, ni par une URL de stockage devinee. C est pour cela que
-- la garde vit dans les policies et dans un trigger, pas dans le
-- JavaScript de la page : le JavaScript, on peut le contourner.
-- =====================================================================


-- =====================================================================
-- PARTIE 1 — LES DOCUMENTS
-- =====================================================================

create table if not exists public.documents (
  id                    uuid primary key default gen_random_uuid(),
  reference             text unique,
  titre                 text not null,
  nature                text not null default 'livrable'
                        check (nature in ('livrable','rapport','planning','compte_rendu','cv','autre')),

  -- Qui l a depose, et pour qui
  depose_par            uuid not null references public.app_users(id),
  profil_boond_id       bigint,
  mission_id            uuid references public.missions(id) on delete set null,
  societe_boond_id      bigint not null,

  -- Les deux fichiers : la source telle que deposee, et la version
  -- mise a la charte. La source n est JAMAIS servie au client.
  chemin_source         text,
  nom_source            text,
  type_source           text,
  taille_source         bigint,
  chemin_formate        text,

  statut                text not null default 'depose'
                        check (statut in ('depose','en_mise_au_format','pret_validation',
                                          'a_corriger','valide','envoye')),

  commentaire_freelance text,
  commentaire_yacine    text,

  cree_le               timestamptz not null default now(),
  maj_le                timestamptz not null default now(),
  formate_le            timestamptz,
  valide_le             timestamptz,
  valide_par            uuid references public.app_users(id),
  envoye_le             timestamptz,

  -- Un document pret a valider sans version formatee n a rien a montrer
  -- a Yacine. La contrainte l interdit plutot que de le laisser passer.
  constraint documents_formate_avant_validation check (
    statut not in ('pret_validation','valide','envoye') or chemin_formate is not null
  ),
  constraint documents_source_presente check (
    statut = 'depose' or chemin_source is not null
  )
);

create index if not exists documents_societe_idx on public.documents (societe_boond_id);
create index if not exists documents_statut_idx  on public.documents (statut);
create index if not exists documents_mission_idx on public.documents (mission_id);
create index if not exists documents_auteur_idx  on public.documents (depose_par);

drop trigger if exists documents_touch on public.documents;
create trigger documents_touch before update on public.documents
  for each row execute function public.touch_maj_le();

-- Reference lisible, du type DOC-20260820-004. Elle sert dans les
-- echanges par mail : un identifiant technique ne se dicte pas au
-- telephone.
create or replace function public.documents_reference() returns trigger
language plpgsql as $$
declare n int;
begin
  if new.reference is null then
    select count(*) + 1 into n from public.documents
     where cree_le::date = current_date;
    new.reference := 'DOC-' || to_char(current_date,'YYYYMMDD') || '-' || lpad(n::text,3,'0');
  end if;
  return new;
end $$;

drop trigger if exists documents_ref on public.documents;
create trigger documents_ref before insert on public.documents
  for each row execute function public.documents_reference();


-- =====================================================================
-- PARTIE 2 — LE JOURNAL
-- Append-only. Il repond a la question qui a valide quoi et quand,
-- des mois apres, quand plus personne ne s en souvient.
-- =====================================================================

create table if not exists public.document_events (
  id            bigserial primary key,
  document_id   uuid not null references public.documents(id) on delete cascade,
  acteur        uuid references public.app_users(id),
  acteur_role   text,
  de_statut     text,
  vers_statut   text,
  commentaire   text,
  fait_le       timestamptz not null default now()
);

create index if not exists document_events_doc_idx on public.document_events (document_id, fait_le desc);


-- =====================================================================
-- PARTIE 3 — LES TRANSITIONS AUTORISEES
-- Le graphe est ferme. Tout ce qui n est pas cite est refuse, y compris
-- le raccourci qui compte le plus : depose vers envoye.
-- =====================================================================

create or replace function public.documents_transition() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  r text := public.app_role();
  permis boolean := false;
begin
  if new.statut = old.statut then
    return new;
  end if;

  -- Yacine et le poste de commande mènent le document du depot a l envoi.
  if r = 'admin' then
    permis := (old.statut, new.statut) in (
      ('depose','en_mise_au_format'),
      ('en_mise_au_format','pret_validation'),
      ('pret_validation','valide'),
      ('pret_validation','a_corriger'),
      ('valide','envoye'),
      ('valide','a_corriger'),
      ('a_corriger','en_mise_au_format'),
      ('depose','a_corriger')
    );
  -- Le freelance ne fait que redeposer apres une demande de correction.
  elsif r = 'freelance' then
    permis := (old.statut, new.statut) in (('a_corriger','depose'));
  end if;

  if not permis then
    raise exception
      'Transition refusee : % ne peut pas faire passer un document de % a %',
      coalesce(r,'un compte sans role'), old.statut, new.statut
      using errcode = 'check_violation';
  end if;

  if new.statut = 'valide' then
    new.valide_le  := now();
    new.valide_par := auth.uid();
  end if;
  if new.statut = 'envoye'          then new.envoye_le  := now(); end if;
  if new.statut = 'pret_validation' then new.formate_le := now(); end if;

  insert into public.document_events
    (document_id, acteur, acteur_role, de_statut, vers_statut, commentaire)
  values
    (new.id, auth.uid(), r, old.statut, new.statut,
     coalesce(new.commentaire_yacine, new.commentaire_freelance));

  return new;
end $$;

drop trigger if exists documents_transition_ctrl on public.documents;
create trigger documents_transition_ctrl before update of statut on public.documents
  for each row execute function public.documents_transition();

create or replace function public.documents_depot() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.document_events
    (document_id, acteur, acteur_role, de_statut, vers_statut, commentaire)
  values (new.id, auth.uid(), public.app_role(), null, new.statut, new.commentaire_freelance);
  return new;
end $$;

drop trigger if exists documents_depot_journal on public.documents;
create trigger documents_depot_journal after insert on public.documents
  for each row execute function public.documents_depot();


-- =====================================================================
-- PARTIE 4 — QUI VOIT QUOI
-- =====================================================================

select public.raz_policies('documents');

create policy documents_admin on public.documents
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- Le freelance voit ce qu il a depose, du debut a la fin. Il suit son
-- document jusqu a l envoi, c est ce qui evite les relances par mail.
create policy documents_freelance_lit on public.documents
  for select to authenticated using (depose_par = auth.uid());

create policy documents_freelance_depose on public.documents
  for insert to authenticated
  with check (
    public.app_role() = 'freelance'
    and depose_par = auth.uid()
    and statut = 'depose'
  );

-- Il peut corriger son depot tant que Yacine ne l a pas pris en main,
-- ou quand celui-ci le lui renvoie. Jamais apres validation.
create policy documents_freelance_corrige on public.documents
  for update to authenticated
  using (depose_par = auth.uid() and statut in ('depose','a_corriger'))
  with check (depose_par = auth.uid() and statut in ('depose','a_corriger'));

-- LA REGLE CENTRALE. Le client ne voit un document que quand il a ete
-- valide PUIS envoye, et seulement ceux de sa societe. Aucun brouillon,
-- aucune version en correction, rien de ce qui est encore en interne.
create policy documents_client_lit on public.documents
  for select to authenticated
  using (
    public.app_societe() is not null
    and societe_boond_id = public.app_societe()
    and statut = 'envoye'
  );

select public.raz_policies('document_events');

create policy document_events_admin on public.document_events
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

create policy document_events_freelance on public.document_events
  for select to authenticated
  using (exists (select 1 from public.documents d
                  where d.id = document_events.document_id
                    and d.depose_par = auth.uid()));

-- Le client voit l historique des seuls documents qu il peut deja voir.
create policy document_events_client on public.document_events
  for select to authenticated
  using (exists (select 1 from public.documents d
                  where d.id = document_events.document_id
                    and d.statut = 'envoye'
                    and public.app_societe() is not null
                    and d.societe_boond_id = public.app_societe()));


-- =====================================================================
-- PARTIE 5 — LE STOCKAGE
-- Un fichier protege dans la base et libre dans le stockage n est pas
-- protege. Les policies ci-dessous rejouent exactement les memes regles
-- sur les objets eux-memes.
--
-- Convention de chemin, elle porte le controle :
--   sources/<document_id>/<nom du fichier>    source deposee
--   livrables/<document_id>/<nom du fichier>  version mise a la charte
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('documents-metier','documents-metier', false)
on conflict (id) do update set public = false;

create or replace function public.doc_du_chemin(chemin text) returns uuid
language sql immutable as $$
  select case
    when split_part(chemin,'/',2) ~ '^[0-9a-f-]{36}$'
    then split_part(chemin,'/',2)::uuid
  end;
$$;

do $$
declare p record;
begin
  for p in select policyname from pg_policies
            where schemaname='storage' and tablename='objects'
              and policyname like 'geozey_doc%' loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

create policy geozey_doc_admin on storage.objects
  for all to authenticated
  using      (bucket_id = 'documents-metier' and public.est_admin())
  with check (bucket_id = 'documents-metier' and public.est_admin());

create policy geozey_doc_freelance_depose on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'documents-metier'
    and name like 'sources/%'
    and public.app_role() = 'freelance'
    and exists (select 1 from public.documents d
                 where d.id = public.doc_du_chemin(name)
                   and d.depose_par = auth.uid())
  );

create policy geozey_doc_freelance_lit on storage.objects
  for select to authenticated
  using (
    bucket_id = 'documents-metier'
    and exists (select 1 from public.documents d
                 where d.id = public.doc_du_chemin(name)
                   and d.depose_par = auth.uid())
  );

-- Le client n atteint que les livrables, jamais les sources, et
-- uniquement ceux de sa societe une fois envoyes.
create policy geozey_doc_client_lit on storage.objects
  for select to authenticated
  using (
    bucket_id = 'documents-metier'
    and name like 'livrables/%'
    and public.app_societe() is not null
    and exists (select 1 from public.documents d
                 where d.id = public.doc_du_chemin(name)
                   and d.statut = 'envoye'
                   and d.societe_boond_id = public.app_societe())
  );


-- =====================================================================
-- PARTIE 6 — VUE DE PILOTAGE POUR YACINE
-- Ce qui attend une action de sa part, en haut, et rien d autre.
-- =====================================================================

create or replace view public.v_documents_a_traiter
with (security_invoker = true) as
select d.id, d.reference, d.titre, d.nature, d.statut,
       d.societe_boond_id, s.nom as societe,
       d.mission_id, m.intitule as mission,
       u.nom as depose_par_nom, u.email as depose_par_email,
       d.cree_le, d.maj_le,
       extract(day from now() - d.maj_le)::int as jours_d_attente,
       case d.statut
         when 'depose'            then 'A mettre au format'
         when 'en_mise_au_format' then 'Mise au format en cours'
         when 'pret_validation'   then 'A VALIDER'
         when 'a_corriger'        then 'Chez le freelance'
         when 'valide'            then 'A envoyer au client'
         when 'envoye'            then 'Termine'
       end as action_attendue
  from public.documents d
  left join public.cache_societes s on s.boond_id = d.societe_boond_id
  left join public.missions       m on m.id       = d.mission_id
  left join public.app_users      u on u.id       = d.depose_par
 where d.statut <> 'envoye'
 order by case d.statut when 'pret_validation' then 0 when 'valide' then 1
                        when 'depose' then 2 else 3 end,
          d.maj_le;

revoke all on public.v_documents_a_traiter from anon;
grant select on public.v_documents_a_traiter to authenticated;


-- =====================================================================
-- CONTROLE. Le graphe des transitions doit se lire ici.
-- =====================================================================

select 'documents'       as objet, count(*) as lignes from public.documents
union all
select 'document_events', count(*) from public.document_events
union all
select 'bucket documents-metier', count(*) from storage.buckets where id='documents-metier';
