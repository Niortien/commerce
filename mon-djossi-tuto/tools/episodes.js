// Découpe le tutoriel en 6 épisodes pour les réseaux : chaque épisode commence par 2,2 s du logo (début du film)
// puis reprend ses chapitres.   node tools/episodes.js   → out/episode-1.mp4 … out/episode-6.mp4
const { execFileSync } = require('child_process');
const path = require('path');
const S = require('../score');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'out', 'mon-djossi-tuto.mp4');
const at = (id) => S.CHAPTERS.find((c) => c.id === id).t;
const EPISODES = [
  ['1-inscrire-ta-boutique', at('c1'), at('c2')],
  ['2-preparer-la-boutique', at('c2'), at('c4')],
  ['3-ajouter-tes-produits', at('c4'), at('c6')],
  ['4-ajouter-tes-caissiers', at('c6'), at('d1')],
  ['5-ta-premiere-vente', at('d1'), at('d4')],
  ['6-fermer-la-journee', at('d4'), S.DURATION],
];
EPISODES.forEach(([name, a, b], i) => {
  const out = path.join(ROOT, 'out', `episode-${name}.mp4`);
  // deux entrées positionnées par -ss (sans tout décoder en mémoire) : le logo, puis le chapitre
  const fc = `[0:a]afade=t=out:st=2.0:d=0.2[a0];[1:v]fade=t=out:st=${(b - a - 0.4).toFixed(2)}:d=0.4[v1];` +
    `[1:a]afade=t=in:d=0.08,afade=t=out:st=${(b - a - 0.5).toFixed(2)}:d=0.5[a1];[0:v][a0][v1][a1]concat=n=2:v=1:a=1[v][a]`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '0.4', '-t', '2.2', '-i', SRC, '-ss', String(a), '-t', String(b - a), '-i', SRC, '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '19', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]);
  console.log(`episode ${i + 1}: ${out} (${(b - a + 2.2).toFixed(1)} s)`);
});
