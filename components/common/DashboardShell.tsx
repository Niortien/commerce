"use client";

import type { ReactNode } from "react";
import { CommandBar } from "@/components/common/CommandBar";
import { ConsultationBanner } from "@/components/common/ConsultationBanner";
import { MetierGuard } from "@/components/common/MetierGuard";
import { MobileNav } from "@/components/common/MobileNav";
import { Sidebar } from "@/components/common/Sidebar";
import { SubscriptionBanner } from "@/components/common/SubscriptionBanner";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-base lg:flex-row">
      <MobileNav />
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <ConsultationBanner />
        <SubscriptionBanner />
        <main id="contenu" tabIndex={-1} className="relative flex-1 overflow-x-hidden overflow-y-auto p-4 outline-none md:p-6">
          <MetierGuard>{children}</MetierGuard>
        </main>
      </div>
      <CommandBar />
    </div>
  );
}
