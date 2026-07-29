// Configuration de la base Geozey (projet Supabase geozey-core).
// La cle anon / publishable est PUBLIQUE par conception : elle est faite pour vivre
// dans le navigateur. Les droits reels sont portes par les policies RLS cote base.
// Pour activer l ecriture : remplacer CLE_ANON_A_COLLER par la cle anon du projet
// geozey-core (Supabase > Settings > API Keys > anon public), puis commiter ce fichier.
window.GEOZEY_DB = {
  url: 'https://ggxanhkixhkmnknslotu.supabase.co',
  anon: 'CLE_ANON_A_COLLER',
  table: 'qualifications',
  contact: 'contact@geozey.com'
};
