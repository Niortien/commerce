// LA BANDE-SON du tutoriel — groove afrobeats doux sous la voix, un son pour chaque geste.   node song.js
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const Genre = require('./engine/audio/genres');
const { m, mtof } = require('./engine/music');
const sc = require('./score');
const { BEAT, BAR, DURATION, clock, ev } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), lead = bus(), fx = bus(), voice = bus();
const verb = bus(), dly = bus();
const bell = (notes, t, g = 0.08, gap = 0.05, pan = 0) => notes.forEach((f, i) => keys.addMono(I.bell(mtof(m(f)), 1.1, 1.4, 3.5), t + i * gap, g, pan));

// ---------- le groove (léger : c'est la voix qui compte) ----------
const LOGO = 0.4;
const lastBar = Math.floor(DURATION / BAR);
const { kicks } = Genre.play('afrobeats', { clock, from: 1, to: lastBar, chordAt: sc.chordAt, buses: { drums, bass, pad, keys }, gain: 0.8 });
for (const c of sc.chords) { if (c.t0 >= DURATION) break; for (const n of c.notes) { const { L, R } = I.padNote(n, c.t1 - c.t0, { cutoff: 1600, attack: 0.3 }); pad.addStereo(L, R, c.t0, 0.04); } }
// le logo
fx.addMono(I.subBoom(1.3), LOGO, 0.5);
drums.addMono(I.crash(18), LOGO, 0.25);
bell(['C6', 'E6', 'G6', 'C7'], LOGO);
[['E5', 0], ['G5', 0.5], ['C6', 1], ['G5', 1.5], ['A5', 2], ['G5', 2.5]].forEach(([f, b]) => lead.addMono(I.marimba(m(f), { decay: 0.6 }), LOGO + 0.3 + b * BEAT, 0.4, 0.15));
// un whoosh à chaque nouveau chapitre
for (const c of sc.CHAPTERS.slice(1)) { fx.addMono(I.noiseSweep(0.35, 400, 5000, { q: 0.8, pink: true }), c.t - 0.3, 0.16); lead.addMono(I.marimba(m('G5'), { decay: 0.5 }), c.t + 0.05, 0.3, 0.2); }

// ---------- les gestes ----------
for (const tp of sc.taps) fx.addMono(I.pop(1150 + (tp.y % 5) * 60, Math.round(tp.t * 10)), tp.t, 0.22, 0.1);
for (const ty of sc.typing) for (let t = ty.t0; t < ty.t1; t += 0.065) fx.addMono(I.woodTick(2.6 + ((t * 37) % 1) * 0.6), t, 0.035, 0.25);
for (const s of sc.screens) fx.addMono(I.paperFwip(1.4, Math.round(s.t * 7)), s.t, 0.04, -0.2);
bell(['C6', 'E6', 'G6', 'C7'], ev.confetti1, 0.1); drums.addMono(I.crash(7), ev.confetti1, 0.12);
fx.addMono(I.thud(120, 0.06), ev.logoDrop, 0.4);
fx.addMono(I.noiseSweep(0.25, 1500, 400, { q: 1 }), ev.newDrawer, 0.15); fx.addMono(I.woodTick(1), ev.newDrawer + 0.25, 0.2);
bell(['E6', 'G6'], ev.marge, 0.08, 0.08);
ev.variantes.forEach((t, i) => lead.addMono(I.marimba(m(['C5', 'E5', 'G5'][i]), { decay: 0.5 }), t, 0.45));
keys.addMono(I.epiano(m('E5'), 0.4), ev.seuilLine, 0.22); keys.addMono(I.epiano(m('C5'), 0.4), ev.seuilLine + 0.14, 0.22);
fx.addMono(I.noiseSweep(0.5, 600, 4000, { q: 0.9 }), ev.stockFly, 0.15);
fx.addMono(I.paperFwip(0.9, 3), ev.excelDrop, 0.25);
{ const [a, b] = ev.importCount; for (let i = 0; i < 20; i++) fx.addMono(I.woodTick(1.8 + i * 0.04), a + (b - a) * Math.pow(i / 20, 0.7), 0.05, 0.2); bell(['C6', 'G6'], b, 0.09); }
keys.addMono(I.bell(mtof(m('A6')), 0.4, 1, 3), ev.badge, 0.08); fx.addMono(I.tvClick(), ev.lock, 0.3);
fx.addMono(I.noiseSweep(1.2, 200, 2500, { q: 0.7, pink: true }), ev.curtainUp - 0.3, 0.14);
for (let i = 0; i < 10; i++) fx.addMono(I.woodTick(0.7), ev.curtainUp - 0.25 + i * 0.07, 0.05, -0.3);
keys.addMono(I.bell(mtof(m('B6')), 0.25, 0.5, 2), ev.scan, 0.1); fx.addMono(I.pop(2200, 9), ev.itemAdded, 0.2);
ev.modes.forEach((t, i) => fx.addMono(I.pop(1400 + i * 200, 40 + i), t, 0.16, -0.3 + i * 0.2));
bell(['G6', 'C7', 'E7'], ev.monnaie, 0.07, 0.045, 0.3);
for (let i = 0; i < 14; i++) fx.addMono(I.woodTick(3.2 + (i % 2) * 0.2), ev.receipt + i * 0.07, 0.045, 0.5);
fx.addMono(I.pop(900, 81), ev.stockDown, 0.2);
keys.addMono(I.epiano(m('E5'), 0.3), ev.offline, 0.22); keys.addMono(I.epiano(m('C5'), 0.3), ev.offline + 0.14, 0.22);
ev.queued.forEach((t) => fx.addMono(I.pop(1500, 3), t, 0.15));
['C5', 'E5', 'G5', 'C6'].forEach((f, i) => keys.addMono(I.epiano(m(f), 0.35), ev.online + i * 0.07, 0.2, 0.2));
fx.addMono(I.noiseSweep(1.2, 2500, 200, { q: 0.7, pink: true }), ev.curtainDown, 0.14);
for (let i = 0; i < 10; i++) fx.addMono(I.woodTick(0.7), ev.curtainDown + i * 0.07, 0.05, -0.3);
{ const [a, b] = ev.dashCount; for (let i = 0; i < 18; i++) fx.addMono(I.woodTick(1.6 + i * 0.05), a + (b - a) * Math.pow(i / 18, 0.7), 0.05, 0.2); bell(['C6', 'E6', 'G6'], b, 0.08); }
// l'écran de fin
fx.addMono(I.subBoom(1.2), sc.endCard, 0.45); drums.addMono(I.crash(21), sc.endCard, 0.25); bell(['C6', 'E6', 'G6', 'C7'], sc.endCard + 0.05);
[['C5', 0], ['E5', 0.06], ['G5', 0.12], ['C6', 0.18]].forEach(([f, d]) => lead.addMono(I.marimba(m(f), { decay: 1.4 }), DURATION - 2.6 + d, 0.4));

// ---------- voix ----------
for (const v of sc.vo) {
  const b = MIX.loadAudio(path.join(__dirname, 'assets/vo', v.id + '.wav'), { at: v.at, length: DURATION });
  for (let i = 0; i < N; i++) { voice.L[i] += b.L[i]; voice.R[i] += b.R[i]; }
}

// ---------- mixage ----------
MIX.sidechain([pad, bass], kicks);
const stems = { drums, bass, pad, keys, lead, fx, verb: reverb(verb, { room: 0.8, damp: 0.4 }), dly: pingpong(dly, BEAT * 0.75, 0.3, 3500) };
MIX.duck([drums, bass, pad, keys, lead, stems.verb, stems.dly], voice, { depth: 0.6, release: 0.4 });
stems.voice = voice;
const GAIN = { drums: 0.32, bass: 0.55, pad: 1.8, keys: 0.9, lead: 1.6, fx: 0.75, verb: 1, dly: 1, voice: 2.0 };
const out = path.join(__dirname, 'out');
require('fs').mkdirSync(out, { recursive: true });
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 25);
MIX.fadeOut(mix, DURATION - 1.4, DURATION);
const M = MIX.master(mix, 0.8, undefined, { lufs: -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s, ${M.lufs.toFixed(1)} LUFS)`);
