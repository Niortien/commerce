// LA BANDE-SON — chaque son vient d'un événement de score.js.   node song.js   (STEMS=1 écrit les pistes)
// Nuit/avant : boîte à musique en la mineur, tic-tac. Logo : afrobeats en do majeur. Soir : sans batterie.
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const Genre = require('./engine/audio/genres');
const { mtof } = require('./engine/music');
const sc = require('./score');
const { T, BEAT, BAR, DURATION, m, ev, clock } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), lead = bus(), fx = bus(), voice = bus();
const verb = bus(), dly = bus();
const BREATH = [ev.logo - BEAT / 2, ev.logo]; // un demi-temps de silence avant le logo

// ---------- AVANT : nuit, matin, réseau (mesures 0–6) ----------
for (const c of sc.chords.filter((c) => c.t0 < ev.logo)) {
  const t1 = Math.min(c.t1, BREATH[0]);
  for (const n of c.notes) { const { L, R } = I.padNote(n, t1 - c.t0, { cutoff: 900, attack: 0.5, release: 0.8 }); pad.addStereo(L, R, c.t0, 0.07); }
  if (c.t0 >= ev.rupture) bass.addMono(I.bass(c.bass + 12, t1 - c.t0, { bright: 0.1, sub: 1 }), c.t0, 0.32);
}
for (const n of sc.sadBox) { const mb = I.musicBox(n.midi, { decay: 1.4 }); keys.addMono(mb, n.t, 0.16, -0.15); verb.addMono(mb, n.t, 0.2); }
clock.eachStep(0, 6, 4, (t) => { if (t < BREATH[0]) fx.addMono(I.woodTick(1.5), t, 0.1, 0.4); }); // l'horloge
// matin : un shaker discret pour le bruit de la rue
clock.eachStep(2, 4, 8, (t, b, s) => drums.addMono(I.shaker(s % 2 ? 0.5 : 1, 20 + s), t, 0.06, 0.3));
// RUPTURE : le tampon claque
fx.addMono(I.thud(60, 0.14), ev.rupture, 0.75);
fx.addMono(I.thwack(), ev.rupture, 0.4);
drums.addMono(I.crash(9), ev.rupture, 0.18, -0.2);
// RÉSEAU : le wifi se coupe, glitch
fx.addMono(I.bwomp(), ev.wifiCut, 0.45);
fx.addMono(I.tvClick(), ev.wifiCut, 0.5);
for (let i = 0; i < 5; i++) fx.addMono(I.pop(3000 - i * 420, 200 + i), ev.wifiCut + 0.09 + i * 0.07, 0.12, i % 2 ? 0.5 : -0.5);
// REMBOBINAGE : bande qui recule, souffle montant, puis silence
fx.addMono(I.noiseSweep(BREATH[0] - ev.rewind, 6000, 300, { q: 1.2, pink: true }), ev.rewind, 0.18);
fx.addMono(I.noiseSweep(BREATH[0] - ev.rewind - 0.3, 200, 8000, { q: 0.9, shape: (x) => x * x, pink: true }), ev.rewind + 0.3, 0.3);
for (let i = 0; i < 8; i++) fx.addMono(I.scribble(0.08), ev.rewind + 0.1 + i * 0.18, 0.12, i % 2 ? 0.4 : -0.4);

// ---------- LOGO + JOURNÉE AVEC MON DJOSSI (mesures 7–20) : afrobeats ----------
const busesA = { drums, bass, pad, keys };
const { kicks } = Genre.play('afrobeats', { clock, from: 7, to: 20, chordAt: sc.chordAt, buses: busesA, gain: 1, fill: [16, 19] });
fx.addMono(I.subBoom(1.6), ev.logo, 0.7);
drums.addMono(I.crash(18), ev.logo, 0.4, 0.2);
for (const [i, f] of ['C6', 'E6', 'G6', 'C7'].entries()) keys.addMono(I.bell(mtof(m(f)), 1.4, 1.5, 3.5), ev.logo + i * 0.05, 0.07, -0.3 + i * 0.2);
for (const n of sc.hook) { const mr = I.marimba(n.midi, { decay: 0.6 }); lead.addMono(mr, n.t, 0.5, 0.15); verb.addMono(mr, n.t, 0.1); dly.addMono(mr, n.t, 0.05); }
// pad lumineux sous le groove
for (const c of sc.chords.filter((c) => c.t0 >= ev.logo && c.t0 < ev.soir)) for (const n of c.notes) { const { L, R } = I.padNote(n, c.t1 - c.t0, { cutoff: 2000, attack: 0.08 }); pad.addStereo(L, R, c.t0, 0.045); }

// ALERTE : notification + tap Commander + confirmation
for (const [i, f] of ['E6', 'C7'].entries()) keys.addMono(I.bell(mtof(m(f)), 0.9, 1.2, 3.5), ev.notif + i * 0.11, 0.12, 0.2);
fx.addMono(I.pop(1300, 61), ev.commander, 0.3);
for (const [i, f] of ['C6', 'E6', 'G6'].entries()) keys.addMono(I.bell(mtof(m(f)), 0.7, 1, 3.5), ev.commander + 0.2 + i * 0.06, 0.07, 0.1);
// CAISSE : trois taps, ka-ching, imprimante, stock
for (const [i, t] of [ev.tapProduit, ev.tapTaille, ev.tapEncaisser].entries()) fx.addMono(I.pop(1100 + i * 250, 70 + i), t, 0.28, 0.1);
fx.addMono(I.woodTick(2.2), ev.cash, 0.3);
for (const [i, f] of ['G6', 'C7', 'E7'].entries()) keys.addMono(I.bell(mtof(m(f)), 1.1, 1.8, 3.5), ev.cash + 0.03 + i * 0.045, 0.1, 0.3);
for (let i = 0; i < 14; i++) fx.addMono(I.woodTick(3.2 + (i % 2) * 0.2), ev.cash + 0.25 + i * 0.07, 0.05, 0.5); // l'imprimante
fx.addMono(I.pop(900, 81), ev.stock, 0.22);
// HORS LIGNE : bip descendant, ventes gardées, puis retour du réseau en montée
for (const [i, f] of ['E5', 'C5'].entries()) keys.addMono(I.epiano(m(f), 0.3), ev.offline + i * 0.14, 0.25, -0.2);
for (const q of sc.queued) { fx.addMono(I.pop(1500, q.price), q.t, 0.18, -0.2); }
for (const [i, f] of ['C5', 'E5', 'G5', 'C6'].entries()) keys.addMono(I.epiano(m(f), 0.35), ev.online + i * 0.07, 0.22, 0.2);
for (const q of sc.queued) { const g = I.guitar(m('G5') + 2 * sc.queued.indexOf(q), 0.4, { bright: 0.7, seed: 4 }); lead.addMono(g, q.send, 0.4, 0.25); fx.addMono(I.noiseSweep(0.25, 800, 5000, { q: 1 }), q.send - 0.15, 0.1); }
// MÉTIERS : un whoosh + un coup de log drum à chaque carte
for (const [i, t] of ev.metiers.entries()) {
  fx.addMono(I.noiseSweep(0.3, 400, 5000, { q: 0.8, pink: true }), t - 0.3, 0.25, i % 2 ? 0.4 : -0.4);
  fx.addMono(I.thud(90, 0.08), t, 0.45);
  lead.addMono(I.marimba(m(['C5', 'E5', 'G5'][i]), { decay: 0.7 }), t, 0.55);
}

// ---------- LE SOIR (mesures 20–23) : sans batterie, chaleureux ----------
for (const c of sc.chords.filter((c) => c.t0 >= ev.soir && c.t0 < ev.endCard)) {
  for (const n of c.notes) { const { L, R } = I.padNote(n, c.t1 - c.t0 + 0.4, { cutoff: 1500, attack: 0.3, release: 1 }); pad.addStereo(L, R, c.t0, 0.075); }
  bass.addMono(I.bass(c.bass + 12, c.t1 - c.t0, { bright: 0.15, sub: 1 }), c.t0, 0.3);
}
clock.eachStep(20, 23, 8, (t, b, s) => { const c = sc.chordAt(t); if (c && s % 2 === 0) { const g = I.guitar(c.notes[(s / 2) % c.notes.length] + 12, 0.5, { bright: 0.45, seed: s }); keys.addMono(g, t, 0.16, s % 4 ? 0.3 : -0.3); verb.addMono(g, t, 0.06); } });
{ // le compteur des ventes qui monte : un tic par pas
  const [c0, c1] = ev.counter; const n = 18;
  for (let i = 0; i < n; i++) fx.addMono(I.woodTick(1.6 + i * 0.05), c0 + (c1 - c0) * Math.pow(i / n, 0.7), 0.06 + i * 0.004, 0.2);
  for (const [i, f] of ['C6', 'E6', 'G6'].entries()) keys.addMono(I.bell(mtof(m(f)), 1.2, 1.4, 3.5), c1 + i * 0.05, 0.09, 0);
}

// ---------- FIN (mesures 23–26) : le groove revient, crochet au marimba ----------
const end = Genre.play('afrobeats', { clock, from: 23, to: 26, chordAt: sc.chordAt, buses: busesA, gain: 1 });
kicks.push(...end.kicks);
fx.addMono(I.subBoom(1.4), ev.endCard, 0.55);
drums.addMono(I.crash(21), ev.endCard, 0.35, -0.2);
for (const c of sc.chords.filter((c) => c.t0 >= ev.endCard)) for (const n of c.notes) { const { L, R } = I.padNote(n, c.t1 - c.t0 + (c.t0 >= ev.final ? 1.2 : 0), { cutoff: 2400, attack: 0.05 }); pad.addStereo(L, R, c.t0, 0.05); }
fx.addMono(I.pop(1500, 90), ev.cta, 0.25);
drums.addMono(I.kick({ tail: 0.4 }), ev.final, 0.8); drums.addMono(I.crash(30), ev.final, 0.3);
bass.addMono(I.bass(m('C2') + 12, 1.8, { bright: 0.3, sub: 1 }), ev.final, 0.5);
for (const [i, f] of ['C5', 'E5', 'G5', 'C6'].entries()) lead.addMono(I.marimba(m(f), { decay: 1.2 }), ev.final + i * 0.06, 0.45, -0.3 + i * 0.2);

// ---------- VOIX OFF ----------
for (const v of sc.vo) {
  const b = MIX.loadAudio(path.join(__dirname, 'assets/vo', v.id + '.wav'), { at: v.at, gain: v.who === 'awa' ? 1.0 : 0.95, length: DURATION });
  for (let i = 0; i < N; i++) { voice.L[i] += b.L[i]; voice.R[i] += b.R[i]; }
}

// ---------- mixage ----------
MIX.sidechain([pad, bass], kicks);
const music = [drums, bass, pad, keys, lead, fx];
const stems = {
  drums, bass, pad, keys, lead, fx,
  verb: reverb(verb, { room: 0.8, damp: 0.4 }),
  dly: pingpong(dly, BEAT * 0.75, 0.3, 3500),
};
MIX.duck([...music, stems.verb, stems.dly], voice, { depth: 0.55, release: 0.35 }); // la musique se pousse sous la voix
stems.voice = voice;
const GAIN = { drums: 0.45, bass: 0.7, pad: 2.2, keys: 1.0, lead: 2.0, fx: 0.8, verb: 1, dly: 1, voice: 1.9 };
const out = path.join(__dirname, 'out');
require('fs').mkdirSync(out, { recursive: true });
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 25);
MIX.gate(mix, BREATH[0], BREATH[1]);
MIX.fadeOut(mix, DURATION - 1.2, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
