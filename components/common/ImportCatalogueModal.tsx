"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { IconAlertTriangle, IconCircleCheck, IconDownload, IconFileSpreadsheet } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useImporterCatalogue } from "@/features/produits/mutation/produits-mutations";
import type { LigneImportCatalogue, RapportImportCatalogue } from "@/features/produits/api/produits-api";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { lireCatalogue, lireTableau, modeleCatalogue, type LectureCatalogue } from "@/lib/importCatalogue";
import type { AppError } from "@/types";

const MAX_LIGNES = 1000;
const APERCU = 6;

interface ImportCatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function estAppError(e: unknown): e is AppError {
  return typeof e === "object" && e !== null && "code" in e && "message" in e;
}

/** Excel enregistre souvent ses CSV en Windows-1252 : si le texte n'est pas de l'UTF-8 valide, on relit autrement. */
async function lireTexte(fichier: File): Promise<string> {
  const octets = await fichier.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(octets);
  } catch {
    return new TextDecoder("windows-1252").decode(octets);
  }
}

/** Valeur d'une cellule Excel en texte (nombre, date ou texte). */
function texteCellule(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

/** Feuille Excel (.xlsx) : la 1re feuille du classeur, lue dans le navigateur. */
async function lireExcel(fichier: File): Promise<LectureCatalogue> {
  const { default: readXlsxFile } = await import("read-excel-file");
  const lignes = await readXlsxFile(fichier);
  return lireTableau(lignes.map((l) => l.map(texteCellule)));
}

function telecharger(nom: string, contenu: string) {
  const url = URL.createObjectURL(new Blob([contenu], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nom;
  a.click();
  URL.revokeObjectURL(url);
}

function Bilan({ rapport }: { rapport: RapportImportCatalogue }) {
  const chiffres = [
    { n: rapport.produitsCrees, texte: "nouveaux articles" },
    { n: rapport.variantesCreees, texte: "tailles / variantes créées" },
    { n: rapport.stocksAjoutes, texte: "lignes de stock ajoutées" },
    { n: rapport.categoriesCreees, texte: "nouvelles catégories" },
  ];
  return (
    <dl className="grid grid-cols-2 gap-2">
      {chiffres.map((c) => (
        <div key={c.texte} className="rounded-lg bg-[var(--color-surface-high)] px-3 py-2">
          <dt className="text-xs text-text-muted">{c.texte}</dt>
          <dd className="font-mono text-lg font-semibold text-text">{c.n}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Import d'un catalogue depuis un fichier CSV (Excel, Google Sheets…).
 * 1. on télécharge le modèle de son type de commerce et on le remplit ;
 * 2. on choisit le fichier : l'appareil le lit et le serveur vérifie tout sans rien enregistrer ;
 * 3. on confirme : articles, catégories et stock de départ sont créés d'un coup.
 */
export function ImportCatalogueModal({ isOpen, onClose }: ImportCatalogueModalProps) {
  const type = useTypeCommerce();
  const champFichier = useRef<HTMLInputElement>(null);
  const [nomFichier, setNomFichier] = useState<string | null>(null);
  const [lecture, setLecture] = useState<LectureCatalogue | null>(null);
  const [apercu, setApercu] = useState<RapportImportCatalogue | null>(null);
  const [resultat, setResultat] = useState<RapportImportCatalogue | null>(null);
  const [fournisseur, setFournisseur] = useState("");
  const importer = useImporterCatalogue();

  const fermer = () => {
    setNomFichier(null);
    setLecture(null);
    setApercu(null);
    setResultat(null);
    setFournisseur("");
    onClose();
  };

  const verifier = async (lignes: LigneImportCatalogue[]) => {
    try {
      const { data } = await importer.mutateAsync({ lignes, simulation: true });
      setApercu(data);
    } catch (e) {
      toast.error(estAppError(e) ? e.message : "Vérification impossible");
    }
  };

  const choisirFichier = async (fichier: File | undefined) => {
    if (!fichier) return;
    setApercu(null);
    setResultat(null);
    setNomFichier(fichier.name);
    if (/\.xls$/i.test(fichier.name)) {
      setLecture(null);
      toast.error("Ancien format Excel (.xls) : dans Excel, Fichier › Enregistrer sous › Classeur Excel (.xlsx), puis recommence.");
      return;
    }
    let lu: LectureCatalogue;
    try {
      lu = /\.xlsx$/i.test(fichier.name) ? await lireExcel(fichier) : lireCatalogue(await lireTexte(fichier));
    } catch {
      setLecture(null);
      toast.error("Fichier illisible. Vérifie qu'il s'agit bien d'un tableau Excel (.xlsx) ou d'un fichier CSV.");
      return;
    }
    setLecture(lu);
    if (lu.colonnesManquantes.length > 0 || lu.lignes.length === 0 || lu.lignes.length > MAX_LIGNES) return;
    await verifier(lu.lignes);
  };

  const lancer = async () => {
    if (!lecture) return;
    try {
      const { data } = await importer.mutateAsync({ lignes: lecture.lignes, fournisseur: fournisseur.trim() || undefined });
      setResultat(data);
      toast.success("Catalogue importé");
    } catch (e) {
      toast.error(estAppError(e) ? e.message : "Import impossible");
    }
  };

  const lignesValides = apercu ? (lecture?.lignes.length ?? 0) - apercu.erreurs.length : 0;
  const bloque = !lecture || lecture.colonnesManquantes.length > 0 || lecture.lignes.length === 0 || lecture.lignes.length > MAX_LIGNES;

  return (
    <Modal isOpen={isOpen} onClose={fermer} size="2xl" scrollBehavior="inside" classNames={{ base: "bg-[var(--color-surface)] border border-border" }}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Importer un catalogue
          <span className="text-xs font-normal text-text-muted">
            Ajoute des centaines d&apos;articles d&apos;un coup depuis un tableau Excel, au lieu de les saisir un par un.
          </span>
        </ModalHeader>

        <ModalBody className="gap-4">
          {resultat ? (
            <div className="space-y-4" role="status">
              <p className="flex items-center gap-2 text-sm font-medium text-in-text">
                <IconCircleCheck size={20} aria-hidden /> Import terminé.
              </p>
              <Bilan rapport={resultat} />
              {resultat.entreeReference && (
                <p className="text-sm text-text-muted">
                  Le stock de départ est enregistré comme une entrée de marchandise ({resultat.entreeReference}) :{" "}
                  <Link href="/entrees" className="text-accent underline" onClick={fermer}>
                    voir les entrées
                  </Link>
                  .
                </p>
              )}
              {resultat.erreurs.length > 0 && (
                <p className="text-sm text-out-text">{resultat.erreurs.length} ligne(s) écartée(s) : corrige-les dans le fichier et réimporte-le, les articles déjà créés ne seront pas doublés.</p>
              )}
            </div>
          ) : (
            <>
              <ol className="space-y-3 text-sm">
                <li className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-text">1. Télécharge le modèle et remplis-le dans Excel ou Google Sheets.</span>
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<IconDownload size={16} aria-hidden />}
                    onPress={() => telecharger("modele-catalogue.csv", modeleCatalogue(type))}
                  >
                    Télécharger le modèle
                  </Button>
                </li>
                <li className="text-text-muted">
                  Une ligne par article. Même nom sur plusieurs lignes = plusieurs tailles ou couleurs d&apos;un même article.
                  Les catégories inconnues sont créées. Colonnes obligatoires : Nom, Catégorie, Prix de vente.
                </li>
                <li className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-text">2. Choisis ton fichier Excel (.xlsx) ou CSV.</span>
                  <Button
                    size="sm"
                    className="bg-accent font-semibold text-white"
                    startContent={<IconFileSpreadsheet size={16} aria-hidden />}
                    onPress={() => champFichier.current?.click()}
                    isLoading={importer.isPending && !apercu}
                  >
                    Choisir le fichier
                  </Button>
                  <input
                    ref={champFichier}
                    type="file"
                    accept=".xlsx,.csv,.txt,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xls"
                    className="sr-only"
                    aria-label="Fichier du catalogue"
                    onChange={(e) => {
                      void choisirFichier(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  {nomFichier && <span className="truncate font-mono text-xs text-text-muted">{nomFichier}</span>}
                </li>
              </ol>

              {lecture && lecture.colonnesManquantes.length > 0 && (
                <p role="alert" className="flex gap-2 rounded-lg bg-out-dim p-3 text-sm text-out-text">
                  <IconAlertTriangle size={18} className="shrink-0" aria-hidden />
                  Colonnes introuvables : {lecture.colonnesManquantes.join(", ")}. La 1re ligne du fichier doit porter les titres du modèle.
                </p>
              )}
              {lecture && lecture.lignes.length > MAX_LIGNES && (
                <p role="alert" className="rounded-lg bg-out-dim p-3 text-sm text-out-text">
                  {lecture.lignes.length} lignes : coupe le fichier en morceaux de {MAX_LIGNES} lignes au plus.
                </p>
              )}
              {lecture && lecture.colonnesIgnorees.length > 0 && (
                <p className="text-xs text-text-muted">Colonnes ignorées : {lecture.colonnesIgnorees.join(", ")}.</p>
              )}

              {lecture && lecture.lignes.length > 0 && !bloque && (
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-left text-xs">
                    <caption className="sr-only">Premières lignes du fichier</caption>
                    <thead className="bg-[var(--color-surface-high)] text-text-muted">
                      <tr>
                        <th scope="col" className="px-2 py-1.5 font-medium">Nom</th>
                        <th scope="col" className="px-2 py-1.5 font-medium">Catégorie</th>
                        <th scope="col" className="px-2 py-1.5 text-right font-medium">Prix</th>
                        <th scope="col" className="px-2 py-1.5 text-right font-medium">Qté</th>
                        <th scope="col" className="px-2 py-1.5 font-medium">Variante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lecture.lignes.slice(0, APERCU).map((l, i) => (
                        <tr key={i} className="border-t border-border/40">
                          <td className="px-2 py-1.5 text-text">{l.nom}</td>
                          <td className="px-2 py-1.5 text-text-muted">{l.categorie}</td>
                          <td className="px-2 py-1.5 text-right font-mono">{l.prixVente}</td>
                          <td className="px-2 py-1.5 text-right font-mono">{l.quantite || "0"}</td>
                          <td className="px-2 py-1.5 text-text-muted">{[l.taille, l.couleur].filter(Boolean).join(" · ") || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {lecture.lignes.length > APERCU && (
                    <p className="border-t border-border/40 px-2 py-1.5 text-xs text-text-muted">… et {lecture.lignes.length - APERCU} autres lignes</p>
                  )}
                </div>
              )}

              {apercu && (
                <div className="space-y-3" aria-live="polite">
                  <p className="text-sm font-medium text-text">3. Vérifie ce qui va être créé :</p>
                  <Bilan rapport={apercu} />
                  {apercu.erreurs.length > 0 && (
                    <div className="rounded-lg border border-out-line bg-out-dim p-3">
                      <p className="mb-1 text-sm font-medium text-out-text">
                        {apercu.erreurs.length} ligne(s) seront écartées :
                      </p>
                      <ul className="max-h-40 space-y-0.5 overflow-y-auto text-xs text-out-text">
                        {apercu.erreurs.map((e) => (
                          <li key={e.ligne}>
                            Ligne {e.ligne + 1} : {e.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Input
                    label="Fournisseur du stock de départ (facultatif)"
                    placeholder="Import du catalogue"
                    value={fournisseur}
                    onValueChange={setFournisseur}
                    variant="bordered"
                  />
                </div>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={fermer}>
            {resultat ? "Fermer" : "Annuler"}
          </Button>
          {!resultat && (
            <Button
              className="bg-in font-semibold text-white"
              isDisabled={bloque || !apercu || lignesValides <= 0}
              isLoading={importer.isPending && Boolean(apercu)}
              onPress={() => void lancer()}
            >
              {apercu ? `Importer ${lignesValides} ligne${lignesValides > 1 ? "s" : ""}` : "Importer"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
