"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import type { Produit, Variante } from "@/types";
import { useVitrineStore } from "@/stores/vitrineStore";
import { buildWhatsappMessage } from "@/lib/whatsapp";

const schema = z.object({
  clientNom: z.string().min(2, "Prénom et nom requis (min. 2 caractères)"),
  clientTel: z.string().min(8, "Numéro requis (ex: +221 77 000 00 00)"),
  livraison: z.enum(["boutique", "livraison"]),
  adresse: z.string().optional(),
  notes: z.string().optional(),
});
type OrderForm = z.infer<typeof schema>;

interface ProduitOrderPanelProps {
  produit: Produit;
  variante: Variante | null;
}

function buildWhatsappUrl(message: string, whatsappNumber?: string | null): string {
  const number = whatsappNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "221770000000";
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function ProduitOrderPanel({ produit, variante }: ProduitOrderPanelProps) {
  const [quantite, setQuantite] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedBoutiqueId, setSelectedBoutiqueId] = useState<string | null>(null);
  const addToCart = useVitrineStore((s) => s.addToCart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<OrderForm>({
    resolver: zodResolver(schema),
    defaultValues: { livraison: "boutique" },
  });
  const livraison = watch("livraison");

  // Find all variantes with same taille+couleur across boutiques that have stock
  const boutiquesWithStock = useMemo(() => {
    if (!variante || !produit.variantes) return [];
    return (produit.variantes ?? []).filter(
      (v) => v.taille === variante.taille && v.couleur === variante.couleur && v.quantiteStock > 0 && v.boutique
    );
  }, [variante, produit.variantes]);

  const activeBoutiqueVariante = useMemo(() => {
    if (!variante) return null;
    if (boutiquesWithStock.length === 0) return null;
    if (boutiquesWithStock.length === 1) return boutiquesWithStock[0];
    return boutiquesWithStock.find((v) => v.boutiqueId === selectedBoutiqueId) ?? null;
  }, [boutiquesWithStock, selectedBoutiqueId, variante]);

  const prix = parseFloat(produit.prixVente || "0");
  const effectiveVariante = activeBoutiqueVariante ?? variante;
  const canWhatsApp = boutiquesWithStock.length <= 1 || !!selectedBoutiqueId;
  const canAddToCart = !!effectiveVariante && effectiveVariante.quantiteStock > 0 &&
    (boutiquesWithStock.length <= 1 || !!selectedBoutiqueId);
  const canOrder = canWhatsApp;
  const maxQte = effectiveVariante ? Math.min(effectiveVariante.quantiteStock, 10) : 10;

  const onSubmit = (values: OrderForm) => {
    const message = buildWhatsappMessage({
      lignes: [
        {
          produitNom: produit.nom,
          sku: produit.sku,
          couleur: effectiveVariante?.couleur,
          taille: effectiveVariante?.taille != null ? String(effectiveVariante.taille) : undefined,
          quantite,
          prix,
          boutiqueNom: effectiveVariante?.boutique?.nom,
        },
      ],
      clientNom: values.clientNom,
      clientTel: values.clientTel,
      livraison: values.livraison,
      adresse: values.adresse,
      notes: values.notes,
    });
    const whatsappNum = effectiveVariante?.boutique?.whatsapp;
    window.open(buildWhatsappUrl(message, whatsappNum), "_blank");
  };

  const handleAddToCart = () => {
    if (!effectiveVariante) return;
    addToCart({ produit, variante: effectiveVariante, quantite });
    setCartOpen(true);
  };

  return (
    <div
      className="rounded-2xl border p-5 space-y-5"
      style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
    >
      {variante && boutiquesWithStock.length === 0 && (
        <p className="text-sm text-center py-2" style={{ color: "var(--v-red)" }}>
          Cette variante est en rupture de stock
        </p>
      )}

      {/* Sélecteur boutique quand 2 boutiques ont le produit */}
      {variante && boutiquesWithStock.length > 1 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--v-muted)" }}>
            Choisir la boutique
          </p>
          <div className="grid grid-cols-2 gap-2">
            {boutiquesWithStock.map((bv) => (
              <button
                key={bv.boutiqueId}
                onClick={() => setSelectedBoutiqueId(bv.boutiqueId)}
                className="flex flex-col items-start rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all"
                style={
                  selectedBoutiqueId === bv.boutiqueId
                    ? { borderColor: "var(--v-lime)", backgroundColor: "rgba(200,118,44,0.08)", color: "var(--v-lime)" }
                    : { borderColor: "var(--v-border)", color: "var(--v-muted)" }
                }
              >
                <span className="font-bold">{bv.boutique!.nom}</span>
                {bv.boutique!.ville && (
                  <span className="text-[10px] opacity-70">{bv.boutique!.ville}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantité */}
      {canOrder && (
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--v-muted)" }}>
            Quantité
          </p>
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2" style={{ borderColor: "var(--v-border)" }}>
            <button
              onClick={() => setQuantite((q) => Math.max(1, q - 1))}
              className="text-lg font-black leading-none w-6 text-center transition-colors hover:text-[var(--v-lime)]"
              style={{ color: "var(--v-muted)" }}
            >
              −
            </button>
            <span className="w-6 text-center [font-family:var(--font-mono)] font-black text-sm" style={{ color: "var(--v-text)" }}>
              {quantite}
            </span>
            <button
              onClick={() => setQuantite((q) => Math.min(maxQte, q + 1))}
              className="text-lg font-black leading-none w-6 text-center transition-colors hover:text-[var(--v-lime)]"
              style={{ color: "var(--v-muted)" }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Total */}
      {canOrder && (
        <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--v-border)" }}>
          <span className="text-sm" style={{ color: "var(--v-muted)" }}>Total</span>
          <span className="[font-family:var(--font-mono)] text-xl font-black" style={{ color: "var(--v-lime)" }}>
            {(prix * quantite).toLocaleString("fr-FR")} <span className="text-xs font-normal" style={{ color: "var(--v-dim)" }}>FCFA</span>
          </span>
        </div>
      )}

      {/* Bouton principal WhatsApp */}
      <button
        onClick={() => canOrder && setShowForm((s) => !s)}
        disabled={!canOrder}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-black uppercase tracking-widest transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        style={{ backgroundColor: "#25D366", color: "#000" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {boutiquesWithStock.length > 1 && !selectedBoutiqueId
          ? "Choisir une boutique d'abord"
          : "Commander sur WhatsApp"}
      </button>

      {/* Formulaire de commande */}
      <AnimatePresence>
        {showForm && canOrder && (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="rounded-xl border p-4 space-y-4"
              style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s3)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--v-lime)" }}>
                Tes infos
              </p>

              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--v-muted)" }}>
                  Prénom & Nom *
                </label>
                <input
                  {...register("clientNom")}
                  placeholder="Konan Yao"
                  className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--v-lime)] placeholder:text-[var(--v-dim)]"
                  style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
                />
                {errors.clientNom && (
                  <p className="mt-1 text-[11px]" style={{ color: "var(--v-red)" }}>{errors.clientNom.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--v-muted)" }}>
                  Téléphone *
                </label>
                <input
                  {...register("clientTel")}
                  placeholder="+225 07 00 00 00 00"
                  type="tel"
                  className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--v-lime)] placeholder:text-[var(--v-dim)]"
                  style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
                />
                {errors.clientTel && (
                  <p className="mt-1 text-[11px]" style={{ color: "var(--v-red)" }}>{errors.clientTel.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold" style={{ color: "var(--v-muted)" }}>
                  Mode de récupération *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["boutique", "livraison"] as const).map((mode) => (
                    <label
                      key={mode}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all"
                      style={
                        livraison === mode
                          ? { borderColor: "var(--v-lime)", backgroundColor: "rgba(200,118,44,0.08)", color: "var(--v-lime)" }
                          : { borderColor: "var(--v-border)", color: "var(--v-muted)" }
                      }
                    >
                      <input type="radio" value={mode} {...register("livraison")} className="hidden" />
                      <span>{mode === "boutique" ? "🏪 Boutique" : "🚚 Livraison"}</span>
                    </label>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {livraison === "livraison" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--v-muted)" }}>
                      Adresse de livraison
                    </label>
                    <input
                      {...register("adresse")}
                      placeholder="Quartier, Commune, Abidjan"
                      className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--v-lime)] placeholder:text-[var(--v-dim)]"
                      style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--v-muted)" }}>
                  Remarques (optionnel)
                </label>
                <textarea
                  {...register("notes")}
                  placeholder="Informations supplémentaires..."
                  rows={2}
                  className="w-full resize-none rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--v-lime)] placeholder:text-[var(--v-dim)]"
                  style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-black uppercase tracking-widest transition-all hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "#000" }}
            >
              Envoyer la commande →
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bouton panier secondaire */}
      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart}
        className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold uppercase tracking-wider transition-all hover:border-[var(--v-text)] hover:text-[var(--v-text)] disabled:cursor-not-allowed disabled:opacity-30"
        style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
        title={!canAddToCart ? "Sélectionne une taille et une couleur pour ajouter au panier" : undefined}
      >
        + Ajouter au panier
      </button>
    </div>
  );
}
