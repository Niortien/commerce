// MON DJOSSI (9:16) — publicité de 60 s. « Le cahier ou le téléphone » : la journée d'Awa, gérante
// d'une boutique de vêtements à Abidjan, d'abord avec le cahier, puis avec Mon Djossi.
// Source unique de vérité : la musique (song.js), les voix off et l'image (film.js) lisent toutes ce fichier.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock, placeBar, makeChords } = MU;

  const FPS = 30;
  const FORMAT = '9:16';
  const STYLE = 'flat';
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const clock = makeClock({ bpm: 108, offset: 0.5 });
  const { T, BEAT, BAR } = clock;
  const DURATION = 60;

  // sections (en mesures)
  const S = {
    nuit: [0, T(2)], matin: [T(2), T(4)], reseau: [T(4), T(6)], rewind: [T(6), T(7)], logo: [T(7), T(8)],
    alerte: [T(8), T(11)], caisse: [T(11), T(14)], horsligne: [T(14), T(17)], metiers: [T(17), T(20)],
    soir: [T(20), T(23)], fin: [T(23), DURATION],
  };

  // harmonie : la mineur triste au début, puis do majeur lumineux dès le logo
  const { chords, chordAt } = makeChords(clock, {
    Am: { notes: ['A3', 'C4', 'E4'], bass: 'A1' }, F: { notes: ['A3', 'C4', 'F4'], bass: 'F1' },
    Dm: { notes: ['A3', 'D4', 'F4'], bass: 'D2' }, E: { notes: ['G#3', 'B3', 'E4'], bass: 'E2' },
    C: { notes: ['G3', 'C4', 'E4'], bass: 'C2' }, G: { notes: ['G3', 'B3', 'D4'], bass: 'G1' },
    Am7: { notes: ['G3', 'C4', 'E4'], bass: 'A1' }, Fmaj7: { notes: ['A3', 'C4', 'E4'], bass: 'F1' },
    Gsus: { notes: ['G3', 'C4', 'D4'], bass: 'G1' }, Cadd9: { notes: ['G3', 'C4', 'D4', 'E4'], bass: 'C2' },
  }, [
    [0, 0, 4, 'Am'], [1, 0, 4, 'F'], [2, 0, 4, 'Am'], [3, 0, 4, 'E'], [4, 0, 4, 'Dm'], [5, 0, 4, 'E'], [6, 0, 4, 'E'],
    ...[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((b, i) => [b, 0, 4, ['C', 'G', 'Am7', 'Fmaj7'][i % 4]]),
    [20, 0, 4, 'Fmaj7'], [21, 0, 4, 'C'], [22, 0, 4, 'Gsus'],
    [23, 0, 4, 'C'], [24, 0, 4, 'G'], [25, 0, 4, 'Fmaj7'], [26, 0, 4, 'Cadd9'],
  ]);

  // ---- les moments clés (secondes) ----
  const ev = {
    tick0: T(0),
    client: T(2, 0.5), // « Taille M ? »
    rupture: T(3), // le tampon RUPTURE claque
    wifiCut: T(4), // le wifi se barre, glitch
    rewind: T(6), // rembobinage
    logo: T(7), // le logo atterrit : la musique démarre
    phoneUp: T(8) - 0.35,
    notif: T(8, 2), // notification de stock
    commander: T(10), // tap « Commander »
    caisse: T(11),
    tapProduit: T(11, 1), tapTaille: T(11, 2), tapEncaisser: T(11, 3),
    cash: T(12), // +12 500 F CFA, le reçu sort
    stock: T(13), // stock M : 2 → 1
    offline: T(14), // hors ligne
    online: T(15, 2), // le réseau revient
    metiers: [T(17), T(18), T(19)],
    soir: T(20),
    counter: [T(20, 1), T(21, 1)],
    endCard: T(23),
    cta: T(24, 2),
    final: T(26),
  };

  // ventes gardées hors ligne (une par temps), puis envoyées
  const queued = [
    { t: T(14, 2), send: T(16, 0), label: 'T-shirt', price: 7000 },
    { t: T(14, 3), send: T(16, 0.5), label: 'Jean', price: 15000 },
    { t: T(15, 0), send: T(16, 1), label: 'Casquette', price: 5000 },
  ];

  // ---- voix off (fichiers dans assets/vo, générés par tools/vo.py) ----
  // who: 'awa' (la gérante, à l'écran) ou 'n' (la narratrice)
  const vo = [
    { id: 'awa1', at: T(0, 2) },
    { id: 'n1', at: T(3, 1) },
    { id: 'n2', at: T(4, 0.6) },
    { id: 'n3', at: T(7) - 2.95 }, // « … avec Mon Djossi. » finit juste avant le silence qui précède le logo
    { id: 'n4', at: T(8, 3) },
    { id: 'n5', at: T(11, 0.6) },
    { id: 'n6', at: T(12, 1) },
    { id: 'n7', at: T(14, 0.5) },
    { id: 'n8', at: T(15, 3) },
    { id: 'n9', at: T(17, 1) },
    { id: 'n10', at: T(18, 3) },
    { id: 'awa2', at: T(21, 2) },
    { id: 'n11', at: T(23, 1) },
    { id: 'n12', at: T(24, 2.2) },
    { id: 'n13', at: T(25, 2) },
  ];
  // textes et durées mesurées (copie de assets/vo/vo.json, pour le Node et le navigateur)
  const VO_TEXT = {
    awa1: ['awa', "Mais… l'argent est parti où, même ?", 1.853],
    n1: ['n', 'Rupture découverte trop tard…', 1.768],
    n2: ['n', 'Le réseau qui coupe… et des comptes qui ne tombent jamais juste.', 3.268],
    n3: ['n', 'Et si on reprenait la journée ? Avec Mon Djossi.', 2.615],
    n4: ['n', 'Une alerte vous prévient, avant la rupture.', 2.249],
    n5: ['n', 'Produit, taille, encaisser.', 1.274],
    n6: ['n', 'Le reçu sort, et le stock se met à jour tout seul.', 3.051],
    n7: ['n', 'Internet coupe ? La caisse continue.', 2.037],
    n8: ['n', "Tout s'envoie dès que le réseau revient.", 1.756],
    n9: ['n', 'Boutique, restaurant, quincaillerie, friperie…', 2.275],
    n10: ['n', 'Mon Djossi parle votre métier.', 1.817],
    awa2: ['awa', "Là… je sais combien j'ai gagné !", 1.582],
    n11: ['n', 'Sachez chaque soir combien votre commerce a gagné.', 2.768],
    n12: ['n', "Quatorze jours d'essai gratuit.", 1.609],
    n13: ['n', 'Mon Djossi… ça compte pour toi !', 1.752],
  };
  for (const v of vo) { const [who, text, dur] = VO_TEXT[v.id]; Object.assign(v, { who, text, end: v.at + dur }); }
  // sous-titres (toujours à l'écran : la plupart des vidéos sociales sont vues sans le son)
  const subtitles = vo.filter((v) => v.at < ev.endCard).map((v) => ({ t: v.at, end: v.end + 0.15, text: v.text.replace(/…/g, '…') }));

  // mélodie : un crochet en do, joué au marimba (balafon) sur le logo et la fin
  const HK = {
    a: [['E5', 0, 1], ['G5', 1, 1], ['C6', 2, 2], ['G5', 4, 1], ['A5', 5, 1], ['G5', 6, 2]],
    b: [['D5', 0, 1], ['G5', 1, 1], ['B5', 2, 2], ['A5', 4, 1], ['G5', 5, 1], ['E5', 6, 2]],
    c: [['C5', 0, 1], ['E5', 1, 1], ['A5', 2, 2], ['G5', 4, 1], ['E5', 5, 1], ['C5', 6, 2]],
    d: [['C5', 0, 1], ['D5', 1, 1], ['E5', 2, 1], ['G5', 3, 3], ['E5', 6, 1], ['D5', 7, 1]],
  };
  const hook = [
    ...placeBar(clock, HK.a, 7), ...placeBar(clock, HK.b, 8),
    ...placeBar(clock, HK.a, 23), ...placeBar(clock, HK.b, 24), ...placeBar(clock, HK.c, 25),
  ];
  const sadBox = [ // boîte à musique triste, la nuit
    ...placeBar(clock, [['E5', 0, 2], ['C5', 2, 2], ['A4', 4, 3]], 0),
    ...placeBar(clock, [['F5', 0, 2], ['E5', 2, 2], ['C5', 4, 3]], 1),
  ];

  const confetti = [];
  { const r = U.mulberry32(7); for (let i = 0; i < 60; i++) confetti.push({ x: r(), d: r() * 0.5, s: 0.6 + r() * 0.8, spin: r() * 8, c: Math.floor(r() * 5) }); }

  const markers = {
    rupture: { t: ev.rupture, sync: 'av' },
    wifi: { t: ev.wifiCut, sync: 'av' },
    logo: { t: ev.logo, sync: 'av' },
    notif: { t: ev.notif, sync: 'a' },
    cash: { t: ev.cash, sync: 'a' },
    offline: ev.offline,
    online: ev.online,
    metier1: { t: ev.metiers[0], sync: 'a' },
    metier2: { t: ev.metiers[1], sync: 'av' },
    metier3: { t: ev.metiers[2], sync: 'a' },
    soir: ev.soir,
    fin: { t: ev.endCard, sync: 'av' },
    cta: ev.cta,
  };

  const SCORE = {
    FPS, FORMAT, STYLE, W, H, SAFE, DURATION, clock, T, BEAT, BAR, S, m, chords, chordAt, ev, markers,
    queued, vo, subtitles, hook, sadBox, confetti,
  };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
