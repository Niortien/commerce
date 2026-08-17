import { ProduitDetailView } from "@/components/produits/ProduitDetailView";

interface ProduitDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProduitDetailPage({ params }: ProduitDetailPageProps) {
  return <ProduitDetailView id={params.id} />;
}
