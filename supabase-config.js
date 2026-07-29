// Configuration de la base Geozey (projet Supabase geozey-core, ref ggxanhkixhkmnknslotu).
// La cle publishable est PUBLIQUE par conception : elle est faite pour vivre dans le
// navigateur. Les droits reels sont portes par les policies RLS cote base :
//   - anon peut INSERER une ligne et COMPLETER sa propre session pendant 24 h
//   - anon ne peut RIEN LIRE (verifie le 29/07/2026 : select renvoie [] avec cette cle)
//   - la lecture est reservee aux comptes authentifies du cockpit
window.GEOZEY_DB = {
  url: 'https://ggxanhkixhkmnknslotu.supabase.co',
  anon: 'sb_publishable_a4mePDbVPl09uG6p1Iv0Lg_lJZCn3jC',
  table: 'qualifications',
  contact: 'contact@geozey.com'
};
