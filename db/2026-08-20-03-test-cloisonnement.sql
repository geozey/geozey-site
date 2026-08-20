-- =====================================================================
-- GEOZEY-CORE — TEST REEL DE CLOISONNEMENT
--
-- Le cahier des charges du 04/08 pose le critere de fin du palier B en
-- ces termes : un compte client de test ne peut acceder a aucune donnee
-- d un autre client, VERIFIE PAR TEST ET NON PAR RELECTURE DE CODE.
-- Ce fichier est ce test.
--
-- Il n interroge pas l application : il se met a la place de chaque
-- compte au niveau de la base, la ou les policies s appliquent. Un
-- ecran peut mentir, une policy non. C est donc la preuve la plus dure
-- que l on puisse produire, et elle couvre aussi l acces direct a
-- l API REST, que l ecran ne protege pas.
--
-- MECANIQUE : chaque bloc ouvre une transaction, se declare
-- authentifie sous l identifiant d un compte, compte ce qu il voit,
-- puis annule la transaction. Rien n est ecrit, le test est rejouable
-- autant de fois que voulu.
--
-- PREALABLE, geste humain, une seule fois :
--   Authentication > Users > Add user, avec Auto Confirm User, pour
--   trois comptes de test, puis leur donner un role dans app_users.
--   Voir la partie 0 ci-dessous. Aucun mot de passe n est manipule ici.
-- =====================================================================


-- =====================================================================
-- PARTIE 0 — LES TROIS IDENTITES DE TEST
-- A adapter aux adresses reellement creees, puis executer une fois.
-- Les identifiants de societe et de profil doivent exister dans
-- cache_societes.boond_id et cache_profils.boond_id, sinon le test
-- mesurera un perimetre vide et conclura a tort au cloisonnement.
-- =====================================================================

-- Reperes disponibles, a lire avant de choisir :
--   select boond_id, nom from public.cache_societes order by nom;
--   select boond_id, type_boond, nom, prenom from public.cache_profils order by nom;

/*
insert into public.app_users (id, email, nom, role, societe_boond_id)
select id, email, 'Client de test A', 'client', 1
  from auth.users where email = 'test-client-a@geozey.com'
on conflict (id) do update set role='client', societe_boond_id=1, actif=true;

insert into public.app_users (id, email, nom, role, societe_boond_id)
select id, email, 'Client de test B', 'client', 2
  from auth.users where email = 'test-client-b@geozey.com'
on conflict (id) do update set role='client', societe_boond_id=2, actif=true;

insert into public.app_users (id, email, nom, role, profil_boond_id)
select id, email, 'Freelance de test', 'freelance', 8
  from auth.users where email = 'test-freelance@geozey.com'
on conflict (id) do update set role='freelance', profil_boond_id=8, actif=true;
*/


-- =====================================================================
-- REFERENCE — CE QUE CONTIENT LA BASE, VU SANS AUCUNE RESTRICTION
-- C est le denominateur du test. Sans lui, zero ligne vue par un client
-- pourrait aussi bien vouloir dire base vide que cloisonnement reussi.
-- =====================================================================

select 'REFERENCE, sans restriction' as vue,
       (select count(*) from public.cache_profils)  as vivier,
       (select count(*) from public.cache_societes) as societes,
       (select count(*) from public.missions)       as missions,
       (select count(*) from public.propositions)   as propositions,
       (select count(*) from public.documents)      as documents,
       (select count(*) from public.profils)        as candidatures,
       (select count(*) from public.prospects)      as prospects;


-- =====================================================================
-- TEST 1 — LE VISITEUR NON CONNECTE
-- C est celui qui a echoue lors de l audit du 20/08. Il doit desormais
-- rendre zero partout, le depot d une qualification restant la seule
-- action ouverte au public.
-- =====================================================================

begin;
  set local role anon;
  select 'T1 anon' as test,
         (select count(*) from public.cache_profils)  as vivier,
         (select count(*) from public.missions)       as missions,
         (select count(*) from public.profils)        as candidatures,
         (select count(*) from public.prospects)      as prospects,
         (select count(*) from public.matches)        as matches,
         (select count(*) from public.documents)      as documents,
         'attendu : 0 partout' as verdict_attendu;
rollback;


-- =====================================================================
-- TEST 2 — LE CLIENT A
-- Il doit voir ses missions, ses propositions, ses documents envoyes,
-- et RIEN du vivier ni des autres clients.
-- =====================================================================

begin;
  select set_config('request.jwt.claims',
         json_build_object('sub', id, 'role', 'authenticated')::text, true)
    from public.app_users where email = 'test-client-a@geozey.com';
  set local role authenticated;

  select 'T2 client A' as test,
         (select count(*) from public.cache_profils)  as vivier_attendu_0,
         (select count(*) from public.profils)        as candidatures_attendu_0,
         (select count(*) from public.prospects)      as prospects_attendu_0,
         (select count(*) from public.matches)        as matches_attendu_0,
         (select count(*) from public.app_users)      as comptes_attendu_1,
         (select count(*) from public.cache_societes) as societes_attendu_1,
         (select count(*) from public.missions)       as missions_de_A_seulement,
         (select count(*) from public.documents)      as docs_envoyes_de_A_seulement;

  -- Fuite transversale : aucune mission visible ne doit appartenir a
  -- une autre societe que la sienne. Cette requete doit rendre 0 ligne.
  select 'T2 FUITE, mission d un autre client visible' as alerte, m.*
    from public.missions m
   where m.societe_boond_id is distinct from public.app_societe();

  -- Aucun document non envoye ne doit apparaitre. 0 ligne attendue.
  select 'T2 FUITE, document non envoye visible' as alerte, d.reference, d.statut
    from public.documents d where d.statut <> 'envoye';
rollback;


-- =====================================================================
-- TEST 3 — LE CLIENT B
-- Meme mesure, autre societe. Les deux ensembles doivent etre disjoints.
-- =====================================================================

begin;
  select set_config('request.jwt.claims',
         json_build_object('sub', id, 'role', 'authenticated')::text, true)
    from public.app_users where email = 'test-client-b@geozey.com';
  set local role authenticated;

  select 'T3 client B' as test,
         (select count(*) from public.missions)  as missions_de_B_seulement,
         (select count(*) from public.documents) as docs_envoyes_de_B_seulement;

  select 'T3 FUITE, mission d un autre client visible' as alerte, m.reference, m.intitule
    from public.missions m
   where m.societe_boond_id is distinct from public.app_societe();
rollback;


-- =====================================================================
-- TEST 4 — LE FREELANCE
-- Il voit sa fiche et ses propres depots. Pas le vivier, pas les
-- clients, pas les documents des autres.
-- =====================================================================

begin;
  select set_config('request.jwt.claims',
         json_build_object('sub', id, 'role', 'authenticated')::text, true)
    from public.app_users where email = 'test-freelance@geozey.com';
  set local role authenticated;

  select 'T4 freelance' as test,
         (select count(*) from public.cache_profils)  as fiche_attendu_1,
         (select count(*) from public.cache_societes) as societes_attendu_0,
         (select count(*) from public.cache_contacts) as contacts_attendu_0,
         (select count(*) from public.profils)        as candidatures_attendu_0,
         (select count(*) from public.prospects)      as prospects_attendu_0;

  select 'T4 FUITE, fiche d un autre profil visible' as alerte, p.boond_id, p.nom
    from public.cache_profils p
   where p.boond_id is distinct from public.app_profil();

  select 'T4 FUITE, document d un autre deposant visible' as alerte, d.reference
    from public.documents d where d.depose_par <> auth.uid();
rollback;


-- =====================================================================
-- TEST 5 — L ESCALADE DE PRIVILEGE
-- La question qui compte vraiment : un freelance peut-il se promouvoir
-- administrateur ? Le bloc doit ECHOUER. Une execution qui reussit est
-- une faille, pas un succes.
-- =====================================================================

begin;
  select set_config('request.jwt.claims',
         json_build_object('sub', id, 'role', 'authenticated')::text, true)
    from public.app_users where email = 'test-freelance@geozey.com';
  set local role authenticated;

  -- Attendu : 0 ligne mise a jour, aucune policy UPDATE ne s applique.
  update public.app_users set role = 'admin' where id = auth.uid()
  returning 'T5 ECHEC DU TEST, escalade reussie' as alerte, email, role;

  -- Attendu : 0 ligne. Il ne peut pas s attribuer la fiche d un autre.
  update public.cache_profils set email = 'detourne@example.com'
   where boond_id is distinct from public.app_profil()
  returning 'T5 ECHEC DU TEST, fiche d autrui modifiee' as alerte, boond_id;
rollback;


-- =====================================================================
-- TEST 6 — LE RACCOURCI INTERDIT DU FLUX DOCUMENTAIRE
-- Un freelance ne doit pas pouvoir declarer son document envoye et le
-- faire apparaitre chez le client sans passer par Yacine.
-- Attendu : exception Transition refusee. Un succes est une faille.
-- =====================================================================

begin;
  select set_config('request.jwt.claims',
         json_build_object('sub', id, 'role', 'authenticated')::text, true)
    from public.app_users where email = 'test-freelance@geozey.com';
  set local role authenticated;

  update public.documents set statut = 'envoye'
   where depose_par = auth.uid() and statut = 'depose';
rollback;


-- =====================================================================
-- TEST 7 — L ADMINISTRATEUR
-- Contre-epreuve. Si l administrateur ne voit pas tout, le
-- cloisonnement est trop serre et l application est inutilisable.
-- =====================================================================

begin;
  select set_config('request.jwt.claims',
         json_build_object('sub', id, 'role', 'authenticated')::text, true)
    from public.app_users where email = 'yacine@geozey.com';
  set local role authenticated;

  select 'T7 admin' as test,
         (select count(*) from public.cache_profils)  as vivier_complet,
         (select count(*) from public.cache_societes) as societes,
         (select count(*) from public.missions)       as missions,
         (select count(*) from public.documents)      as documents,
         (select count(*) from public.profils)        as candidatures;
rollback;


-- =====================================================================
-- GRILLE DE LECTURE, a reporter dans cockpit_memory apres execution
--
--  T1  anon             tout a 0                       sinon la fuite persiste
--  T2  client A         vivier 0, missions = les siennes, 0 ligne de fuite
--  T3  client B         missions = les siennes, 0 ligne de fuite
--  T4  freelance        fiche 1, societes 0, 0 ligne de fuite
--  T5  escalade         DOIT ne rien mettre a jour
--  T6  raccourci envoi  DOIT lever une exception
--  T7  admin            retrouve les chiffres de la REFERENCE
--
-- Le test n est reussi que si les sept lignes sont conformes. Six sur
-- sept n est pas un cloisonnement, c est une fuite documentee.
-- =====================================================================
