# Base de l'application métier — geozey-core

Projet Supabase `geozey-core`, référence `ggxanhkixhkmnknslotu`.

Ces fichiers ne sont pas de la documentation : ce sont les migrations qui font
foi. Toute modification du schéma ou des droits passe par un fichier daté ici,
jamais par une saisie directe dans l'éditeur SQL sans trace. Une règle d'accès
qui n'existe que dans une base, sans son fichier, n'est ni relue ni rejouable
ni récupérable.

## Ordre d'application

| Fichier | Ce qu'il fait | État | Rejouable |
|---|---|---|---|
| `2026-08-20-01-cloisonnement-et-socle-auth.sql` | Ferme l'accès public, pose `app_users`, les fonctions d'identité et les policies des trois espaces | **appliqué le 20/08** | oui |
| `2026-08-20-02-flux-documentaire.sql` | Crée `documents`, son journal, le graphe des transitions et le stockage cloisonné | **appliqué le 20/08** | oui |
| `2026-08-20-03-test-cloisonnement.sql` | Ne modifie rien. Prouve le cloisonnement en se mettant à la place de chaque rôle | **joué le 20/08, 7/7 conformes** | oui |
| `2026-08-21-04-formulaires-publics.sql` | Ferme l'écriture directe du site public sur `qualifications` et la remplace par `enregistrer_qualification()`, un upsert sur `session_id`. Ajoute la seconde boîte au mail de notification | **appliqué le 21/08, recette prospect et profil passée** | oui |

Le fichier 02 dépend du 01 : il utilise `app_role()`, `est_admin()` et
`touch_maj_le()`. Les passer dans le désordre échoue proprement, sans rien
laisser à moitié fait.

## Comment les passer

Éditeur SQL du projet `geozey-core`, sous le compte Geozey. Un fichier à la
fois, en lisant le tableau de contrôle rendu à la fin de chacun.

Le fichier 01 se termine par une grille qui liste chaque table du schéma
`public` avec un verdict. **La colonne `verdict` doit valoir `FERME` sur toutes
les lignes.** Une seule ligne à `OUVERT` signifie que le travail n'est pas fini,
quel que soit le reste.

## Les trois espaces, en une phrase chacun

- **Administrateur.** Yacine, et le poste de commande. Voit tout, décide tout,
  fait circuler les documents.
- **Client maître d'œuvre.** Ses missions, les profils que Geozey lui a
  explicitement proposés, et les documents validés puis transmis. Jamais le
  vivier, jamais un autre client, jamais un brouillon.
- **Expert.** Sa propre fiche, qu'il met à jour lui-même, et ses propres
  dépôts, qu'il suit jusqu'à la transmission.

Le périmètre n'est pas porté par l'écran mais par la base. Interroger l'API
REST directement, sans passer par l'application, donne exactement le même
résultat. C'est ce qui sépare un cloisonnement d'un affichage conditionnel.

## Ce qui doit être fait par un humain

Ces gestes ne passent par aucun agent, par choix de sécurité tenu depuis le
début de la mission : aucun secret ne transite par une conversation.

1. Créer les comptes réels dans `Authentication > Users > Add user`, en cochant
   `Auto Confirm User`, puis leur attribuer un rôle dans `app_users`. **Le
   fichier 03 n'en a pas besoin** : il monte ses propres identités dans une
   transaction annulée. Ces comptes-là servent à la recette réelle, sur écran.
2. Fermer l'inscription libre : `disable_signup` vaut `false` à ce jour,
   n'importe qui peut créer un compte. Sans ligne dans `app_users` il ne voit
   rien, le cloisonnement tient, mais un espace client se ferme mieux à la
   porte qu'au couloir.

## Le graphe du flux documentaire

```
déposé ─▶ mise au format ─▶ à valider ─┬─▶ validé ─▶ envoyé au client
   ▲                                   │
   └──────── à corriger ◀──────────────┘
```

Chaque flèche est une transition autorisée, et il n'en existe pas d'autre. La
base refuse tout le reste, y compris le raccourci qui compte : un expert ne
peut pas rendre son fichier visible à un client sans la validation de Geozey.
Le refus vient d'un trigger, pas d'un bouton grisé.

## Décisions de schéma qu'il vaut mieux connaître avant de lire le SQL

- **`matches` n'est pas le matching de l'application.** Ses colonnes réelles
  sont `profil_id`, `cible_type`, `signal_id`, `prospect_id`, `score_match`.
  C'est l'outil de sourcing. Le matching mission contre vivier se calcule dans
  le navigateur, à partir du barème reporté à l'identique, et se matérialise
  dans `propositions` quand l'administrateur décide de présenter un profil.
- **`propositions` est la seule fenêtre du client sur le vivier**, et elle est
  nominative et volontaire. Sans elle, ouvrir le vivier au client reviendrait à
  lui donner le carnet d'adresses de Geozey.
- **Deux fonctions cassent une récursion, elles ne sont pas décoratives.**
  `mission_de_ma_societe()` et `propose_sur_mission()` existent parce que la
  policy des missions interrogeait `propositions` pendant que celles de
  `propositions` interrogeaient `missions`. Postgres rendait
  `42P17 infinite recursion detected in policy`. Elles sont `SECURITY DEFINER`
  et ne rendent qu'un booléen sur le périmètre propre de l'appelant : rendre
  `societe_boond_id` aurait été une fuite, même petite. Ne pas les remplacer
  par un `exists` en ligne, le cycle reviendrait.
- **Trois colonnes manquaient à `cache_profils`** : `zone`, `presence` et
  `secteur`. Le moteur de matching les lisait, elles n'existaient pas. Les axes
  correspondants, vingt-cinq points sur cent, tombaient donc à zéro pour tout
  le vivier dès qu'une mission les exigeait. Le fichier 01 les crée. Elles se
  rempliront par l'import Boond et par le passeport que chaque expert tient
  lui-même.

## Pourquoi les formulaires du site n'enregistraient rien, et depuis quand

Du 3 août au 21 août, aucun dépôt du site n'est arrivé complet en base et
aucun mail n'est parti. Trois pannes empilées, toutes silencieuses.

1. **`gz_sid` est gardé à vie dans le `localStorage`.** Un visiteur qui
   revient réutilise l'identifiant de session de sa visite précédente.
2. **`session_id` porte une contrainte `UNIQUE`.** Le `POST` du visiteur qui
   revient partait donc en 409. La page rattrapait ce 409 par un `PATCH`.
3. **Aucune policy `UPDATE` n'existait pour `anon`.** PostgREST répond `204` à
   un `PATCH` qui ne touche aucune ligne : côté navigateur, `response.ok` vaut
   `true`. La personne lisait « Reçu », rien n'était écrit.

Même pour un visiteur neuf, seul le tout premier `POST` passait : la
sauvegarde automatique créait une ligne à un ou deux champs, et tout le reste
de la saisie, jusqu'au clic final, partait en `PATCH` perdu. Le statut
`complet` n'atteignait donc jamais la base. Or les deux triggers de
notification ne se déclenchent que sur `complet` : le vide de
`notifications_envoyees` n'était pas une panne de Brevo, c'est que le trigger
n'a jamais eu lieu.

La donnée le disait : six lignes en tout depuis le 3 août, toutes en
`brouillon`, toutes à un ou deux champs remplis. C'est exactement le contenu
de la première sauvegarde automatique, et rien après.

**Ce qui a été corrigé, et pourquoi ainsi.** On a supprimé la classe de pannes
plutôt que le symptôme. Le site public n'écrit plus jamais dans la table : il
appelle `enregistrer_qualification()`, qui fait un upsert sur `session_id`.
Plus de conflit possible, donc plus de repli sur un `PATCH`. Plus d'écriture
muette, donc une erreur redevient une erreur. `anon` perd tous ses droits de
table — il en détenait sept, seule la RLS filtrait — et ne garde que cette
porte. Enfin, la page exige un identifiant de ligne en retour avant d'afficher
« Reçu » : sans identifiant, elle affiche l'échec et le lien de repli.

**Recette du 21/08, faite sur geozey.com, pas en local.**

| Ce qui a été vérifié | Résultat |
|---|---|
| Parcours prospect, visiteur qui revient avec un `gz_sid` de 15 jours | ligne passée à `complet`, mail Brevo `201` |
| Parcours profil, session neuve | ligne créée puis `complet`, mail Brevo `201` |
| `GET`, `POST`, `PATCH`, `DELETE` directs sur la table avec la clé anon | `401 / 42501` sur les quatre |
| Pot de miel rempli | `200`, aucune ligne écrite |
| `type` hors liste, `session_id` trop court | `400`, refus explicite |
| `brouillon` envoyé sur une ligne déjà `complet` | refusé, la ligne ne redevient pas brouillon |
