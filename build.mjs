// Build du site vitrine Geozey.
// Les pages et le CSS sont versionnes a la racine de ce repo.
// Les images versionnees dans assets/ font autorite.
// Les images pas encore versionnees sont recuperees au build depuis ASSETS_SOURCE
// (dependance transitoire, a supprimer image par image en les commitant ici).
import { mkdir, copyFile, writeFile, readdir } from 'fs/promises';

const ASSETS = process.env.ASSETS_SOURCE || 'https://geozey-site-three.vercel.app';
const pages = ['index.html', 'manifeste.html', 'experts.html', 'interventions.html', 'styles.css'];
const assets = ['logo.png','hero.jpg','p1.jpg','p2.jpg','p3.jpg','d1.jpg','d2.jpg','d3.jpg','stats.jpg','iter1.jpg','iter2.jpg','v1.jpg','v2.jpg','v3.jpg','v4.jpg'];

await mkdir('public/assets', { recursive: true });

for (const p of pages) {
  await copyFile(p, 'public/' + p);
  console.log('SRC ' + p);
}

// Images versionnees dans le repo
let local = [];
try { local = await readdir('assets'); } catch { local = []; }
for (const a of local) {
  await copyFile('assets/' + a, 'public/assets/' + a);
  console.log('LOCAL ' + a);
}

// Images pas encore versionnees
let ok = 0, ko = 0;
for (const a of assets) {
  if (local.includes(a)) continue;
  try {
    const r = await fetch(`${ASSETS}/assets/${a}`);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    await writeFile('public/assets/' + a, Buffer.from(await r.arrayBuffer()));
    ok++; console.log('IMG ' + a);
  } catch (e) { ko++; console.warn('FAIL ' + a + ' : ' + e.message); }
}
console.log(`Images: ${local.length} locales, ${ok} distantes, ${ko} en echec`);
if (ko > 0) process.exit(1);

// portrait officiel Yacine integre le 28/07/2026
