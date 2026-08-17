import { ProduitDetailView } from "@/components/vitrine/produit/ProduitDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BoutiqueProduitPage({ params }: Props) {
  const { id } = await params;
  return <ProduitDetailView id={id} />;
}
