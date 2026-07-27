// Build du site vitrine Geozey : recupere les pages et les assets, produit /public.
// Source de reference actuelle : deploiement public existant. A basculer sur les sources
// versionnees des que le contenu definitif (textes + photos Louise) est valide.
import { mkdir, writeFile } from 'fs/promises';

const SRC = process.env.SITE_SOURCE || 'https://geozey-site.vercel.app';
const pages = ['index.html', 'manifeste.html', 'experts.html', 'interventions.html', 'styles.css'];
const assets = ['logo.png','hero.jpg','p1.jpg','p2.jpg','p3.jpg','d1.jpg','d2.jpg','d3.jpg','stats.jpg','iter1.jpg','iter2.jpg','v1.jpg','v2.jpg','v3.jpg'];

await mkdir('public/assets', { recursive: true });
let ok = 0, ko = 0;

for (const p of pages) {
  const r = await fetch(`${SRC}/${p}`);
  if (!r.ok) { console.error('FAIL page ' + p + ' HTTP ' + r.status); ko++; continue; }
  await writeFile('public/' + p, await r.text());
  console.log('OK page ' + p); ok++;
}
for (const a of assets) {
  const r = await fetch(`${SRC}/assets/${a}`);
  if (!r.ok) { console.error('FAIL asset ' + a + ' HTTP ' + r.status); ko++; continue; }
  await writeFile('public/assets/' + a, Buffer.from(await r.arrayBuffer()));
  console.log('OK asset ' + a); ok++;
}
console.log(`Build: ${ok} ok, ${ko} failed`);
if (ko > 0) process.exit(1);
