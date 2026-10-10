import { apiGet } from "@/lib/api";
import type { AuditLog, Role } from "@/types";

export type AuditParams = {
  page?: number;
  limit?: number;
  action?: string;
  boutiqueId?: string;
  role?: Role;
  search?: string;
  /** AAAA-MM-JJ, inclus. */
  dateDebut?: string;
  /** AAAA-MM-JJ, inclus. */
  dateFin?: string;
};

export const getAuditLogs = (params?: AuditParams) => apiGet<AuditLog[]>("/super-admin/audit-logs", params);

/** Les actions présentes dans le journal, pour le filtre. */
export const getAuditActions = () => apiGet<string[]>("/super-admin/audit-logs/actions");
