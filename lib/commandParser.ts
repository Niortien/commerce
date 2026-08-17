import { ModePaiement, Taille, TypeSortie } from "@/types";
import type { ParsedCommand } from "@/types";
import { formatCurrency } from "./formatCurrency";

const TAILLE_VALUES = new Set(Object.values(Taille));

function parseTaille(token?: string): Taille | undefined {
  if (!token) return undefined;
  const normalized = token.toUpperCase();
  return TAILLE_VALUES.has(normalized as Taille) ? (normalized as Taille) : undefined;
}

function parseModePaiement(token?: string): ModePaiement | undefined {
  if (!token) return undefined;

  const normalized = token.trim().toLowerCase();
  if (normalized === "cash") return ModePaiement.CASH;
  if (normalized === "wave") return ModePaiement.WAVE;
  if (normalized === "orange" || normalized === "orange_money") return ModePaiement.ORANGE_MONEY;
  if (normalized === "mtn" || normalized === "mtn_money") return ModePaiement.MTN_MONEY;
  if (normalized === "carte") return ModePaiement.CARTE;

  return undefined;
}

export function parseCommand(rawInput: string): ParsedCommand | null {
  const raw = rawInput.trim();
  if (!raw) return null;

  if (raw.startsWith("?")) {
    const terme = raw.slice(1).trim();
    if (!terme) return null;
    return { action: "RECHERCHE", raw, terme };
  }

  if (raw.toLowerCase() === "!cloture" || raw.toLowerCase() === "!clôture") {
    return { action: "FERMETURE_CAISSE", raw };
  }

  if (raw.startsWith("$")) {
    const tokens = raw.slice(1).trim().split(/\s+/);
    const montant = tokens[0];
    const modePaiement = parseModePaiement(tokens[1]);
    const referenceToken = tokens.find((token) => token.startsWith("ref:"));

    if (!/^\d+(\.\d{1,2})?$/.test(montant) || !modePaiement) return null;

    return {
      action: "TRANSACTION",
      raw,
      montant,
      modePaiement,
      reference: referenceToken?.replace("ref:", "") || undefined,
      preview: `Transaction · ${formatCurrency(montant)} · ${modePaiement}`,
    };
  }

  const isEntree = raw.startsWith("+");
  const isSortie = raw.startsWith("-");

  if (!isEntree && !isSortie) return null;

  const chunks = raw.slice(1).trim().split(/\s+/);
  const quantite = Number.parseInt(chunks[0] || "", 10);
  const produitSearch = chunks[1];

  if (!Number.isInteger(quantite) || quantite <= 0 || !produitSearch) return null;

  const couleur = chunks[2];
  const taille = parseTaille(chunks[3]);
  const amountToken = chunks.find((token) => token.startsWith("@"));
  const prixUnitaire = amountToken?.slice(1);

  if (isEntree) {
    const previewMontant = prixUnitaire ? formatCurrency(String(quantite * Number.parseFloat(prixUnitaire))) : undefined;
    return {
      action: "ENTREE",
      raw,
      quantite,
      produitSearch,
      couleur,
      taille,
      prixUnitaire,
      preview: previewMontant
        ? `Entree · ${quantite}x ${produitSearch} ${couleur || ""} ${taille || ""} · ${previewMontant}`
        : `Entree · ${quantite}x ${produitSearch}`,
    };
  }

  return {
    action: "SORTIE",
    raw,
    type: TypeSortie.VENTE,
    quantite,
    produitSearch,
    couleur,
    taille,
    prixUnitaire,
    preview: `Sortie · ${quantite}x ${produitSearch} ${couleur || ""} ${taille || ""}`,
  };
}

// Inline parser examples:
// parseCommand("+5 jogging noir L @12000") => { action: "ENTREE", ... }
// parseCommand("-2 tshirt blanc M") => { action: "SORTIE", type: "VENTE", ... }
// parseCommand("$35000 wave ref:TXN-001") => { action: "TRANSACTION", ... }
// parseCommand("?jogging") => { action: "RECHERCHE", terme: "jogging" }
// parseCommand("!cloture") => { action: "FERMETURE_CAISSE" }
