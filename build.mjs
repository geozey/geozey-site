// Build du site vitrine Geozey.
// Les pages, le CSS et les images sont tous versionnes dans ce depot.
// Le build ne sort plus sur le reseau : il copie, puis il verifie.
// Avant le 30/07/2026 il recuperait 9 images sur https://geozey.com, donc sur le
// deploiement quil produisait lui meme. Un echec de deploiement aurait casse le
// build suivant. Les images ont ete rapatriees, la circularite est supprimee.
import { mkdir, copyFile, readdir, readFile, cp } from "fs/promises";

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

// Copie d un dossier interne complet, sous-dossiers compris.
// Le 20/08/2026, la copie entree par entree avec copyFile levait EISDIR des
// qu un sous-dossier apparaissait, et le catch silencieux publiait un dossier
// vide sans rien signaler. Le hub cockpit-accompagnement est parti en 404 de
// cette facon. Une copie recursive traite les sous-dossiers, et une erreur de
// copie arrete maintenant le build au lieu d etre confondue avec un dossier
// absent, qui reste un cas normal.
async function copierDossier(nom, etiquette) {
  try {
    await readdir(nom);
  } catch {
    console.log("pas de dossier " + nom);
    return;
  }
  await cp(nom, "public/" + nom, { recursive: true });
  console.log(etiquette + " " + nom + " copie recursivement");
}

// Application metier. Zone interne, exclue des moteurs par vercel.json.
await copierDossier("app", "APP");

// Apercus des emails de campagne. Zone interne, exclue des moteurs par vercel.json.
// Publies ici pour etre relus sans passer par Brevo, et pour servir d archive.
await copierDossier("emails", "MAIL");

// Rubrique blog. Pages publiques, indexees, meme charte que le reste du site.
await copierDossier("blog", "BLOG");

// Dossier de seance protege par code, cockpit-accompagnement. Zone interne,
// exclue des moteurs par balise noindex sur chaque page, cf. skill garde-fous.
// Contient un sous-dossier assets, d ou la copie recursive obligatoire.
await copierDossier("cockpit-accompagnement", "COCKPIT");

// Controle : toute image citee par une page doit exister dans assets/.
// Les balises du carousel passent par loptimiseur Vercel, donc le chemin est
// encode dans une query string, %2Fassets%2Fx.jpg. Les deux formes sont lues.
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
