-- ---------------------------------------------------------------------------
-- Geozey — les formulaires publics ecrivent par une porte unique
-- Fichier 04, projet geozey-core (ggxanhkixhkmnknslotu). Rejouable.
--
-- CE QUI ETAIT CASSE, ET DEPUIS QUAND
--
-- 1. Le navigateur garde `gz_sid` dans localStorage, sans expiration. Un
--    visiteur qui revient reutilise donc exactement le meme identifiant de
--    session que sa visite precedente.
-- 2. `qualifications.session_id` porte une contrainte UNIQUE. Le POST du
--    visiteur qui revient part donc en 409, et le code de la page rattrape
--    ce 409 par un PATCH.
-- 3. Aucune policy UPDATE anon n existait. PostgREST repond 204 a un PATCH
--    qui ne touche AUCUNE ligne : cote page, `response.ok` vaut true. Le
--    visiteur lit « Recu », et rien n a ete ecrit.
-- 4. Meme pour un visiteur neuf : seul le tout premier POST passait. Toutes
--    les ecritures suivantes etaient des PATCH, donc perdues. Le passage a
--    `statut = 'complet'` n arrivait jamais en base.
-- 5. Les deux triggers de notification ne se declenchent que sur
--    `statut = 'complet'`. Comme aucune ligne n y arrivait jamais, aucun mail
--    n est jamais parti. `notifications_envoyees` etait vide, et ce vide
--    n etait pas une panne de Brevo : c est le trigger qui n a jamais eu lieu.
--
-- Preuve dans la donnee avant correction : 6 lignes en tout depuis le 03/08,
-- toutes en `brouillon`, toutes a 1 ou 2 champs remplis — c est-a-dire
-- exactement le contenu de la premiere sauvegarde automatique, et rien apres.
--
-- LA CORRECTION
--
-- On supprime la classe entiere de pannes plutot que le symptome : le site
-- public n ecrit plus jamais dans la table. Il appelle UNE fonction, qui fait
-- un upsert sur `session_id`. Plus de 409 possible, plus de PATCH muet, plus
-- de policy a satisfaire pour anon. Une erreur redevient une erreur visible.
-- ---------------------------------------------------------------------------

begin;

-- ------------------------------------------------------------- 1. la porte
create or replace function public.enregistrer_qualification(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
declare
  sid   text  := nullif(trim(p->>'session_id'), '');
  genre text  := nullif(p->>'type', '');
  etat  text  := coalesce(nullif(p->>'statut', ''), 'brouillon');
  corps jsonb := coalesce(p->'payload', '{}'::jsonb);
  avant public.qualifications%rowtype;
  apres public.qualifications%rowtype;
begin
  -- Pot de miel. Un robot remplit le champ cache : on repond bien, sans ecrire.
  if coalesce(corps->>'site_web_confirmation', '') <> '' then
    return jsonb_build_object('ok', true, 'ignore', true);
  end if;

  if sid is null or length(sid) < 8 or length(sid) > 64 then
    raise exception 'session invalide' using errcode = '22023';
  end if;
  if genre is null or genre not in ('client', 'expert') then
    raise exception 'type invalide' using errcode = '22023';
  end if;
  if etat not in ('brouillon', 'complet') then
    raise exception 'statut invalide' using errcode = '22023';
  end if;
  if pg_column_size(corps) > 100000 then
    raise exception 'contenu trop volumineux' using errcode = '22023';
  end if;

  select * into avant from public.qualifications where session_id = sid;

  if found then
    -- Une ligne que Geozey a deja prise en main ne se reecrit pas du dehors.
    if avant.statut in ('traite', 'archive') then
      return jsonb_build_object('ok', true, 'fige', true, 'id', avant.id);
    end if;
    -- Un dossier envoye ne redevient pas brouillon : ce serait le cas du
    -- `pagehide` qui part APRES le clic d envoi et ecraserait le depot.
    if avant.statut = 'complet' and etat = 'brouillon' then
      return jsonb_build_object('ok', true, 'fige', true, 'id', avant.id);
    end if;
    if avant.created_at < now() - interval '30 days' then
      raise exception 'session expiree' using errcode = '22023';
    end if;
  end if;

  insert into public.qualifications as q (
    session_id, type, statut, email, nom, societe, autorisation_travail,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    referrer, landing, device, progression, champs_remplis, duree_sec,
    payload, cv_storage_path, cv_nom_fichier
  ) values (
    sid, genre, etat,
    nullif(p->>'email', ''), nullif(p->>'nom', ''), nullif(p->>'societe', ''),
    (p->>'autorisation_travail')::boolean,
    nullif(p->>'utm_source', ''), nullif(p->>'utm_medium', ''), nullif(p->>'utm_campaign', ''),
    nullif(p->>'utm_content', ''), nullif(p->>'utm_term', ''),
    nullif(p->>'referrer', ''), nullif(p->>'landing', ''), nullif(p->>'device', ''),
    coalesce((p->>'progression')::smallint, 0),
    coalesce((p->>'champs_remplis')::smallint, 0),
    coalesce((p->>'duree_sec')::integer, 0),
    corps,
    nullif(p->>'cv_storage_path', ''), nullif(p->>'cv_nom_fichier', '')
  )
  on conflict (session_id) do update set
    type                 = excluded.type,
    statut               = excluded.statut,
    -- Un champ vide n efface pas ce qui etait deja su : le depot du CV et la
    -- sauvegarde du texte partent de deux endroits differents de la page.
    email                = coalesce(excluded.email, q.email),
    nom                  = coalesce(excluded.nom, q.nom),
    societe              = coalesce(excluded.societe, q.societe),
    autorisation_travail = coalesce(excluded.autorisation_travail, q.autorisation_travail),
    -- L attribution se fige a la premiere visite, elle ne se reecrit pas.
    utm_source           = coalesce(q.utm_source, excluded.utm_source),
    utm_medium           = coalesce(q.utm_medium, excluded.utm_medium),
    utm_campaign         = coalesce(q.utm_campaign, excluded.utm_campaign),
    utm_content          = coalesce(q.utm_content, excluded.utm_content),
    utm_term             = coalesce(q.utm_term, excluded.utm_term),
    referrer             = coalesce(q.referrer, excluded.referrer),
    landing              = coalesce(q.landing, excluded.landing),
    device               = excluded.device,
    progression          = greatest(coalesce(excluded.progression, 0), coalesce(q.progression, 0)),
    champs_remplis       = greatest(coalesce(excluded.champs_remplis, 0), coalesce(q.champs_remplis, 0)),
    duree_sec            = greatest(coalesce(excluded.duree_sec, 0), coalesce(q.duree_sec, 0)),
    payload              = case when excluded.payload = '{}'::jsonb then q.payload else excluded.payload end,
    cv_storage_path      = coalesce(excluded.cv_storage_path, q.cv_storage_path),
    cv_nom_fichier       = coalesce(excluded.cv_nom_fichier, q.cv_nom_fichier)
  returning * into apres;

  return jsonb_build_object('ok', true, 'id', apres.id, 'statut', apres.statut);
end
$fn$;

comment on function public.enregistrer_qualification(jsonb) is
  'Seule ecriture autorisee au site public sur qualifications. Upsert sur session_id.';

-- --------------------------------------------------------------- 2. les droits
-- anon n a plus aucun droit de table : ni lire, ni ecrire, ni supprimer. Il
-- n a qu une porte, et cette porte a des serrures. Avant ce fichier, anon
-- detenait arwdDxtm sur la table : seule la RLS filtrait.
revoke all on public.qualifications          from anon;
revoke all on public.notifications_envoyees  from anon, authenticated;

drop policy if exists qualifications_depot_public on public.qualifications;

revoke all on function public.enregistrer_qualification(jsonb) from public;
grant  execute on function public.enregistrer_qualification(jsonb) to anon, authenticated;

-- ---------------------------------------------------- 3. le mail, deux boites
-- Meme corps qu avant, deux destinataires au lieu d un : la boite nominative
-- de Yacine et la boite generique du site.
create or replace function public.notifier_qualification()
returns trigger
language plpgsql
security definer
set search_path to 'public', 'extensions', 'vault'
as $function$
declare
  cle text; corps jsonb; rep extensions.http_response;
  sujet text; lignes text := ''; k text; v text;
begin
  select decrypted_secret into cle from vault.decrypted_secrets where name = 'brevo_api_key' limit 1;
  if cle is null then
    insert into public.notifications_envoyees (qualification_id, destinataire, sujet, statut_http, reponse)
    values (new.id, 'yacine@geozey.com', 'cle brevo absente du coffre', 0,
            'Ajouter le secret brevo_api_key dans Vault');
    return new;
  end if;

  sujet := case when new.type = 'expert' then 'Nouvelle candidature expert : '
                else 'Nouveau brief client : ' end
           || coalesce(new.nom, 'sans nom') || coalesce(' - ' || new.societe, '');

  for k, v in select key, value from jsonb_each_text(new.payload) loop
    if k <> 'site_web_confirmation' then
      lignes := lignes
        || '<tr><td style="padding:6px 16px 6px 0;font-family:monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#575756;vertical-align:top">'
        || k || '</td><td style="padding:6px 0;font-size:15px">' || coalesce(v, '') || '</td></tr>';
    end if;
  end loop;

  corps := jsonb_build_object(
    'sender',  jsonb_build_object('name', 'Geozey', 'email', 'noreply@geozey.com'),
    'to',      jsonb_build_array(
                 jsonb_build_object('email', 'yacine@geozey.com', 'name', 'Yacine Djebrouni'),
                 jsonb_build_object('email', 'contact@geozey.com', 'name', 'Geozey')),
    'replyTo', jsonb_build_object('email', coalesce(new.email, 'noreply@geozey.com')),
    'subject', sujet,
    'htmlContent',
      '<div style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;color:#1e1e1e;max-width:640px">'
      || '<div style="background:#1e1e1e;padding:26px 30px;border-bottom:3px solid #FF4512">'
      || '<div style="font-family:monospace;font-size:10px;letter-spacing:2.3px;text-transform:uppercase;color:#FF4512">'
      || case when new.type = 'expert' then 'Candidature expert' else 'Brief client' end
      || '</div><div style="color:#fff;font-size:24px;margin-top:10px">'
      || coalesce(new.nom, 'Sans nom')
      || '</div></div><div style="padding:30px"><table style="width:100%;border-collapse:collapse">'
      || lignes
      || '</table><p style="margin-top:28px;font-size:14px;color:#575756">Recu le '
      || to_char(new.created_at, 'DD/MM/YYYY a HH24hMI')
      || ' - source ' || coalesce(new.utm_source, 'direct')
      || ' - progression ' || coalesce(new.progression, 0) || ' %</p>'
      || '<p style="margin-top:20px"><a href="https://geozey.com/app/" style="display:inline-block;background:#FF4512;color:#fff;padding:12px 22px;border-radius:27px;text-decoration:none;font-size:15px">Ouvrir l application</a></p>'
      || '</div></div>');

  select * into rep from extensions.http((
    'POST',
    'https://api.brevo.com/v3/smtp/email',
    array[extensions.http_header('api-key', cle), extensions.http_header('accept', 'application/json')],
    'application/json',
    corps::text
  )::extensions.http_request);

  insert into public.notifications_envoyees (qualification_id, destinataire, sujet, statut_http, reponse)
  values (new.id, 'yacine@geozey.com, contact@geozey.com', sujet, rep.status, left(rep.content, 400));
  return new;
exception when others then
  insert into public.notifications_envoyees (qualification_id, destinataire, sujet, statut_http, reponse)
  values (new.id, 'yacine@geozey.com', 'erreur', -1, left(SQLERRM, 400));
  return new;
end
$function$;

commit;
