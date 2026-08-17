"use client";

import Link from "next/link";
import { getWhatsappUrl } from "@/lib/whatsapp";

const FOOTER_LINKS = [
  {
    group: "Shop",
    items: [
      { href: "/catalogue", label: "Catalogue" },
      { href: "/lookbook", label: "Le Style" },
    ],
  },
  {
    group: "À propos",
    items: [
      { href: "/marque", label: "La Marque" },
      { href: "/marque#contact", label: "Contact" },
    ],
  },
];

const WA_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function VitrineFooter() {
  const waUrl = getWhatsappUrl("Bonjour Dri Valé, j'ai une question !");

  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s1)" }}
    >
      {/* Top statement */}
      <div
        className="border-b py-10 text-center"
        style={{ borderColor: "var(--v-border)" }}
      >
        <p
          className="font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(28px, 6vw, 64px)", color: "var(--v-text)" }}
        >
          Yop City.{" "}
          <span style={{ color: "var(--v-gold)" }}>On est l&agrave;.</span>
        </p>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm font-bold" style={{ color: "var(--v-gold)" }}>
          <span>★</span>
          <span>Sortez toujours bien habill&eacute;</span>
          <span>★</span>
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--v-muted)" }}>
          Dri Val&eacute; &mdash; La boutique des jeunes class&eacute;s de Yopougon.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p
              className="font-[var(--font-display)] text-xl font-black tracking-[0.18em]"
              style={{ color: "var(--v-text)" }}
            >
              DRI VAL&Eacute;
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
              V&ecirc;tements et accessoires import&eacute;s.
              <br />
              Yopougon &middot; Abidjan &mdash; C&ocirc;te d&rsquo;Ivoire.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all hover:bg-[#25D366] hover:text-black hover:border-[#25D366]"
              style={{ color: "#25D366", borderColor: "rgba(37,211,102,0.3)" }}
            >
              {WA_ICON}
              WhatsApp direct
            </a>
            <p className="mt-3 text-[11px]" style={{ color: "var(--v-dim)" }}>
              R&eacute;ponse garantie sous 30 min &mdash; Lun-Dim, 9h-21h
            </p>
          </div>

          {/* Liens */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.group}>
              <p
                className="mb-5 text-[10px] font-black uppercase tracking-[0.28em]"
                style={{ color: "var(--v-gold)" }}
              >
                {group.group}
              </p>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors hover:text-[var(--v-text)]"
                      style={{ color: "var(--v-muted)" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p
              className="mb-5 text-[10px] font-black uppercase tracking-[0.28em]"
              style={{ color: "var(--v-gold)" }}
            >
              Nous trouver
            </p>
            <ul className="space-y-3 text-sm" style={{ color: "var(--v-muted)" }}>
              <li>
                <p>Oasis Ananeraie, Yopougon</p>
                <a
                  href="tel:+2250710444625"
                  className="text-xs font-bold transition-colors hover:text-[#25D366]"
                  style={{ color: "var(--v-dim)" }}
                >
                  07 10 44 46 25
                </a>
              </li>
              <li>
                <p>Toit rouge, Yopougon</p>
                <a
                  href="tel:+2250767602389"
                  className="text-xs font-bold transition-colors hover:text-[#25D366]"
                  style={{ color: "var(--v-dim)" }}
                >
                  07 67 60 23 89
                </a>
              </li>
              <li className="pt-2" style={{ color: "var(--v-dim)", fontSize: "11px" }}>
                24h/24 &bull; 7j/7
              </li>
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold transition-colors hover:text-[#25D366]"
                >
                  +225 07 09 29 44 68
                </a>
              </li>
            </ul>

            {/* Paiements */}
            <div className="mt-6">
              <p
                className="mb-2 text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: "var(--v-dim)" }}
              >
                On accepte
              </p>
              <div className="flex flex-wrap gap-2">
                {["Wave", "Orange Money", "Cash"].map((m) => (
                  <span
                    key={m}
                    className="rounded-md px-2.5 py-1 text-[10px] font-bold"
                    style={{ backgroundColor: "var(--v-s2)", color: "var(--v-muted)", border: "1px solid var(--v-border)" }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-8 text-xs"
          style={{ borderColor: "var(--v-border)", color: "var(--v-dim)" }}
        >
          <span>&copy; 2026 Dri Val&eacute; Boutique. Tous droits r&eacute;serv&eacute;s.</span>
          <span className="font-bold tracking-wider" style={{ color: "var(--v-gold)" }}>
            YOP CITY &hearts;
          </span>
        </div>
      </div>
    </footer>
  );
}
