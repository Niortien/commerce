"use client";

import { motion } from "framer-motion";
import { usePublicLookbookPhotos } from "@/features/lookbook-photos/query/public-lookbook-photos-queries";

const LOOKS = [
  {
    id: 1,
    src: "/images/dri_style/look-selfie-lacoste.jpg",
    alt: "Client Dri Valé — look Lacoste",
    pieces: ["T-shirt Lacoste", "Short DSQUARED2", "Sandales à carreaux"],
    tag: "Look du jour",
  },
  {
    id: 2,
    src: "/images/dri_style/client-sacs-drivale.jpg",
    alt: "Client Dri Valé — sortie boutique",
    pieces: ["Débardeur Off-White", "Cargo tie-dye"],
    tag: "Fresh out the shop",
  },
];

const WHATSAPP_NUMBER = "2250709294468";

export function LookbookBehindScenes() {
  const { data: res } = usePublicLookbookPhotos();
  const clientPhotos = res?.data ?? [];

  return (
    <section
      className="overflow-hidden py-20"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p
            className="mb-2 text-[10px] font-black uppercase tracking-[0.4em]"
            style={{ color: "var(--v-gold)" }}
          >
            Notre communauté
          </p>
          <h2
            className="font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(28px,5vw,56px)", color: "var(--v-text)" }}
          >
            Ils portent
            <br />
            <span style={{ color: "var(--v-hot)" }}>Dri Valé</span>
          </h2>
        </motion.div>
      </div>

      {/* Carrousel horizontal */}
      <div
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ paddingLeft: "clamp(20px,5vw,80px)", scrollbarWidth: "none" }}
      >
        {LOOKS.map((look, i) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="group flex-shrink-0"
            style={{ width: "260px" }}
          >
            {/* Photo */}
            <div
              className="relative overflow-hidden rounded-xl"
              style={{ aspectRatio: "3/4", backgroundColor: "var(--v-s2)" }}
            >
              <img
                src={look.src}
                alt={look.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Gradient bas */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,6,7,0.75) 0%, transparent 50%)",
                }}
              />
              {/* Tag */}
              <div
                className="absolute left-3 top-3 rounded-full px-3 py-1"
                style={{ backgroundColor: "var(--v-hot)" }}
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-white">
                  {look.tag}
                </p>
              </div>
            </div>

            {/* Pièces portées */}
            <div className="mt-3 space-y-1 px-1">
              {look.pieces.map((piece) => (
                <p
                  key={piece}
                  className="text-xs"
                  style={{ color: "var(--v-muted)" }}
                >
                  — {piece}
                </p>
              ))}
            </div>
          </motion.div>
        ))}

        {clientPhotos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (LOOKS.length + i) * 0.1, duration: 0.4 }}
            className="group flex-shrink-0"
            style={{ width: "260px" }}
          >
            {/* Photo */}
            <div
              className="relative overflow-hidden rounded-xl"
              style={{ aspectRatio: "3/4", backgroundColor: "var(--v-s2)" }}
            >
              <img
                src={photo.url}
                alt={photo.nom ? `${photo.nom} — client Dri Valé` : "Client Dri Valé"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient bas */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,6,7,0.75) 0%, transparent 50%)",
                }}
              />
              {/* Tag */}
              <div
                className="absolute left-3 top-3 rounded-full px-3 py-1"
                style={{ backgroundColor: "var(--v-gold)" }}
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-black">
                  Client Dri Valé
                </p>
              </div>
            </div>

            {photo.nom && (
              <div className="mt-3 px-1">
                <p className="text-xs" style={{ color: "var(--v-muted)" }}>
                  — {photo.nom}
                </p>
              </div>
            )}
          </motion.div>
        ))}

        {/* Carte CTA — soumettre son look */}
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%2C%20je%20veux%20partager%20mon%20look%20Dri%20Val%C3%A9%20%F0%9F%94%A5`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="group flex-shrink-0 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors"
          style={{
            width: "260px",
            aspectRatio: "3/4",
            borderColor: "var(--v-border)",
            backgroundColor: "var(--v-s2)",
          }}
          whileHover={{ borderColor: "var(--v-gold)" } as never}
        >
          <p
            className="text-4xl font-black"
            style={{ color: "var(--v-gold)" }}
          >
            +
          </p>
          <p
            className="mt-3 text-center text-sm font-bold leading-snug px-6"
            style={{ color: "var(--v-text)" }}
          >
            Ton look ici
          </p>
          <p
            className="mt-2 text-center text-[11px] leading-relaxed px-6"
            style={{ color: "var(--v-muted)" }}
          >
            Envoie ta photo via WhatsApp et rejoins la communauté
          </p>
          <p
            className="mt-4 text-[10px] font-black uppercase tracking-widest"
            style={{ color: "var(--v-gold)" }}
          >
            Envoyer →
          </p>
        </motion.a>

        <div className="flex-shrink-0 w-5" />
      </div>
    </section>
  );
}
