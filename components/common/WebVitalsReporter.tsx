"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { ajouterMesure, envoyerMesures, type MesureNavigateur } from "@/lib/webVitals";

const ACTIF = process.env.NODE_ENV === "production";

/**
 * Vitesse réelle du site : chaque visiteur mesure sa propre visite (affichage principal, réaction
 * au toucher, stabilité…) et l'envoie en quittant la page. Rien de personnel n'est transmis.
 * Lecture des résultats : Super Admin › Vitesse du site.
 */
export function WebVitalsReporter() {
  useReportWebVitals((mesure: MesureNavigateur) => {
    if (ACTIF) ajouterMesure(mesure);
  });

  useEffect(() => {
    if (!ACTIF) return;
    const siCachee = () => {
      if (document.visibilityState === "hidden") envoyerMesures();
    };
    // Enregistrés après ceux de web-vitals : les dernières valeurs (CLS, INP) sont déjà dans la file.
    document.addEventListener("visibilitychange", siCachee);
    window.addEventListener("pagehide", envoyerMesures);
    return () => {
      document.removeEventListener("visibilitychange", siCachee);
      window.removeEventListener("pagehide", envoyerMesures);
    };
  }, []);

  return null;
}
