"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Cartes du guide déjà vues sur cet appareil, et la dernière position, pour reprendre où on s'était arrêté.
 * Rien n'est envoyé au serveur : c'est un simple repère personnel.
 */
interface Etat {
  vues: string[];
  chapitre: number;
  carte: number;
  /** A déjà fait glisser une carte : on n'affiche plus l'indication « glisse ». */
  aGlisse: boolean;
}

const VIDE: Etat = { vues: [], chapitre: 0, carte: 0, aGlisse: false };

function lire(cle: string): Etat {
  try {
    const brut = window.localStorage.getItem(cle);
    if (!brut) return VIDE;
    const o: unknown = JSON.parse(brut);
    if (typeof o !== "object" || o === null) return VIDE;
    return {
      vues: "vues" in o && Array.isArray(o.vues) ? o.vues.filter((x): x is string => typeof x === "string") : [],
      chapitre: "chapitre" in o && typeof o.chapitre === "number" ? o.chapitre : 0,
      carte: "carte" in o && typeof o.carte === "number" ? o.carte : 0,
      aGlisse: "aGlisse" in o && o.aGlisse === true,
    };
  } catch {
    return VIDE;
  }
}

export function useGuideProgression(slug: string) {
  const cle = `mon-djossi-guide-${slug}`;
  const [etat, setEtat] = useState<Etat>(VIDE);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    setEtat(lire(cle));
    setPret(true);
  }, [cle]);

  useEffect(() => {
    if (!pret) return;
    try {
      window.localStorage.setItem(cle, JSON.stringify(etat));
    } catch {
      // Stockage indisponible (navigation privée) : la progression n'est simplement pas gardée.
    }
  }, [cle, etat, pret]);

  const aller = useCallback((chapitre: number, carte: number) => setEtat((e) => ({ ...e, chapitre, carte })), []);
  const marquerVue = useCallback(
    (id: string) => setEtat((e) => (e.vues.includes(id) ? e : { ...e, vues: [...e.vues, id] })),
    []
  );
  const noterGlisse = useCallback(() => setEtat((e) => (e.aGlisse ? e : { ...e, aGlisse: true })), []);

  return { ...etat, pret, aller, marquerVue, noterGlisse };
}
