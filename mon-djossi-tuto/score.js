// MON DJOSSI — TUTORIEL (9:16, ~2 min 40). Awa installe sa boutique puis vit sa première journée.
// Source unique : les voix (vo-data.js, durées mesurées) posent le temps ; chaque tap, saisie et écran est
// calé sur un MOT de la voix (K). song.js et film.js ne lisent que ce fichier.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const VO_DATA = node ? require('./vo-data') : globalThis.VO_DATA;
  const { makeClock, makeChords } = MU;

  const FPS = 30, FORMAT = '9:16', STYLE = 'flat';
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const clock = makeClock({ bpm: 100, offset: 0 });
  const { T, BEAT, BAR } = clock;

  // ---------- la voix pose le temps ----------
  // [id, silence après (s)] ; '|' = nouveau chapitre (le chapitre démarre sur le temps suivant)
  const PLAN = [
    ['i1', 0.5], ['i2', 1.0], '|',
    ['c1a', 1.2], ['c1b', 1.3], ['c1c', 2.2], ['c1d', 1.0], '|',
    ['c2', 1.6], '|',
    ['c3', 1.6], '|',
    ['c4a', 0.9], ['c4b', 1.0], ['c4c', 1.0], ['c4d', 1.2], '|',
    ['c5a', 1.2], ['c5b', 2.2], '|',
    ['c6', 1.4], '|',
    ['d1', 1.4], '|',
    ['d2a', 1.0], ['d2b', 1.0], ['d2c', 1.4], ['d2d', 2.0], '|',
    ['d3', 1.6], '|',
    ['d4', 2.4], '|',
    ['d5', 0.2],
  ];
  const vo = [];
  const chapStart = {};
  let cur = 2.6; // l'intro du logo occupe le début
  for (const p of PLAN) {
    if (p === '|') { cur = Math.ceil((cur + 0.3) / BEAT) * BEAT; continue; }
    const [id, gap] = p, d = VO_DATA[id];
    if (!(d.chap in chapStart)) chapStart[d.chap] = d.chap === 'intro' ? 0 : cur - 0.5;
    vo.push({ id, who: 'n', chap: d.chap, text: d.text, at: cur, end: cur + d.dur });
    cur += d.dur + gap;
  }
  const V = Object.fromEntries(vo.map((v) => [v.id, v]));
  // K('c1b', 'Vêtements') : l'instant où le mot est prononcé (estimé à la position du mot dans la phrase)
  const K = (id, word, d = 0) => {
    const v = V[id], txt = v.text, i = txt.indexOf(word);
    if (i < 0) throw new Error(`mot « ${word} » absent de ${id}`);
    return v.at + (v.end - v.at) * (i / txt.length) + d;
  };
  const endCard = V.d5.at + (V.d5.end - V.d5.at) * 0.62; // sur « Le guide complet… »
  const DURATION = Math.ceil(V.d5.end + 4.2);

  const CHAPTERS = [
    { id: 'intro', label: '' },
    { id: 'c1', label: 'Étape 1/6 · Créer ta boutique' },
    { id: 'c2', label: 'Étape 2/6 · Ma boutique' },
    { id: 'c3', label: 'Étape 3/6 · Les catégories' },
    { id: 'c4', label: 'Étape 4/6 · Tes produits' },
    { id: 'c5', label: 'Étape 5/6 · Ton stock de départ' },
    { id: 'c6', label: 'Étape 6/6 · Tes caissiers' },
    { id: 'd1', label: 'Jour 1 · Le matin' },
    { id: 'd2', label: 'Jour 1 · Vendre' },
    { id: 'd3', label: 'Jour 1 · Sans internet' },
    { id: 'd4', label: 'Jour 1 · Le soir' },
    { id: 'd5', label: 'Jour 1 · Le bilan' },
  ].map((c) => ({ ...c, t: chapStart[c.id] }));

  // ---------- le menu de l'app (positions en points du téléphone, 412 de large) ----------
  const MENU = [
    ['Pilotage', null], ['Dashboard', 'dash'], ['Activité'], ['Recette hebdo'], ['Guide'],
    ['Opérations', null], ['Caisse', 'caisse'], ['Stock'], ['Entrées', 'entrees'], ['Sorties', 'sorties'],
    ['Catalogue', null], ['Produits', 'produits'], ['Catégories', 'categories'], ['Promotions'],
    ['Administration', null], ['Ma boutique', 'boutique'], ['Caissiers', 'caissiers'],
  ];
  let my = 120;
  const MENU_Y = {};
  const MENU_ITEMS = MENU.map(([label, key]) => { const group = key === null; my += group ? 18 : 0; const y = my; my += group ? 34 : 42; MENU_Y[label] = y; return { label, group, y }; });
  const HAMBURGER = [372, 104];

  // ---------- les écrans montrés, dans l'ordre (id → film.js) ----------
  const screens = [];
  const taps = []; // { t, x, y, label } : un doigt se pose, onde, libellé jaune
  const typing = []; // { t0, t1, field, screen } : un champ se remplit lettre par lettre
  const scr = (t, id) => screens.push({ t, id });
  const tap = (t, x, y, label = '') => taps.push({ t, x, y, label });
  const type = (t0, dur, screen, field) => typing.push({ t0, t1: t0 + dur, screen, field });
  const menuTo = (tOpen, label) => { tap(tOpen, ...HAMBURGER); scr(tOpen + 0.12, 'menu'); tap(tOpen + 0.75, 110, MENU_Y[label], label); return tOpen + 0.9; };

  // ÉTAPE 1 : le site → type de commerce → formulaire
  scr(V.c1a.at - 0.4, 'site');
  tap(K('c1a', 'Essai'), 206, 600, 'Essai gratuit');
  scr(K('c1a', 'Essai', 0.35), 'metier');
  tap(K('c1b', 'Vêtements'), 110, 230, 'Vêtements');
  tap(V.c1b.end + 0.3, 206, 640, 'Essai 14 jours');
  scr(V.c1c.at - 0.25, 'form');
  ['nom', 'ville', 'WhatsApp', 'email', 'mot de passe'].forEach((w, i) => type(K('c1c', w), 0.75, 'form', i));
  tap(V.c1c.end + 0.6, 206, 650, 'Inscrire ma boutique');
  const confetti1 = V.c1c.end + 0.75;
  scr(V.c1c.end + 0.9, 'welcome');
  // ÉTAPE 2 : Ma boutique
  scr(V.c2.at - 0.6, 'home');
  const tBoutique = menuTo(K('c2', 'Ouvre'), 'Ma boutique');
  scr(tBoutique, 'boutique');
  type(K('c2', 'adresse'), 0.8, 'boutique', 0);
  type(K('c2', 'WhatsApp'), 0.8, 'boutique', 1);
  const logoDrop = K('c2', 'logo');
  tap(V.c2.end + 0.4, 206, 620, 'Enregistrer');
  // ÉTAPE 3 : Catégories
  const tCat = menuTo(V.c3.at - 0.2, 'Catégories');
  scr(tCat, 'categories');
  tap(K('c3', 'ajoute'), 334, 168, '+ Ajouter');
  const newDrawer = K('c3', 'ajoute', 0.45);
  type(newDrawer, 0.7, 'categories', 0);
  // ÉTAPE 4 : Produits
  const tProd = menuTo(V.c4a.at + 0.3, 'Produits');
  scr(tProd, 'produits');
  tap(K('c4a', 'bouton bleu', 0.2), 334, 168, '+ Ajouter');
  scr(K('c4a', 'bouton bleu', 0.5), 'produitForm');
  [['nom', 0], ['catégorie', 1], ['prix de vente', 2], ["prix d'achat", 3]].forEach(([w, f]) => type(K('c4b', w), 0.6, 'produitForm', f));
  const marge = K('c4b', 'bénéfice');
  const variantes = [K('c4c', 'variante'), K('c4c', 'taille'), K('c4c', 'couleur')];
  const seuil = K('c4d', 'seuil');
  const seuilLine = K('c4d', 'en dessous');
  tap(V.c4d.end + 0.4, 206, 850, 'Enregistrer');
  // ÉTAPE 5 : Entrées + import
  const tEnt = menuTo(V.c5a.at - 0.3, 'Entrées');
  scr(tEnt, 'entrees');
  tap(K('c5a', 'entrée', -0.5), 206, 236, 'Nouvelle entrée');
  scr(K('c5a', 'entrée', -0.2), 'entreeForm');
  type(K('c5a', 'entrée'), 0.6, 'entreeForm', 0);
  const stockFly = K('c5a', 'entrée', 0.6);
  tap(V.c5a.end + 0.6, 206, 790, "Enregistrer l'entrée");
  scr(V.c5b.at - 0.2, 'import');
  const excelDrop = K('c5b', 'Remplis');
  tap(K('c5b', 'importe'), 206, 640, 'Importer');
  const importCount = [K('c5b', 'importe', 0.3), K('c5b', 'coup', 0.6)];
  // ÉTAPE 6 : Caissiers
  const tCais = menuTo(V.c6.at + 0.3, 'Caissiers');
  scr(tCais, 'caissiers');
  tap(K('c6', 'email', -0.4), 206, 236, 'Nouveau caissier');
  type(K('c6', 'email'), 0.6, 'caissiers', 0);
  type(K('c6', 'mot de passe'), 0.6, 'caissiers', 1);
  const badge = K('c6', 'Chacun');
  const lock = K('c6', 'réglages');
  // JOUR 1 · matin
  const sunrise = V.d1.at - 0.5;
  scr(V.d1.at + 0.2, 'home');
  const tCaisse = menuTo(K('d1', 'ouvre', -0.5), 'Caisse');
  scr(tCaisse, 'caisseClosed');
  tap(K('d1', 'rideau', -0.3), 206, 500, 'Commencer la journée');
  const curtainUp = K('d1', 'rideau');
  scr(K('d1', 'rideau', 0.25), 'caisseOpen');
  // JOUR 1 · vendre
  const tSort = menuTo(K('d2a', 'Sorties', -0.75), 'Sorties');
  scr(tSort, 'sorties');
  tap(K('d2a', 'Nouvelle'), 206, 236, 'Nouvelle sortie');
  scr(K('d2a', 'Nouvelle', 0.25), 'sortieType');
  tap(K('d2a', 'Vente'), 110, 290, 'Vente');
  scr(K('d2a', 'Vente', 0.4), 'vente');
  tap(K('d2b', "l'article"), 160, 236, '+ Ajouter un article');
  const scan = K('d2b', 'scanne');
  const itemAdded = K('d2b', 'code-barres', 0.3);
  tap(K('d2b', 'taille'), 148, 376, 'Taille M');
  tap(K('d2b', 'couleur'), 96, 444, 'Rouge');
  tap(V.d2b.end + 0.25, 206, 820, 'Continuer → Paiement');
  scr(V.d2b.end + 0.5, 'paiement');
  const modes = ['espèces', 'Wave', 'Orange', 'MTN'].map((w) => K('d2c', w));
  tap(K('d2c', 'En espèces'), 110, 240, 'Espèces');
  type(K('d2c', 'calcule'), 0.5, 'paiement', 0);
  const monnaie = K('d2c', 'monnaie');
  tap(K('d2d', 'Enregistre', -0.1), 206, 820, 'Enregistrer la vente');
  scr(K('d2d', 'Enregistre', 0.2), 'venteOk');
  tap(K('d2d', 'imprime'), 206, 520, 'Imprimer');
  const receipt = K('d2d', 'imprime', 0.2);
  const stockDown = K('d2d', 'stock');
  // JOUR 1 · sans internet
  scr(V.d3.at - 0.4, 'offline');
  const offline = V.d3.at - 0.2;
  const queued = [K('d3', 'Continue'), K('d3', 'vendre', 0.2)];
  const online = K('d3', 'revient');
  // JOUR 1 · le soir
  const sunset = V.d4.at - 0.5;
  scr(V.d4.at - 0.2, 'caisseTotal');
  const totalBars = K('d4', 'total');
  tap(K('d4', 'termine'), 206, 760, 'Terminer la journée');
  scr(K('d4', 'termine', 0.2), 'caisseConfirm');
  tap(V.d4.end + 0.5, 206, 560, 'Oui, terminer la journée');
  const curtainDown = V.d4.end + 0.75;
  // JOUR 1 · le bilan
  const tDash = menuTo(V.d5.at - 0.6, 'Dashboard');
  scr(tDash, 'dash');
  const dashCount = [K('d5', 'Dashboard', 0.2), K('d5', 'rapporté')];

  screens.sort((a, b) => a.t - b.t);
  taps.sort((a, b) => a.t - b.t);

  // musique : do majeur doux, une progression de 4 mesures en boucle
  const BARS = Math.ceil(DURATION / BAR) + 1;
  const prog = ['C', 'Am7', 'Fmaj7', 'G'];
  const { chords, chordAt } = makeChords(clock, {
    C: { notes: ['G3', 'C4', 'E4'], bass: 'C2' }, Am7: { notes: ['G3', 'C4', 'E4'], bass: 'A1' },
    Fmaj7: { notes: ['A3', 'C4', 'E4'], bass: 'F1' }, G: { notes: ['G3', 'B3', 'D4'], bass: 'G1' },
  }, Array.from({ length: BARS }, (_, b) => [b, 0, 4, prog[b % 4]]));

  // sous-titres : chaque réplique est coupée aux fins de phrase (. ? ;) et aux « : », au prorata des lettres
  const subtitles = [];
  for (const v of vo.filter((x) => x.at < endCard)) {
    const parts = v.text.match(/[^.?;:]+[.?;:]?\s*/g).map((x) => x.trim()).filter(Boolean);
    const merged = [];
    for (const q of parts) { if (merged.length && (merged[merged.length - 1].length < 22 || q.length < 12)) merged[merged.length - 1] += ' ' + q; else merged.push(q); }
    const total = merged.reduce((n, q) => n + q.length, 0);
    let t0 = v.at;
    merged.forEach((q, i) => { const d = (v.end - v.at) * (q.length / total); subtitles.push({ t: t0, end: i === merged.length - 1 ? v.end + 0.2 : t0 + d - 0.02, text: q }); t0 += d; });
  }

  const markers = {
    c1: chapStart.c1, c2: chapStart.c2, c3: chapStart.c3, c4: chapStart.c4, c5: chapStart.c5, c6: chapStart.c6,
    jour: chapStart.d1, vente: chapStart.d2, offline: chapStart.d3, soir: chapStart.d4, bilan: chapStart.d5,
    inscrire: { t: taps.find((x) => x.label === 'Inscrire ma boutique').t, sync: 'a' },
    fin: { t: endCard, sync: 'av' },
  };

  const SCORE = {
    FPS, FORMAT, STYLE, W, H, SAFE, DURATION, clock, T, BEAT, BAR, chords, chordAt, markers,
    vo, V, K, CHAPTERS, MENU_ITEMS, HAMBURGER, screens, taps, typing, subtitles, endCard,
    ev: { confetti1, logoDrop, newDrawer, marge, variantes, seuil, seuilLine, stockFly, excelDrop, importCount, badge, lock,
      sunrise, curtainUp, scan, itemAdded, modes, monnaie, receipt, stockDown, offline, queued, online, sunset, totalBars, curtainDown, dashCount },
  };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
