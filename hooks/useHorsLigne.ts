"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { onlineManager, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getProduits } from "@/features/produits/api/produits-api";
import { envoyerVenteHorsLigne } from "@/features/sorties/api/sorties-api";
import { getActiveSession } from "@/features/caisse/api/caisse-api";
import { useAuthStore } from "@/stores/authStore";
import { useHorsLigneStore } from "@/stores/horsLigneStore";
import { Role, type AppError, type Produit } from "@/types";

function subscribe(callback: () => void) {
  return onlineManager.subscribe(callback);
}

/** true tant que l'appareil a du réseau (même source que TanStack Query, qui met ses requêtes en pause sinon). */
export function useEnLigne(): boolean {
  return useSyncExternalStore(subscribe, () => onlineManager.isOnline(), () => true);
}

function estAppError(e: unknown): e is AppError {
  return typeof e === "object" && e !== null && "code" in e && "message" in e;
}

const PAGES_MAX = 10;
const PAR_PAGE = 200;
/** Copie du catalogue rafraîchie au plus toutes les 10 minutes. */
const FRAICHEUR_CATALOGUE_MS = 10 * 60_000;
const INTERVALLE_ENVOI_MS = 30_000;

async function chargerCatalogue(boutiqueId: string): Promise<Produit[]> {
  const produits: Produit[] = [];
  for (let page = 1; page <= PAGES_MAX; page++) {
    const { data, meta } = await getProduits({ page, limit: PAR_PAGE, boutiqueId, isActif: true });
    // Les photos ne servent pas à la caisse : on ne les garde pas sur l'appareil.
    produits.push(...data.map((p) => ({ ...p, images: undefined, description: null })));
    const pages = meta.totalPages ?? meta.pageCount ?? 1;
    if (page >= pages) break;
  }
  return produits;
}

/**
 * Tenu par le tableau de bord : garde la copie du catalogue et l'état de la caisse à jour,
 * puis envoie les ventes faites hors connexion dès que le réseau revient (et toutes les 30 s).
 * Une vente refusée par le serveur (stock, caisse…) reste sur l'appareil avec son motif.
 */
export function useSynchroHorsLigne(): void {
  const enLigne = useEnLigne();
  const user = useAuthStore((s) => s.user);
  const consultation = useAuthStore((s) => s.consultation);
  const qc = useQueryClient();
  const enCours = useRef(false);

  const boutiqueId = user?.boutiqueId ?? null;
  const actif = Boolean(boutiqueId) && !consultation && (user?.role === Role.ADMIN || user?.role === Role.CAISSIER);

  const synchroniser = useCallback(async () => {
    if (!actif || !boutiqueId || enCours.current || !onlineManager.isOnline()) return;
    enCours.current = true;
    try {
      const store = useHorsLigneStore.getState();
      const aEnvoyer = store.ventes.filter((v) => v.boutiqueId === boutiqueId && v.erreur === null);
      let envoyees = 0;
      for (const vente of aEnvoyer) {
        try {
          await envoyerVenteHorsLigne(vente.corps);
          useHorsLigneStore.getState().retirerVente(vente.corps.clientRef);
          envoyees++;
        } catch (e) {
          if (estAppError(e) && e.reseau) break; // Réseau reparti : on réessaiera plus tard.
          useHorsLigneStore.getState().marquerErreur(vente.corps.clientRef, estAppError(e) ? e.message : "Envoi refusé");
        }
      }
      if (envoyees > 0) {
        toast.success(envoyees > 1 ? `${envoyees} ventes faites hors connexion envoyées` : "Vente faite hors connexion envoyée");
        await Promise.all([
          qc.invalidateQueries({ queryKey: ["sorties"] }),
          qc.invalidateQueries({ queryKey: ["caisse"] }),
          qc.invalidateQueries({ queryKey: ["stock"] }),
          qc.invalidateQueries({ queryKey: ["produits"] }),
        ]);
      }

      const { data: session } = await getActiveSession(boutiqueId);
      useHorsLigneStore.getState().memoriserCaisse(boutiqueId, Boolean(session));

      const { catalogueMajLe, boutiqueId: boutiqueCopie } = useHorsLigneStore.getState();
      const perimee = !catalogueMajLe || boutiqueCopie !== boutiqueId || Date.now() - Date.parse(catalogueMajLe) > FRAICHEUR_CATALOGUE_MS;
      if (perimee || envoyees > 0) {
        useHorsLigneStore.getState().memoriserCatalogue(boutiqueId, await chargerCatalogue(boutiqueId));
      }
    } catch {
      // Hors ligne ou serveur indisponible : la copie précédente reste valable.
    } finally {
      enCours.current = false;
    }
  }, [actif, boutiqueId, qc]);

  useEffect(() => {
    if (enLigne) void synchroniser();
  }, [enLigne, synchroniser]);

  useEffect(() => {
    const id = window.setInterval(() => void synchroniser(), INTERVALLE_ENVOI_MS);
    return () => window.clearInterval(id);
  }, [synchroniser]);
}
