"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useAuthStore } from "@/stores/authStore";
import { Role } from "@/types";

/** Protège la plateforme Super Admin : réservée au rôle SUPER_ADMIN. */
export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.user?.role);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated());
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (role !== Role.SUPER_ADMIN) {
      router.replace("/stock");
    }
  }, [hydrated, token, role, router]);

  if (!hydrated || !token || role !== Role.SUPER_ADMIN) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return <>{children}</>;
}
