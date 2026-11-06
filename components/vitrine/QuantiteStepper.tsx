import { Button } from "@heroui/react";
import { IconMinus, IconPlus } from "@tabler/icons-react";

interface Props {
  valeur: number;
  onChange: (n: number) => void;
  libelle: string;
  max?: number;
}

/** Choix d'une quantité avec − et +, utilisable au pouce sur téléphone. */
export function QuantiteStepper({ valeur, onChange, libelle, max = 99 }: Props) {
  return (
    <div role="group" aria-label={libelle} className="inline-flex items-center rounded-full bg-surface-high">
      <Button
        isIconOnly
        radius="full"
        variant="light"
        aria-label="Retirer un"
        isDisabled={valeur <= 1}
        onPress={() => onChange(valeur - 1)}
        className="h-10 w-10 min-w-10 active:scale-90"
      >
        <IconMinus size={16} aria-hidden />
      </Button>
      <span className="min-w-8 text-center text-base font-semibold tabular-nums text-text" aria-live="polite">
        {valeur}
      </span>
      <Button
        isIconOnly
        radius="full"
        variant="light"
        aria-label="Ajouter un"
        isDisabled={valeur >= max}
        onPress={() => onChange(valeur + 1)}
        className="h-10 w-10 min-w-10 active:scale-90"
      >
        <IconPlus size={16} aria-hidden />
      </Button>
    </div>
  );
}
