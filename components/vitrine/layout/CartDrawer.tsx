"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useVitrineStore } from "@/stores/vitrineStore";
import { buildWhatsappMessage, getWhatsappUrl } from "@/lib/whatsapp";

export function CartDrawer() {
  const cart = useVitrineStore((s) => s.cart);
  const cartOpen = useVitrineStore((s) => s.cartOpen);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);
  const removeFromCart = useVitrineStore((s) => s.removeFromCart);
  const updateQuantite = useVitrineStore((s) => s.updateQuantite);

  const total = cart.reduce(
    (sum, item) => sum + item.quantite * parseFloat(item.produit.prixVente || "0"),
    0
  );

  const handleCommanderTout = () => {
    if (cart.length === 0) return;
    const message = buildWhatsappMessage({
      lignes: cart.map((item) => ({
        produitNom: item.produit.nom,
        sku: item.produit.sku,
        couleur: item.variante.couleur,
        taille: String(item.variante.taille),
        quantite: item.quantite,
        prix: parseFloat(item.produit.prixVente || "0"),
        boutiqueNom: item.variante.boutique?.nom,
      })),
      clientNom: "À préciser",
      clientTel: "À préciser",
      livraison: "boutique",
    });
    window.open(getWhatsappUrl(message), "_blank");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ backgroundColor: "rgba(4,8,15,0.7)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-[95] flex w-full max-w-sm flex-col border-l"
            style={{ backgroundColor: "var(--v-s1)", borderColor: "var(--v-border)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: "var(--v-border)" }}
            >
              <h2
                className="font-[var(--font-display)] text-base font-black tracking-widest uppercase"
                style={{ color: "var(--v-text)" }}
              >
                Panier{" "}
                <span style={{ color: "var(--v-lime)" }}>
                  ({cart.reduce((s, i) => s + i.quantite, 0)})
                </span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--v-s3)]"
                style={{ color: "var(--v-muted)" }}
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <span className="text-4xl opacity-30">🛒</span>
                  <p style={{ color: "var(--v-muted)" }}>Ton panier est vide</p>
                  <Link
                    href="/catalogue"
                    onClick={() => setCartOpen(false)}
                    className="text-sm font-semibold underline"
                    style={{ color: "var(--v-lime)" }}
                  >
                    Voir le catalogue →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => {
                    const prix = parseFloat(item.produit.prixVente || "0");
                    return (
                      <div
                        key={item.variante.id}
                        className="flex gap-3 rounded-xl border p-3"
                        style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
                      >
                        {/* Image */}
                        <div
                          className="h-16 w-16 shrink-0 overflow-hidden rounded-lg"
                          style={{ backgroundColor: "var(--v-s3)" }}
                        >
                          {item.produit.imageUrl ? (
                            <img
                              src={item.produit.imageUrl}
                              alt={item.produit.nom}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xl opacity-20">👟</div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{ color: "var(--v-text)" }}
                          >
                            {item.produit.nom}
                          </p>
                          <p className="text-xs" style={{ color: "var(--v-muted)" }}>
                            {item.variante.taille} · {item.variante.couleur}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <button
                              onClick={() => updateQuantite(item.variante.id, item.quantite - 1)}
                              className="flex h-5 w-5 items-center justify-center rounded border text-xs"
                              style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
                            >
                              −
                            </button>
                            <span className="text-xs font-semibold" style={{ color: "var(--v-text)" }}>
                              {item.quantite}
                            </span>
                            <button
                              onClick={() => updateQuantite(item.variante.id, item.quantite + 1)}
                              className="flex h-5 w-5 items-center justify-center rounded border text-xs"
                              style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
                            >
                              +
                            </button>
                            <span
                              className="ml-auto font-[var(--font-mono)] text-sm font-bold"
                              style={{ color: "var(--v-lime)" }}
                            >
                              {(prix * item.quantite).toLocaleString("fr-FR")}
                            </span>
                          </div>
                        </div>

                        {/* Supprimer */}
                        <button
                          onClick={() => removeFromCart(item.variante.id)}
                          className="shrink-0 text-xs transition-colors hover:text-[var(--v-red)]"
                          style={{ color: "var(--v-dim)" }}
                          aria-label="Retirer"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div
                className="border-t px-5 py-5 space-y-3"
                style={{ borderColor: "var(--v-border)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--v-muted)" }}>Total</span>
                  <span
                    className="font-[var(--font-mono)] text-lg font-black"
                    style={{ color: "var(--v-text)" }}
                  >
                    {total.toLocaleString("fr-FR")} <span className="text-xs">FCFA</span>
                  </span>
                </div>
                <button
                  onClick={handleCommanderTout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black uppercase tracking-wider transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#25D366", color: "#000" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Commander sur WhatsApp
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
