-- =====================================================================
-- GEOZEY-CORE — TEST REEL DE CLOISONNEMENT
--
-- Le cahier des charges du 04/08 pose le critere de fin du palier B en
-- ces termes : un compte client de test ne peut acceder a aucune donnee
-- d un autre client, VERIFIE PAR TEST ET NON PAR RELECTURE DE CODE.
-- Ce fichier est ce test.
--
-- JOUE EN PRODUCTION LE 20/08/2026 sur geozey-core. Les sept resultats
-- sont conformes. Le detail des mesures est en fin de fichier.
--
-- IL NE DEMANDE AUCUN COMPTE PREEXISTANT. Une premiere version exigeait
-- que trois comptes soient crees a la main dans Authentication > Users.
-- C etait une dependance inutile : le test monte ses propres identites
-- dans une transaction, mesure, puis ANNULE. Rien n est ecrit, aucun
-- compte ne survit, aucun mot de passe n existe. Verifie apres coup :
-- zero residu dans auth.users, app_users, missions et documents.
--
-- Il ne teste pas l application mais la BASE, la ou les policies
-- s appliquent. Un ecran peut mentir, une policy non. Le test couvre
-- donc aussi l acces direct a l API REST, que l ecran ne protege pas.
--
-- CE QU IL A TROUVE, et c est sa raison d etre : une RECURSION INFINIE
-- entre les policies de missions et de propositions, chacune
-- interrogeant l autre. Postgres rendait 42P17. Le defaut etait
-- invisible a la relecture et fatal a l usage. Corrige dans le
-- fichier 01 par deux fonctions SECURITY DEFINER.
-- =====================================================================


-- =====================================================================
-- PARTIE 1 — LES CINQ ROLES, MESURES DANS UNE TRANSACTION ANNULEE
-- =====================================================================

begin;

create temp table res (o int, test text, mesure text, valeur bigint, attendu text) on commit drop;
grant all on res to anon, authenticated;

-- Trois identites de test. Le mot de passe est un caractere invalide :
-- aucune authentification n est possible avec, et de toute facon la
-- transaction sera annulee.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
 ('aaaaaaaa-0000-4000-8000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t-client-a@test.invalid','!',now(),now(),now()),
 ('bbbbbbbb-0000-4000-8000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t-client-b@test.invalid','!',now(),now(),now()),
 ('cccccccc-0000-4000-8000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t-freelance@test.invalid','!',now(),now(),now());

insert into public.app_users (id, email, nom, role, societe_boond_id)
select 'aaaaaaaa-0000-4000-8000-000000000001','t-client-a@test.invalid','Client A','client',
       (select boond_id from public.cache_societes order by boond_id limit 1);
insert into public.app_users (id, email, nom, role, societe_boond_id)
select 'bbbbbbbb-0000-4000-8000-000000000002','t-client-b@test.invalid','Client B','client',
       (select boond_id from public.cache_societes order by boond_id offset 1 limit 1);
insert into public.app_users (id, email, nom, role, profil_boond_id)
select 'cccccccc-0000-4000-8000-000000000003','t-freelance@test.invalid','Freelance','freelance',
       (select boond_id from public.cache_profils order by boond_id limit 1);

-- Deux missions et trois documents, repartis sur DEUX clients
-- differents. Sans cette repartition, le test ne prouverait rien : zero
-- ligne vue pourrait vouloir dire base vide.
insert into public.missions (reference, intitule, statut, societe_boond_id)
values ('T-MIS-A','Mission du client A','ouverte',(select boond_id from public.cache_societes order by boond_id limit 1)),
       ('T-MIS-B','Mission du client B','ouverte',(select boond_id from public.cache_societes order by boond_id offset 1 limit 1));

insert into public.documents (titre, depose_par, societe_boond_id, statut, chemin_source, chemin_formate)
values ('Doc A transmis','cccccccc-0000-4000-8000-000000000003',(select boond_id from public.cache_societes order by boond_id limit 1),'envoye','sources/x/a.md','livrables/x/a.html'),
       ('Doc A en cours','cccccccc-0000-4000-8000-000000000003',(select boond_id from public.cache_societes order by boond_id limit 1),'depose',null,null),
       ('Doc B transmis','cccccccc-0000-4000-8000-000000000003',(select boond_id from public.cache_societes order by boond_id offset 1 limit 1),'envoye','sources/y/b.md','livrables/y/b.html');

-- Le denominateur.
insert into res values (0,'REFERENCE','cache_profils',(select count(*) from public.cache_profils),'denominateur'),
 (0,'REFERENCE','missions',(select count(*) from public.missions),'denominateur'),
 (0,'REFERENCE','documents',(select count(*) from public.documents),'denominateur');

-- T1 — le visiteur non connecte.
-- Les tables profils, prospects, matches et contacts ne figurent PAS
-- ici : anon n a plus le droit SQL de les toucher, un count leverait
-- 42501 et interromprait le test. Ce refus dur est plus fort qu un zero
-- et se mesure depuis l exterieur, en HTTP.
set local role anon;
insert into res values (1,'T1 anon','cache_profils',(select count(*) from public.cache_profils),'0'),
 (1,'T1 anon','missions',(select count(*) from public.missions),'0'),
 (1,'T1 anon','documents',(select count(*) from public.documents),'0');
reset role;

-- T2 — le client A.
select set_config('request.jwt.claims','{"sub":"aaaaaaaa-0000-4000-8000-000000000001","role":"authenticated"}',true);
set local role authenticated;
insert into res values (2,'T2 client A','cache_profils',(select count(*) from public.cache_profils),'0'),
 (2,'T2 client A','cache_societes',(select count(*) from public.cache_societes),'1'),
 (2,'T2 client A','profils',(select count(*) from public.profils),'0'),
 (2,'T2 client A','missions',(select count(*) from public.missions),'1 la sienne'),
 (2,'T2 client A','documents',(select count(*) from public.documents),'1 envoye'),
 (2,'T2 client A','FUITE mission autre client',(select count(*) from public.missions m where m.societe_boond_id is distinct from public.app_societe()),'0'),
 (2,'T2 client A','FUITE doc non envoye',(select count(*) from public.documents d where d.statut <> 'envoye'),'0');
reset role;

-- T3 — le client B. Son ensemble doit etre disjoint de celui de A.
select set_config('request.jwt.claims','{"sub":"bbbbbbbb-0000-4000-8000-000000000002","role":"authenticated"}',true);
set local role authenticated;
insert into res values (3,'T3 client B','missions',(select count(*) from public.missions),'1 la sienne'),
 (3,'T3 client B','documents',(select count(*) from public.documents),'1 envoye'),
 (3,'T3 client B','FUITE mission autre client',(select count(*) from public.missions m where m.societe_boond_id is distinct from public.app_societe()),'0');
reset role;

-- T4 — le freelance.
select set_config('request.jwt.claims','{"sub":"cccccccc-0000-4000-8000-000000000003","role":"authenticated"}',true);
set local role authenticated;
insert into res values (4,'T4 freelance','cache_profils',(select count(*) from public.cache_profils),'1 sa fiche'),
 (4,'T4 freelance','cache_societes',(select count(*) from public.cache_societes),'0'),
 (4,'T4 freelance','profils',(select count(*) from public.profils),'0'),
 (4,'T4 freelance','documents',(select count(*) from public.documents),'3 les siens'),
 (4,'T4 freelance','FUITE fiche autrui',(select count(*) from public.cache_profils p where p.boond_id is distinct from public.app_profil()),'0');
reset role;

-- T7 — l administrateur, contre-epreuve. Un cloisonnement trop serre
-- rend l application inutilisable, ce n est pas un succes non plus.
select set_config('request.jwt.claims',(select json_build_object('sub',id,'role','authenticated')::text from public.app_users where email='yacine@geozey.com'),true);
set local role authenticated;
insert into res values (7,'T7 admin','cache_profils',(select count(*) from public.cache_profils),'tout'),
 (7,'T7 admin','missions',(select count(*) from public.missions),'tout'),
 (7,'T7 admin','documents',(select count(*) from public.documents),'tout'),
 (7,'T7 admin','profils',(select count(*) from public.profils),'tout');
reset role;

select o, test, mesure, valeur, attendu from res order by o, mesure;
rollback;


-- =====================================================================
-- PARTIE 2 — LES DEUX TENTATIVES DE TRICHE
-- Elles DOIVENT echouer. Une execution qui reussit est une faille, pas
-- un succes. A passer separement de la partie 1.
-- =====================================================================

begin;

create temp table res (o int, test text, mesure text, valeur bigint, attendu text) on commit drop;
grant all on res to anon, authenticated;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values ('cccccccc-0000-4000-8000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t-freelance@test.invalid','!',now(),now(),now());

insert into public.app_users (id, email, nom, role, profil_boond_id)
select 'cccccccc-0000-4000-8000-000000000003','t-freelance@test.invalid','Freelance','freelance',
       (select boond_id from public.cache_profils order by boond_id limit 1);

insert into public.documents (titre, depose_par, societe_boond_id, statut)
values ('Doc a corrompre','cccccccc-0000-4000-8000-000000000003',(select boond_id from public.cache_societes order by boond_id limit 1),'depose');

select set_config('request.jwt.claims','{"sub":"cccccccc-0000-4000-8000-000000000003","role":"authenticated"}',true);
set local role authenticated;

-- T5 — un freelance peut-il se promouvoir administrateur ?
-- Aucune policy UPDATE ne s applique a lui sur app_users. L ordre passe
-- sans erreur mais ne touche aucune ligne, ce qui est le comportement
-- normal de la RLS : elle ne crie pas, elle ne montre rien.
update public.app_users set role = 'admin' where id = auth.uid();
insert into res values (5,'T5 escalade de privilege','suis-je devenu admin',
  (select case when role = 'admin' then 1 else 0 end from public.app_users where id = auth.uid()),
  '0 sinon FAILLE');

-- T6 — un freelance peut-il court-circuiter la validation de Yacine et
-- rendre son document visible au client ? Le trigger doit lever.
do $blk$
begin
  update public.documents set statut = 'envoye'
   where depose_par = auth.uid() and statut = 'depose';
  insert into res values (6,'T6 raccourci envoi','transition acceptee',1,'0 sinon FAILLE');
exception when others then
  insert into res values (6,'T6 raccourci envoi','transition refusee par la base',0,'0 sinon FAILLE');
end $blk$;

insert into res values (6,'T6 raccourci envoi','doc rendu visible au client',
  (select count(*) from public.documents where statut = 'envoye' and titre = 'Doc a corrompre'),
  '0 sinon FAILLE');

reset role;
select o, test, mesure, valeur, attendu from res order by o, mesure;
rollback;


-- =====================================================================
-- PARTIE 3 — LE CONTROLE QUI NE PASSE PAS PAR LA BASE
-- A jouer depuis n importe quel poste, avec la seule cle publishable du
-- site. C est le seul test qui reproduit ce que ferait un tiers.
--
--   for t in profils prospects matches contacts cache_profils missions documents ; do
--     curl -s -o /dev/null -w "$t %{http_code}\n" \
--       -H "apikey: $CLE" -H "Authorization: Bearer $CLE" \
--       "https://ggxanhkixhkmnknslotu.supabase.co/rest/v1/$t?select=*&limit=1"
--   done
--
-- Attendu : 401 avec code 42501 sur les quatre premieres, 200 avec un
-- tableau vide sur les suivantes. Un 200 avec des lignes est une fuite.
-- =====================================================================


-- =====================================================================
-- RESULTATS MESURES LE 20/08/2026, apres application des fichiers 01 et 02
--
--  REFERENCE       cache_profils 12 · missions 5 · documents 3
--  T1 anon         cache_profils 0 · missions 0 · documents 0
--                  profils, prospects, matches, contacts : REFUS DUR 42501
--  T2 client A     vivier 0 · profils 0 · societes 1 · missions 1 · docs 1
--                  fuite mission autre client 0 · fuite doc non envoye 0
--  T3 client B     missions 1 · documents 1 · fuite 0
--                  les ensembles de A et de B sont disjoints
--  T4 freelance    sa fiche 1 · societes 0 · profils 0 · ses depots 3
--                  fuite fiche autrui 0
--  T5 escalade     devenu admin : 0
--  T6 raccourci    transition refusee · doc visible au client : 0
--  T7 admin        retrouve la reference : 12 · 5 · 3 · 35
--
--  Residus apres les deux rollback : 0 dans auth.users, app_users,
--  missions et documents. Base intacte : profils 35, cache_profils 12,
--  missions reelles 3, app_users reels 2.
--
-- Sept tests sur sept conformes. Six sur sept n aurait pas ete un
-- cloisonnement, seulement une fuite documentee.
-- =====================================================================
