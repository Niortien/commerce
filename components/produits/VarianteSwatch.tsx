interface VarianteSwatchProps {
  color: string;
}

export function VarianteSwatch({ color }: VarianteSwatchProps) {
  return <span className="inline-block h-5 w-5 rounded-full border border-border" style={{ backgroundColor: color }} />;
}
