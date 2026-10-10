import { BalleDetailView } from "@/components/balles/BalleDetailView";

interface BalleDetailPageProps {
  params: {
    id: string;
  };
}

export default function BalleDetailPage({ params }: BalleDetailPageProps) {
  return <BalleDetailView id={params.id} />;
}
