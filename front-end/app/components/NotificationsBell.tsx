"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getConversations } from "@/app/lib/chatApi";
import { CHAT_EVENTS, getChatSocket } from "@/app/lib/chatSocket";
import { actionHint, STATUS_LABEL, STATUS_STYLE } from "@/app/p2p/orderUi";
import type { ConversationListItem } from "@/app/p2p/types";

const timeAgo = (iso: string) => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

const preview = (item: ConversationListItem) => {
  const last = item.lastMessage;
  if (!last) return "Order started";
  if (last.content) return last.content;
  return last.type === "image" ? "📷 Image" : "📎 File";
};

export default function NotificationsBell() {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [items, setItems] = useState<ConversationListItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getConversations(10);
      setItems(data.items);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleReload = useCallback(() => {
    if (reloadTimer.current) clearTimeout(reloadTimer.current);
    reloadTimer.current = setTimeout(() => void load(), 300);
  }, [load]);

  useEffect(() => {
    void load();

    const socket = getChatSocket();
    if (!socket) return;

    socket.on("connect", scheduleReload);
    socket.on(CHAT_EVENTS.UNREAD_UPDATED, scheduleReload);
    socket.on(CHAT_EVENTS.CONVERSATION_CREATED, scheduleReload);
    socket.on(CHAT_EVENTS.ORDER_UPDATED, scheduleReload);

    return () => {
      socket.off("connect", scheduleReload);
      socket.off(CHAT_EVENTS.UNREAD_UPDATED, scheduleReload);
      socket.off(CHAT_EVENTS.CONVERSATION_CREATED, scheduleReload);
      socket.off(CHAT_EVENTS.ORDER_UPDATED, scheduleReload);
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
    };
  }, [load, scheduleReload]);

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const needsUser = (item: ConversationListItem) =>
    item.unreadCount > 0 || actionHint(item.role, item.order.status) !== null;

  const attention = items.filter(needsUser).length;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-yellow-400 hover:text-yellow-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {attention > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {attention > 9 ? "9+" : attention}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white">
            Notifications
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                Loading...
              </p>
            )}

            {!loading && items.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                No conversations yet.
              </p>
            )}

            {items.map((item) => {
              const hint = actionHint(item.role, item.order.status);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(`/p2p/order/${item.orderId}`);
                  }}
                  className="block w-full border-b border-slate-800 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-800/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-white">
                      {item.role === "buyer" ? "Buying" : "Selling"}{" "}
                      {item.order.amount} {item.order.asset}
                    </span>
                    <span className="shrink-0 text-[11px] text-slate-500">
                      {timeAgo(item.updatedAt)}
                    </span>
                  </div>

                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-slate-400">
                      {item.counterpart}: {preview(item)}
                    </span>

                    {item.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400 px-1 text-[11px] font-bold text-slate-950">
                        {item.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${STATUS_STYLE[item.order.status]}`}
                    >
                      {STATUS_LABEL[item.order.status]}
                    </span>

                    {hint && (
                      <span className="text-[11px] font-semibold text-yellow-400">
                        {hint}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
