"use client";

import { motion } from "framer-motion";

export function MarqueManifesto() {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      <div className="mx-auto max-w-4xl px-5 md:px-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-[10px] font-black uppercase tracking-[0.5em]"
          style={{ color: "var(--v-gold)" }}
        >
          Notre manifeste
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12 space-y-5 text-base leading-relaxed md:text-lg"
          style={{ color: "var(--v-muted)" }}
        >
          <p>
            Dri Val&eacute;, c&rsquo;est n&eacute; d&rsquo;un constat simple : &agrave; Yopougon, trouver des v&ecirc;tements
            de qualit&eacute; &agrave; prix juste relevait du parcours du combattant. On importait de loin, on payait
            des interm&eacute;diaires, on recevait des produits qui ne ressemblaient pas aux photos.
          </p>
          <p>
            On a d&eacute;cid&eacute; de changer &ccedil;a. Apporter directement des pi&egrave;ces authentiques &mdash;
            ensembles, casquettes, maroquinerie, parfumerie &mdash; import&eacute;es et soigneusement
            s&eacute;lectionn&eacute;es. Un rapport direct entre la boutique et ceux qui portent.
          </p>
          <p>
            Dri Val&eacute;, c&rsquo;est Yopougon. Notre quartier, notre terrain, notre inspiration premi&egrave;re.
            On livre &agrave; Abidjan et partout en C&ocirc;te d&rsquo;Ivoire.
          </p>
        </motion.div>

        {/* Citation */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative border-l-4 py-6 pl-8"
          style={{ borderColor: "var(--v-gold)" }}
        >
          <p
            className="font-[var(--font-display)] font-black leading-tight tracking-tight"
            style={{ fontSize: "clamp(22px,4vw,40px)", color: "var(--v-text)" }}
          >
            &ldquo;La mode est un langage.
            <br />
            Dri Val&eacute; te donne les mots.&rdquo;
          </p>
          <footer className="mt-4 text-sm font-bold" style={{ color: "var(--v-gold)" }}>
            &mdash; Dri Val&eacute; Boutique, Yopougon Abidjan
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
