# Site de présentation (`/presentation`) — surcharges

> Remplace la page générée par défaut (qui était étiquetée « Dashboard / Data View » à tort).
> Tout ce qui n'est pas listé ici suit `../MASTER.md`.

**Pattern :** Feature-Rich Showcase + bloc « abonnements » (pattern *Pricing-Focused Landing*, sans prix inventés).

**Ordre des sections :** Hero (promesse + aperçu produit) → Bandeau de preuves factuelles → Fonctionnalités (6) →
Cycle d'abonnement (le cœur du produit) → Trois rôles → Vitrine publique → Plans → FAQ → CTA final → Pied de page.

## Layout
- Conteneur `max-w-6xl`, gouttière 16 px mobile / 24 px desktop, sections espacées de `py-16 md:py-24`.
- Navigation haute collante, 64 px, fond `surface/90` + flou léger (le contenu ne passe jamais dessous : `scroll-mt-20`).
- Un seul CTA primaire par écran : « Inscrire ma boutique » ; secondaire : « Se connecter ».

## Typographie / couleur
- H1 40 px mobile → 56 px desktop, Plus Jakarta Sans 800. Corps 16–18 px, mesure ≤ 65 caractères.
- Fond clair `--color-base`, sections alternées `--color-surface`. Une section sombre (bleu nuit `--sidebar-bg`) pour le cycle d'abonnement.

## Contenu — règles d'honnêteté
- Aucun prix, aucun témoignage, aucun logo client, aucun chiffre d'usage inventés.
- L'aperçu produit est une maquette HTML étiquetée « Données d'exemple ».
- Les plans reflètent l'enum `PlanAbonnement` ; le tarif est « communiqué à l'inscription ».

## Mouvement
- Apparition au scroll (`whileInView`, une fois, 380 ms, décalage 12 px) ; désactivée sous `prefers-reduced-motion`.
