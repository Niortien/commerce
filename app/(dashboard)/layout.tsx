import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ApiErrorBoundary } from "@/components/common/ApiErrorBoundary";
import { AuthGuard } from "@/components/common/AuthGuard";
import { DashboardShell } from "@/components/common/DashboardShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ApiErrorBoundary>
      <AuthGuard>
        <DashboardShell>{children}</DashboardShell>
      </AuthGuard>
    </ApiErrorBoundary>
  );
}
