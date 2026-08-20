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
