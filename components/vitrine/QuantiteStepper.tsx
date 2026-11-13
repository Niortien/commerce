import { Button } from "@heroui/react";
import { IconMinus, IconPlus } from "@tabler/icons-react";

interface Props {
  valeur: number;
  onChange: (n: number) => void;
  libelle: string;
  max?: number;
}

/** Choix d'une quantité avec − et +, utilisable au pouce sur téléphone. Angles droits, comme toute la vitrine. */
export function QuantiteStepper({ valeur, onChange, libelle, max = 99 }: Props) {
  return (
    <div role="group" aria-label={libelle} className="inline-flex items-center bg-fa-sol-pas">
      <Button
        isIconOnly
        radius="none"
        variant="light"
        disableRipple
        aria-label="Retirer un"
        isDisabled={valeur <= 1}
        onPress={() => onChange(valeur - 1)}
        className="h-11 w-11 min-w-11 text-fa-encre data-[hover=true]:bg-transparent data-[pressed=true]:scale-90"
      >
        <IconMinus size={18} stroke={2.2} aria-hidden />
      </Button>
      <span className="min-w-8 text-center text-base font-semibold tabular-nums" aria-live="polite">
        {valeur}
      </span>
      <Button
        isIconOnly
        radius="none"
        variant="light"
        disableRipple
        aria-label="Ajouter un"
        isDisabled={valeur >= max}
        onPress={() => onChange(valeur + 1)}
        className="h-11 w-11 min-w-11 text-fa-encre data-[hover=true]:bg-transparent data-[pressed=true]:scale-90"
      >
        <IconPlus size={18} stroke={2.2} aria-hidden />
      </Button>
    </div>
  );
}
