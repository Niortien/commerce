// LE FILM du tutoriel (9:16). Un téléphone au centre ; un doigt pose chaque tap, un libellé jaune nomme le
// bouton ; autour, des illustrations rendent chaque idée concrète (tiroirs, boîtes, rideau, reçu…).
// Tout est fonction pure de t et lit score.js (écrans, taps, saisies, moments).
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, UI = globalThis.UI, S = globalThis.SCORE, Studio = globalThis.Studio;
  const Subs = globalThis.Subs, Data = globalThis.Data;
  const { ev, V, K } = S;
  const { clamp, lerp, ease, pulse } = U;
  const W = G.W, H = G.H, SAFE = G.SAFE;

  const B = { violet: '#7C3AED', blue: '#2563EB', blueDim: 'rgba(37,99,235,0.10)', yellow: '#FFC531', ink: '#0F172A', muted: '#64748B', line: '#DCE3EE', base: '#F4F6FB', ok: '#16A34A', okDim: '#DCFCE7', warn: '#EA580C', warnDim: '#FFEDD5', red: '#E11D48' };
  UI.setTheme({ accent: B.blue, accent2: B.violet, ok: B.ok, ink: B.ink, muted: B.muted, app: B.base, line: B.line, font: 'Inter' });
  const AWA = { hairStyle: 'bun', hair: '#1E1614', skin: '#6B4430', outfit: 'dress', shirt: '#E8742E', trim: '#1F4E8C', bottoms: 'skirt', shorts: '#1F4E8C', build: 'regular' };
  globalThis.CAST = { awa: AWA };
  let LOGO = null;
  const fcfa = (n) => `${Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ')} F CFA`;
  const chapAt = (t) => { let c = S.CHAPTERS[0]; for (const x of S.CHAPTERS) if (t >= x.t) c = x; return c; };
  const after = (t, t0, d = 0.25) => clamp((t - t0) / d);

  // ---------- le téléphone ----------
  const PH = 1060, PW = PH * 0.47, PB = PH * 0.016, PK = (PW - 2 * PB) / 412;
  function phonePos(t) {
    const up = ease.outBack(clamp((t - (V.i2.at - 0.3)) / 0.6), 1.1);
    const end = ease.inCubic(clamp((t - (S.endCard - 0.35)) / 0.35));
    return { cx: 540, cy: lerp(H + 700, 845, up) + end * 1500 };
  }
  const P = (t, x, y) => { const { cx, cy } = phonePos(t); return [cx - (PW - 2 * PB) / 2 + x * PK, cy - (PH - 2 * PB) / 2 + y * PK]; };

  // ---------- le logo (voir la pub) ----------
  function logo(ctx, cx, cy, width, t, t0) {
    if (!LOGO || t < t0) return;
    const k = width / 1664, x0 = cx - width / 2, y0 = cy - (413 * k) / 2;
    const u = clamp((t - t0) / 0.42), slide = (1 - ease.outBack(u, 1.6)) * -760, sx = 1 + 0.25 * (1 - clamp(u * 1.6));
    ctx.save(); ctx.translate(x0 + slide, y0 + 413 * k / 2); ctx.scale(sx, 1 / sx); ctx.drawImage(LOGO, 0, 0, 485, 413, 0, (-413 * k) / 2, 485 * k, 413 * k); ctx.restore();
    const r = ease.outCubic(clamp((t - t0 - 0.4) / 0.5));
    if (r > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x0 + 495 * k, y0, 1160 * k * r, 320 * k); ctx.clip(); ctx.drawImage(LOGO, 495, 0, 1169, 320, x0 + 495 * k + (1 - r) * -40, y0, 1169 * k, 320 * k); ctx.restore(); }
    const a = ease.outCubic(clamp((t - t0 - 0.85) / 0.35));
    if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(LOGO, 495, 312, 1169, 101, x0 + 495 * k, y0 + 312 * k + (1 - a) * 24, 1169 * k, 101 * k); ctx.restore(); }
  }
  function logoIcon(ctx, x, y, size, alpha = 1) {
    if (!LOGO) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(15,23,42,0.18)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
    ctx.beginPath(); ctx.roundRect(x - size / 2, y - size / 2, size, size, size * 0.28); ctx.fill(); ctx.shadowColor = 'transparent';
    const s = size * 0.78 / 485; ctx.drawImage(LOGO, 0, 0, 485, 413, x - (485 * s) / 2, y - (413 * s) / 2, 485 * s, 413 * s); ctx.restore();
  }

  // ---------- briques d'interface (en points du téléphone) ----------
  const typedOf = (t, screen, field, full) => {
    const ty = S.typing.find((x) => x.screen === screen && x.field === field);
    if (!ty) return full;
    if (t < ty.t0) return '';
    return full.slice(0, Math.ceil(full.length * clamp((t - ty.t0) / (ty.t1 - ty.t0))));
  };
  const focusOf = (t, screen, field) => { const ty = S.typing.find((x) => x.screen === screen && x.field === field); return ty && t >= ty.t0 - 0.1 && t <= ty.t1 + 0.4; };
  function field(ctx, x, y, w, label, value, { focus = false, t = 0, placeholder = '' } = {}) {
    UI.text(ctx, label, x, y, { size: 14, weight: 700, color: B.muted });
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(x, y + 10, w, 50, 12); ctx.fill();
    ctx.strokeStyle = focus ? B.blue : B.line; ctx.lineWidth = focus ? 2.5 : 1.5; ctx.stroke();
    UI.text(ctx, value || placeholder, x + 14, y + 42, { size: 17, weight: value ? 600 : 500, color: value ? B.ink : '#A0AEC0' });
    if (focus && Math.floor(t * 2.5) % 2 === 0) { const cw = value ? UI.measure(ctx, value, 17, 600) : 0; ctx.fillStyle = B.blue; ctx.fillRect(x + 15 + cw, y + 24, 2, 24); }
  }
  function btn(ctx, cx, cy, w, h, label, { bg = B.blue, fg = '#FFFFFF', outline = false, size = 18 } = {}) {
    ctx.fillStyle = outline ? '#FFFFFF' : bg; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill();
    if (outline) { ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke(); }
    UI.text(ctx, label, cx, cy + size * 0.36, { size, weight: 800, color: outline ? bg : fg, align: 'center' });
  }
  function appBar(ctx, w) {
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, 130); ctx.fillStyle = B.line; ctx.fillRect(0, 130, w, 1);
    logoIcon(ctx, 42, 100, 40);
    UI.text(ctx, 'Boutique Awa', 72, 107, { size: 18, weight: 800 });
    ctx.fillStyle = B.ink; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.roundRect(358, 90 + i * 9, 28, 3.5, 2); ctx.fill(); }
  }
  function title(ctx, text, kicker) {
    if (kicker) UI.text(ctx, kicker.toUpperCase(), 24, 150, { size: 11, weight: 800, color: B.muted, spacing: 1.5 });
    UI.text(ctx, text, 24, 182, { size: 26, weight: 800 });
  }
  function addPill(ctx, label = '+ Ajouter') { ctx.fillStyle = B.blue; ctx.beginPath(); ctx.roundRect(274, 150, 120, 38, 19); ctx.fill(); UI.text(ctx, label, 334, 175, { size: 15, weight: 800, color: '#FFFFFF', align: 'center' }); }
  function row(ctx, y, left, right, { sub = '', color = B.ink, rcolor = B.muted, h = 56, a = 1, dx = 0 } = {}) {
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(dx, 0);
    UI.card(ctx, 16, y, 380, h, 14, { shadow: false });
    UI.text(ctx, left, 32, y + (sub ? 25 : h / 2 + 6), { size: 16, weight: 700, color, maxW: 230 });
    if (sub) UI.text(ctx, sub, 32, y + 45, { size: 13, weight: 500, color: B.muted });
    UI.text(ctx, right, 380, y + h / 2 + 6, { size: 15, weight: 700, color: rcolor, align: 'right' });
    ctx.restore();
  }
  const pop = (t, t0) => UI.pop(t, t0, 0.28, 2.2);
  function chip(ctx, cx, cy, w, label, on, a = 1) {
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = on ? B.blue : '#FFFFFF'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - 24, w, 48, 14); ctx.fill();
    if (!on) { ctx.strokeStyle = B.line; ctx.lineWidth = 2; ctx.stroke(); }
    UI.text(ctx, label, cx, cy + 7, { size: 17, weight: 800, color: on ? '#FFFFFF' : B.ink, align: 'center' });
    ctx.restore();
  }

  // ---------- les écrans ----------
  const SCR = {
    site(ctx, w, h, t) {
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
      if (LOGO) ctx.drawImage(LOGO, 0, 0, 1664, 413, 20, 74, 170, 42);
      ctx.fillStyle = B.blue; ctx.beginPath(); ctx.roundRect(282, 78, 112, 36, 18); ctx.fill(); UI.text(ctx, 'Essai gratuit', 338, 101, { size: 13, weight: 800, color: '#FFFFFF', align: 'center' });
      ctx.fillStyle = B.base; ctx.beginPath(); ctx.roundRect(24, 160, 330, 34, 17); ctx.fill();
      UI.text(ctx, 'Pensé pour les commerces de Côte d’Ivoire', 40, 182, { size: 13, weight: 700, color: B.muted });
      ['Sachez chaque soir', 'combien votre', 'commerce a gagné.'].forEach((l, i) => UI.text(ctx, l, 24, 250 + i * 42, { size: 34, weight: 800 }));
      ['Caisse, stock et rapports dans une seule', 'application, adaptée à votre métier.'].forEach((l, i) => UI.text(ctx, l, 24, 400 + i * 24, { size: 16, weight: 500, color: B.muted }));
      btn(ctx, 206, 600, 340, 62, 'Essai gratuit  →', { size: 20 });
      btn(ctx, 206, 676, 340, 56, 'Voir comment ça marche', { outline: true, bg: B.ink, size: 16 });
      ['✓ 14 jours d’essai gratuit', '✓ Montants en FCFA'].forEach((l, i) => UI.text(ctx, l, 24, 760 + i * 30, { size: 15, weight: 600, color: B.muted }));
    },
    metier(ctx, w, h, t) {
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
      title(ctx, 'Inscrire ma boutique', '1. Ton commerce');
      const tSel = S.taps.find((x) => x.label === 'Vêtements').t, tPlan = S.taps.find((x) => x.label === 'Essai 14 jours').t;
      [['Vêtements', '#E8742E'], ['Restaurant', '#EA580C'], ['Quincaillerie', '#0E7490'], ['Friperie', '#15803D'], ['Chaussures', '#7C3AED'], ['Beauté', '#DB2777']].forEach(([n, c], i) => {
        const x = [110, 302][i % 2], y = 230 + Math.floor(i / 2) * 100, sel = i === 0 && t >= tSel;
        ctx.fillStyle = sel ? B.blueDim : '#FFFFFF'; ctx.beginPath(); ctx.roundRect(x - 88, y - 40, 176, 80, 16); ctx.fill();
        ctx.strokeStyle = sel ? B.blue : B.line; ctx.lineWidth = sel ? 3 : 1.5; ctx.stroke();
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x - 58, y, 14, 0, Math.PI * 2); ctx.fill();
        UI.text(ctx, n, x - 36, y + 6, { size: 15, weight: 800, maxW: 116 });
        if (sel) UI.check(ctx, x + 68, y - 24, 11, after(t, tSel, 0.2));
      });
      UI.text(ctx, 'Formule', 24, 560, { size: 15, weight: 800 });
      [['Essai 14 jours', 'Gratuit, sans paiement', 640], ['Mensuel', '10 000 F CFA / mois', 716]].forEach(([a, b, y], i) => {
        const sel = i === 0 && t >= tPlan;
        ctx.fillStyle = sel ? B.blueDim : '#FFFFFF'; ctx.beginPath(); ctx.roundRect(24, y - 32, 364, 64, 16); ctx.fill();
        ctx.strokeStyle = sel ? B.blue : B.line; ctx.lineWidth = sel ? 3 : 1.5; ctx.stroke();
        UI.text(ctx, a, 44, y - 4, { size: 17, weight: 800 }); UI.text(ctx, b, 44, y + 18, { size: 13, weight: 500, color: B.muted });
      });
    },
    form(ctx, w, h, t) {
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
      title(ctx, 'Inscrire ma boutique', '2. Tes informations');
      [['Nom de la boutique', 'Boutique Awa'], ['Ville', 'Abidjan'], ['WhatsApp', '+225 07 12 34 56 78'], ['Votre email (admin)', 'awa@boutique.ci'], ['Mot de passe', '••••••••••']].forEach(([l, v], i) =>
        field(ctx, 24, 220 + i * 80, 364, l, typedOf(t, 'form', i, v), { focus: focusOf(t, 'form', i), t }));
      btn(ctx, 206, 650, 364, 60, 'Inscrire ma boutique', { size: 19 });
      UI.text(ctx, 'Essai gratuit de 14 jours, sans paiement', 206, 712, { size: 13, weight: 600, color: B.muted, align: 'center' });
    },
    welcome(ctx, w, h, t, t0) {
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
      const p = pop(t, t0);
      ctx.save(); ctx.translate(206, 330); ctx.scale(p, p); ctx.fillStyle = B.okDim; ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      UI.check(ctx, 206, 330, 40, after(t, t0 + 0.1, 0.3));
      UI.text(ctx, 'Bienvenue, Awa !', 206, 460, { size: 28, weight: 800, align: 'center' });
      UI.text(ctx, 'Ta boutique est créée.', 206, 498, { size: 17, weight: 500, color: B.muted, align: 'center' });
      ctx.fillStyle = B.yellow; ctx.beginPath(); ctx.roundRect(86, 530, 240, 40, 20); ctx.fill();
      UI.text(ctx, 'Essai : 14 jours restants', 206, 556, { size: 15, weight: 800, align: 'center' });
    },
    home(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Dashboard', 'Pilotage');
      UI.card(ctx, 16, 210, 380, 120, 18); UI.text(ctx, 'Ventes du jour', 34, 248, { size: 14, weight: 700, color: B.muted }); UI.text(ctx, '0 F CFA', 34, 292, { size: 30, weight: 800 });
      UI.card(ctx, 16, 346, 380, 120, 18, { fill: B.blueDim, shadow: false });
      UI.text(ctx, 'Pour commencer', 34, 382, { size: 14, weight: 800, color: B.blue }); UI.text(ctx, 'Remplis « Ma boutique », puis ajoute', 34, 410, { size: 15, weight: 600 }); UI.text(ctx, 'tes catégories et tes produits.', 34, 434, { size: 15, weight: 600 });
    },
    boutique(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Ma boutique', 'Administration');
      field(ctx, 24, 220, 364, 'Adresse', typedOf(t, 'boutique', 0, 'Cocody, Rue des Jardins'), { focus: focusOf(t, 'boutique', 0), t });
      field(ctx, 24, 300, 364, 'WhatsApp', typedOf(t, 'boutique', 1, '+225 07 12 34 56 78'), { focus: focusOf(t, 'boutique', 1), t });
      UI.text(ctx, 'Logo', 24, 380, { size: 14, weight: 700, color: B.muted });
      ctx.save(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#A0AEC0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(24, 392, 364, 150, 16); ctx.stroke(); ctx.restore();
      if (t < ev.logoDrop) UI.text(ctx, '+ Ajouter un logo', 206, 474, { size: 16, weight: 700, color: B.muted, align: 'center' });
      else { const p = pop(t, ev.logoDrop); ctx.save(); ctx.translate(206, 467); ctx.scale(p, p); ctx.translate(-206, -467); shopLogo(ctx, 206, 467, 52); ctx.restore(); }
      btn(ctx, 206, 620, 364, 58, 'Enregistrer');
    },
    categories(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Catégories', 'Catalogue'); addPill(ctx);
      [['Robes', '0 produit'], ['Jeans', '0 produit'], ['T-shirts', '0 produit']].forEach(([a, b], i) => row(ctx, 220 + i * 66, a, b));
      if (t >= ev.newDrawer - 0.1) { const a = after(t, ev.newDrawer - 0.1, 0.2); row(ctx, 418, typedOf(t, 'categories', 0, 'Accessoires') || ' ', 'nouveau', { a, rcolor: B.ok, dx: (1 - a) * 40 }); }
    },
    produits(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Produits', 'Catalogue'); addPill(ctx);
      ctx.fillStyle = B.blueDim; ctx.beginPath(); ctx.arc(206, 380, 64, 0, Math.PI * 2); ctx.fill(); dress(ctx, 206, 336, 0.55, B.blue, '#FFFFFF', 3);
      UI.text(ctx, 'Aucun produit pour l’instant', 206, 490, { size: 17, weight: 700, color: B.muted, align: 'center' });
    },
    produitForm(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Nouveau produit', 'Produits');
      [['Nom', 'Robe wax', 24, 220, 364], ['Catégorie', 'Robes', 24, 300, 364], ['Prix de vente', '12 500', 24, 380, 176], ['Prix d’achat', '8 000', 212, 380, 176]].forEach(([l, v, x, y, fw], i) =>
        field(ctx, x, y, fw, l, typedOf(t, 'produitForm', i, v), { focus: focusOf(t, 'produitForm', i), t }));
      if (t >= ev.marge) { const p = pop(t, ev.marge); ctx.save(); ctx.translate(206, 476); ctx.scale(p, p); ctx.fillStyle = B.okDim; ctx.beginPath(); ctx.roundRect(-182, -20, 364, 40, 20); ctx.fill(); UI.text(ctx, 'Bénéfice : 4 500 F CFA par robe', 0, 6, { size: 15, weight: 800, color: B.ok, align: 'center' }); ctx.restore(); }
      UI.text(ctx, 'Variantes (taille · couleur · quantité)', 24, 530, { size: 14, weight: 700, color: B.muted });
      [['S · Rouge', '4'], ['M · Rouge', '4'], ['L · Bleu', '3']].forEach(([a, b], i) => { if (t >= ev.variantes[i]) { const a2 = after(t, ev.variantes[i], 0.2); row(ctx, 544 + i * 54, a, `${b} en stock`, { h: 46, a: a2, dx: (1 - a2) * 30 }); } });
      field(ctx, 24, 712, 176, 'Seuil d’alerte', t >= ev.seuil ? '3' : '', { focus: t >= ev.seuil && t < ev.seuil + 1.2, t });
      btn(ctx, 206, 850, 364, 58, 'Enregistrer');
    },
    entrees(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Entrées', 'Opérations'); btn(ctx, 206, 236, 364, 56, '+ Nouvelle entrée');
      UI.text(ctx, 'Aucune entrée pour l’instant', 206, 340, { size: 16, weight: 600, color: B.muted, align: 'center' });
    },
    entreeForm(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Nouvelle entrée', 'Entrées');
      field(ctx, 24, 220, 364, 'Fournisseur', typedOf(t, 'entreeForm', 0, 'Stock de départ'), { focus: focusOf(t, 'entreeForm', 0), t });
      UI.text(ctx, 'Articles reçus', 24, 318, { size: 14, weight: 700, color: B.muted });
      const items = [['Robe wax · S Rouge', '× 4'], ['Robe wax · M Rouge', '× 4'], ['Jean · 32', '× 6'], ['T-shirt · L', '× 9']];
      items.forEach(([a, b], i) => { const t0 = ev.stockFly + 0.15 + i * 0.22; if (t >= t0) { const a2 = after(t, t0, 0.18); row(ctx, 332 + i * 56, a, b, { h: 48, a: a2, rcolor: B.ok, dx: (1 - a2) * -40 }); } });
      if (t >= ev.stockFly + 1.1) UI.text(ctx, '4 articles · 23 pièces', 206, 580, { size: 16, weight: 800, color: B.ink, align: 'center', alpha: after(t, ev.stockFly + 1.1) });
      btn(ctx, 206, 790, 364, 58, 'Enregistrer l’entrée');
    },
    import(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Importer', 'Produits');
      btn(ctx, 110, 236, 172, 46, '⤓ Modèle', { outline: true, size: 15 });
      ctx.save(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#A0AEC0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(24, 290, 364, 200, 18); ctx.stroke(); ctx.restore();
      if (t < ev.excelDrop + 0.3) UI.text(ctx, 'Choisir le fichier', 206, 396, { size: 16, weight: 700, color: B.muted, align: 'center' });
      else { const p = pop(t, ev.excelDrop + 0.3); ctx.save(); ctx.translate(206, 370); ctx.scale(p, p); excel(ctx, 0, 0, 0.8); ctx.restore(); UI.text(ctx, 'catalogue.xlsx', 206, 462, { size: 15, weight: 700, align: 'center' }); }
      if (t >= ev.excelDrop + 0.7) { ctx.fillStyle = B.blueDim; ctx.beginPath(); ctx.roundRect(24, 510, 364, 80, 16); ctx.fill(); UI.text(ctx, 'Aperçu : 300 articles · 12 catégories', 206, 545, { size: 15, weight: 800, color: B.blue, align: 'center' }); UI.text(ctx, 'et ton stock de départ', 206, 570, { size: 14, weight: 600, color: B.blue, align: 'center' }); }
      btn(ctx, 206, 640, 364, 58, 'Importer');
      const [a, b] = ev.importCount;
      if (t >= a) { const n = Data.count(t, a, b, 0, 300, ease.outCubic); UI.text(ctx, `${Math.round(n)} articles créés${t >= b ? ' ✓' : ''}`, 206, 730, { size: 22, weight: 800, color: t >= b ? B.ok : B.ink, align: 'center' }); }
    },
    caissiers(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Caissiers', 'Administration'); btn(ctx, 206, 236, 364, 56, '+ Nouveau caissier');
      const tNew = S.taps.find((x) => x.label === 'Nouveau caissier').t;
      if (t >= tNew + 0.15) {
        const a = after(t, tNew + 0.15, 0.2);
        ctx.save(); ctx.globalAlpha = a; UI.card(ctx, 16, 286, 380, 210, 18);
        field(ctx, 34, 310, 344, 'Email', typedOf(t, 'caissiers', 0, 'koffi@boutique.ci'), { focus: focusOf(t, 'caissiers', 0), t });
        field(ctx, 34, 392, 344, 'Mot de passe', typedOf(t, 'caissiers', 1, '••••••••'), { focus: focusOf(t, 'caissiers', 1), t });
        ctx.restore();
      }
      if (t >= ev.badge) row(ctx, 520, 'Koffi', 'Caissier', { sub: 'koffi@boutique.ci', h: 64, a: after(t, ev.badge, 0.2), rcolor: B.blue });
    },
    caisseClosed(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Caisse', 'Opérations');
      shopFront(ctx, 206, 360, 0.55, 0);
      UI.text(ctx, 'Aucune caisse ouverte', 206, 440, { size: 18, weight: 800, color: B.muted, align: 'center' });
      btn(ctx, 206, 500, 364, 60, 'Commencer la journée', { size: 19 });
    },
    caisseOpen(ctx, w, h, t, t0) {
      appBar(ctx, w); title(ctx, 'Caisse', 'Opérations');
      const p = pop(t, t0); ctx.save(); ctx.translate(206, 236); ctx.scale(p, p); ctx.fillStyle = B.okDim; ctx.beginPath(); ctx.roundRect(-182, -24, 364, 48, 24); ctx.fill(); UI.text(ctx, '● Caisse ouverte · 08:00', 0, 6, { size: 16, weight: 800, color: B.ok, align: 'center' }); ctx.restore();
      UI.card(ctx, 16, 286, 380, 120, 18); UI.text(ctx, 'Encaissé aujourd’hui', 34, 324, { size: 14, weight: 700, color: B.muted }); UI.text(ctx, '0 F CFA', 34, 370, { size: 30, weight: 800 });
    },
    sorties(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Sorties', 'Opérations'); btn(ctx, 206, 236, 364, 56, '+ Nouvelle sortie');
      UI.text(ctx, 'Ventes, pertes, dons et dépenses', 206, 330, { size: 15, weight: 600, color: B.muted, align: 'center' });
    },
    sortieType(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Nouvelle sortie', 'Type');
      const tV = S.taps.find((x) => x.label === 'Vente').t;
      [['Vente', B.blue], ['Perte', B.red], ['Don', B.violet], ['Dépense', B.warn]].forEach(([n, c], i) => {
        const x = [110, 302][i % 2], y = 290 + Math.floor(i / 2) * 92, sel = i === 0 && t >= tV;
        ctx.fillStyle = sel ? B.blueDim : '#FFFFFF'; ctx.beginPath(); ctx.roundRect(x - 88, y - 38, 176, 76, 16); ctx.fill();
        ctx.strokeStyle = sel ? B.blue : B.line; ctx.lineWidth = sel ? 3 : 1.5; ctx.stroke();
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x - 56, y, 12, 0, Math.PI * 2); ctx.fill();
        UI.text(ctx, n, x - 34, y + 6, { size: 17, weight: 800 });
      });
    },
    vente(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Nouvelle vente', 'Sorties');
      const tAdd = S.taps.find((x) => x.label === '+ Ajouter un article').t;
      btn(ctx, 160, 236, 272, 50, '+ Ajouter un article', { outline: true, size: 16 });
      ctx.fillStyle = B.blue; ctx.beginPath(); ctx.arc(360, 236, 25, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2.5; ctx.strokeRect(349, 228, 22, 16); ctx.beginPath(); ctx.arc(360, 236, 4, 0, Math.PI * 2); ctx.stroke();
      if (t >= ev.itemAdded) {
        const a = after(t, ev.itemAdded, 0.2);
        ctx.save(); ctx.globalAlpha = a; UI.card(ctx, 16, 272, 380, 50, 14, { shadow: false }); UI.text(ctx, 'Robe wax', 32, 303, { size: 16, weight: 800 }); UI.text(ctx, '12 500 F', 380, 303, { size: 15, weight: 800, align: 'right' }); ctx.restore();
        const tM = S.taps.find((x) => x.label === 'Taille M').t, tR = S.taps.find((x) => x.label === 'Rouge').t;
        UI.text(ctx, 'Taille', 24, 356, { size: 14, weight: 700, color: B.muted, alpha: a });
        ['S', 'M', 'L', 'XL'].forEach((s2, i) => chip(ctx, 60 + i * 88, 376, 76, s2, s2 === 'M' && t >= tM, a));
        UI.text(ctx, 'Couleur', 24, 424, { size: 14, weight: 700, color: B.muted, alpha: a });
        [['Rouge', 96], ['Bleu', 250]].forEach(([c, x]) => chip(ctx, x, 444, 140, c, c === 'Rouge' && t >= tR, a));
        ctx.fillStyle = B.line; ctx.fillRect(24, 500, 364, 1.5);
        UI.text(ctx, 'Total', 24, 540, { size: 18, weight: 800, alpha: a }); UI.text(ctx, '12 500 F CFA', 388, 540, { size: 20, weight: 800, align: 'right', alpha: a });
      }
      btn(ctx, 206, 820, 364, 60, 'Continuer → Paiement', { size: 18 });
      // le scanner : la caméra s'ouvre, le laser passe sur l'étiquette
      if (t >= tAdd + 0.2 && t < ev.itemAdded + 0.1) {
        const a = Math.min(after(t, tAdd + 0.2, 0.2), 1 - after(t, ev.itemAdded - 0.1, 0.2));
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(15,23,42,0.88)'; ctx.fillRect(0, 130, w, h - 130);
        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(96, 330, 220, 150, 12); ctx.fill();
        for (let i = 0; i < 34; i++) { const bw = U.hash(i, 5) > 0.6 ? 4 : 2; ctx.fillStyle = B.ink; ctx.fillRect(116 + i * 5.4, 350, bw, 90); }
        UI.text(ctx, '6 123456 789012', 206, 466, { size: 13, weight: 700, align: 'center' });
        const ly = 350 + 90 * (0.5 + 0.5 * Math.sin((t - tAdd) * 9));
        ctx.fillStyle = '#FF3B5C'; ctx.shadowColor = '#FF3B5C'; ctx.shadowBlur = 12; ctx.fillRect(90, ly, 232, 3); ctx.shadowBlur = 0;
        UI.text(ctx, 'Scanne l’étiquette', 206, 560, { size: 17, weight: 800, color: '#FFFFFF', align: 'center' });
        ctx.restore();
      }
    },
    paiement(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Paiement', 'Robe wax · M · Rouge');
      const tE = S.taps.find((x) => x.label === 'Espèces').t;
      [['Espèces', '#16A34A', 110, 240], ['Wave', '#1DC4F5', 302, 240], ['Orange Money', '#F97316', 110, 316], ['MTN', '#EAB308', 302, 316]].forEach(([n, c, x, y], i) => {
        const p = t < ev.modes[i] ? 0.92 : 1 + 0.08 * pulse(t, ev.modes[i], 8), sel = i === 0 && t >= tE;
        ctx.save(); ctx.translate(x, y); ctx.scale(p, p);
        ctx.fillStyle = sel ? B.blueDim : '#FFFFFF'; ctx.beginPath(); ctx.roundRect(-88, -32, 176, 64, 16); ctx.fill();
        ctx.strokeStyle = sel ? B.blue : B.line; ctx.lineWidth = sel ? 3 : 1.5; ctx.stroke();
        ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(-74, -14, 28, 28, 8); ctx.fill();
        UI.text(ctx, n, -38, 6, { size: 15, weight: 800, maxW: 120 }); ctx.restore();
      });
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(24, 360, 364, 52, 16); ctx.fill(); ctx.strokeStyle = B.line; ctx.lineWidth = 1.5; ctx.stroke();
      UI.text(ctx, 'Carte', 206, 392, { size: 15, weight: 800, align: 'center', color: B.muted });
      if (t >= tE) {
        field(ctx, 24, 450, 364, 'Montant reçu du client', typedOf(t, 'paiement', 0, '15 000'), { focus: focusOf(t, 'paiement', 0), t });
        if (t >= ev.monnaie) { const p = pop(t, ev.monnaie); ctx.save(); ctx.translate(206, 580); ctx.scale(p, p); ctx.fillStyle = B.okDim; ctx.beginPath(); ctx.roundRect(-182, -36, 364, 72, 18); ctx.fill(); UI.text(ctx, 'Monnaie à rendre', 0, -8, { size: 14, weight: 700, color: B.ok, align: 'center' }); UI.text(ctx, '2 500 F CFA', 0, 24, { size: 26, weight: 800, color: B.ok, align: 'center' }); ctx.restore(); }
      }
      UI.text(ctx, 'Total : 12 500 F CFA', 206, 700, { size: 18, weight: 800, align: 'center' });
      btn(ctx, 206, 820, 364, 60, 'Enregistrer la vente', { size: 18 });
    },
    venteOk(ctx, w, h, t, t0) {
      appBar(ctx, w);
      const p = pop(t, t0); ctx.save(); ctx.translate(206, 300); ctx.scale(p, p); ctx.fillStyle = B.okDim; ctx.beginPath(); ctx.arc(0, 0, 62, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      UI.check(ctx, 206, 300, 34, after(t, t0 + 0.1, 0.3));
      UI.text(ctx, 'Vente enregistrée', 206, 410, { size: 26, weight: 800, align: 'center' });
      UI.text(ctx, 'Robe wax · M · Rouge · 12 500 F', 206, 444, { size: 15, weight: 600, color: B.muted, align: 'center' });
      btn(ctx, 206, 520, 300, 56, '🖨  Imprimer', { size: 18 });
      if (t >= ev.stockDown) { const p2 = pop(t, ev.stockDown); ctx.save(); ctx.translate(206, 620); ctx.scale(p2, p2); ctx.fillStyle = B.warnDim; ctx.beginPath(); ctx.roundRect(-160, -24, 320, 48, 24); ctx.fill(); UI.text(ctx, 'Stock M · Rouge : 4 → 3', 0, 6, { size: 16, weight: 800, color: B.warn, align: 'center' }); ctx.restore(); }
    },
    offline(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Sorties', 'Opérations');
      const on = t >= ev.online;
      ctx.fillStyle = on ? B.okDim : B.warnDim; ctx.beginPath(); ctx.roundRect(16, 210, 380, 56, 16); ctx.fill();
      UI.text(ctx, on ? '✓ Connexion rétablie · 2 ventes envoyées' : 'Hors connexion · envoi au retour du réseau', 206, 244, { size: 14, weight: 800, color: on ? B.ok : B.warn, align: 'center' });
      row(ctx, 284, 'Robe wax · M', '✓ envoyée', { sub: '12 500 F · 09:12', h: 64, rcolor: B.ok });
      [['T-shirt · L', '7 000 F · 14:05'], ['Jean · 32', '15 000 F · 14:20']].forEach(([a, b], i) => {
        const t0 = ev.queued[i]; if (t < t0) return; const a2 = after(t, t0, 0.2), sent = t >= ev.online + 0.2 + i * 0.2;
        row(ctx, 360 + i * 76, a, sent ? '✓ envoyée' : 'en attente', { sub: b, h: 64, a: a2, dx: (1 - a2) * 40, rcolor: sent ? B.ok : B.warn });
      });
    },
    caisseTotal(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Caisse', 'Ouverte depuis 08:00');
      UI.card(ctx, 16, 210, 380, 110, 18); UI.text(ctx, 'Total encaissé', 34, 248, { size: 14, weight: 700, color: B.muted }); UI.text(ctx, '185 000 F CFA', 34, 294, { size: 30, weight: 800 });
      [['Espèces', 92000, '#16A34A'], ['Wave', 48000, '#1DC4F5'], ['Orange Money', 30000, '#F97316'], ['MTN', 15000, '#EAB308']].forEach(([n, v, c], i) => {
        const y = 352 + i * 64, g = ease.outCubic(clamp((t - ev.totalBars - i * 0.12) / 0.5));
        UI.text(ctx, n, 24, y + 4, { size: 15, weight: 700 }); UI.text(ctx, fcfa(v * g), 388, y + 4, { size: 15, weight: 800, align: 'right' });
        ctx.fillStyle = '#E8EDF5'; ctx.beginPath(); ctx.roundRect(24, y + 16, 364, 14, 7); ctx.fill();
        ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(24, y + 16, Math.max(1, 364 * (v / 92000) * g), 14, 7); ctx.fill();
      });
      btn(ctx, 206, 760, 364, 60, 'Terminer la journée', { bg: B.ink, size: 19 });
    },
    caisseConfirm(ctx, w, h, t, t0) {
      SCR.caisseTotal(ctx, w, h, t);
      ctx.fillStyle = `rgba(15,23,42,${0.45 * after(t, t0, 0.2)})`; ctx.fillRect(0, 0, w, h);
      const p = pop(t, t0); ctx.save(); ctx.translate(206, 520); ctx.scale(p, p); ctx.translate(-206, -520);
      UI.card(ctx, 24, 400, 364, 240, 22);
      UI.text(ctx, 'Terminer la journée ?', 206, 448, { size: 21, weight: 800, align: 'center' });
      UI.text(ctx, 'Les recettes sont rangées.', 206, 480, { size: 14, weight: 500, color: B.muted, align: 'center' });
      UI.text(ctx, 'Tu pourras relire cette journée.', 206, 502, { size: 14, weight: 500, color: B.muted, align: 'center' });
      btn(ctx, 206, 560, 320, 54, 'Oui, terminer la journée', { bg: B.ink, size: 16 });
      UI.text(ctx, 'Annuler', 206, 616, { size: 15, weight: 700, color: B.muted, align: 'center' });
      ctx.restore();
    },
    dash(ctx, w, h, t) {
      appBar(ctx, w); title(ctx, 'Dashboard', 'Pilotage');
      const [a, b] = ev.dashCount;
      UI.card(ctx, 16, 210, 380, 110, 18); UI.text(ctx, 'Ventes du jour', 34, 248, { size: 14, weight: 700, color: B.muted }); UI.text(ctx, fcfa(Data.count(t, a, b, 0, 185000, ease.outCubic)), 34, 294, { size: 30, weight: 800, color: t >= b ? B.blue : B.ink });
      UI.card(ctx, 16, 334, 380, 110, 18); UI.text(ctx, 'Bénéfice du jour', 34, 372, { size: 14, weight: 700, color: B.muted }); UI.text(ctx, fcfa(Data.count(t, a + 0.2, b, 0, 61500, ease.outCubic)), 34, 418, { size: 30, weight: 800, color: B.ok });
      UI.card(ctx, 16, 458, 380, 220, 18); UI.text(ctx, 'Produits qui se vendent le mieux', 34, 494, { size: 14, weight: 700, color: B.muted });
      [['Robe wax', 9], ['T-shirt', 6], ['Jean', 4]].forEach(([n, v], i) => {
        const g = ease.outCubic(clamp((t - a - 0.3 - i * 0.12) / 0.5)), y = 520 + i * 50;
        UI.text(ctx, n, 34, y + 18, { size: 15, weight: 700 }); ctx.fillStyle = i ? '#DCE3EE' : B.blue; ctx.beginPath(); ctx.roundRect(140, y + 4, 200 * (v / 9) * g, 20, 6); ctx.fill();
        UI.text(ctx, String(v), 370, y + 20, { size: 15, weight: 800, align: 'right' });
      });
    },
  };
  // le menu (tiroir latéral) par-dessus l'écran précédent
  function drawMenu(ctx, w, h, t, t0, base) {
    if (base) SCR[base](ctx, w, h, t, t0);
    const u = ease.outCubic(after(t, t0, 0.22));
    ctx.fillStyle = `rgba(15,23,42,${0.4 * u})`; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.translate((u - 1) * 320, 0);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 300, h);
    logoIcon(ctx, 40, 90, 40); UI.text(ctx, 'Mon Djossi', 72, 98, { size: 18, weight: 800 });
    const target = S.taps.find((x) => x.t > t0 && x.t < t0 + 1.2 && x.x === 110);
    for (const it of S.MENU_ITEMS) {
      if (it.group) { UI.text(ctx, it.label.toUpperCase(), 24, it.y + 8, { size: 11, weight: 800, color: B.muted, spacing: 1.5 }); continue; }
      const on = target && target.label === it.label && t >= target.t - 0.05;
      if (on) { ctx.fillStyle = B.blueDim; ctx.beginPath(); ctx.roundRect(12, it.y - 18, 276, 36, 10); ctx.fill(); }
      ctx.fillStyle = on ? B.blue : '#A0AEC0'; ctx.beginPath(); ctx.roundRect(26, it.y - 7, 14, 14, 4); ctx.fill();
      UI.text(ctx, it.label, 52, it.y + 6, { size: 16, weight: on ? 800 : 600, color: on ? B.blue : B.ink });
    }
    ctx.restore();
  }
  function screenAt(t) { let i = -1; for (let k = 0; k < S.screens.length; k++) if (t >= S.screens[k].t) i = k; return i; }
  function baseBefore(i) { for (let k = i - 1; k >= 0; k--) if (S.screens[k].id !== 'menu') return S.screens[k]; return { id: 'site', t: 0 }; }
  function drawScreen(ctx, w, h, t, i) {
    if (i < 0) { SCR.site(ctx, w, h, t, 0); return; }
    const s = S.screens[i];
    ctx.fillStyle = B.base; ctx.fillRect(0, 0, w, h);
    if (s.id === 'menu') { const b = baseBefore(i); drawMenu(ctx, w, h, t, s.t, b.id); }
    else SCR[s.id](ctx, w, h, t, s.t);
  }
  function appScreen(ctx, w, h, t) {
    const i = screenAt(t);
    const s = S.screens[i];
    const u = s && s.id !== 'menu' && i > 0 ? clamp((t - s.t) / 0.26) : 1;
    if (u < 1) { ctx.save(); ctx.translate(-u * 120, 0); drawScreen(ctx, w, h, t, i - 1); ctx.restore(); ctx.save(); ctx.translate((1 - ease.outCubic(u)) * w, 0); drawScreen(ctx, w, h, t, i); ctx.restore(); }
    else drawScreen(ctx, w, h, t, i);
  }

  // ---------- le doigt et les libellés ----------
  function finger(ctx, t) {
    const taps = S.taps;
    let k = taps.findIndex((x) => x.t + 0.35 >= t);
    if (k < 0) return;
    const tp = taps[k];
    if (t < tp.t - 0.7) return;
    const prev = k > 0 && tp.t - taps[k - 1].t < 1.3 ? taps[k - 1] : null;
    const [tx, ty] = P(t, tp.x, tp.y);
    const [fx, fy] = prev ? P(t, prev.x, prev.y) : [tx + 160, ty + 260];
    const u = ease.inOutCubic(clamp((t - (tp.t - 0.6)) / 0.48));
    const x = lerp(fx, tx, u), y = lerp(fy, ty, u);
    const a = prev ? 1 : clamp((t - (tp.t - 0.7)) / 0.15);
    const fade = 1 - clamp((t - tp.t - 0.15) / 0.2);
    // le halo jaune sur la cible, juste avant
    if (t < tp.t + 0.05) { const h2 = clamp((t - (tp.t - 0.5)) / 0.3); ctx.save(); ctx.globalAlpha = 0.5 * h2; ctx.strokeStyle = B.yellow; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(tx, ty, 34 + 6 * Math.sin(t * 18), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    UI.tap(ctx, tx, ty, t, tp.t, { color: 'rgba(37,99,235,0.9)', size: 110 });
    const press = t >= tp.t - 0.06 && t < tp.t + 0.12 ? 0.82 : 1;
    ctx.save(); ctx.globalAlpha = a * fade; ctx.translate(x, y); ctx.scale(press, press);
    ctx.shadowColor = 'rgba(15,23,42,0.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.strokeStyle = B.ink; ctx.lineWidth = 4; ctx.stroke();
    ctx.restore();
  }
  function callouts(ctx, t) {
    for (const tp of S.taps) {
      if (!tp.label || t < tp.t - 0.45 || t > tp.t + 1.0) continue;
      const a = Math.min(clamp((t - (tp.t - 0.45)) / 0.15), 1 - clamp((t - (tp.t + 0.8)) / 0.2));
      const [tx, ty] = P(t, tp.x, tp.y);
      const text = `Touche « ${tp.label} »`, size = 34, wdt = UI.measure(ctx, text, size, 800) + 48;
      const cx = clamp(tx, SAFE.x + wdt / 2, SAFE.x + SAFE.w - wdt / 2), below = ty < 1150, cy = below ? ty + 84 : ty - 84;
      const p = UI.pop(t, tp.t - 0.45, 0.25, 2);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.scale(p, p);
      ctx.shadowColor = 'rgba(15,23,42,0.3)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 5;
      ctx.fillStyle = B.yellow; ctx.beginPath(); ctx.roundRect(-wdt / 2, -36, wdt, 72, 36); ctx.fill(); ctx.shadowColor = 'transparent';
      const ax = clamp(tx - cx, -wdt / 2 + 30, wdt / 2 - 30);
      ctx.beginPath(); if (below) { ctx.moveTo(ax - 14, -30); ctx.lineTo(ax, -46); ctx.lineTo(ax + 14, -30); } else { ctx.moveTo(ax - 14, 30); ctx.lineTo(ax, 46); ctx.lineTo(ax + 14, 30); } ctx.fill();
      UI.text(ctx, text, 0, 12, { size, weight: 800, color: B.ink, align: 'center' });
      ctx.restore();
    }
  }

  // ---------- illustrations autour du téléphone ----------
  function dress(ctx, x, y, s, color, dots = '#FFD166', seed = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const pts = [[-18, 0], [18, 0], [24, 16], [40, 26], [32, 44], [26, 40], [48, 150], [-48, 150], [-26, 40], [-32, 44], [-40, 26], [-24, 16]];
    G.poly(ctx, pts, { fill: color, lw: 0, seed });
    ctx.save(); ctx.beginPath(); G.path(ctx, pts, true); ctx.clip(); ctx.fillStyle = dots;
    for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.arc(-50 + (i * 37) % 100, 6 + ((i * 53) % 150), 6 + (i % 3) * 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore(); ctx.restore();
  }
  function shopLogo(ctx, x, y, r) { ctx.fillStyle = '#E8742E'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); UI.text(ctx, 'BA', x, y + r * 0.3, { size: r * 0.8, weight: 800, color: '#FFFFFF', align: 'center' }); }
  function excel(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(-46, -60, 92, 120, 10); ctx.fill(); ctx.strokeStyle = '#1D6F42'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#1D6F42'; ctx.beginPath(); ctx.roundRect(-60, -24, 64, 52, 8); ctx.fill();
    UI.text(ctx, 'X', -28, 14, { size: 36, weight: 800, color: '#FFFFFF', align: 'center' });
    ctx.fillStyle = '#A7D7B9'; for (let i = 0; i < 4; i++) ctx.fillRect(12, -40 + i * 22, 24, 10);
    ctx.restore();
  }
  // la devanture de la boutique ; shutter = 0 fermé … 1 ouvert
  function shopFront(ctx, x, y, s, shutter) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#F5E6D3'; ctx.fillRect(-170, -140, 340, 260);
    ctx.fillStyle = '#E8742E'; ctx.beginPath(); ctx.moveTo(-190, -140); for (let i = 0; i <= 8; i++) ctx.lineTo(-190 + i * 47.5, -100 + (i % 2) * 14); ctx.lineTo(190, -140); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1F4E8C'; ctx.fillRect(-190, -186, 380, 50); UI.text(ctx, 'BOUTIQUE AWA', 0, -151, { size: 28, weight: 800, color: '#FFFFFF', align: 'center' });
    ctx.fillStyle = '#3B2A20'; ctx.fillRect(-140, -86, 280, 206);
    [[-90, '#C2410C'], [-20, '#1D4ED8'], [50, '#047857']].forEach(([dx, c], i) => dress(ctx, dx + 20, -70, 0.6, c, '#FDE68A', i));
    const sh = 206 * (1 - shutter);
    ctx.save(); ctx.beginPath(); ctx.rect(-140, -86, 280, sh); ctx.clip();
    ctx.fillStyle = '#9CA3AF'; ctx.fillRect(-140, -86, 280, sh); ctx.fillStyle = '#6B7280';
    for (let yy = -86 + sh - 10; yy > -96; yy -= 14) ctx.fillRect(-140, yy, 280, 4);
    ctx.restore();
    ctx.fillStyle = '#4B5563'; ctx.fillRect(-150, -86 + sh - 8, 300, 10);
    ctx.restore();
  }
  function wifi(ctx, x, y, s, color, slash = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineWidth = 16;
    for (const r of [60, 110, 160]) { ctx.beginPath(); ctx.arc(0, 60, r, -Math.PI * 0.78, -Math.PI * 0.22); ctx.stroke(); }
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 60, 16, 0, Math.PI * 2); ctx.fill();
    if (slash > 0) { ctx.strokeStyle = B.red; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(-150, -120); ctx.lineTo(-150 + 300 * slash, -120 + 240 * slash); ctx.stroke(); }
    ctx.restore();
  }
  function floatCard(ctx, x, y, w, h, a, draw) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(a); const p = 0.85 + 0.15 * ease.outBack(clamp(a), 2);
    ctx.translate(x + w / 2, y + h / 2); ctx.scale(p, p); ctx.translate(-(x + w / 2), -(y + h / 2));
    ctx.shadowColor = 'rgba(15,23,42,0.22)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 24); ctx.fill(); ctx.shadowColor = 'transparent';
    draw(); ctx.restore();
  }
  function props(ctx, t) {
    const ch = chapAt(t).id;
    const inCh = (id, d = 0.35) => (ch === id ? clamp((t - S.CHAPTERS.find((c) => c.id === id).t) / d) : 0);
    // étape 2 : l'aperçu du reçu se remplit en direct
    if (ch === 'c2') floatCard(ctx, 764, 960, 176, 290, inCh('c2'), () => {
      UI.text(ctx, 'APERÇU DU REÇU', 852, 996, { size: 13, weight: 800, color: B.muted, align: 'center', spacing: 1 });
      if (t >= ev.logoDrop) shopLogo(ctx, 852, 1040, 26);
      UI.text(ctx, 'BOUTIQUE AWA', 852, 1096, { size: 16, weight: 800, align: 'center' });
      UI.text(ctx, typedOf(t, 'boutique', 0, 'Cocody, Rue des Jardins'), 852, 1124, { size: 11, weight: 600, color: B.muted, align: 'center' });
      UI.text(ctx, typedOf(t, 'boutique', 1, '+225 07 12 34 56 78'), 852, 1148, { size: 11, weight: 600, color: B.muted, align: 'center' });
      ctx.fillStyle = B.line; for (let i = 0; i < 3; i++) ctx.fillRect(782, 1176 + i * 20, 140 - i * 30, 8);
    });
    // étape 3 : le meuble à tiroirs
    if (ch === 'c3') floatCard(ctx, 70, 930, 250, 330, inCh('c3'), () => {
      ['Robes', 'Jeans', 'T-shirts', 'Accessoires'].forEach((n, i) => {
        const isNew = i === 3; if (isNew && t < ev.newDrawer) return;
        const out = isNew ? (1 - ease.outBack(after(t, ev.newDrawer, 0.35), 1.4)) * -220 : 6 * Math.sin(Math.max(0, t - V.c3.at) * 3 + i) * clamp((t - V.c3.at) / 0.5) * (t < K('c3', 'Quelques') ? 1 : 0);
        const y = 960 + i * 72;
        ctx.fillStyle = isNew ? '#FDE68A' : '#E8C9A0'; ctx.beginPath(); ctx.roundRect(92 + out, y, 206, 60, 10); ctx.fill();
        ctx.fillStyle = '#8A5A36'; ctx.beginPath(); ctx.roundRect(170 + out, y + 38, 50, 8, 4); ctx.fill();
        UI.text(ctx, n, 195 + out, y + 28, { size: 18, weight: 800, color: '#5B3A1E', align: 'center' });
      });
    });
    // étape 4 : la grande boîte et les petites (variantes), puis la jauge du seuil
    if (ch === 'c4' && t >= ev.variantes[0] - 0.3) floatCard(ctx, 70, 960, 250, 290, after(t, ev.variantes[0] - 0.3), () => {
      UI.text(ctx, 'Robe wax', 195, 996, { size: 18, weight: 800, align: 'center' });
      ctx.fillStyle = '#E8C9A0'; ctx.beginPath(); ctx.roundRect(100, 1150, 190, 80, 12); ctx.fill();
      [['S', 4], ['M', 4], ['L', 3]].forEach(([s2, q], i) => {
        const tt = ev.variantes[i]; if (t < tt) return;
        const u = ease.outBack(after(t, tt, 0.35), 1.6), x = 130 + i * 65, y = lerp(1170, 1040, u);
        ctx.fillStyle = ['#C2410C', '#B91C1C', '#1D4ED8'][i]; ctx.beginPath(); ctx.roundRect(x - 26, y, 52, 52, 10); ctx.fill();
        UI.text(ctx, s2, x, y + 26, { size: 20, weight: 800, color: '#FFFFFF', align: 'center' }); UI.text(ctx, `×${q}`, x, y + 46, { size: 13, weight: 700, color: '#FFFFFF', align: 'center' });
      });
    });
    if (ch === 'c4' && t >= ev.seuil - 0.2) floatCard(ctx, 760, 900, 180, 360, after(t, ev.seuil - 0.2), () => {
      UI.text(ctx, 'Stock M', 850, 936, { size: 16, weight: 800, align: 'center' });
      const lvl = t < ev.seuilLine ? 4 : lerp(4, 2, after(t, ev.seuilLine, 1.2)), top = 970, bot = 1220, hh = bot - top, y = bot - hh * (lvl / 6);
      ctx.fillStyle = '#E8EDF5'; ctx.beginPath(); ctx.roundRect(820, top, 60, hh, 12); ctx.fill();
      ctx.fillStyle = lvl <= 3 ? B.warn : B.blue; ctx.beginPath(); ctx.roundRect(820, y, 60, bot - y, 12); ctx.fill();
      const ly = bot - hh * 0.5; ctx.strokeStyle = B.warn; ctx.lineWidth = 4; ctx.setLineDash([10, 6]); ctx.beginPath(); ctx.moveTo(800, ly); ctx.lineTo(900, ly); ctx.stroke(); ctx.setLineDash([]);
      UI.text(ctx, 'seuil 3', 850, ly - 10, { size: 14, weight: 800, color: B.warn, align: 'center' });
      if (lvl <= 3) { const p = pop(t, ev.seuilLine + 0.6); ctx.save(); ctx.translate(850, 1250); ctx.scale(p, p); UI.text(ctx, '⚠ Alerte !', 0, 0, { size: 18, weight: 800, color: B.warn, align: 'center' }); ctx.restore(); }
    });
    // étape 5 : les étagères se vident dans le téléphone, puis le fichier Excel
    if (ch === 'c5' && t < V.c5b.at - 0.3) floatCard(ctx, 70, 980, 230, 260, inCh('c5'), () => {
      ctx.fillStyle = '#8A5A36'; [1080, 1170, 1230].forEach((y) => ctx.fillRect(90, y, 190, 8));
      for (let i = 0; i < 6; i++) {
        const fly = ease.inOutCubic(clamp((t - ev.stockFly - i * 0.12) / 0.5)), x0 = 120 + (i % 3) * 64, y0 = i < 3 ? 1010 : 1100;
        const [tx, ty] = P(t, 206, 330 + (i % 4) * 56);
        const x = lerp(x0, tx, fly), y = lerp(y0, ty, fly) - Math.sin(fly * Math.PI) * 140;
        if (fly < 1) dress(ctx, x, y, 0.42 * (1 - 0.4 * fly), ['#C2410C', '#1D4ED8', '#047857'][i % 3], '#FDE68A', i);
      }
    });
    if (ch === 'c5' && t >= ev.excelDrop - 0.6 && t < ev.excelDrop + 0.4) { const u = ease.inCubic(clamp((t - (ev.excelDrop - 0.6)) / 0.9)); const [tx, ty] = P(t, 206, 380); excel(ctx, lerp(880, tx, u), lerp(320, ty, u), 1.4 - 0.5 * u); }
    if (ch === 'c5' && t >= ev.importCount[1]) { const p = pop(t, ev.importCount[1]); ctx.save(); ctx.translate(820, 1180); ctx.scale(p, p); ctx.rotate(-0.06); UI.pill(ctx, -120, -36, '300 articles', { bg: B.ok, size: 32, h: 72, weight: 800 }); ctx.restore(); }
    // étape 6 : le badge du caissier et le cadenas des réglages
    if (ch === 'c6' && t >= ev.badge) floatCard(ctx, 764, 960, 176, 170, after(t, ev.badge), () => {
      ctx.fillStyle = B.blue; ctx.beginPath(); ctx.roundRect(764, 960, 176, 50, [24, 24, 0, 0]); ctx.fill();
      UI.text(ctx, 'ACCÈS CAISSIER', 852, 992, { size: 12, weight: 800, color: '#FFFFFF', align: 'center', spacing: 1 });
      ctx.fillStyle = '#FDE68A'; ctx.beginPath(); ctx.arc(800, 1066, 30, 0, Math.PI * 2); ctx.fill(); UI.text(ctx, 'K', 800, 1076, { size: 26, weight: 800, align: 'center' });
      UI.text(ctx, 'Koffi', 838, 1062, { size: 20, weight: 800 }); UI.text(ctx, 'vend, encaisse', 784, 1116, { size: 13, weight: 600, color: B.muted });
    });
    if (ch === 'c6' && t >= ev.lock - 0.3) floatCard(ctx, 70, 1010, 230, 150, after(t, ev.lock - 0.3), () => {
      UI.text(ctx, 'Réglages', 185, 1056, { size: 20, weight: 800, align: 'center', color: B.muted });
      const sh = ease.outBack(after(t, ev.lock, 0.3), 2);
      ctx.fillStyle = B.ink; ctx.beginPath(); ctx.roundRect(160, 1090, 50, 40, 8); ctx.fill();
      ctx.strokeStyle = B.ink; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(185, 1090 - 14 * (1 - sh), 16, Math.PI, 0); ctx.stroke();
    });
    // jour 1 : la devanture, rideau levé le matin, baissé le soir
    if (ch === 'd1' || ch === 'd4') {
      const sh = ch === 'd1' ? ease.inOutCubic(after(t, ev.curtainUp - 0.2, 1.0)) : 1 - ease.inOutCubic(after(t, ev.curtainDown, 1.0));
      floatCard(ctx, 66, 960, 260, 300, inCh(ch), () => { shopFront(ctx, 196, 1130, 0.62, sh); });
    }
    // jour 1 · vendre : le reçu qui s'imprime à droite
    if (ch === 'd2' && t >= ev.receipt) {
      const pr = ease.outCubic(clamp((t - ev.receipt) / 1.2)), rx = 772, ry = 1000, rw = 168;
      ctx.fillStyle = '#2F3446'; ctx.beginPath(); ctx.roundRect(758, 974, 196, 40, 12); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(rx - 10, ry, rw + 20, 300 * pr); ctx.clip(); ctx.shadowColor = 'rgba(15,23,42,0.2)'; ctx.shadowBlur = 16;
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(rx, ry, rw, 300); ctx.shadowColor = 'transparent';
      const mono = '"DejaVu Sans Mono", monospace';
      [['BOUTIQUE AWA', 14, 800], ['Cocody · Abidjan', 10, 500], ['- - - - - - - -', 11, 500], ['Robe wax M Rouge', 11, 700], ['12 500 F', 11, 700], ['Reçu : 15 000 F', 11, 500], ['Monnaie : 2 500 F', 11, 700], ['Merci, à bientôt !', 11, 600]].forEach(([s2, sz, wt], i) =>
        UI.text(ctx, s2, rx + rw / 2, ry + 36 + i * 32, { size: sz, weight: wt, align: 'center', font: mono, color: B.ink }));
      ctx.restore();
    }
    // jour 1 · sans internet : le nuage
    if (ch === 'd3') {
      const on = t >= ev.online, a = inCh('d3');
      ctx.save(); ctx.globalAlpha = a; ctx.translate(840, 1010); ctx.fillStyle = on ? '#DBEAFE' : '#E2E8F0';
      ctx.beginPath(); ctx.arc(-40, 10, 40, 0, Math.PI * 2); ctx.arc(10, -14, 54, 0, Math.PI * 2); ctx.arc(60, 12, 38, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-40, 10, 100, 40); ctx.restore();
      ctx.save(); ctx.globalAlpha = a; wifi(ctx, 848, 1000, 0.25, on ? B.blue : B.muted, on ? 0 : 1); ctx.restore();
      for (let i = 0; i < 2; i++) { const u = clamp((t - (ev.online + i * 0.2)) / 0.45); if (u <= 0 || u >= 1) continue; const [x0, y0] = P(t, 330, 392 + i * 76); ctx.fillStyle = B.blue; ctx.beginPath(); ctx.arc(lerp(x0, 850, u), lerp(y0, 1010, u) - Math.sin(u * Math.PI) * 120, 14, 0, Math.PI * 2); ctx.fill(); }
    }
    // l'étape 1 réussie : confettis
    burst(ctx, t, ev.confetti1, ...P(t, 206, 330));
    // le bilan : Awa, contente, à gauche
    if (ch === 'd5') { const a = inCh('d5', 0.4); ctx.save(); ctx.globalAlpha = a; Ch.person(ctx, { x: 170, y: 1500 + (1 - a) * 200, s: 0.95, pose: 'stand', style: AWA, seed: 11, look: 1, eyes: 'happy', brows: 'up', mouth: 'grin', blush: 0.4, gesture: t > ev.dashCount[1] ? 'cheer' : 'thumbsUp' }); ctx.restore(); }
  }
  function burst(ctx, t, t0, cx, cy) {
    const a = t - t0; if (a < 0 || a > 1.6) return;
    const cols = [B.violet, B.blue, B.yellow, '#22C55E', '#F472B6'];
    for (let i = 0; i < 50; i++) {
      const ang = U.hash(i, 1) * Math.PI * 2, v = 600 + U.hash(i, 2) * 600, d = clamp(a), s = 0.6 + U.hash(i, 3) * 0.8;
      const x = cx + Math.cos(ang) * v * d, y = cy + Math.sin(ang) * v * d + 900 * d * d;
      ctx.save(); ctx.globalAlpha = clamp(1.4 - a); ctx.translate(x, y); ctx.rotate(a * 8 * U.hash(i, 4)); ctx.fillStyle = cols[i % 5]; ctx.fillRect(-9 * s, -5 * s, 18 * s, 10 * s); ctx.restore();
    }
  }

  // ---------- fond, en-tête, intro, fin ----------
  function blob(ctx, x, y, r, color) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function background(ctx, t) {
    const ch = chapAt(t).id;
    // matin : aube chaude ; soir : coucher ; bilan : nuit violette ; sinon lavande claire
    const sky = { d1: ['#FFE7C2', '#FDF4E7'], d4: ['#FDBA74', '#C4B5FD'], d5: ['#4C1D95', '#7C3AED'] }[ch] || ['#EEF0FB', '#F4F6FB'];
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (ch === 'd1') { const u = after(t, ev.sunrise, 2); ctx.fillStyle = '#FDB022'; ctx.beginPath(); ctx.arc(860, lerp(560, 360, u), 70, 0, Math.PI * 2); ctx.fill(); blob(ctx, 860, 400, 420, 'rgba(253,176,34,0.35)'); }
    else if (ch === 'd4') { const u = after(t, ev.sunset, 3); ctx.fillStyle = '#F97316'; ctx.beginPath(); ctx.arc(860, lerp(360, 640, u), 70, 0, Math.PI * 2); ctx.fill(); blob(ctx, 860, 500, 420, 'rgba(249,115,22,0.35)'); }
    else if (ch === 'd5') { for (let i = 0; i < 22; i++) { ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.4 * Math.abs(Math.sin(t * 2 + i))})`; ctx.beginPath(); ctx.arc(U.hash(i, 1) * W, 240 + U.hash(i, 2) * 1100, 3, 0, Math.PI * 2); ctx.fill(); } }
    else { blob(ctx, 200 + 60 * Math.sin(t * 0.4), 420, 700, 'rgba(124,58,237,0.16)'); blob(ctx, 900, 1300, 760, 'rgba(37,99,235,0.14)'); }
  }
  function header(ctx, t) {
    const c = chapAt(t); if (!c.label) return;
    const dark = c.id === 'd5';
    logoIcon(ctx, SAFE.x + 38, SAFE.y + 44, 76);
    const p = UI.pop(t, c.t, 0.3, 2);
    ctx.save(); ctx.translate(SAFE.x + 96, SAFE.y + 44); ctx.scale(p, p);
    UI.pill(ctx, 0, -30, c.label, { bg: dark ? '#FFFFFF' : B.ink, fg: dark ? B.ink : '#FFFFFF', size: 28, h: 60, weight: 800 });
    ctx.restore();
    // la progression : 6 points pour l'installation, puis le soleil du jour 1
    const steps = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'], idx = steps.indexOf(c.id);
    if (idx >= 0) steps.forEach((s, i) => { ctx.fillStyle = i <= idx ? B.blue : 'rgba(15,23,42,0.15)'; ctx.beginPath(); ctx.roundRect(SAFE.x + i * 46, SAFE.y + 96, 38, 8, 4); ctx.fill(); });
  }
  function intro(ctx, t) {
    // le logo arrive, puis rétrécit ; Awa et sa boutique
    const out = ease.inOutCubic(clamp((t - (V.i1.at - 0.2)) / 0.5));
    ctx.save(); ctx.globalAlpha = 1 - out; logo(ctx, W / 2, lerp(820, 600, out), lerp(920, 400, out), t, 0.4); ctx.restore();
    burst(ctx, t, 0.4, W / 2, 820);
    if (t >= V.i1.at - 0.2) {
      const a = after(t, V.i1.at - 0.2, 0.4), leave = ease.inCubic(clamp((t - (V.i2.at - 0.3)) / 0.5));
      ctx.save(); ctx.globalAlpha = a * (1 - leave);
      shopFront(ctx, 540, 820 - leave * 200, 1.3, 1);
      Ch.person(ctx, { x: 540, y: 1460 + (1 - a) * 120, s: 1.1, pose: 'stand', style: AWA, seed: 11, eyes: 'happy', mouth: 'smile', gesture: 'wave' });
      UI.text(ctx, 'Awa · boutique de vêtements, Abidjan', W / 2, SAFE.y + 60, { size: 34, weight: 800, align: 'center', color: B.ink });
      ctx.restore();
    }
    // les deux promesses
    [['Installer ta boutique', K('i2', 'installer')], ['Faire ta première vente', K('i2', 'première')]].forEach(([s2, t0], i) => {
      const p = UI.pop(t, t0, 0.3, 2) * (1 - after(t, V.c1a.at - 0.6, 0.3)); if (p <= 0) return;
      ctx.save(); ctx.translate(i ? 760 : 320, SAFE.y + 70); ctx.scale(p, p); const wd = UI.measure(ctx, s2, 28, 800) + 50; UI.pill(ctx, -wd / 2, -30, s2, { bg: i ? B.ok : B.blue, size: 28, h: 60, weight: 800 }); ctx.restore();
    });
  }
  function endCard(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#6D28D9'); g.addColorStop(1, '#2563EB'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    blob(ctx, 200, 1600, 800, 'rgba(255,197,49,0.25)');
    const cp = UI.pop(t, S.endCard, 0.35, 1.8);
    ctx.save(); ctx.translate(W / 2, 520); ctx.scale(cp, cp); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(-SAFE.w / 2, -150, SAFE.w, 300, 48); ctx.fill(); ctx.restore();
    logo(ctx, W / 2, 520, 780, t, S.endCard + 0.1);
    const a = after(t, S.endCard + 0.6, 0.3);
    UI.text(ctx, 'Le guide complet t’attend', W / 2, 800, { size: 50, weight: 800, color: '#FFFFFF', align: 'center', alpha: a });
    UI.text(ctx, 'dans le menu « Guide »', W / 2, 864, { size: 50, weight: 800, color: B.yellow, align: 'center', alpha: a });
    const p2 = UI.pop(t, S.endCard + 1.2, 0.3, 2.2);
    if (p2 > 0) { ctx.save(); ctx.translate(W / 2, 990); ctx.scale(p2, p2); const wd = UI.measure(ctx, '14 jours d’essai gratuit', 42, 800) + 80; UI.pill(ctx, -wd / 2, -40, '14 jours d’essai gratuit', { bg: B.yellow, fg: B.ink, size: 42, h: 80, weight: 800 }); ctx.restore(); }
    UI.text(ctx, 'mon-djossi.vercel.app', W / 2, 1110, { size: 36, weight: 700, color: '#FFFFFF', align: 'center', alpha: after(t, S.endCard + 1.6, 0.3) });
    burst(ctx, t, S.endCard, W / 2, 520);
  }

  Studio.film({
    async init() { LOGO = await Studio.loadImage('assets/logo-couleur.png'); },
    draw(ctx, t) {
      if (t >= S.endCard) { endCard(ctx, t); }
      else {
        background(ctx, t);
        if (t < V.c1a.at - 0.5) intro(ctx, t);
        header(ctx, t);
        props(ctx, t);
        const { cx, cy } = phonePos(t);
        if (cy < H + 500) {
          UI.phone(ctx, cx, cy, PH, appScreen, t, { time: chapAt(t).id.startsWith('d') ? { d1: '08:00', d2: '09:12', d3: '14:20', d4: '19:30', d5: '21:00' }[chapAt(t).id] : '10:41' });
          finger(ctx, t);
          callouts(ctx, t);
          const ch = chapAt(t).id;
          if (ch === 'd4' || ch === 'd5') UI.text(ctx, 'Données d’exemple', cx, cy + PH / 2 + 34, { size: 22, weight: 500, color: ch === 'd5' ? 'rgba(255,255,255,0.6)' : B.muted, align: 'center' });
        }
        Subs.draw(ctx, t, S.subtitles, { style: 'box', size: 40, fam: 'Inter', maxW: SAFE.w * 0.98 });
      }
      if (t < 0.4) { ctx.fillStyle = `rgba(20,14,40,${1 - t / 0.4})`; ctx.fillRect(0, 0, W, H); }
    },
    post: { paper: 0.06, vignette: 0.1, grain: 0.015 },
    fadeOut: 0.9,
  });
})();
