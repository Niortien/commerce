import { ClientDetailView } from "@/components/clients/ClientDetailView";

interface ClientDetailPageProps {
  params: {
    id: string;
  };
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  return <ClientDetailView id={params.id} />;
}
