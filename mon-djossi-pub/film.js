// LE FILM (9:16) — Mon Djossi. Chaque image est une fonction pure de t, mise en page dans G.SAFE.
// Avant (nuit, matin, réseau) en tons éteints → rembobinage → logo → la même journée avec l'app → soir → fin.
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, UI = globalThis.UI, S = globalThis.SCORE, Studio = globalThis.Studio;
  const Subs = globalThis.Subs, Data = globalThis.Data;
  const { T, BEAT, BAR, ev, clock } = S;
  const { clamp, lerp, ease, pulse } = U;
  const W = G.W, H = G.H, SAFE = G.SAFE;

  // ---------- la marque (couleurs du logo et du site) ----------
  const B = { violet: '#7C3AED', blue: '#2563EB', blueL: '#3B82F6', yellow: '#FFC531', ink: '#0F172A', muted: '#64748B', base: '#F4F6FB', ok: '#16A34A', warn: '#EA580C', red: '#E11D48' };
  UI.setTheme({ accent: B.violet, accent2: B.blue, ok: B.ok, ink: B.ink, muted: B.muted, app: B.base, font: 'Inter' });
  const AWA = { hairStyle: 'bun', hair: '#1E1614', skin: '#6B4430', outfit: 'dress', shirt: '#E8742E', trim: '#1F4E8C', bottoms: 'skirt', shorts: '#1F4E8C', build: 'regular' };
  const CLIENT = { hairStyle: 'ponytail', hair: '#1E1614', skin: '#8D5A3B', outfit: 'tee', shirt: '#2E9E6B', bottoms: 'pants', shorts: '#2B2F45' };
  globalThis.CAST = { awa: AWA, cliente: CLIENT };

  let LOGO = null, VO = null;
  const fcfa = (n) => `${Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ')} F CFA`;
  const shakeAt = (t, t0, amp, decay = 9) => (t < t0 ? 0 : amp * Math.exp(-(t - t0) * decay) * Math.sin((t - t0) * 70));

  // ---------- lip-sync depuis l'enveloppe des voix (assets/vo/vo.json) ----------
  function mouthOf(who, t) {
    if (!VO) return 'smile';
    for (const v of S.vo) {
      if (v.who !== who || t < v.at || t > v.end) continue;
      const env = VO[v.id] && VO[v.id].mouth;
      if (!env) break;
      const o = env[Math.min(env.length - 1, Math.floor((t - v.at) * 30))] || 0;
      return { open: o, wide: 0.4 + 0.3 * Math.sin(t * 9), talking: true };
    }
    return null;
  }

  // ---------- le logo, découpé en trois (chariot / « Mon Djossi » / signature) ----------
  // logo-couleur.png : 1664×413 ; chariot x 0–485, mot x 495–1655 y 40–320, signature y 312–405
  function logo(ctx, cx, cy, width, t, t0, { fast = false } = {}) {
    if (!LOGO || t < t0) return;
    const k = width / 1664, x0 = cx - width / 2, y0 = cy - (413 * k) / 2;
    const sp = fast ? 0.7 : 1;
    // le chariot arrive en glissant, avec des traînées
    const u = clamp((t - t0) / (0.42 * sp));
    const pi = ease.outBack(u, 1.6), slide = (1 - pi) * -760;
    for (let g = 3; g >= 0; g--) {
      const lag = g * 0.035, ug = clamp((t - t0 - lag) / (0.42 * sp)), sg = (1 - ease.outBack(ug, 1.6)) * -760;
      if (g > 0 && ug >= 1) continue;
      ctx.save(); ctx.globalAlpha *= g ? 0.18 / g : 1;
      const sx = g ? 1 : 1 + 0.25 * (1 - clamp(u * 1.6));
      ctx.translate(x0 + sg + (g ? 0 : slide - sg), y0 + 413 * k / 2); ctx.scale(sx, 1 / sx);
      ctx.drawImage(LOGO, 0, 0, 485, 413, 0, (-413 * k) / 2, 485 * k, 413 * k);
      ctx.restore();
    }
    // le mot se dévoile de gauche à droite
    const t1 = t0 + 0.4 * sp, r = ease.outCubic(clamp((t - t1) / (0.5 * sp)));
    if (r > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(x0 + 495 * k, y0, 1160 * k * r, 320 * k); ctx.clip();
      ctx.drawImage(LOGO, 495, 0, 1169, 320, x0 + 495 * k + (1 - r) * -40, y0, 1169 * k, 320 * k);
      ctx.restore();
    }
    // la signature monte en fondu
    const t2 = t0 + 0.85 * sp, a = ease.outCubic(clamp((t - t2) / 0.35));
    if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(LOGO, 495, 312, 1169, 101, x0 + 495 * k, y0 + 312 * k + (1 - a) * 24, 1169 * k, 101 * k); ctx.restore(); }
  }
  function logoIcon(ctx, x, y, size, alpha = 1) {
    if (!LOGO) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(15,23,42,0.18)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
    ctx.beginPath(); ctx.roundRect(x - size / 2, y - size / 2, size, size, size * 0.28); ctx.fill(); ctx.shadowColor = 'transparent';
    const s = size * 0.78 / 485;
    ctx.drawImage(LOGO, 0, 0, 485, 413, x - (485 * s) / 2, y - (413 * s) / 2, 485 * s, 413 * s);
    ctx.restore();
  }

  // ---------- petits dessins ----------
  function dress(ctx, x, y, s, color, dots = '#FFD166', seed = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const pts = [[-18, 0], [18, 0], [24, 16], [40, 26], [32, 44], [26, 40], [48, 150], [-48, 150], [-26, 40], [-32, 44], [-40, 26], [-24, 16]];
    G.poly(ctx, pts, { fill: color, lw: 3, seed });
    ctx.save(); ctx.beginPath(); G.path(ctx, pts, true); ctx.clip();
    ctx.fillStyle = dots;
    for (let i = 0; i < 26; i++) { const px = -50 + (i * 37) % 100, py = 6 + ((i * 53) % 150); ctx.beginPath(); ctx.arc(px, py, 6 + (i % 3) * 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    ctx.restore();
  }
  function hanger(ctx, x, y, s = 1) {
    ctx.save(); ctx.strokeStyle = '#5B5B66'; ctx.lineWidth = 5 * s; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x, y - 18 * s, 10 * s, Math.PI, Math.PI * 2.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - 8 * s); ctx.lineTo(x - 46 * s, y + 18 * s); ctx.lineTo(x + 46 * s, y + 18 * s); ctx.closePath(); ctx.stroke();
    ctx.restore();
  }
  function wifi(ctx, x, y, s, color, slash = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineWidth = 16;
    for (const r of [60, 110, 160]) { ctx.beginPath(); ctx.arc(0, 60, r, -Math.PI * 0.78, -Math.PI * 0.22); ctx.stroke(); }
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 60, 16, 0, Math.PI * 2); ctx.fill();
    if (slash > 0) { ctx.strokeStyle = B.red; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(-150, -120); ctx.lineTo(-150 + 300 * slash, -120 + 240 * slash); ctx.stroke(); }
    ctx.restore();
  }
  function cloud(ctx, x, y, s, color) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(-40, 10, 40, 0, Math.PI * 2); ctx.arc(10, -14, 54, 0, Math.PI * 2); ctx.arc(60, 12, 38, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-40, 10, 100, 40); ctx.restore();
  }
  function bgGrad(ctx, c0, c1, angle = 1) {
    const g = ctx.createLinearGradient(0, 0, W * angle, H); g.addColorStop(0, c0); g.addColorStop(1, c1);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function blob(ctx, x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function tag(ctx, text, x, y, { bg = 'rgba(255,255,255,0.92)', fg = B.ink, size = 30, a = 1 } = {}) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; UI.pill(ctx, x, y, text, { bg, fg, size, h: size * 1.9, weight: 800 }); ctx.restore();
  }

  // ======================= AVANT =======================
  // 1. LA NUIT (mesures 0–1) : Awa, le cahier, la calculatrice
  function shotNuit(ctx, t) {
    bgGrad(ctx, '#2B2752', '#3E2F63');
    blob(ctx, 820, 520, 620, 'rgba(255,186,110,0.30)'); // la lampe
    // l'horloge
    const colon = Math.floor(t * 2) % 2 ? ':' : ' ';
    UI.text(ctx, `21${colon}00`, W / 2, 380, { size: 150, weight: 800, color: '#F3E9FF', align: 'center' });
    UI.text(ctx, 'Le soir, à la boutique', W / 2, 450, { size: 36, weight: 600, color: '#C9B8E8', align: 'center' });
    // Awa assise derrière la table
    const late = t > T(1, 2);
    Ch.person(ctx, {
      x: 540, y: 1250, s: 1.45, pose: 'sit', style: AWA, seed: 11,
      eyes: late ? 'closed' : 'normal', brows: 'worried', mouth: mouthOf('awa', t) || 'wavy', look: 0, lookY: 0.4,
      gesture: late ? 'facepalm' : t > ev.tick0 + 1.0 ? 'shrug' : 'think', sweat: late ? 0.6 : 0,
    });
    // la table
    G.rrect(ctx, -40, 1190, W + 80, 60, 10, { fill: '#8A5A36', lw: 0 });
    G.rrect(ctx, -40, 1245, W + 80, 700, 0, { fill: '#6E4528', lw: 0 });
    // le cahier ouvert
    ctx.save(); ctx.translate(470, 1225); ctx.rotate(-0.05);
    G.rrect(ctx, -250, -70, 500, 300, 14, { fill: '#FFF9EC', lw: 0 });
    ctx.strokeStyle = 'rgba(37,99,235,0.18)'; ctx.lineWidth = 2;
    for (let y = -30; y < 220; y += 36) { ctx.beginPath(); ctx.moveTo(-230, y); ctx.lineTo(230, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-2, -70, 4, 300);
    const hand = { fam: 'Caveat', weight: 700, color: '#1E3A8A' };
    G.text(ctx, 'Robe wax  12 500', -225, -12, { size: 34, ...hand });
    G.text(ctx, 'Jean  15 000', -225, 24, { size: 34, ...hand });
    G.text(ctx, 'T-shirt  7 000', -225, 60, { size: 34, ...hand });
    G.text(ctx, 'Avance Fatou ?', 20, -12, { size: 34, ...hand });
    G.text(ctx, 'Casquette  5 000', 20, 24, { size: 34, ...hand });
    G.text(ctx, 'TOTAL : 36 500', 20, 96, { size: 40, ...hand });
    const st = clamp((t - T(1)) / 0.3);
    if (st > 0) { ctx.strokeStyle = B.red; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(14, 84); ctx.lineTo(14 + 220 * st, 80); ctx.stroke(); }
    const q = UI.pop(t, T(1, 1), 0.3, 2.5);
    if (q > 0) { ctx.save(); ctx.translate(120, 150); ctx.scale(q, q); ctx.rotate(-0.12); G.text(ctx, '31 000 ???', 0, 0, { size: 46, fam: 'Caveat', weight: 700, color: B.red, align: 'center' }); ctx.restore(); }
    ctx.restore();
    // la calculatrice
    ctx.save(); ctx.translate(860, 1290); ctx.rotate(0.12);
    G.rrect(ctx, -90, -120, 180, 250, 22, { fill: '#2F3446', lw: 0 });
    G.rrect(ctx, -70, -100, 140, 56, 8, { fill: '#B7C6A5', lw: 0 });
    const err = t > T(1) && Math.floor(t * 3) % 2 === 0;
    UI.text(ctx, err ? 'ERR' : '36500', 58, -60, { size: 32, weight: 800, color: '#2B3324', align: 'right' });
    for (let i = 0; i < 12; i++) G.rrect(ctx, -66 + (i % 3) * 46, -26 + Math.floor(i / 3) * 36, 38, 28, 6, { fill: i % 3 === 2 ? '#E8742E' : '#4A5068', lw: 0 });
    ctx.restore();
    // des billets en vrac
    [[150, 1400, -0.3], [250, 1440, 0.2], [700, 1450, -0.1]].forEach(([x, y, r], i) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(r);
      G.rrect(ctx, -90, -44, 180, 88, 6, { fill: i % 2 ? '#7FB6A8' : '#C9A7E0', lw: 0 });
      UI.text(ctx, i % 2 ? '2000' : '10000', 0, 12, { size: 30, weight: 800, color: 'rgba(15,23,42,0.55)', align: 'center' });
      ctx.restore();
    });
    // pénombre sur les bords
    const v = ctx.createRadialGradient(W / 2, 900, 300, W / 2, 900, 1300); v.addColorStop(0, 'rgba(20,10,40,0)'); v.addColorStop(1, 'rgba(20,10,40,0.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }

  // 2. LE MATIN (mesures 2–3) : la cliente demande une taille M… épuisée
  function shotMatin(ctx, t) {
    const sh = shakeAt(t, ev.rupture, 22);
    ctx.save(); ctx.translate(sh, sh * 0.6);
    bgGrad(ctx, '#E7DCCB', '#CDBFA9');
    blob(ctx, 200, 300, 700, 'rgba(255,240,200,0.55)');
    tag(ctx, '08:30 · le matin', SAFE.x, SAFE.y + 20, { a: UI.fadeIn(t, T(2), 0.3) });
    // le portant
    ctx.fillStyle = '#6B6B76'; ctx.fillRect(110, 470, 860, 12); ctx.fillRect(120, 470, 12, 760); ctx.fillRect(948, 470, 12, 760);
    const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
    const COLORS = [['#C2410C', '#FDE68A'], null, ['#1D4ED8', '#FCA5A5'], ['#047857', '#FDE68A'], ['#7C2D12', '#A7F3D0']];
    SIZES.forEach((sz, i) => {
      const x = 220 + i * 160;
      if (COLORS[i]) { hanger(ctx, x, 500); dress(ctx, x, 518, 1.05 + 0.02 * Math.sin(t * 2 + i), COLORS[i][0], COLORS[i][1], 30 + i); }
      else { ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = 'rgba(15,23,42,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - 55, 520, 110, 160, 16); ctx.stroke(); ctx.restore(); UI.text(ctx, '?', x, 620, { size: 70, weight: 800, color: 'rgba(15,23,42,0.35)', align: 'center' }); }
      G.rrect(ctx, x - 30, 700, 60, 40, 8, { fill: '#FFFFFF', lw: 0 }); UI.text(ctx, sz, x, 730, { size: 24, weight: 800, color: B.ink, align: 'center' });
    });
    // la cliente et Awa
    Ch.person(ctx, { x: 230, y: 1500, s: 1.2, pose: 'stand', style: CLIENT, seed: 21, look: 1, eyes: 'normal', mouth: t > ev.client && t < ev.client + 1.4 ? 'open' : 'smile', gesture: t > ev.client ? 'point' : undefined });
    const found = t > ev.rupture;
    Ch.person(ctx, { x: 820, y: 1500, s: 1.2, pose: 'stand', style: AWA, seed: 11, look: -1, eyes: found ? 'wide' : 'normal', brows: found ? 'worried' : 'neutral', mouth: found ? 'o' : 'smile', gesture: found ? 'facepalm' : 'think' });
    G.bubble(ctx, 'Taille M, s’il vous plaît ?', 380, 860, 260, 1000, t, ev.client, ev.rupture - 0.1, { size: 46 });
    // le tampon RUPTURE
    if (t >= ev.rupture) {
      const u = clamp((t - ev.rupture) / 0.16), sc = lerp(2.6, 1, ease.outCubic(u));
      ctx.save(); ctx.translate(540, 650); ctx.rotate(-0.16); ctx.scale(sc, sc); ctx.globalAlpha = clamp(u * 3);
      ctx.strokeStyle = B.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-300, -80, 600, 160, 24); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill();
      UI.text(ctx, 'RUPTURE', 0, 38, { size: 110, weight: 800, color: B.red, align: 'center', spacing: 6 });
      ctx.restore();
    }
    ctx.restore();
    // flash du tampon
    const fl = 0.55 * Math.exp(-(t - ev.rupture) * 14);
    if (t >= ev.rupture && fl > 0.01) { ctx.fillStyle = `rgba(255,255,255,${fl})`; ctx.fillRect(0, 0, W, H); }
  }

  // 3. LE RÉSEAU (mesures 4–5) : wifi coupé, comptes qui ne tombent pas juste
  function shotReseau(ctx, t) {
    const cut = t >= ev.wifiCut;
    bgGrad(ctx, '#2F3A5E', '#4A2E55');
    blob(ctx, 540, 600, 700, cut ? `rgba(225,29,72,${0.25 + 0.1 * Math.sin(t * 6)})` : 'rgba(120,140,220,0.2)');
    const gl = cut ? Math.exp(-(t - ev.wifiCut) * 4) : 0;
    const jx = gl * 26 * (U.hash(Math.floor(t * 30), 1) - 0.5), jy = gl * 10 * (U.hash(Math.floor(t * 30), 2) - 0.5);
    const slash = ease.outCubic(clamp((t - ev.wifiCut) / 0.18));
    if (gl > 0.05) { ctx.save(); ctx.globalAlpha = 0.6; wifi(ctx, 540 + jx + 12, 560 + jy, 1.5, '#FF4D8D', slash); wifi(ctx, 540 - jx - 12, 560 - jy, 1.5, '#4DD9FF', slash); ctx.restore(); }
    wifi(ctx, 540 + jx, 560 + jy, 1.5, '#FFFFFF', slash);
    tag(ctx, 'Réseau indisponible', W / 2 - 200, 760, { bg: B.red, fg: '#FFFFFF', a: UI.pop(t, ev.wifiCut + 0.2, 0.3, 2) > 0 ? 1 : 0 });
    // la feuille de comptes qui se brouille
    ctx.save(); ctx.translate(540, 1080); ctx.rotate(0.04);
    G.rrect(ctx, -330, -150, 660, 300, 20, { fill: '#FFF9EC', lw: 0 });
    const rows = ['Ventes', 'Dépenses', 'Caisse'];
    rows.forEach((r, i) => {
      G.text(ctx, r, -290, -70 + i * 80, { size: 46, fam: 'Caveat', color: '#1E3A8A' });
      const n = cut && t > T(4, 2 + i) ? Math.floor(U.hash(Math.floor(t * 8), i) * 90000) : [36500, 12000, 24500][i];
      G.text(ctx, cut && t > T(4, 2 + i) ? `${n.toLocaleString('fr-FR').replace(/ | /g, ' ')} ?` : `${n.toLocaleString('fr-FR').replace(/ | /g, ' ')}`, 290, -70 + i * 80, { size: 46, fam: 'Caveat', color: cut && t > T(4, 2 + i) ? B.red : '#1E3A8A', align: 'right' });
    });
    ctx.restore();
    Ch.person(ctx, { x: 860, y: 1500, s: 0.95, pose: 'stand', style: AWA, seed: 11, look: -1, eyes: 'closed', brows: 'worried', mouth: 'wavy', gesture: 'facepalm', sweat: 0.8 });
  }

  // 4. LE REMBOBINAGE (mesure 6) : la journée défile à l'envers, façon cassette
  function shotBefore(ctx, t) {
    if (t < T(2)) shotNuit(ctx, t); else if (t < T(4)) shotMatin(ctx, t); else shotReseau(ctx, t);
  }
  function shotRewind(ctx, t) {
    const end = ev.logo - BEAT / 2;
    const u = clamp((t - ev.rewind) / (end - ev.rewind));
    const tp = lerp(ev.rewind - 0.05, 0.6, ease.inCubic(u)); // on recule de plus en plus vite
    ctx.save();
    const sk = 0.04 * Math.sin(t * 40) * (0.3 + u);
    ctx.transform(1, 0, sk, 1, -sk * H / 2, 0);
    shotBefore(ctx, t < end ? tp : 0.6);
    ctx.restore();
    // look VHS : teinte violette, lignes, bande de bruit qui défile
    ctx.fillStyle = 'rgba(124,58,237,0.22)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2);
    const by = ((t * 2400) % (H + 200)) - 100;
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(0, by, W, 60);
    // ◀◀
    ctx.fillStyle = '#FFFFFF';
    for (const dx of [0, 70]) { ctx.beginPath(); ctx.moveTo(SAFE.x + 80 + dx, SAFE.y + 40); ctx.lineTo(SAFE.x + 80 + dx, SAFE.y + 120); ctx.lineTo(SAFE.x + 20 + dx, SAFE.y + 80); ctx.closePath(); ctx.fill(); }
    UI.text(ctx, 'ON REPREND LA JOURNÉE', SAFE.x + 180, SAFE.y + 96, { size: 44, weight: 800, color: '#FFFFFF' });
    if (t >= end) { ctx.fillStyle = 'rgba(15,10,40,0.55)'; ctx.fillRect(0, 0, W, H); } // le souffle retenu : on fige
  }

  // ======================= LE LOGO =======================
  function lightBg(ctx, t) {
    ctx.fillStyle = B.base; ctx.fillRect(0, 0, W, H);
    blob(ctx, 200 + 80 * Math.sin(t * 0.5), 380, 720, 'rgba(124,58,237,0.20)');
    blob(ctx, 900 + 60 * Math.cos(t * 0.4), 1300, 800, 'rgba(37,99,235,0.18)');
    blob(ctx, 540, 1800, 600, 'rgba(255,197,49,0.15)');
  }
  function shotLogo(ctx, t) {
    lightBg(ctx, t);
    const p = clamp((t - ev.logo) / 0.6);
    G.rays(ctx, W / 2, 800, { n: 28, r0: 200, r1: 1300, color: B.violet, lw: 22, alpha: 0.07 * p, spin: (t - ev.logo) * 0.15 });
    const ring = clamp((t - ev.logo) / 0.7);
    if (ring < 1) { ctx.save(); ctx.strokeStyle = `rgba(124,58,237,${0.5 * (1 - ring)})`; ctx.lineWidth = 14 * (1 - ring) + 2; ctx.beginPath(); ctx.arc(W / 2, 800, 120 + ring * 700, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    // le logo, à la fin de la mesure il rétrécit vers le coin (il restera en badge)
    const out = ease.inOutCubic(clamp((t - (T(8) - 0.85)) / 0.45));
    ctx.save(); ctx.globalAlpha = 1 - out;
    logo(ctx, W / 2, lerp(800, 600, out), lerp(920, 300, out), t, ev.logo);
    ctx.restore();
    burst(ctx, t, ev.logo, W / 2, 800);
    const wp = UI.fadeIn(t, T(7, 2.5), 0.3) * (1 - out);
    UI.text(ctx, 'La caisse et le stock de votre boutique', W / 2, 1060, { size: 40, weight: 700, color: B.ink, align: 'center', alpha: wp, maxW: SAFE.w });
    UI.text(ctx, 'dans votre téléphone.', W / 2, 1116, { size: 40, weight: 700, color: B.violet, align: 'center', alpha: wp });
  }
  function burst(ctx, t, t0, cx, cy) {
    const a = t - t0; if (a < 0 || a > 1.6) return;
    const cols = [B.violet, B.blue, B.yellow, '#22C55E', '#F472B6'];
    S.confetti.forEach((c, i) => {
      const ang = c.x * Math.PI * 2, v = 700 + c.s * 600, d = clamp(a - c.d * 0.2);
      const x = cx + Math.cos(ang) * v * d, y = cy + Math.sin(ang) * v * d + 900 * d * d;
      ctx.save(); ctx.globalAlpha = clamp(1.4 - a); ctx.translate(x, y); ctx.rotate(a * c.spin); ctx.fillStyle = cols[c.c];
      ctx.fillRect(-9 * c.s, -5 * c.s, 18 * c.s, 10 * c.s); ctx.restore();
    });
  }

  // ======================= L'APP =======================
  const BADGE_Y = SAFE.y + 44;
  function badgeRow(ctx, t, label, t0) {
    logoIcon(ctx, SAFE.x + 38, BADGE_Y, 76);
    const a = UI.fadeIn(t, t0, 0.25);
    if (label) { ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * -30, 0); UI.pill(ctx, SAFE.x + 96, BADGE_Y - 30, label, { bg: B.ink, fg: '#FFFFFF', size: 28, h: 60, weight: 800 }); ctx.restore(); }
  }
  // écran ACCUEIL + ALERTE (mesures 8–10)
  function screenHome(ctx, w, h, t) {
    UI.header(ctx, w, 'Bonjour Awa', { kicker: 'Boutique Awa · Abidjan' });
    UI.card(ctx, 16, 150, w - 32, 150, 22);
    UI.text(ctx, 'Ventes du jour', 36, 192, { size: 15, weight: 700, color: B.muted });
    UI.text(ctx, '0 F CFA', 36, 236, { size: 32, weight: 800 });
    UI.text(ctx, 'Objectif : 150 000 F', 36, 274, { size: 14, weight: 600, color: B.muted });
    UI.ring(ctx, w - 80, 225, 42, 0.02, { color: B.violet });
    UI.text(ctx, 'Stock à surveiller', 24, 344, { size: 18, weight: 800 });
    [['Robe wax · taille M', '2', B.warn], ['Jean · taille 32', '5', B.muted], ['T-shirt blanc · L', '9', B.muted]].forEach(([n, q, c], i) => {
      const y = 364 + i * 78;
      UI.card(ctx, 16, y, w - 32, 66, 16, { shadow: false });
      UI.text(ctx, n, 36, y + 41, { size: 17, weight: 700 });
      UI.pill(ctx, w - 76, y + 17, q, { bg: c, size: 15, h: 32 });
    });
    // la notification qui descend
    const nd = ease.outBack(clamp((t - ev.notif) / 0.35), 1.4);
    if (t >= ev.notif) {
      const y = lerp(-140, 70, nd);
      const big = clamp((t - T(9, 2)) / 0.3);
      const hh = 112 + big * 76;
      ctx.save(); UI.card(ctx, 12, y, w - 24, hh, 22, { fill: '#FFFFFF' });
      ctx.fillStyle = B.warn; ctx.beginPath(); ctx.arc(52, y + 46, 22, 0, Math.PI * 2); ctx.fill();
      UI.text(ctx, '!', 52, y + 55, { size: 26, weight: 800, color: '#FFFFFF', align: 'center' });
      UI.text(ctx, 'STOCK BAS · maintenant', 88, y + 38, { size: 12, weight: 800, color: B.warn, spacing: 1 });
      UI.text(ctx, 'Robe wax, taille M : plus que 2', 88, y + 66, { size: 17, weight: 700, maxW: w - 120 });
      UI.text(ctx, 'Commandez avant la rupture', 88, y + 90, { size: 14, weight: 500, color: B.muted });
      if (big > 0) { ctx.globalAlpha = big; UI.button(ctx, w / 2, y + 148, w - 64, 50, 'Commander au fournisseur', t, { tTap: ev.commander, done: 'Commande envoyée ✓', bg: B.violet, size: 18 }); }
      ctx.restore();
    }
    UI.navBar(ctx, w, h, ['Accueil', 'Caisse', 'Stock', 'Rapports'], 'Accueil');
  }
  // écran CAISSE (mesures 11–13)
  const PRODUCTS = [['Robe wax', 12500, '#C2410C', '#FDE68A'], ['T-shirt', 7000, '#2563EB', '#BFDBFE'], ['Jean', 15000, '#1E3A8A', '#93C5FD'], ['Casquette', 5000, '#047857', '#A7F3D0']];
  function screenCaisse(ctx, w, h, t) {
    UI.header(ctx, w, 'Caisse', { kicker: '● Session ouverte · Caisse 1' });
    PRODUCTS.forEach(([n, p, c, d], i) => {
      const x = 16 + (i % 2) * ((w - 44) / 2 + 12), y = 140 + Math.floor(i / 2) * 196, cw = (w - 44) / 2;
      const sel = i === 0 && t >= ev.tapProduit;
      UI.card(ctx, x, y, cw, 180, 20, { stroke: sel ? B.violet : undefined });
      if (sel) { ctx.save(); ctx.strokeStyle = B.violet; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x, y, cw, 180, 20); ctx.stroke(); ctx.restore(); }
      ctx.fillStyle = d; ctx.beginPath(); ctx.roundRect(x + 10, y + 10, cw - 20, 96, 14); ctx.fill();
      dress(ctx, x + cw / 2, y + 18, 0.52, c, '#FFFFFF', 60 + i);
      UI.text(ctx, n, x + 14, y + 134, { size: 17, weight: 800 });
      UI.text(ctx, fcfa(p), x + 14, y + 160, { size: 14, weight: 600, color: B.muted });
    });
    UI.tap(ctx, 110, 220, t, ev.tapProduit, { color: 'rgba(124,58,237,0.9)', size: 90 });
    // la taille
    const ta = UI.fadeIn(t, ev.tapProduit + 0.12, 0.2);
    if (ta > 0) {
      ctx.save(); ctx.globalAlpha = ta;
      UI.text(ctx, 'Taille', 24, 562, { size: 16, weight: 800 });
      ['S', 'M', 'L', 'XL'].forEach((sz, i) => {
        const on = sz === 'M' && t >= ev.tapTaille;
        ctx.fillStyle = on ? B.violet : '#FFFFFF'; ctx.beginPath(); ctx.roundRect(24 + i * 92, 576, 80, 50, 14); ctx.fill();
        if (!on) { ctx.strokeStyle = '#D5DBE7'; ctx.lineWidth = 2; ctx.stroke(); }
        UI.text(ctx, sz, 64 + i * 92, 609, { size: 19, weight: 800, color: on ? '#FFFFFF' : B.ink, align: 'center' });
      });
      const stock = t >= ev.stock ? 1 : 2, sp = 1 + 0.4 * pulse(t, ev.stock, 6) * (t >= ev.stock ? 1 : 0);
      ctx.save(); ctx.translate(24, 662); ctx.scale(sp, sp);
      UI.text(ctx, `Stock M : ${stock}`, 0, 0, { size: 15, weight: 700, color: t >= ev.stock ? B.warn : B.muted });
      ctx.restore();
      UI.tap(ctx, 156, 601, t, ev.tapTaille, { color: 'rgba(124,58,237,0.9)', size: 70 });
      ctx.restore();
    }
    const ba = UI.fadeIn(t, ev.tapTaille + 0.1, 0.2);
    if (ba > 0) { ctx.save(); ctx.globalAlpha = ba; UI.button(ctx, w / 2, h - 150, w - 48, 62, 'Encaisser 12 500 F', t, { tTap: ev.tapEncaisser, done: 'Payé ✓  Reçu imprimé', bg: B.violet, size: 20 }); ctx.restore(); }
    UI.navBar(ctx, w, h, ['Accueil', 'Caisse', 'Stock', 'Rapports'], 'Caisse');
  }
  // écran HORS LIGNE (mesures 14–16)
  function screenOffline(ctx, w, h, t) {
    UI.header(ctx, w, 'Caisse', { kicker: '● Session ouverte · Caisse 1' });
    const on = t >= ev.online;
    const bp = UI.pop(t, on ? ev.online : ev.offline, 0.3, 2);
    ctx.save(); ctx.translate(w / 2, 168); ctx.scale(Math.max(0.01, bp), Math.max(0.01, bp));
    ctx.fillStyle = on ? '#DCFCE7' : '#FFEDD5'; ctx.beginPath(); ctx.roundRect(-(w - 32) / 2, -34, w - 32, 68, 18); ctx.fill();
    UI.text(ctx, on ? 'Connexion rétablie · envoi…' : 'Hors ligne · la caisse continue', 0, 8, { size: 18, weight: 800, color: on ? B.ok : B.warn, align: 'center' });
    ctx.restore();
    S.queued.forEach((q, i) => {
      const a = UI.fadeIn(t, q.t, 0.15); if (a <= 0) return;
      const y = 230 + i * 100, slide = (1 - ease.outCubic(clamp((t - q.t) / 0.3))) * 60;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(slide, 0);
      UI.card(ctx, 16, y, w - 32, 84, 18);
      UI.text(ctx, q.label, 36, y + 38, { size: 18, weight: 800 });
      UI.text(ctx, fcfa(q.price), 36, y + 64, { size: 15, weight: 600, color: B.muted });
      const sent = t >= q.send;
      if (sent) UI.check(ctx, w - 60, y + 42, 18, clamp((t - q.send) / 0.2));
      else { UI.text(ctx, 'en attente', w - 40, y + 48, { size: 14, weight: 700, color: B.warn, align: 'right' }); }
      ctx.restore();
    });
    const allSent = t >= S.queued[2].send + 0.2;
    const n = S.queued.filter((q) => t >= q.t).length;
    if (n > 0) UI.text(ctx, allSent ? '3 ventes envoyées · sans doublon' : `${n} vente${n > 1 ? 's' : ''} gardée${n > 1 ? 's' : ''} sur le téléphone`, w / 2, 560, { size: 17, weight: 800, color: allSent ? B.ok : B.ink, align: 'center' });
    UI.navBar(ctx, w, h, ['Accueil', 'Caisse', 'Stock', 'Rapports'], 'Caisse');
  }
  function appScreen(ctx, w, h, t) {
    const list = [[ev.caisse, screenCaisse], [ev.offline, screenOffline]];
    let cur = screenHome, prev = null, tc = -1;
    for (const [t0, fn] of list) if (t >= t0) { prev = cur; cur = fn; tc = t0; }
    const u = prev ? clamp((t - tc) / 0.28) : 1;
    if (u < 1) { ctx.save(); ctx.translate(-u * 140, 0); prev(ctx, w, h, t); ctx.restore(); }
    ctx.save(); ctx.translate((1 - ease.outCubic(u)) * w, 0);
    ctx.fillStyle = B.base; ctx.fillRect(0, 0, w, h);
    cur(ctx, w, h, t);
    ctx.restore();
  }
  function shotApp(ctx, t) {
    lightBg(ctx, t);
    const up = ease.outBack(clamp((t - ev.phoneUp) / 0.5), 1.1);
    const down = ease.inCubic(clamp((t - (T(17) - 0.32)) / 0.32));
    const left = ease.inOutCubic(clamp((t - ev.caisse) / 0.4)) * (1 - ease.inOutCubic(clamp((t - ev.offline) / 0.4)));
    const cx = W / 2 - 110 * left, cy = lerp(H + 700, 820, up) + down * 1400;
    const label = t < ev.caisse ? ['Alertes de stock', T(8)] : t < ev.offline ? ['Caisse rapide', ev.caisse] : ['Même sans internet', ev.offline];
    badgeRow(ctx, t, label[0], label[1]);
    // à droite du téléphone : le reçu qui s'imprime
    if (t >= ev.cash && t < ev.offline + 0.3) {
      const pr = ease.outCubic(clamp((t - ev.cash) / 1.4)), fade = 1 - clamp((t - ev.offline) / 0.3);
      ctx.save(); ctx.globalAlpha = fade;
      const rx = 694, ry = 560, rw = 244, rh = 520 * pr;
      ctx.beginPath(); ctx.rect(rx - 10, ry, rw + 20, rh); ctx.clip();
      ctx.shadowColor = 'rgba(15,23,42,0.2)'; ctx.shadowBlur = 20;
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(rx, ry, rw, 520); ctx.shadowColor = 'transparent';
      const L = [['BOUTIQUE AWA', 18, 800, 'center'], ['Abidjan · Caisse 1', 14, 500, 'center'], ['- - - - - - - - - - - -', 16, 500, 'center'], ['Robe wax M x1', 14, 700, 'left'], ['12 500 F', 14, 700, 'right'], ['- - - - - - - - - - - -', 16, 500, 'center'], ['TOTAL', 16, 800, 'left'], ['12 500 F CFA', 16, 800, 'right'], ['Merci et à bientôt !', 15, 600, 'center']];
      let y = ry + 50;
      L.forEach(([s, size, wt, al], i) => {
        const x = al === 'center' ? rx + rw / 2 : al === 'left' ? rx + 20 : rx + rw - 20;
        UI.text(ctx, s, x, y, { size, weight: wt, align: al, font: '"DejaVu Sans Mono", monospace', color: B.ink });
        if (!(al === 'left' && L[i + 1] && L[i + 1][3] === 'right')) y += size * 2.1;
      });
      ctx.restore();
      ctx.fillStyle = '#2F3446'; ctx.beginPath(); ctx.roundRect(676, 532, 280, 44, 14); ctx.fill(); // la fente de l'imprimante
    }
    UI.phone(ctx, cx, cy, 1060, appScreen, t, { rot: lerp(0.1, 0, up) - down * 0.08, time: t < ev.caisse ? '08:31' : t < ev.offline ? '10:12' : '15:40' });
    // +12 500 F CFA qui s'envole
    const fl = t - ev.cash;
    if (fl > 0 && fl < 1.6) { ctx.save(); ctx.globalAlpha = clamp(1.6 - fl); const p = UI.pop(t, ev.cash, 0.3, 2.2); ctx.translate(cx, 1150 - fl * 160); ctx.scale(p, p); UI.pill(ctx, -150, -36, '+ 12 500 F CFA', { bg: B.ok, size: 34, h: 72, weight: 800 }); ctx.restore(); }
    // hors ligne : le nuage, et les ventes qui remontent dès que le réseau revient
    if (t >= ev.offline - 0.2) {
      const a = UI.fadeIn(t, ev.offline, 0.25), on = t >= ev.online;
      ctx.save(); ctx.globalAlpha = a;
      cloud(ctx, 830, 400, 0.9, on ? '#DBEAFE' : '#E2E8F0');
      wifi(ctx, 840, 392, 0.22, on ? B.blue : B.muted, on ? 0 : 1);
      ctx.restore();
      for (const q of S.queued) {
        const u = clamp((t - (q.send - 0.35)) / 0.35); if (u <= 0 || u >= 1) continue;
        const i = S.queued.indexOf(q), x0 = cx + 120, y0 = 470 + i * 100;
        ctx.fillStyle = B.blue; ctx.beginPath(); ctx.arc(lerp(x0, 830, u), lerp(y0, 410, u) - Math.sin(u * Math.PI) * 120, 14, 0, Math.PI * 2); ctx.fill();
      }
    }
    // « Avant la rupture » : la confirmation sort du téléphone
    const cp = UI.pop(t, ev.commander + 0.4, 0.3, 2) * (1 - clamp((t - ev.caisse) / 0.2));
    if (cp > 0 && t < ev.caisse) { ctx.save(); ctx.translate(250, 1250); ctx.rotate(-0.05); ctx.scale(cp, cp); UI.pill(ctx, -10, -32, '✓ Commandé avant la rupture', { bg: B.ok, size: 28, h: 64, weight: 800 }); ctx.restore(); }
  }

  // ======================= LES MÉTIERS =======================
  const SECTORS = [
    { name: 'Restaurant', kicker: 'Le plat vendu, les ingrédients décomptés', color: '#EA580C', bg: ['#FFEDD5', '#FED7AA'], icon: 'bowl',
      head: '1 garba vendu', rows: ['Attiéké  −1 portion', 'Poulet  −1', 'Piment  −1'], meter: null },
    { name: 'Quincaillerie', kicker: 'Au mètre, au sac, et à crédit', color: '#0E7490', bg: ['#CFFAFE', '#A5F3FC'], icon: 'cable',
      head: 'Câble 2,5 mm²', rows: ['Devis proforma → vente', 'Crédit client · échéance', 'Relance WhatsApp'], meter: { label: 'm vendus', to: 12.5, dec: 1 } },
    { name: 'Friperie', kicker: 'Chaque balle sait si elle est rentabilisée', color: '#15803D', bg: ['#DCFCE7', '#BBF7D0'], icon: 'bale',
      head: 'Balle n°14', rows: ['1er choix · 2e choix', 'Démarque des pièces', 'Prix ronds en un geste'], meter: { label: '% remboursée', to: 68, dec: 0 } },
  ];
  function sectorIcon(ctx, kind, x, y, color) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.lineCap = 'round';
    if (kind === 'bowl') { ctx.beginPath(); ctx.arc(0, 0, 52, 0, Math.PI); ctx.fill(); ctx.fillRect(-64, -6, 128, 10); for (const dx of [-22, 0, 22]) { ctx.beginPath(); ctx.moveTo(dx, -22); ctx.quadraticCurveTo(dx + 10, -40, dx, -58); ctx.stroke(); } }
    if (kind === 'cable') { ctx.beginPath(); ctx.arc(0, 0, 46, 0, Math.PI * 1.7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 1.7); ctx.stroke(); ctx.fillRect(30, -50, 36, 18); }
    if (kind === 'bale') { ctx.beginPath(); ctx.roundRect(-58, -46, 116, 92, 18); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-58, -10, 116, 8); ctx.fillRect(-20, -46, 8, 92); ctx.fillRect(18, -46, 8, 92); }
    ctx.restore();
  }
  function sectorCard(ctx, s, t, t0, x) {
    const cw = SAFE.w, ch = 1020, y = 330;
    ctx.save(); ctx.translate(x, 0);
    UI.card(ctx, SAFE.x, y, cw, ch, 44, { fill: '#FFFFFF' });
    ctx.fillStyle = s.bg[0]; ctx.beginPath(); ctx.roundRect(SAFE.x, y, cw, 300, [44, 44, 0, 0]); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(SAFE.x + 120, y + 130, 80, 0, Math.PI * 2); ctx.fill();
    sectorIcon(ctx, s.icon, SAFE.x + 120, y + 130, s.color);
    UI.text(ctx, s.name, SAFE.x + 230, y + 140, { size: 66, weight: 800, color: B.ink, maxW: cw - 260 });
    UI.text(ctx, s.kicker, SAFE.x + 230, y + 196, { size: 28, weight: 600, color: '#334155', maxW: cw - 260 });
    UI.text(ctx, s.head, SAFE.x + 50, y + 390, { size: 44, weight: 800, color: s.color });
    if (s.meter) {
      const v = Data.count(t, t0 + 0.3, t0 + 1.3, 0, s.meter.to, ease.outCubic);
      ctx.fillStyle = '#EEF2F7'; ctx.beginPath(); ctx.roundRect(SAFE.x + 50, y + 430, cw - 100, 34, 17); ctx.fill();
      ctx.fillStyle = s.color; ctx.beginPath(); ctx.roundRect(SAFE.x + 50, y + 430, (cw - 100) * (v / (s.meter.dec ? 20 : 100)), 34, 17); ctx.fill();
      UI.text(ctx, `${v.toFixed(s.meter.dec).replace('.', ',')} ${s.meter.label}`, SAFE.x + cw - 50, y + 400, { size: 32, weight: 800, color: B.ink, align: 'right' });
    }
    s.rows.forEach((r, i) => {
      const tr = t0 + BEAT * (1 + i * 0.5), a = UI.fadeIn(t, tr, 0.15); if (a <= 0) return;
      const ry = y + 520 + i * 120;
      ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - ease.outCubic(clamp((t - tr) / 0.25))) * 50, 0);
      ctx.fillStyle = '#F4F6FB'; ctx.beginPath(); ctx.roundRect(SAFE.x + 40, ry, cw - 80, 96, 22); ctx.fill();
      UI.check(ctx, SAFE.x + 92, ry + 48, 22, clamp((t - tr) / 0.2), { color: s.color });
      UI.text(ctx, r, SAFE.x + 140, ry + 60, { size: 34, weight: 700, color: B.ink, maxW: cw - 200 });
      ctx.restore();
    });
    ctx.restore();
  }
  function shotMetiers(ctx, t) {
    const i = clamp(Math.floor((t - ev.metiers[0]) / BAR), 0, 2);
    const s = SECTORS[i];
    bgGrad(ctx, s.bg[1], s.bg[0]);
    blob(ctx, 900, 300, 600, 'rgba(255,255,255,0.5)');
    badgeRow(ctx, t, 'Adapté à votre métier', ev.metiers[0]);
    const t0 = ev.metiers[i], u = clamp((t - t0) / 0.3);
    if (i > 0 && u < 1) sectorCard(ctx, SECTORS[i - 1], t, ev.metiers[i - 1], -ease.inCubic(u) * W);
    sectorCard(ctx, s, t, t0, (1 - ease.outBack(u, 1.1)) * W);
    // et les autres métiers
    if (i === 2) {
      const other = ['Chaussures', 'Beauté', 'Alimentation', 'Pharmacie', 'Électronique'];
      let x = SAFE.x, y = 1230;
      other.forEach((o, k) => {
        const p = UI.pop(t, T(19, 2) + k * BEAT / 4, 0.25, 2.4); if (p <= 0) return;
        const wdt = UI.measure(ctx, o, 28, 800) + 50;
        if (x + wdt > SAFE.x + SAFE.w) { x = SAFE.x; y += 70; }
        ctx.save(); ctx.translate(x + wdt / 2, y + 28); ctx.scale(p, p); UI.pill(ctx, -wdt / 2, -28, o, { bg: B.ink, size: 28, h: 56, weight: 800 }); ctx.restore();
        x += wdt + 14;
      });
    }
  }

  // ======================= LE SOIR =======================
  function screenDash(ctx, w, h, t) {
    UI.header(ctx, w, 'Bilan du jour', { kicker: 'Boutique Awa · 21:00' });
    const [c0, c1] = ev.counter;
    UI.card(ctx, 16, 150, w - 32, 170, 22);
    UI.text(ctx, 'Ventes du jour', 36, 192, { size: 15, weight: 700, color: B.muted });
    const v = Data.count(t, c0, c1, 0, 185000, ease.outCubic);
    const lp = 1 + 0.12 * (t >= c1 ? pulse(t, c1, 6) : 0);
    ctx.save(); ctx.translate(36, 250); ctx.scale(lp, lp); UI.text(ctx, fcfa(v), 0, 0, { size: 30, weight: 800, color: t >= c1 ? B.violet : B.ink }); ctx.restore();
    UI.text(ctx, t >= c1 ? 'Objectif atteint ✓' : 'Objectif : 150 000 F', 36, 292, { size: 15, weight: 700, color: t >= c1 ? B.ok : B.muted });
    UI.ring(ctx, w - 80, 230, 44, clamp(v / 150000), { color: t >= c1 ? B.ok : B.violet });
    UI.card(ctx, 16, 336, w - 32, 220, 22);
    UI.text(ctx, '7 derniers jours', 36, 376, { size: 15, weight: 700, color: B.muted });
    const bars = [0.45, 0.62, 0.38, 0.7, 0.55, 0.8, 1];
    bars.forEach((b, i) => {
      const g = ease.outCubic(clamp((t - (T(21, 1) + i * 0.06)) / 0.4));
      const bh = 120 * b * g, x = 40 + i * 50;
      ctx.fillStyle = i === 6 ? B.violet : '#DCE3EE'; ctx.beginPath(); ctx.roundRect(x, 530 - bh, 34, bh, 6); ctx.fill();
    });
    UI.card(ctx, 16, 572, w - 32, 96, 22);
    UI.text(ctx, 'Produit star', 36, 610, { size: 15, weight: 700, color: B.muted });
    UI.text(ctx, 'Robe wax · 9 vendues', 36, 646, { size: 20, weight: 800 });
    UI.navBar(ctx, w, h, ['Accueil', 'Caisse', 'Stock', 'Rapports'], 'Rapports');
  }
  function shotSoir(ctx, t) {
    bgGrad(ctx, '#2A2260', '#5A2D6E');
    blob(ctx, 540, 1700, 1000, 'rgba(255,170,80,0.32)');
    ctx.fillStyle = '#FFF4D6'; ctx.beginPath(); ctx.arc(860, 330, 46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3A2766'; ctx.beginPath(); ctx.arc(882, 314, 42, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 18; i++) { const x = U.hash(i, 1) * W, y = 240 + U.hash(i, 2) * 500, tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)); ctx.fillStyle = `rgba(255,255,255,${0.5 * tw})`; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); }
    tag(ctx, '21:00 · le soir', SAFE.x, SAFE.y + 14, { bg: 'rgba(255,255,255,0.14)', fg: '#FFFFFF', a: UI.fadeIn(t, ev.soir, 0.3) });
    const up = ease.outBack(clamp((t - ev.soir) / 0.5), 1.1);
    UI.phone(ctx, 640, lerp(H + 600, 800, up), 980, screenDash, t, { time: '21:00' });
    // Awa, soulagée ; le cahier se referme
    const talking = mouthOf('awa', t);
    Ch.person(ctx, { x: 230, y: 1520, s: 1.12, pose: 'stand', style: AWA, seed: 11, look: 1, eyes: talking ? 'happy' : t > S.vo.find((v) => v.id === 'awa2').end ? 'happy' : 'normal', brows: 'up', mouth: talking || 'smile', blush: 0.4, gesture: t > S.vo.find((v) => v.id === 'awa2').end - 0.3 ? 'cheer' : 'phone' });
    UI.text(ctx, 'Données d’exemple', 640, 1310, { size: 22, weight: 500, color: 'rgba(255,255,255,0.55)', align: 'center' });
  }

  // ======================= LA FIN =======================
  function shotFin(ctx, t) {
    bgGrad(ctx, '#6D28D9', '#2563EB');
    blob(ctx, 200, 1600, 800, 'rgba(255,197,49,0.25)');
    for (const [x, y, r, dir] of [[90, 330, 120, 1], [980, 1420, 190, -1]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.4 * dir); ctx.setLineDash([16, 14]); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    const cp = UI.pop(t, ev.endCard, 0.35, 1.8);
    if (cp > 0) {
      ctx.save(); ctx.translate(W / 2, 470); ctx.scale(cp, cp);
      ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(15,23,42,0.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
      ctx.beginPath(); ctx.roundRect(-SAFE.w / 2, -150, SAFE.w, 300, 48); ctx.fill(); ctx.restore();
      logo(ctx, W / 2, 470, 780, t, ev.endCard + 0.1, { fast: true });
    }
    // le titre, puis le surligneur jaune sous « a gagné. »
    const ha = UI.fadeIn(t, T(23, 1), 0.3);
    ctx.save(); ctx.globalAlpha = ha; ctx.translate(0, (1 - ha) * 20);
    UI.text(ctx, 'Sachez chaque soir combien', W / 2, 760, { size: 58, weight: 800, color: '#FFFFFF', align: 'center', maxW: SAFE.w });
    const l2a = 'votre commerce ', l2b = 'a gagné.';
    const wa = UI.measure(ctx, l2a, 58, 800), wb = UI.measure(ctx, l2b, 58, 800), x0 = W / 2 - (wa + wb) / 2;
    const hl = ease.outCubic(clamp((t - T(23, 3)) / 0.35));
    if (hl > 0) { ctx.fillStyle = B.yellow; ctx.beginPath(); ctx.roundRect(x0 + wa - 8, 790, (wb + 16) * hl, 62, 12); ctx.fill(); }
    UI.text(ctx, l2a, x0, 840, { size: 58, weight: 800, color: '#FFFFFF' });
    UI.text(ctx, l2b, x0 + wa, 840, { size: 58, weight: 800, color: hl > 0.5 ? B.ink : '#FFFFFF' });
    ctx.restore();
    // l'offre
    const pp = UI.pop(t, ev.cta, 0.3, 2.2);
    if (pp > 0) { ctx.save(); ctx.translate(W / 2, 960); ctx.scale(pp, pp); const pw = UI.measure(ctx, '14 jours d’essai gratuit', 44, 800) + 80; UI.pill(ctx, -pw / 2, -42, '14 jours d’essai gratuit', { bg: B.yellow, fg: B.ink, size: 44, h: 84, weight: 800 }); ctx.restore(); }
    const sa = UI.fadeIn(t, ev.cta + 0.35, 0.3);
    UI.text(ctx, 'Ensuite 10 000 F CFA / mois · Wave, Orange Money, MTN', W / 2, 1060, { size: 28, weight: 600, color: '#E0E7FF', align: 'center', alpha: sa, maxW: SAFE.w });
    const ba = UI.fadeIn(t, T(25), 0.25);
    if (ba > 0) { ctx.save(); ctx.globalAlpha = ba; const b = 1 + 0.03 * Math.sin((t - T(25)) * 6); ctx.translate(W / 2, 1170); ctx.scale(b, b); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(-300, -48, 600, 96, 48); ctx.fill(); UI.text(ctx, 'Essayer gratuitement  →', 0, 14, { size: 38, weight: 800, color: B.violet, align: 'center' }); ctx.restore(); }
    UI.text(ctx, 'mon-djossi.vercel.app', W / 2, 1272, { size: 34, weight: 700, color: '#FFFFFF', align: 'center', alpha: UI.fadeIn(t, T(25, 1), 0.3) });
    const sl = UI.pop(t, T(25, 2), 0.35, 2);
    if (sl > 0) { ctx.save(); ctx.translate(W / 2, 1390); ctx.rotate(-0.025); ctx.scale(sl, sl); UI.text(ctx, 'Mon Djossi, ça compte pour toi.', 0, 0, { size: 46, weight: 800, color: B.yellow, align: 'center', italic: true, maxW: SAFE.w }); ctx.restore(); }
    burst(ctx, t, ev.endCard, W / 2, 470);
  }

  Studio.film({
    async init() {
      LOGO = await Studio.loadImage('assets/logo-couleur.png');
      VO = await Studio.loadJSON('assets/vo/vo.json');
    },
    draw(ctx, t) {
      if (t < ev.rewind) shotBefore(ctx, t);
      else if (t < ev.logo) shotRewind(ctx, t);
      else if (t < ev.phoneUp) shotLogo(ctx, t);
      else if (t < ev.metiers[0]) shotApp(ctx, t);
      else if (t < ev.soir) shotMetiers(ctx, t);
      else if (t < ev.endCard) shotSoir(ctx, t);
      else shotFin(ctx, t);
      // sous-titres des voix off (vue sans le son)
      if (t < ev.endCard) Subs.draw(ctx, t, S.subtitles, { style: 'box', size: 46, fam: 'Inter' });
      // fondu d'ouverture
      if (t < 0.4) { ctx.fillStyle = `rgba(20,14,40,${1 - t / 0.4})`; ctx.fillRect(0, 0, W, H); }
    },
    post: { paper: 0.08, vignette: 0.12, grain: 0.02 },
    fadeOut: 0.9,
  });
})();
