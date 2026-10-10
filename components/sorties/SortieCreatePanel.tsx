"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Spinner } from "@heroui/react";
import { onlineManager } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getMotionVariant, panelSlide } from "@/lib/motionVariants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCreateSortie } from "@/features/sorties/mutation/sorties-mutations";
import { useAddTransaction } from "@/features/caisse/mutation/caisse-mutations";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { VariantePicker, type VarianteSelection } from "@/components/common/VariantePicker";
import { ModePaiement, ModeService, TypeCommerce, TypeSortie } from "@/types";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { UNITES, isVarianteUnique } from "@/lib/unites";
import { ModeServicePicker } from "./ModeServicePicker";
import { RecuPrint, type RecuLigne } from "./RecuPrint";
import { SortieTypeStep } from "./SortieTypeStep";
import { SortieFormLine, type SortieFormLineData } from "./SortieFormLine";
import { SortiePaiementStep } from "./SortiePaiementStep";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { CREDIT_VIDE, VenteCreditFields, erreurCredit, versOptionsCredit, type CreditSaisie } from "@/components/common/VenteCreditFields";
import { useClients } from "@/features/clients/query/clients-queries";
import { echeanceDans } from "@/lib/credit";
import type { RecuCredit } from "./RecuPrint";
import { useEnLigne } from "@/hooks/useHorsLigne";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import { nouvelleRefVente, useHorsLigneStore } from "@/stores/horsLigneStore";

/** Le serveur n'a pas répondu : la vente part dans la file hors connexion. */
function erreurReseau(e: unknown): boolean {
  return typeof e === "object" && e !== null && "reseau" in e && e.reseau === true;
}

interface RecuData {
  reference: string;
  date: string;
  lignes: RecuLigne[];
  totalMontant: string;
  modePaiement: ModePaiement;
  transactionReference?: string;
  montantRecu?: string;
  monnaieRendue?: string;
  remiseMontant?: string;
  totalAvantRemise?: string;
  credit?: RecuCredit;
}

const OPTIONS_REGLEMENT = [
  { key: "COMPTANT", label: "Comptant" },
  { key: "CREDIT", label: "À crédit" },
];

interface SortieCreatePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SortieCreatePanel({ isOpen, onClose }: SortieCreatePanelProps) {
  const reduced = useReducedMotion();
  const createSortieMutation = useCreateSortie();
  const addTransactionMutation = useAddTransaction();
  const { data: activeSessionData } = useActiveSession();
  const enLigne = useEnLigne();
  const boutiqueId = useBoutiqueId();
  const caisseOuverteHorsLigne = useHorsLigneStore((s) => s.caisseOuverte);
  const ajouterVenteHorsLigne = useHorsLigneStore((s) => s.ajouterVente);
  // Sans réseau, on se fie au dernier état connu de la caisse.
  const hasActiveSession = !!(activeSessionData?.data) || (!enLigne && caisseOuverteHorsLigne);
  const typeCommerce = useTypeCommerce();
  const isRestaurant = typeCommerce === TypeCommerce.RESTAURANT;
  // Quincaillerie : un client pro peut emporter la marchandise et payer plus tard.
  const creditPossible = typeCommerce === TypeCommerce.QUINCAILLERIE;
  const [reglement, setReglement] = useState("COMPTANT");
  const [credit, setCredit] = useState<CreditSaisie>(CREDIT_VIDE);
  const { data: clientsRes } = useClients({ actifs: true }, creditPossible);
  const [modeService, setModeService] = useState<ModeService>(ModeService.SUR_PLACE);
  const [tableLabel, setTableLabel] = useState("");

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<TypeSortie | null>(null);
  const [sortieNotes, setSortieNotes] = useState("");
  const [lines, setLines] = useState<SortieFormLineData[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [recuOpen, setRecuOpen] = useState(false);
  const [recuData, setRecuData] = useState<RecuData | null>(null);

  const [dateOperation, setDateOperation] = useState("");

  // Montant (uniquement pour DEPENSE)
  const [depenseMontant, setDepenseMontant] = useState("");

  // Remise (uniquement pour VENTE)
  const [remiseMontant, setRemiseMontant] = useState("");
  const [remiseTaux, setRemiseTaux] = useState("");

  // Paiement state (step 3) — lifted here pour le footer
  const [paiementMode, setPaiementMode] = useState<ModePaiement | null>(null);
  const [paiementRef, setPaiementRef] = useState("");
  const [paiementNotes, setPaiementNotes] = useState("");
  const [paiementMontantRecu, setPaiementMontantRecu] = useState("");

  const isPending = createSortieMutation.isPending || addTransactionMutation.isPending;
  const isDepense = selectedType === TypeSortie.DEPENSE;

  const totalAvantRemise = lines
    .reduce((sum, l) => sum + l.quantite * parseFloat(l.prixUnitaire || "0"), 0);

  const remiseNum = parseFloat(remiseMontant || "0");
  const remiseDepasse = remiseNum > totalAvantRemise;
  const totalMontant = Math.max(0, totalAvantRemise - remiseNum).toFixed(0);
  const hasRemise = selectedType === TypeSortie.VENTE && remiseNum > 0 && !remiseDepasse;

  const montantInsuffisant =
    paiementMode === ModePaiement.CASH &&
    paiementMontantRecu !== "" &&
    parseFloat(paiementMontantRecu) < parseFloat(totalMontant);

  const aCredit = creditPossible && reglement === "CREDIT";
  const clientCredit = clientsRes?.data.find((c) => c.id === credit.clientId);
  const blocageCredit = aCredit ? erreurCredit(credit, Number(totalMontant), clientCredit) : null;
  const paiementPret = aCredit ? !blocageCredit : Boolean(paiementMode) && !montantInsuffisant;

  const handleReset = () => {
    setStep(1);
    setSelectedType(null);
    setSortieNotes("");
    setLines([]);
    setPickerOpen(false);
    setReplacingIndex(null);
    setRecuData(null);
    setDateOperation("");
    setDepenseMontant("");
    setRemiseMontant("");
    setRemiseTaux("");
    setPaiementMode(null);
    setPaiementRef("");
    setPaiementNotes("");
    setPaiementMontantRecu("");
    setModeService(ModeService.SUR_PLACE);
    setTableLabel("");
    setReglement("COMPTANT");
    setCredit(CREDIT_VIDE);
  };

  const handleRemiseMontant = (val: string) => {
    if (!/^\d*$/.test(val)) return;
    setRemiseMontant(val);
    if (val !== "" && totalAvantRemise > 0) {
      setRemiseTaux(((parseFloat(val) / totalAvantRemise) * 100).toFixed(1));
    } else {
      setRemiseTaux("");
    }
  };

  const handleRemiseTaux = (val: string) => {
    if (!/^\d*\.?\d{0,1}$/.test(val)) return;
    setRemiseTaux(val);
    if (val !== "" && totalAvantRemise > 0) {
      setRemiseMontant(((parseFloat(val) / 100) * totalAvantRemise).toFixed(0));
    } else {
      setRemiseMontant("");
    }
  };

  const addLine = (sel: VarianteSelection) => {
    const prixUnitaire =
      selectedType === TypeSortie.VENTE ? sel.prixVente : sel.prixAchat;
    const newLine: SortieFormLineData = {
      varianteId: sel.varianteId,
      produitNom: sel.produitNom,
      taille: sel.taille,
      couleur: sel.couleur,
      quantiteStock: sel.quantiteStock,
      quantite: 1,
      prixUnitaire,
      unite: sel.unite,
      nature: sel.nature,
      pieceUnique: sel.pieceUnique,
    };
    if (replacingIndex !== null) {
      setLines((cur) => cur.map((l, i) => (i === replacingIndex ? newLine : l)));
      setReplacingIndex(null);
    } else {
      setLines((cur) => [...cur, newLine]);
    }
  };

  const handleLineChange = (
    index: number,
    field: "quantite" | "prixUnitaire",
    value: string | number
  ) => {
    setLines((cur) =>
      cur.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const handleLineRemove = (index: number) => {
    setLines((cur) => cur.filter((_, i) => i !== index));
  };

  const openPickerToReplace = (index: number) => {
    setReplacingIndex(index);
    setPickerOpen(true);
  };

  const handleTypeConfirm = () => {
    if (!selectedType) return;
    if (selectedType === TypeSortie.VENTE && !hasActiveSession) {
      toast.error("Ouvre une session caisse avant de créer une vente.");
      return;
    }
    setStep(2);
  };

  const handleLignesConfirm = () => {
    if (lines.length === 0) {
      toast.error("Ajoute au moins un article.");
      return;
    }
    if (remiseDepasse) {
      toast.error("La remise dépasse le total.");
      return;
    }
    if (selectedType === TypeSortie.VENTE) {
      setStep(3);
    } else {
      createSortieMutation.mutate(
        {
          type: selectedType!,
          notes: sortieNotes.trim() || undefined,
          dateOperation: dateOperation || undefined,
          lignes: lines.map((l) => ({
            varianteId: l.varianteId,
            quantite: l.quantite,
            prixUnitaire: parseFloat(l.prixUnitaire || "0").toFixed(2),
          })),
        },
        {
          onSuccess: () => {
            toast.success("Sortie enregistrée !");
            handleReset();
            onClose();
          },
        }
      );
    }
  };

  const handleDepenseConfirm = () => {
    const montantNum = parseFloat(depenseMontant || "0");
    if (!sortieNotes.trim()) {
      toast.error("Décris la dépense.");
      return;
    }
    if (!(montantNum > 0)) {
      toast.error("Indique un montant valide.");
      return;
    }
    createSortieMutation.mutate(
      {
        type: TypeSortie.DEPENSE,
        notes: sortieNotes.trim(),
        montant: montantNum.toFixed(2),
        dateOperation: dateOperation || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Dépense enregistrée !");
          handleReset();
          onClose();
        },
      }
    );
  };

  /** Vente à crédit : l'acompte éventuel entre en caisse côté serveur ; le reste va au compte du client. */
  const handleVenteCredit = async () => {
    const options = versOptionsCredit(credit);
    if (!options || blocageCredit || !clientCredit) return;
    try {
      const { data: sortie } = await createSortieMutation.mutateAsync({
        type: TypeSortie.VENTE,
        notes: sortieNotes.trim() || undefined,
        remiseMontant: hasRemise ? parseFloat(remiseMontant).toFixed(2) : undefined,
        lignes: lines.map((l) => ({
          varianteId: l.varianteId,
          quantite: l.quantite,
          prixUnitaire: parseFloat(l.prixUnitaire || "0").toFixed(2),
        })),
        ...options,
      });
      const acompte = Number(options.acompteMontant ?? 0);
      setRecuData({
        reference: sortie.reference,
        date: sortie.createdAt,
        lignes: lines.map((l) => ({
          produitNom: l.produitNom,
          taille: isVarianteUnique(l) ? UNITES[l.unite].singulier : l.taille,
          couleur: isVarianteUnique(l) ? "" : l.couleur,
          quantite: l.quantite,
          prixUnitaire: l.prixUnitaire,
          sousTotal: (l.quantite * parseFloat(l.prixUnitaire || "0")).toFixed(0),
        })),
        totalMontant: sortie.totalMontant,
        modePaiement: options.acompteMode ?? ModePaiement.CASH,
        remiseMontant: sortie.remiseMontant ?? undefined,
        totalAvantRemise: sortie.totalAvantRemise ?? undefined,
        credit: {
          client: clientCredit.nom,
          acompte,
          acompteMode: options.acompteMode,
          reste: Number(sortie.totalMontant) - acompte,
          echeance: echeanceDans(options.echeanceJours),
        },
      });
      setRecuOpen(true);
      toast.success(`Vente mise sur le compte de ${clientCredit.nom}`);
    } catch {
      // Message d'erreur affiché par la mutation (plafond dépassé, stock insuffisant…).
    }
  };

  const handleVenteSubmit = async () => {
    if (aCredit) {
      if (!onlineManager.isOnline()) {
        toast.error("La vente à crédit demande internet : encaisse comptant ou attends le retour du réseau.");
        return;
      }
      await handleVenteCredit();
      return;
    }
    if (!paiementMode || montantInsuffisant) return;
    const modePaye = paiementMode;

    const recuNum = parseFloat(paiementMontantRecu || "0");
    const totalNum = parseFloat(totalMontant || "0");
    const monnaieRendue =
      paiementMode === ModePaiement.CASH && paiementMontantRecu !== ""
        ? (recuNum - totalNum).toFixed(0)
        : undefined;

    const clientRef = nouvelleRefVente();
    const remise = hasRemise ? parseFloat(remiseMontant).toFixed(2) : undefined;
    const corps = {
      notes: sortieNotes.trim() || undefined,
      remiseMontant: remise,
      modeService: isRestaurant ? modeService : undefined,
      tableLabel: isRestaurant && modeService === ModeService.SUR_PLACE ? tableLabel.trim() || undefined : undefined,
      lignes: lines.map((l) => ({
        varianteId: l.varianteId,
        quantite: l.quantite,
        prixUnitaire: parseFloat(l.prixUnitaire || "0").toFixed(2),
      })),
    };

    const recuLignes: RecuLigne[] = lines.map((l) => ({
      produitNom: l.produitNom,
      // Produit sans taille ni couleur : le reçu montre son unité (kg, m, portion…).
      taille: isVarianteUnique(l) ? UNITES[l.unite].singulier : l.taille,
      couleur: isVarianteUnique(l) ? "" : l.couleur,
      quantite: l.quantite,
      prixUnitaire: l.prixUnitaire,
      sousTotal: (l.quantite * parseFloat(l.prixUnitaire || "0")).toFixed(0),
    }));

    /** Pas de réseau : la vente est gardée sur l'appareil et partira toute seule au retour d'internet. */
    const garderHorsLigne = () => {
      if (!boutiqueId) return;
      const venduLe = new Date().toISOString();
      ajouterVenteHorsLigne({
        boutiqueId,
        corps: { ...corps, clientRef, venduLe, modePaiement: modePaye },
        resume: lines.map((l) => `${l.quantite} × ${l.produitNom}`).join(", "),
        total: totalMontant,
        erreur: null,
      });
      setRecuData({
        reference: `HL-${clientRef.slice(0, 8).toUpperCase()}`,
        date: venduLe,
        lignes: recuLignes,
        totalMontant,
        modePaiement: modePaye,
        transactionReference: "hors connexion, envoi en attente",
        montantRecu: paiementMontantRecu || undefined,
        monnaieRendue,
        remiseMontant: remise,
        totalAvantRemise: hasRemise ? totalAvantRemise.toFixed(2) : undefined,
      });
      setRecuOpen(true);
      toast.success("Pas de réseau : vente gardée sur l'appareil. Elle sera envoyée dès le retour d'internet.");
    };

    if (!onlineManager.isOnline()) {
      garderHorsLigne();
      return;
    }

    let sortie;
    try {
      ({ data: sortie } = await createSortieMutation.mutateAsync({ type: TypeSortie.VENTE, clientRef, ...corps }));
    } catch (e) {
      // Le serveur n'a pas répondu : la même référence évite un doublon si la vente était quand même arrivée.
      if (erreurReseau(e)) garderHorsLigne();
      // Sinon le message du serveur est affiché par la mutation (stock, caisse…).
      return;
    }

    let transactionRef: string | undefined;
    try {
      const { data: tx } = await addTransactionMutation.mutateAsync({
        montant: sortie.totalMontant,
        modePaiement: modePaye,
        sortieId: sortie.id,
        reference: paiementRef || undefined,
        notes: paiementNotes || undefined,
      });
      transactionRef = tx.reference ?? undefined;
    } catch (e) {
      if (erreurReseau(e)) {
        // La vente est arrivée, pas son paiement : le renvoi complétera le paiement sans doubler la vente.
        garderHorsLigne();
        return;
      }
      toast("Paiement non enregistré — vente créée", { icon: "⚠️" });
    }

    setRecuData({
      reference: sortie.reference,
      date: sortie.createdAt,
      lignes: recuLignes,
      totalMontant: sortie.totalMontant,
      modePaiement: modePaye,
      transactionReference: transactionRef,
      montantRecu: paiementMontantRecu || undefined,
      monnaieRendue,
      remiseMontant: sortie.remiseMontant ?? undefined,
      totalAvantRemise: sortie.totalAvantRemise ?? undefined,
    });
    setRecuOpen(true);
    toast.success("Vente enregistrée !");
  };

  const handleRecuClose = () => {
    setRecuOpen(false);
    handleReset();
    onClose();
  };

  const STEP_LABELS: Record<number, string> = { 1: "Type", 2: "Articles", 3: "Paiement" };

  if (!isOpen) return null;

  return (
    <>
      <VariantePicker
        isOpen={pickerOpen}
        onClose={() => { setPickerOpen(false); setReplacingIndex(null); }}
        onSelect={addLine}
        excludedVarianteIds={replacingIndex !== null ? [] : lines.map((l) => l.varianteId)}
      />

      {recuData && (
        <RecuPrint
          isOpen={recuOpen}
          onClose={handleRecuClose}
          reference={recuData.reference}
          date={recuData.date}
          lignes={recuData.lignes}
          totalMontant={recuData.totalMontant}
          modePaiement={recuData.modePaiement}
          transactionReference={recuData.transactionReference}
          montantRecu={recuData.montantRecu}
          monnaieRendue={recuData.monnaieRendue}
          remiseMontant={recuData.remiseMontant}
          totalAvantRemise={recuData.totalAvantRemise}
          credit={recuData.credit}
        />
      )}

      <div className="fixed inset-0 z-[700] bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <motion.aside
        initial="hidden"
        animate="visible"
        variants={getMotionVariant(panelSlide, reduced)}
        className="fixed inset-y-0 right-0 z-[800] flex w-full max-w-[520px] flex-col border-l border-border bg-[linear-gradient(180deg,rgba(81,34,68,0.95),rgba(23,28,58,0.98))]"
        role="dialog"
        aria-modal="true"
        aria-label="Nouvelle sortie"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl text-[var(--color-out)]">Nouvelle sortie</h3>
            <span className="rounded-full bg-[var(--color-surface-high)] px-2 py-0.5 text-[10px] uppercase text-text-muted">
              {STEP_LABELS[step]} {step}/3
            </span>
          </div>
          <Button isIconOnly variant="light" onPress={onClose} aria-label="Fermer">✕</Button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <SortieTypeStep selected={selectedType} onSelect={setSelectedType} />
              {selectedType === TypeSortie.VENTE && !hasActiveSession && (
                <div className="flex items-start gap-3 rounded-lg border border-[var(--color-out)]/50 bg-[var(--color-out-dim)] p-3">
                  <span className="mt-0.5 text-base">⚠</span>
                  <div className="text-sm">
                    <p className="font-semibold text-[var(--color-out)]">Aucune session caisse ouverte</p>
                    <p className="mt-0.5 text-text-muted">
                      Une vente nécessite une session active.{" "}
                      <Link href="/caisse" className="text-accent underline" onClick={onClose}>Ouvrir la caisse →</Link>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              {selectedType && (
                <p className="text-xs uppercase tracking-wide text-text-muted">
                  Type : <span className="font-semibold text-[var(--color-out)]">{selectedType}</span>
                </p>
              )}
              {isRestaurant && selectedType === TypeSortie.VENTE && (
                <ModeServicePicker
                  mode={modeService}
                  table={tableLabel}
                  onModeChange={setModeService}
                  onTableChange={setTableLabel}
                />
              )}
              {!isDepense && (
                <Input
                  variant="underlined"
                  placeholder="Notes (optionnel)"
                  value={sortieNotes}
                  onValueChange={setSortieNotes}
                  size="sm"
                  classNames={{ input: "text-sm text-text-muted" }}
                />
              )}
              {selectedType !== TypeSortie.VENTE && (
                <Input
                  type="date"
                  variant="underlined"
                  label="Date de l'opération (si différente d'aujourd'hui)"
                  value={dateOperation}
                  onValueChange={setDateOperation}
                  max={new Date().toISOString().split("T")[0]}
                  size="sm"
                  classNames={{ input: "text-sm", label: "text-xs text-text-dim" }}
                />
              )}

              {isDepense ? (
                <section className="space-y-3 rounded-lg border border-border/80 bg-[color:rgba(81,34,68,0.25)] p-4">
                  <p className="text-xs uppercase tracking-wide text-text-muted">Détails de la dépense</p>
                  <Input
                    variant="bordered"
                    label="Description"
                    placeholder="Ex : nourriture, don à un employé..."
                    value={sortieNotes}
                    onValueChange={setSortieNotes}
                    size="sm"
                    isRequired
                  />
                  <Input
                    size="sm"
                    variant="bordered"
                    label="Montant"
                    placeholder="0"
                    value={depenseMontant}
                    onValueChange={(v) => { if (/^\d*$/.test(v)) setDepenseMontant(v); }}
                    inputMode="numeric"
                    isRequired
                    endContent={<span className="shrink-0 text-xs text-text-dim">FCFA</span>}
                  />
                </section>
              ) : (
                <section className="rounded-lg border border-border/80 bg-[color:rgba(81,34,68,0.25)] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-text-muted">Produits</p>
                    {lines.length > 0 && (
                      <span className="[font-family:var(--font-mono)] text-xs text-[var(--color-out)]">
                        Sous-total : {totalAvantRemise.toLocaleString("fr-FR")} FCFA
                      </span>
                    )}
                  </div>
                  {lines.length > 0 && (
                    <div className="mb-1 grid grid-cols-[1fr_70px_90px_32px] gap-1.5 px-3 sm:grid-cols-[1fr_80px_100px_80px_32px] sm:gap-2">
                      <span className="text-[10px] text-text-muted">Produit</span>
                      <span className="text-[10px] text-text-muted">Qté</span>
                      <span className="text-[10px] text-text-muted">Prix unit.</span>
                      <span className="hidden text-right text-[10px] text-text-muted sm:block">S/Total</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {lines.map((line, i) => (
                      <SortieFormLine
                        key={`${line.varianteId}-${i}`}
                        line={line}
                        index={i}
                        onPickVariante={() => openPickerToReplace(i)}
                        onChange={handleLineChange}
                        onRemove={handleLineRemove}
                      />
                    ))}
                  </div>
                  <Button
                    variant="flat"
                    className="mt-3 w-full border border-dashed border-accent/40 bg-[var(--color-accent-dim)] text-accent"
                    onPress={() => { setReplacingIndex(null); setPickerOpen(true); }}
                  >
                    + Ajouter un article
                  </Button>
                </section>
              )}

              {/* Section remise — uniquement pour VENTE */}
              {selectedType === TypeSortie.VENTE && lines.length > 0 && (
                <section className="rounded-lg border border-border/60 bg-[var(--color-surface-high)] p-3">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Réduction (optionnel)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      size="sm"
                      variant="bordered"
                      label="Montant"
                      placeholder="0"
                      value={remiseMontant}
                      onValueChange={handleRemiseMontant}
                      inputMode="numeric"
                      endContent={<span className="shrink-0 text-xs text-text-dim">FCFA</span>}
                      isInvalid={remiseDepasse}
                      errorMessage={remiseDepasse ? "Dépasse le total" : undefined}
                    />
                    <Input
                      size="sm"
                      variant="bordered"
                      label="Taux"
                      placeholder="0"
                      value={remiseTaux}
                      onValueChange={handleRemiseTaux}
                      inputMode="decimal"
                      endContent={<span className="shrink-0 text-xs text-text-dim">%</span>}
                    />
                  </div>
                  {hasRemise && (
                    <div className="mt-2.5 flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2 text-xs">
                      <span className="text-text-muted">
                        {totalAvantRemise.toLocaleString("fr-FR")} − {remiseNum.toLocaleString("fr-FR")}
                      </span>
                      <span className="[font-family:var(--font-mono)] font-bold text-[var(--color-cash)]">
                        = {Number(totalMontant).toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {/* Step 3 */}
          {step === 3 && creditPossible && (
            <SegmentedControl ariaLabel="Mode de règlement" options={OPTIONS_REGLEMENT} value={reglement} onChange={setReglement} className="mb-4" />
          )}
          {step === 3 && aCredit && (
            <VenteCreditFields total={Number(totalMontant)} valeur={credit} onChange={setCredit} />
          )}
          {step === 3 && !aCredit && (
            <SortiePaiementStep
              totalMontant={totalMontant}
              totalAvantRemise={hasRemise ? totalAvantRemise.toFixed(0) : undefined}
              remiseMontant={hasRemise ? remiseMontant : undefined}
              selected={paiementMode}
              onSelect={setPaiementMode}
              reference={paiementRef}
              onChangeReference={setPaiementRef}
              notes={paiementNotes}
              onChangeNotes={setPaiementNotes}
              montantRecu={paiementMontantRecu}
              onChangeMontantRecu={setPaiementMontantRecu}
            />
          )}
        </div>

        {/* Footer — toujours visible */}
        <div className="shrink-0 border-t border-border/60 p-4 pb-6">
          {step === 1 && (
            <Button
              className="w-full bg-[var(--color-out)] font-semibold text-white"
              size="lg"
              isDisabled={!selectedType || (selectedType === TypeSortie.VENTE && !hasActiveSession)}
              onPress={handleTypeConfirm}
            >
              Continuer →
            </Button>
          )}

          {step === 2 && (
            <div className="space-y-2">
              {hasRemise && (
                <div className="flex justify-between px-1 text-xs text-text-muted">
                  <span>Sous-total {totalAvantRemise.toLocaleString("fr-FR")} · Remise −{remiseNum.toLocaleString("fr-FR")}</span>
                  <span className="[font-family:var(--font-mono)] font-semibold text-[var(--color-cash)]">
                    {Number(totalMontant).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="flat" className="flex-1 text-text-muted" onPress={() => setStep(1)} isDisabled={isPending}>
                  ← Retour
                </Button>
                <Button
                  className="flex-1 bg-[var(--color-out)] font-semibold text-white"
                  size="lg"
                  isDisabled={
                    isDepense
                      ? !sortieNotes.trim() || !(parseFloat(depenseMontant || "0") > 0) || isPending
                      : lines.length === 0 || isPending || remiseDepasse
                  }
                  isLoading={isPending && selectedType !== TypeSortie.VENTE}
                  onPress={isDepense ? handleDepenseConfirm : handleLignesConfirm}
                >
                  {isPending ? (
                    <Spinner size="sm" color="current" />
                  ) : selectedType === TypeSortie.VENTE ? (
                    "Continuer → Paiement"
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-3">
              <Button
                variant="flat"
                className="flex-1 text-text-muted"
                onPress={() => {
                  setPaiementMode(null);
                  setPaiementRef("");
                  setPaiementNotes("");
                  setPaiementMontantRecu("");
                  setReglement("COMPTANT");
                  setCredit(CREDIT_VIDE);
                  setStep(2);
                }}
                isDisabled={isPending}
              >
                ← Retour
              </Button>
              <Button
                className="flex-1 bg-accent font-semibold text-white"
                size="lg"
                isDisabled={!paiementPret || isPending}
                isLoading={isPending}
                onPress={() => void handleVenteSubmit()}
              >
                {isPending ? <Spinner size="sm" color="current" /> : aCredit ? "Vendre à crédit" : "Enregistrer la vente"}
              </Button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
