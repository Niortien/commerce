import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ApiErrorBoundary } from "@/components/common/ApiErrorBoundary";
import { SuperAdminGuard } from "@/components/common/SuperAdminGuard";
import { SuperAdminShell } from "@/components/common/SuperAdminShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <ApiErrorBoundary>
      <SuperAdminGuard>
        <SuperAdminShell>{children}</SuperAdminShell>
      </SuperAdminGuard>
    </ApiErrorBoundary>
  );
}
