/** Garde uniquement les chiffres (et un « + » initial) pour un lien `tel:`. */
export function toTelHref(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  return `tel:${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}

/** Lien WhatsApp (`wa.me`) : exige l'indicatif pays, sans « + » ni espaces. */
export function toWhatsAppHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
