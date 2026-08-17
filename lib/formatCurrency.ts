const FCFA_LABEL = "FCFA";

function withNarrowNbsp(value: string): string {
  return value.replace(/\s/g, "\u202F");
}

export function formatCurrency(amount: string | number): string {
  const numericAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount;

  if (Number.isNaN(numericAmount)) {
    return `0\u202F${FCFA_LABEL}`;
  }

  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(numericAmount);

  return `${withNarrowNbsp(formatted)}\u202F${FCFA_LABEL}`;
}
