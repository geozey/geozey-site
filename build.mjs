// Build du site vitrine Geozey.
// Les pages, le CSS et les images sont tous versionnes dans ce depot.
// Le build ne sort plus sur le reseau : il copie, puis il verifie.
// Avant le 30/07/2026 il recuperait 9 images sur https://geozey.com, donc sur le
// deploiement quil produisait lui meme. Un echec de deploiement aurait casse le
// build suivant. Les images ont ete rapatriees, la circularite est supprimee.
import { mkdir, copyFile, readdir, readFile } from "fs/promises";

const pages = ["index.html", "manifeste.html", "experts.html", "interventions.html", "styles.css", "candidature.html", "supabase-config.js", "mentions-legales.html", "politique-rgpd.html", "favicon.svg", "robots.txt", "sitemap.xml"];

await mkdir("public/assets", { recursive: true });

for (const p of pages) {
  await copyFile(p, "public/" + p);
  console.log("SRC " + p);
}

const local = await readdir("assets");
for (const a of local) {
  await copyFile("assets/" + a, "public/assets/" + a);
  console.log("LOCAL " + a);
}
console.log(`Images: ${local.length} versionnees, 0 distante`);

// Controle : toute image citee par une page doit exister dans assets/.
// Les balises du carousel passent par loptimiseur Vercel, donc le chemin est
// encode dans une query string, %2Fassets%2Fx.jpg. Les deux formes sont lues.

// Apercus des emails de campagne. Zone interne, exclue des moteurs par vercel.json.
// Publies ici pour etre relus sans passer par Brevo, et pour servir d archive.
// Application metier. Zone interne, exclue des moteurs par vercel.json.
try {
  const appf = await readdir('app');
  await mkdir('public/app', { recursive: true });
  for (const f of appf) { await copyFile('app/' + f, 'public/app/' + f); console.log('APP ' + f); }
} catch { console.log('pas de dossier app'); }

try {
  const mails = await readdir('emails');
  await mkdir('public/emails', { recursive: true });
  for (const m of mails) { await copyFile('emails/' + m, 'public/emails/' + m); console.log('MAIL ' + m); }
} catch { console.log('pas de dossier emails'); }

// Rubrique blog. Pages publiques, indexees, meme charte que le reste du site.
try {
  const blogf = await readdir('blog');
  await mkdir('public/blog', { recursive: true });
  for (const b of blogf) { await copyFile('blog/' + b, 'public/blog/' + b); console.log('BLOG ' + b); }
} catch { console.log('pas de dossier blog'); }

// Dossier de seance protege par code, cockpit-accompagnement. Zone interne,
// exclue des moteurs par balise noindex sur chaque page, cf. skill garde-fous.
try {
  const cockpitf = await readdir('cockpit-accompagnement');
  await mkdir('public/cockpit-accompagnement', { recursive: true });
  for (const c of cockpitf) { await copyFile('cockpit-accompagnement/' + c, 'public/cockpit-accompagnement/' + c); console.log('COCKPIT ' + c); }
} catch { console.log('pas de dossier cockpit-accompagnement'); }

const cites = new Set();
for (const p of pages.filter(f => f.endsWith(".html") || f.endsWith(".css"))) {
  const t = await readFile(p, "utf8");
  for (const m of t.matchAll(/assets(?:\/|%2F)([A-Za-z0-9_.-]+\.(?:png|jpg|jpeg|svg|webp|avif))/g)) cites.add(m[1]);
}
const manquantes = [...cites].filter(a => !local.includes(a));
if (manquantes.length) {
  console.error("MANQUANTES dans assets/ : " + manquantes.join(", "));
  process.exit(1);
}
console.log(`Controle: ${cites.size} images citees, toutes presentes`);
