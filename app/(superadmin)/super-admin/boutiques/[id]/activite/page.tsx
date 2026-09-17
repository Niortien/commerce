import { BoutiqueActiviteView } from "@/components/superadmin/BoutiqueActiviteView";

export default function SuperAdminBoutiqueActivitePage({ params }: { params: { id: string } }) {
  return <BoutiqueActiviteView boutiqueId={params.id} />;
}
