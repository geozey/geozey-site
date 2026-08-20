-- =====================================================================
-- GEOZEY-CORE (ggxanhkixhkmnknslotu)
-- Migration 2026-08-20-01 : cloisonnement des donnees, puis socle
-- d authentification a trois espaces.
--
-- A passer dans l editeur SQL du projet geozey-core, sous le compte
-- Geozey, dans l ordre des fichiers db/ de ce depot.
-- Idempotent : peut etre rejoue sans dommage.
--
-- POURQUOI CE FICHIER EXISTE
-- Un audit du 20/08/2026 a montre que trois tables du schema public
-- n etaient pas couvertes par une policy restrictive et restaient donc
-- atteignables par le role anon. Le detail de la mesure est consigne
-- dans la memoire de pilotage, pas ici : ce depot est public, et
-- decrire precisement un defaut encore ouvert reviendrait a en publier
-- le mode d emploi.
--
-- Ce qui n est PAS en cause : les cles. Une cle publishable est
-- publique par conception, elle est faite pour vivre dans le
-- navigateur. Ce sont les policies qui portent le droit, et ce sont
-- elles que ce fichier reecrit, table par table, sans en laisser une
-- seule au hasard.
-- =====================================================================


-- =====================================================================
-- PARTIE 0 — OUTILLAGE
-- Deux fonctions utilitaires dont tout le reste du fichier depend.
-- =====================================================================

-- Horodatage de derniere modification, pose en trigger sur les tables
-- qui portent une colonne maj_le.
create or replace function public.touch_maj_le() returns trigger
language plpgsql as $$
begin new.maj_le := now(); return new; end $$;

-- Remet une table a zero de policy avant de reecrire son intention.
-- On n ajuste pas une policy trop large, on la remplace : une policy
-- oubliee est une porte laissee ouverte.
create or replace function public.raz_policies(nom text) returns void
language plpgsql as $$
declare p record;
begin
  if to_regclass('public.'||nom) is null then return; end if;
  execute format('alter table public.%I enable row level security', nom);
  for p in select policyname from pg_policies
            where schemaname='public' and tablename=nom loop
    execute format('drop policy %I on public.%I', p.policyname, nom);
  end loop;
end $$;


-- =====================================================================
-- PARTIE 1 — FERMETURE IMMEDIATE
-- On ne repare pas une policy trop large, on remet la table a zero de
-- policy puis on reecrit l intention. Une policy oubliee est une porte
-- laissee ouverte.
-- =====================================================================

do $$
declare
  t text;
  p record;
begin
  foreach t in array array['profils','prospects','matches','contacts'] loop
    if to_regclass('public.'||t) is null then
      raise notice 'table public.% absente, ignoree', t;
      continue;
    end if;
    execute format('alter table public.%I enable row level security', t);
    for p in
      select policyname from pg_policies
       where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy %I on public.%I', p.policyname, t);
      raise notice 'policy % supprimee sur %', p.policyname, t;
    end loop;
  end loop;
end $$;

-- Ceinture en plus des bretelles : meme si une policy revenait par
-- accident, anon n a plus le droit SQL de toucher ces tables.
do $$
declare t text;
begin
  foreach t in array array['profils','prospects','matches','contacts'] loop
    if to_regclass('public.'||t) is not null then
      execute format('revoke all on public.%I from anon', t);
    end if;
  end loop;
end $$;

-- Les vues heritent des droits de leur proprietaire. Une vue ouverte a
-- anon sur une table fermee annule la fermeture.
do $$
declare v record;
begin
  for v in
    select table_name from information_schema.views where table_schema = 'public'
  loop
    execute format('revoke all on public.%I from anon', v.table_name);
  end loop;
end $$;


-- =====================================================================
-- PARTIE 2 — LA TABLE DES ROLES
-- app_users est la seule source de verite du droit. auth.users dit qui
-- s est authentifie, app_users dit ce que cette personne a le droit de
-- voir. Un compte auth sans ligne ici ne voit rien, par construction.
-- =====================================================================

create table if not exists public.app_users (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text not null,
  nom               text,
  role              text not null check (role in ('admin','client','freelance')),
  societe_boond_id  bigint,
  profil_boond_id   bigint,
  actif             boolean not null default true,
  cree_le           timestamptz not null default now(),
  maj_le            timestamptz not null default now()
);

-- Rattrapage si la table preexiste avec un sous-ensemble de colonnes.
alter table public.app_users add column if not exists societe_boond_id bigint;
alter table public.app_users add column if not exists profil_boond_id  bigint;
alter table public.app_users add column if not exists actif   boolean not null default true;
alter table public.app_users add column if not exists cree_le timestamptz not null default now();
alter table public.app_users add column if not exists maj_le  timestamptz not null default now();

comment on column public.app_users.societe_boond_id is
  'Client uniquement. Perimetre de visibilite : il ne verra que les missions de cette societe.';
comment on column public.app_users.profil_boond_id is
  'Freelance uniquement. Perimetre de visibilite : il ne verra que cette fiche du vivier, la sienne.';

-- Un client sans societe et un freelance sans fiche sont des comptes
-- mal ouverts. Sans cette contrainte ils verraient zero ligne et le
-- support conclurait a une panne au lieu d un parametrage manquant.
alter table public.app_users drop constraint if exists app_users_perimetre_coherent;
alter table public.app_users add constraint app_users_perimetre_coherent check (
      (role = 'admin')
   or (role = 'client'    and societe_boond_id is not null)
   or (role = 'freelance' and profil_boond_id  is not null)
);

create index if not exists app_users_role_idx    on public.app_users (role);
create index if not exists app_users_societe_idx on public.app_users (societe_boond_id);


-- La table des propositions est creee ici, avant les policies, parce
-- que la policy de lecture des missions par un freelance la reference :
-- une policy est analysee a sa creation, sa table cible doit exister.
create table if not exists public.propositions (
  id               uuid primary key default gen_random_uuid(),
  mission_id       uuid not null references public.missions(id) on delete cascade,
  profil_boond_id  bigint not null,
  score            smallint check (score between 0 and 100),
  motif            text,
  statut           text not null default 'proposee'
                   check (statut in ('proposee','vue_client','retenue','ecartee','pourvue')),
  cree_le          timestamptz not null default now(),
  maj_le           timestamptz not null default now(),
  constraint propositions_unicite unique (mission_id, profil_boond_id)
);

create index if not exists propositions_mission_idx on public.propositions (mission_id);
create index if not exists propositions_profil_idx  on public.propositions (profil_boond_id);

drop trigger if exists propositions_touch on public.propositions;
create trigger propositions_touch before update on public.propositions
  for each row execute function public.touch_maj_le();


-- =====================================================================
-- PARTIE 3 — LES TROIS FONCTIONS D IDENTITE
-- Une policy qui lit app_users declencherait la policy de app_users,
-- donc une recursion infinie. Ces fonctions sont SECURITY DEFINER :
-- elles lisent app_users hors RLS et ne rendent qu une valeur scalaire.
-- Elles ne rendent JAMAIS de donnee metier, seulement le perimetre.
-- search_path fige, sinon un schema pose par un tiers pourrait les
-- detourner.
-- =====================================================================

create or replace function public.app_role() returns text
language sql stable security definer set search_path = public, pg_temp as $$
  select role from public.app_users where id = auth.uid() and actif;
$$;

create or replace function public.app_societe() returns bigint
language sql stable security definer set search_path = public, pg_temp as $$
  select societe_boond_id from public.app_users
   where id = auth.uid() and actif and role = 'client';
$$;

create or replace function public.app_profil() returns bigint
language sql stable security definer set search_path = public, pg_temp as $$
  select profil_boond_id from public.app_users
   where id = auth.uid() and actif and role = 'freelance';
$$;

create or replace function public.est_admin() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(public.app_role() = 'admin', false);
$$;

revoke all on function public.app_role(), public.app_societe(),
                      public.app_profil(), public.est_admin() from public, anon;
grant execute on function public.app_role(), public.app_societe(),
                          public.app_profil(), public.est_admin() to authenticated;


-- =====================================================================
-- PARTIE 4 — POLICIES, TABLE PAR TABLE
-- Regle de lecture des blocs : on efface tout, on reecrit. Chaque
-- policy nommee ci-dessous est la liste complete de ce qui est permis.
-- =====================================================================

-- ---------------------------------------------------------------- app_users
select public.raz_policies('app_users');

-- Chacun lit sa propre ligne. C est ce que fait l ecran de connexion
-- pour savoir dans quel espace envoyer la personne.
create policy app_users_moi on public.app_users
  for select to authenticated using (id = auth.uid());

-- L administrateur voit et gere tous les comptes.
create policy app_users_admin_lit on public.app_users
  for select to authenticated using (public.est_admin());
create policy app_users_admin_ecrit on public.app_users
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- Personne ne modifie son propre role. L absence de policy UPDATE pour
-- le simple authentifie est volontaire et c est la garantie centrale :
-- un freelance ne peut pas se promouvoir administrateur.


-- ---------------------------------------------------------------------
-- DEFAUT MESURE LE 20/08, corrige ici. Le moteur de matching lit
-- profil.zone, profil.presence et profil.secteur. Ces trois colonnes
-- n existaient pas dans cache_profils. Les axes Zone (5 points),
-- Presence (6) et Secteur (14) tombaient donc a zero des qu une mission
-- les exigeait : vingt-cinq points sur cent perdus par tout le vivier,
-- en silence. Les colonnes sont creees vides, elles se rempliront par
-- l import Boond et par le passeport freelance.
-- ---------------------------------------------------------------------
alter table public.cache_profils add column if not exists zone      text;
alter table public.cache_profils add column if not exists presence  text;
alter table public.cache_profils add column if not exists secteur   text;
alter table public.cache_profils add column if not exists secteurs  text[];
alter table public.cache_profils add column if not exists linkedin  text;
alter table public.cache_profils add column if not exists cv_url    text;

-- ------------------------------------------------------------ cache_profils
-- Le vivier. Admin : tout. Freelance : sa fiche, et lui seul.
-- Client : rien du vivier en direct, il ne voit que les profils qu on
-- lui a explicitement proposes, via la table propositions.
select public.raz_policies('cache_profils');

create policy cache_profils_admin on public.cache_profils
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

create policy cache_profils_freelance_lit on public.cache_profils
  for select to authenticated
  using (public.app_profil() is not null and boond_id = public.app_profil());

-- Le freelance met a jour SON passeport, jamais celui d un autre.
-- with check identique au using : sans lui, il pourrait modifier sa
-- ligne pour lui donner le boond_id de quelqu un d autre.
create policy cache_profils_freelance_ecrit on public.cache_profils
  for update to authenticated
  using  (public.app_profil() is not null and boond_id = public.app_profil())
  with check (public.app_profil() is not null and boond_id = public.app_profil());

-- ----------------------------------------------------------- cache_societes
select public.raz_policies('cache_societes');

create policy cache_societes_admin on public.cache_societes
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

create policy cache_societes_client on public.cache_societes
  for select to authenticated
  using (public.app_societe() is not null and boond_id = public.app_societe());

-- ----------------------------------------------------------- cache_contacts
select public.raz_policies('cache_contacts');

create policy cache_contacts_admin on public.cache_contacts
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

create policy cache_contacts_client on public.cache_contacts
  for select to authenticated
  using (public.app_societe() is not null and societe_boond_id = public.app_societe());

-- ----------------------------------------------------------------- missions
select public.raz_policies('missions');

create policy missions_admin on public.missions
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- Le client voit ses missions et rien d autre. C est le critere de fin
-- du palier B du cahier des charges du 04/08.
create policy missions_client on public.missions
  for select to authenticated
  using (public.app_societe() is not null and societe_boond_id = public.app_societe());

-- Le freelance voit les missions sur lesquelles il a ete propose. Pas
-- le carnet de commandes complet.
create policy missions_freelance on public.missions
  for select to authenticated
  using (
    public.app_profil() is not null
    and exists (
      select 1 from public.propositions pr
       where pr.mission_id = missions.id
         and pr.profil_boond_id = public.app_profil()
    )
  );

-- ------------------------------------------------------------------ matches
-- MISE AU POINT DU 20/08 : cette table n est PAS le matching de
-- l application metier. Ses colonnes reelles sont profil_id, cible_type
-- valant signal ou prospect, signal_id, prospect_id, score_match,
-- criteres, rationale, recommandation. C est l outil de sourcing, il
-- appartient au poste de commande, pas aux clients ni aux freelances.
-- Le matching mission contre vivier de l application se calcule dans le
-- navigateur et se materialise dans propositions, plus bas.
select public.raz_policies('matches');

create policy matches_admin on public.matches
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- ------------------------------------------------------------- propositions
-- La seule fenetre du client sur le vivier, et elle est nominative et
-- volontaire : l administrateur decide quel profil il propose, sur
-- quelle mission. Sans cette table, ouvrir le vivier au client
-- reviendrait a lui donner le carnet d adresses de Geozey.
select public.raz_policies('propositions');

create policy propositions_admin on public.propositions
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

create policy propositions_client_lit on public.propositions
  for select to authenticated
  using (
    public.app_societe() is not null
    and exists (
      select 1 from public.missions mi
       where mi.id = propositions.mission_id
         and mi.societe_boond_id = public.app_societe()
    )
  );

-- Le client se prononce, il ne cree ni ne supprime rien.
create policy propositions_client_arbitre on public.propositions
  for update to authenticated
  using (
    public.app_societe() is not null
    and exists (select 1 from public.missions mi
                 where mi.id = propositions.mission_id
                   and mi.societe_boond_id = public.app_societe())
  )
  with check (
    public.app_societe() is not null
    and statut in ('vue_client','retenue','ecartee')
    and exists (select 1 from public.missions mi
                 where mi.id = propositions.mission_id
                   and mi.societe_boond_id = public.app_societe())
  );

create policy propositions_freelance_lit on public.propositions
  for select to authenticated
  using (public.app_profil() is not null and profil_boond_id = public.app_profil());

-- ------------------------------------------------------------------ profils
-- Table des candidatures spontanees, celle qui fuyait. Reservee a
-- l administrateur en lecture. L ecriture par le formulaire public
-- passe par qualifications, pas par ici.
select public.raz_policies('profils');

create policy profils_admin on public.profils
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- ---------------------------------------------------------------- prospects
select public.raz_policies('prospects');

create policy prospects_admin on public.prospects
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- ----------------------------------------------------------------- contacts
select public.raz_policies('contacts');

create policy contacts_admin on public.contacts
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- ----------------------------------------------------------- qualifications
-- Le formulaire public de candidature ecrit ici avec la cle anon. Ce
-- droit d ecriture est voulu et documente dans supabase-config.js. Ce
-- qui ne doit jamais exister, c est un droit de LECTURE pour anon.
select public.raz_policies('qualifications');

create policy qualifications_depot_public on public.qualifications
  for insert to anon with check (true);

create policy qualifications_admin on public.qualifications
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- ------------------------------------------------------------- sync_journal
select public.raz_policies('sync_journal');

create policy sync_journal_lecture on public.sync_journal
  for select to authenticated using (public.app_role() is not null);
create policy sync_journal_admin on public.sync_journal
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- ------------------------------------------------------- profils_sourcing
select public.raz_policies('profils_sourcing');
create policy profils_sourcing_admin on public.profils_sourcing
  for all to authenticated using (public.est_admin()) with check (public.est_admin());


-- =====================================================================
-- PARTIE 5 — HORODATAGE
-- =====================================================================

drop trigger if exists app_users_touch on public.app_users;
create trigger app_users_touch before update on public.app_users
  for each row execute function public.touch_maj_le();


-- =====================================================================
-- PARTIE 6 — CONTROLE DE FERMETURE
-- A lire apres execution. La colonne verdict doit valoir FERME partout.
-- =====================================================================

select t.tablename                                as table_,
       t.rowsecurity                              as rls_active,
       count(p.policyname) filter (where 'anon' = any(p.roles)) as policies_anon,
       case
         when not t.rowsecurity then 'OUVERT, RLS desactive'
         when count(p.policyname) filter (
                where 'anon' = any(p.roles) and p.cmd <> 'INSERT') > 0
           then 'OUVERT, anon peut lire ou ecrire'
         else 'FERME'
       end                                        as verdict
  from pg_tables t
  left join pg_policies p on p.schemaname = t.schemaname and p.tablename = t.tablename
 where t.schemaname = 'public'
 group by t.tablename, t.rowsecurity
 order by 4 desc, 1;
