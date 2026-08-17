import { VitrineRoot } from "@/components/vitrine/layout/VitrineRoot";
import { VitrineNav } from "@/components/vitrine/layout/VitrineNav";
import { VitrineFooter } from "@/components/vitrine/layout/VitrineFooter";
import { CartDrawer } from "@/components/vitrine/layout/CartDrawer";

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <VitrineRoot>
      <VitrineNav />
      <main className="pt-16">{children}</main>
      <VitrineFooter />
      <CartDrawer />
    </VitrineRoot>
  );
}
