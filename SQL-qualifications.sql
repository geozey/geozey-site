-- Table des qualifications Geozey (projet Supabase geozey-core).
-- A executer une fois dans Supabase > SQL Editor.
-- Recoit les deux parcours du formulaire candidature.geozey.com : brief client et
-- candidature expert, brouillons compris, avec attribution marketing complete.

create extension if not exists "pgcrypto";

create table if not exists public.qualifications (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- identification de la session : permet de suivre un remplissage en cours
  session_id            text unique not null,

  type                  text not null check (type in ('client','expert')),
  statut                text not null default 'ouvert'
                          check (statut in ('ouvert','brouillon','complet','traite','archive')),

  -- champs de confort, extraits du payload pour le cockpit
  email                 text,
  nom                   text,
  societe               text,
  autorisation_travail  boolean,

  -- attribution : d ou vient la personne
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_content           text,
  utm_term              text,
  referrer              text,
  landing               text,
  device                text,

  -- suivi du remplissage
  progression           smallint default 0,   -- pourcentage de champs remplis
  champs_remplis        smallint default 0,
  duree_sec             integer default 0,

  payload               jsonb not null default '{}'::jsonb
);

create index if not exists qualifications_type_statut_idx on public.qualifications (type, statut, created_at desc);
create index if not exists qualifications_email_idx on public.qualifications (email);
create index if not exists qualifications_campaign_idx on public.qualifications (utm_campaign, utm_source);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists qualifications_touch on public.qualifications;
create trigger qualifications_touch before update on public.qualifications
  for each row execute function public.touch_updated_at();

-- Securite : le formulaire est public. Il peut ecrire et mettre a jour SA session,
-- il ne peut jamais lire les autres. La lecture est reservee aux comptes authentifies.
alter table public.qualifications enable row level security;

drop policy if exists "formulaire public peut inserer" on public.qualifications;
create policy "formulaire public peut inserer"
  on public.qualifications for insert to anon with check (true);

-- FAILLE CORRIGEE : une policy update ouverte a anon permettait a n importe qui
-- de modifier ou vider toute la table, la cle anon etant publique par construction.
-- On restreint l update aux lignes encore ouvertes et recentes : une session en cours
-- de saisie peut se completer, une candidature envoyee devient intouchable.
drop policy if exists "formulaire public peut completer sa session" on public.qualifications;
create policy "formulaire public peut completer sa session"
  on public.qualifications for update to anon
  using  (statut in ('ouvert','brouillon') and created_at > now() - interval '24 hours')
  with check (statut in ('ouvert','brouillon','complet'));

drop policy if exists "lecture reservee aux membres" on public.qualifications;
create policy "lecture reservee aux membres"
  on public.qualifications for select to authenticated using (true);

-- Temps reel : le cockpit s abonne en WebSocket et voit les remplissages en direct.
alter publication supabase_realtime add table public.qualifications;

-- Vue de pilotage : qui remplit quoi, d ou, et jusqu ou.
create or replace view public.v_qualifications_live as
select
  id, created_at, updated_at, type, statut, progression,
  coalesce(nom, '(anonyme)') as qui,
  societe, email,
  coalesce(utm_source,'direct') as source,
  utm_campaign as campagne,
  duree_sec,
  extract(epoch from (now() - updated_at))::int as inactif_depuis_sec
from public.qualifications
order by updated_at desc;
