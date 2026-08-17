"use client";

import { motion } from "framer-motion";
import { getWhatsappUrl } from "@/lib/whatsapp";

export function LookbookWhatsapp() {
  const url = getWhatsappUrl(
    "Salut Dri Valé ! J'ai vu le lookbook Abidjan Nights et j'aimerais recréer le look. Pouvez-vous m'aider ?"
  );

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      {/* Gold glow décoratif */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full blur-3xl opacity-[0.12]"
        style={{ backgroundColor: "var(--v-gold)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-[10px] font-black uppercase tracking-[0.5em]"
          style={{ color: "var(--v-gold)" }}
        >
          Tu veux ce look ?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6 font-[var(--font-display)] font-black uppercase leading-tight tracking-tighter"
          style={{ fontSize: "clamp(36px,7vw,80px)", color: "var(--v-text)" }}
        >
          Recr&eacute;e le
          <br />
          look avec nous
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-10 text-sm leading-relaxed"
          style={{ color: "var(--v-muted)" }}
        >
          Envoie-nous un message et on t&rsquo;aide &agrave; assembler le look exact &mdash; taille, couleur, disponibilit&eacute;.
          Notre &eacute;quipe r&eacute;pond en moins de 30 minutes.
        </motion.p>

        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 rounded-2xl px-8 py-5 text-sm font-black uppercase tracking-widest"
          style={{ backgroundColor: "#25D366", color: "#000" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Recr&eacute;er ce look sur WhatsApp
        </motion.a>

        <p className="mt-4 text-[11px]" style={{ color: "var(--v-dim)" }}>
          R&eacute;ponse garantie sous 30 min &mdash; Lun-Dim, 9h-21h
        </p>
      </div>
    </section>
  );
}
