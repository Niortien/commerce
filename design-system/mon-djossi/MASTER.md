# Mon Djossi — Design System (Master)

> Références visuelles : recherche 21st.dev (pricing à plans, hero à aperçu commutable, sidebar à indicateur actif, cartes KPI).
> Aucun code payant n'a été récupéré ; les motifs ont été réimplémentés avec HeroUI + Tailwind.

> Source : `ui-ux-pro-max --design-system "SaaS multi-boutique ERP stock caisse subscription management dashboard"`
> (style **Flat Design**, pattern **Feature-Rich Showcase**, typo SaaS/Enterprise), puis adapté aux contraintes du dépôt
> (`AGENTS.md`, `FRONTEND_SPEC.md`) : rôles couleur stricts in/out/return/cash, HeroUI v2, Tailwind + variables CSS,
> pas de noir dominant.
>
> Règle de lecture : pour une page, lire `pages/<page>.md` s'il existe — il **surcharge** ce fichier.

**Produit :** Mon Djossi — outil SaaS qui permet de gérer l'activité de boutiques (stock, caisse, entrées/sorties, promotions,
vitrine) **selon l'abonnement** de chaque boutique. Trois rôles : `SUPER_ADMIN` (plateforme), `ADMIN` (boutique), `CAISSIER`.
Cycle d'une boutique : `EN_ATTENTE → ESSAI → ACTIF → SUSPENDU → ARCHIVE` ; plans : `ESSAI`, `MENSUEL`, `TRIMESTRIEL`, `ANNUEL`.

**Écarts volontaires avec la sortie brute du skill**
- Accent **bleu** conservé (pas le vert `#059669` proposé) : le vert est réservé au rôle sémantique « entrée / succès ».
- Titres en **Plus Jakarta Sans** (proposé par le skill pour « Enterprise SaaS ») au lieu de Calistoga : plus lisible en
  interface dense. Corps en **Inter**, chiffres en **JetBrains Mono** (`tabular-nums`).
- La **vitrine publique** (`[data-vitrine]`) garde son identité noir + or + Playfair Display : autre public, autre palette.

---

## 0. Marque — logo Mon Djossi

Signature : **Gérez • Vendez • Développez**. Dégradé de marque violet `#7C3AED` → bleu `#2563EB` (cf. `.text-brand-gradient`,
réservé aux mots-clés d'un titre).

| Fichier (`public/images/mon-djossi/`) | Usage |
|---|---|
| `logo-couleur.png` | Fonds clairs (transparent, 1664×413) |
| `logo-clair.png` | Fonds sombres (texte blanc, dégradé éclairci) — barre latérale, thème sombre |
| `logo-fond-blanc.png` | Supports qui exigent un fond blanc (documents, e-mails) |
| `logo-icone.png` | Chariot seul : favicon (`app/icon.png`), icône Apple, petits formats |

Composant : `<BrandMark />` (suit le thème), `onDark` pour forcer la variante claire, `variant="icon"` pour le chariot seul.
Les fichiers d'origine renommés sont conservés dans `design-system/mon-djossi/assets/`. Zone de protection : 1/2 hauteur du chariot
autour du logo ; hauteur minimale 32 px.

## 1. Principes

1. **Flat & dense** : aplats, bordures 1 px, ombres quasi absentes (une seule élévation pour menus/modales).
2. **La donnée d'abord** : chiffres en mono tabulaire, libellés en petites capitales discrètes, une couleur = un sens.
3. **L'abonnement est visible partout** : statut/plan/jours restants dans la navigation, bannière d'alerte, badge dans les tableaux.
4. **Mobile-first** : cibles ≥ 44 px, nav en tiroir sous `lg`, aucune largeur fixe en px sur les conteneurs.
5. **Accessible** : contraste ≥ 4.5:1, focus visible 2 px, `aria-label` sur toute icône seule, `prefers-reduced-motion` respecté.

## 2. Couleurs (tokens `app/globals.css`)

| Rôle | Clair | Sombre | Token |
|---|---|---|---|
| Fond app | `#F4F6FB` | `#0B1220` | `--color-base` |
| Surface (cartes) | `#FFFFFF` | `#111A2E` | `--color-surface` |
| Surface haute | `#F1F5FB` | `#182338` | `--color-surface-high` |
| Bordure | `#E2E8F0` | `rgba(255,255,255,.08)` | `--color-border` |
| Accent / CTA | `#2563EB` | `#3B82F6` | `--color-accent` |
| Texte | `#0F172A` | `#E2E8F0` | `--color-text` |
| Texte atténué | `#64748B` (`#475569` sur texte courant) | `#94A3B8` | `--color-text-muted` |
| Entrée / succès / abonnement ACTIF | `#22C55E` | `#34D399` | `--color-in` |
| Sortie / erreur / SUSPENDU | `#E11D48` | `#FB7185` | `--color-out` |
| Retour / avertissement / ESSAI | `#D97706` | `#FBBF24` | `--color-return` |
| Caisse / argent | `#8B5CF6` | `#A78BFA` | `--color-cash` |
| Barre latérale | `#0F1B33` | `#0A1020` | `--sidebar-bg` (bleu nuit, jamais noir pur) |

Mapping statut boutique : `ACTIF`→in · `ESSAI`→return · `SUSPENDU`→out · `EN_ATTENTE`/`ARCHIVE`→neutre.

## 3. Typographie

| Usage | Police | Variable | Poids |
|---|---|---|---|
| Titres, chiffres clés | Plus Jakarta Sans | `--font-display` | 600–800, `leading-tight`, `tracking-tight` |
| Corps / UI | Inter | `--font-body` | 400 · 500 · 600 |
| Données (montants, quantités, codes) | JetBrains Mono | `--font-mono` | 400–500, `tabular-nums` |

Échelle : 11 · 13 · 15 · 16 · 18 · 20 · 24 · 32 · 40 · 56. Corps ≥ 15 px, 16 px sur mobile pour les champs.

## 4. Espacement, rayons, élévation

- Espacement : grille 4/8 (`--space-*`). Densité ERP : cartes `p-4`, sections `gap-4`, page `p-4 md:p-6`.
- Rayons : 6 (puces) · 10 (champs/boutons) · 16 (cartes) · 24 (héros).
- Élévation : `--shadow-card` = bordure hairline seulement ; `--shadow-md/lg` réservés aux menus, tiroirs, modales.
- Z-index : échelle `--z-*` existante (jamais de valeur arbitraire).

## 5. Composants

- **Carte** `Card` : fond surface, bordure 1 px, `rounded-lg`. Pas de dégradé ni de glow.
- **KPI** : pastille icône teintée (rôle couleur) + libellé muted + valeur `font-display` + sous-texte. Cliquable si action suivante.
- **En-tête de page** `PageHeader` : titre `font-display` 24–32 px, description muted, actions à droite (empilées < `sm`).
- **Navigation** : barre latérale bleu nuit ; item actif = fond translucide + barre d'accent 2 px ; sections libellées
  (« Pilotage », « Catalogue », « Administration »). Tiroir mobile avec fermeture visible et `Escape`.
- **Abonnement** `SubscriptionStatusCard` : plan, statut (puce couleur + icône), jours restants avant `dateFin`.
- **Boutons** : 1 action primaire par écran (bleu), secondaires en `bordered`/`light`, destructif en `danger` séparé.
- **Tableaux** : en-têtes muted, chiffres alignés à droite en mono, état vide avec message + action, squelettes au chargement.

## 6. Mouvement

- Durées : 120 ms (feedback) · 220 ms (état) · 380 ms (entrée de page) ; sorties ≈ 65 % de l'entrée.
- `transform`/`opacity` uniquement ; apparition en cascade de 40 ms max ; jamais plus de 1–2 éléments animés par vue.
- `useReducedMotion()` (hook existant) : toute animation Framer Motion a un état final immédiat.

## 7. Anti-patterns

- ❌ Noir pur dominant, dégradés décoratifs, glows, ombres multiples, effets 3D.
- ❌ Emoji comme icône (Tabler uniquement), tailles d'icône mélangées (16 px nav, 20 px titres de section).
- ❌ Couleur seule pour porter un sens (toujours icône ou texte avec le statut).
- ❌ Hex en dur dans les composants (passer par tokens/classes Tailwind sémantiques).
- ❌ Prix ou chiffres de preuve sociale inventés sur le site de présentation.

## 8. Checklist avant livraison

- [ ] Contraste ≥ 4.5:1 en clair **et** en sombre · [ ] focus visible · [ ] `aria-label` sur icônes seules
- [ ] 375 / 768 / 1024 / 1440 px sans scroll horizontal · [ ] `prefers-reduced-motion`
- [ ] `cursor-pointer` + transition 150–220 ms sur tout élément cliquable · [ ] états vide / chargement / erreur
