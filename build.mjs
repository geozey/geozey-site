// Build du site vitrine Geozey.
// Les pages et le CSS sont versionnes a la racine de ce repo.
// Seules les images sont recuperees au build depuis ASSETS_SOURCE.
import { mkdir, copyFile, writeFile } from 'fs/promises';

const ASSETS = process.env.ASSETS_SOURCE || 'https://geozey-site-three.vercel.app';
const pages = ['index.html', 'manifeste.html', 'experts.html', 'interventions.html', 'styles.css'];
const assets = ['logo.png','hero.jpg','p1.jpg','p2.jpg','p3.jpg','d1.jpg','d2.jpg','d3.jpg','stats.jpg','iter1.jpg','iter2.jpg','v1.jpg','v2.jpg','v3.jpg'];

await mkdir('public/assets', { recursive: true });

for (const p of pages) {
  await copyFile(p, 'public/' + p);
  console.log('SRC ' + p);
}

let ok = 0, ko = 0;
for (const a of assets) {
  try {
    const r = await fetch(`${ASSETS}/assets/${a}`);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    await writeFile('public/assets/' + a, Buffer.from(await r.arrayBuffer()));
    ok++; console.log('IMG ' + a);
  } catch (e) { ko++; console.warn('FAIL ' + a + ' : ' + e.message); }
}
console.log(`Images: ${ok} ok, ${ko} failed`);
if (ko > 0) process.exit(1);
