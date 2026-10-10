"use client";

import { useMemo } from "react";
import { Spinner } from "@heroui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useConversations } from "@/features/chat/query/chat-queries";
import { useOpenConversation } from "@/features/chat/mutation/chat-mutations";
import { useSuperAdminUsers } from "@/features/super-admin/query/superadmin-queries";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { Role } from "@/types";
import { PhoneLink } from "@/components/common/PhoneLink";
import { ConversationList, type ConversationListItem } from "./ConversationList";
import { MessageComposer } from "./MessageComposer";
import { MessageThread } from "./MessageThread";

function ThreadPane({ title, phone, conversationId, unreadCount, onBack }: {
  title: string;
  phone?: string | null;
  conversationId: string;
  unreadCount: number;
  onBack?: () => void;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label={`Conversation avec ${title}`}>
      <header className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Retour aux conversations"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg hover:bg-surface-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:hidden"
          >
            <IconArrowLeft size={20} aria-hidden />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-text">{title}</h2>
          {phone && <PhoneLink phone={phone} />}
        </div>
      </header>
      <MessageThread conversationId={conversationId} unreadCount={unreadCount} />
      <MessageComposer conversationId={conversationId} />
    </section>
  );
}

/** Super Admin : liste de tous les admins + fil. */
function SuperAdminChat() {
  const { data: convRes, isLoading } = useConversations();
  const { data: usersRes } = useSuperAdminUsers({ role: "ADMIN" });
  const open = useOpenConversation();
  const activeAdminId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActiveConversation);

  const items = useMemo<ConversationListItem[]>(() => {
    const convs = convRes?.data ?? [];
    const byAdmin = new Map(convs.map((c) => [c.admin.id, c]));
    const admins = (usersRes?.data ?? []).filter((u) => u.role === "ADMIN");
    return admins.map((u) => {
      const c = byAdmin.get(u.id);
      return {
        adminId: u.id,
        conversationId: c?.id ?? null,
        admin: { email: u.email, boutique: u.boutique ? { id: u.boutique.id, nom: u.boutique.nom } : null },
        preview: c?.lastMessage?.body ?? "",
        unreadCount: c?.unreadCount ?? 0,
      };
    });
  }, [convRes, usersRes]);

  const active = items.find((i) => i.adminId === activeAdminId) ?? null;
  const phone = (usersRes?.data ?? []).find((u) => u.id === activeAdminId)?.telephone ?? null;

  const select = (item: ConversationListItem) => {
    setActive(item.adminId);
    if (!item.conversationId) open.mutate(item.adminId);
  };

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner color="warning" /></div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-border bg-surface md:h-[calc(100vh-3rem)]">
      <aside className={`w-full shrink-0 overflow-y-auto border-r border-border md:block md:w-80 ${active ? "hidden" : "block"}`}>
        <ConversationList items={items} activeAdminId={activeAdminId} onSelect={select} />
      </aside>
      <div className={`min-w-0 flex-1 flex-col ${active ? "flex" : "hidden md:flex"}`}>
        {active?.conversationId ? (
          <ThreadPane
            title={active.admin.boutique?.nom ?? active.admin.email}
            phone={phone}
            conversationId={active.conversationId}
            unreadCount={active.unreadCount}
            onBack={() => setActive(null)}
          />
        ) : (
          <p className="m-auto p-4 text-sm text-text-muted">
            {active ? "Ouverture de la conversation…" : "Choisis un admin pour discuter."}
          </p>
        )}
      </div>
    </div>
  );
}

/** Admin : un seul fil, avec le Super Admin. */
function AdminChat() {
  const { data, isLoading } = useConversations();
  const conversation = data?.data[0];

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner color="warning" /></div>;
  if (!conversation) {
    return <p className="p-6 text-sm text-text-muted">Messagerie indisponible pour le moment.</p>;
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-lg border border-border bg-surface lg:h-[calc(100vh-3rem)]">
      <ThreadPane title="Support Mon Djossi" conversationId={conversation.id} unreadCount={conversation.unreadCount} />
    </div>
  );
}

export function ChatView() {
  const role = useAuthStore((s) => s.user?.role);
  if (role === Role.SUPER_ADMIN) return <SuperAdminChat />;
  if (role === Role.ADMIN) return <AdminChat />;
  return <p className="p-6 text-sm text-text-muted">La messagerie est réservée aux admins.</p>;
}
