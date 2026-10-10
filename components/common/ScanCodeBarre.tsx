"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { IconBarcode } from "@tabler/icons-react";

interface ScanCodeBarreProps {
  isOpen: boolean;
  onClose: () => void;
  /** Code lu (caméra) ou tapé. Le composant se ferme après une lecture. */
  onCode: (code: string) => void;
  titre?: string;
}

const FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "itf", "qr_code"];

type Etat = "demarrage" | "lecture" | "refus" | "indisponible";

/**
 * Lecture d'un code-barres à la caméra du téléphone.
 * Utilise le lecteur intégré au navigateur quand il existe (Chrome Android), sinon la bibliothèque
 * ZXing chargée à la demande (iPhone, Firefox). Un lecteur USB ou Bluetooth n'a pas besoin de ce
 * composant : il tape le code dans le champ de recherche, suivi d'Entrée.
 */
export function ScanCodeBarre({ isOpen, onClose, onCode, titre = "Scanner un code-barres" }: ScanCodeBarreProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [etat, setEtat] = useState<Etat>("demarrage");
  const [saisie, setSaisie] = useState("");
  const onCodeRef = useRef(onCode);
  onCodeRef.current = onCode;

  useEffect(() => {
    if (!isOpen) return;
    let arrete = false;
    let flux: MediaStream | null = null;
    let minuterie: number | null = null;
    let arreterZxing: (() => void) | null = null;
    setEtat("demarrage");

    const trouve = (code: string) => {
      if (arrete) return;
      arrete = true;
      navigator.vibrate?.(60);
      onCodeRef.current(code.trim());
    };

    const demarrer = async () => {
      const video = videoRef.current;
      if (!video || !navigator.mediaDevices?.getUserMedia) {
        setEtat("indisponible");
        return;
      }
      try {
        const Detecteur = window.BarcodeDetector;
        const formatsNatifs = Detecteur ? await Detecteur.getSupportedFormats() : [];
        if (Detecteur && formatsNatifs.length > 0) {
          flux = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
          if (arrete) return;
          video.srcObject = flux;
          await video.play();
          setEtat("lecture");
          const detecteur = new Detecteur({ formats: FORMATS.filter((f) => formatsNatifs.includes(f)) });
          minuterie = window.setInterval(async () => {
            if (arrete || video.readyState < 2) return;
            const [premier] = await detecteur.detect(video).catch(() => []);
            if (premier?.rawValue) trouve(premier.rawValue);
          }, 250);
          return;
        }

        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        if (arrete) return;
        const lecteur = new BrowserMultiFormatReader();
        const controles = await lecteur.decodeFromConstraints(
          { video: { facingMode: { ideal: "environment" } }, audio: false },
          video,
          (resultat) => {
            if (resultat) trouve(resultat.getText());
          }
        );
        arreterZxing = () => controles.stop();
        if (arrete) arreterZxing();
        else setEtat("lecture");
      } catch (e) {
        if (arrete) return;
        const refus = e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError");
        setEtat(refus ? "refus" : "indisponible");
      }
    };
    void demarrer();

    return () => {
      arrete = true;
      if (minuterie !== null) window.clearInterval(minuterie);
      arreterZxing?.();
      flux?.getTracks().forEach((t) => t.stop());
    };
  }, [isOpen]);

  const valider = () => {
    const code = saisie.trim();
    if (!code) return;
    setSaisie("");
    onCode(code);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      classNames={{ wrapper: "z-[1100]", backdrop: "z-[1050]", base: "bg-[var(--color-surface)] border border-border" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 text-md font-semibold">
          <IconBarcode size={20} aria-hidden />
          {titre}
        </ModalHeader>
        <ModalBody className="gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--color-surface-high)]">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline aria-label="Image de la caméra" />
            {etat === "lecture" && (
              <div aria-hidden className="pointer-events-none absolute inset-x-[12%] top-1/2 h-24 -translate-y-1/2 rounded-md border-2 border-accent/80" />
            )}
            {etat === "demarrage" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner color="warning" label="Ouverture de la caméra…" />
              </div>
            )}
            {(etat === "refus" || etat === "indisponible") && (
              <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-text-muted">
                {etat === "refus"
                  ? "La caméra est bloquée. Autorise-la dans les réglages du navigateur, ou tape le code ci-dessous."
                  : "Pas de caméra utilisable sur cet appareil. Tape le code ci-dessous ou branche un lecteur."}
              </p>
            )}
          </div>
          <p className="text-xs text-text-muted" aria-live="polite">
            {etat === "lecture" ? "Place le code-barres dans le cadre, bien éclairé. La lecture est automatique." : " "}
          </p>
          <div className="flex gap-2">
            <Input
              aria-label="Code-barres tapé à la main"
              placeholder="Ou tape les chiffres du code"
              inputMode="numeric"
              value={saisie}
              onValueChange={setSaisie}
              onKeyDown={(e) => {
                if (e.key === "Enter") valider();
              }}
              variant="bordered"
            />
            <Button onPress={valider} isDisabled={!saisie.trim()} className="shrink-0">
              Valider
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
