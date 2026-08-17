import type { ReactNode } from "react";
import { ApiErrorBoundary } from "@/components/common/ApiErrorBoundary";
import { AuthGuard } from "@/components/common/AuthGuard";
import { DashboardShell } from "@/components/common/DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ApiErrorBoundary>
      <AuthGuard>
        <DashboardShell>{children}</DashboardShell>
      </AuthGuard>
    </ApiErrorBoundary>
  );
}
