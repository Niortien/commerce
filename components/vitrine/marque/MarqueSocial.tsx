"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SOCIALS = [
  {
    name: "WhatsApp",
    handle: "+225 07 09 29 44 68",
    color: "#25D366",
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2250709294468"}`,
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    handle: "Luxury Boutique",
    color: "#1877F2",
    href: "https://web.facebook.com/mirnalmahmoudzorkot1/",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.459h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
      </svg>
    ),
  },
];

export function MarqueSocial() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      className="py-24"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      <div className="mx-auto max-w-5xl px-5 md:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]"
          style={{ color: "var(--v-lime)" }}
        >
          Reste connecté
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-16 font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(32px,6vw,64px)", color: "var(--v-text)" }}
        >
          Follow the
          <br />
          <span style={{ color: "var(--v-lime)" }}>Luxury Boutique</span>
        </motion.h2>

        {/* Socials */}
        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {SOCIALS.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-5 rounded-2xl border p-6 transition-colors"
              style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s1)" }}
            >
              <div style={{ color: social.color }}>{social.icon}</div>
              <div>
                <p className="font-black text-sm" style={{ color: "var(--v-text)" }}>
                  {social.name}
                </p>
                <p className="text-xs" style={{ color: "var(--v-muted)" }}>
                  {social.handle}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 md:p-12"
          style={{ backgroundColor: "var(--v-s1)", border: `1px solid var(--v-border)` }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]"
            style={{ color: "var(--v-lime)" }}
          >
            Newsletter
          </p>
          <h3
            className="mb-3 font-black uppercase leading-tight"
            style={{ fontSize: "clamp(20px,3vw,36px)", color: "var(--v-text)" }}
          >
            Nouveautés en avant-première
          </h3>
          <p className="mb-8 text-sm" style={{ color: "var(--v-muted)" }}>
            Inscris-toi pour recevoir les nouveautés exclusives, les nouvelles collections et les offres avant tout le monde.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl px-6 py-4 text-center"
              style={{ backgroundColor: "rgba(200,118,44,0.1)", border: "1px solid var(--v-lime)" }}
            >
              <p className="text-sm font-black" style={{ color: "var(--v-lime)" }}>
                Bienvenue dans la famille Luxury Boutique ✓
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--v-lime)] sm:rounded-r-none placeholder:text-[var(--v-dim)]"
                style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-xl px-6 py-3 text-sm font-black uppercase tracking-wider transition-all hover:opacity-90 sm:rounded-l-none"
                style={{ backgroundColor: "var(--v-lime)", color: "#fff" }}
              >
                S&apos;inscrire
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
