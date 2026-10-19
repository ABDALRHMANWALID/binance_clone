"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getPaymentMethods } from "@/app/lib/chatApi";
import ChatInput from "../../components/ChatInput";
import ChatMessages from "../../components/ChatMessages";
import OrderActions from "../../components/OrderActions";
import OrderDetails from "../../components/OrderDetails";
import { useOrderChat } from "../../hooks/useOrderChat";
import { isOpen } from "../../orderUi";
import type { PaymentMethod } from "../../types";

export default function OrderChatPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  const chat = useOrderChat(orderId);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    getPaymentMethods()
      .then(setMethods)
      .catch(() => {});
  }, []);

  if (chat.loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-center text-slate-400">
        Loading...
      </main>
    );
  }

  if (chat.error || !chat.order || !chat.conversationId || !chat.myId) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-center">
        <p className="text-red-400">{chat.error || "Order not found"}</p>
        <Link
          href="/p2p"
          className="mt-4 inline-block text-sm text-yellow-400 hover:underline"
        >
          Back to P2P
        </Link>
      </main>
    );
  }

  const { order } = chat;
  const open = isOpen(order.status);
  const paymentMethodName = methods.find(
    (m) => m.id === order.paymentMethodId,
  )?.name;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <Link
                href="/p2p"
                className="text-slate-400 hover:text-white"
                aria-label="Back"
              >
                ←
              </Link>

              <div>
                <h1 className="font-semibold">
                  Chat with {chat.conversation?.counterpart ?? "the other side"}
                </h1>
                <p className="text-xs text-slate-500">
                  Order {order.id.slice(0, 8)}
                </p>
              </div>
            </div>

            <span
              className={`flex items-center gap-2 text-xs ${
                chat.connected ? "text-green-400" : "text-slate-500"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  chat.connected ? "bg-green-400" : "bg-slate-600"
                }`}
              />
              {chat.connected ? "Live" : "Reconnecting..."}
            </span>
          </div>

          <OrderActions
            order={order}
            conversationId={chat.conversationId}
            onOrderChange={chat.setOrder}
            onSync={chat.syncMissed}
          />

          <ChatMessages
            messages={chat.messages}
            myId={chat.myId}
            proofMessageId={order.paymentProofMessageId}
            hasMoreOlder={chat.hasMoreOlder}
            loadingOlder={chat.loadingOlder}
            onLoadOlder={chat.loadOlder}
            onRetry={chat.retry}
          />

          <ChatInput
            conversationId={chat.conversationId}
            disabled={!open}
            disabledReason={`This order is ${order.status}, so the chat is read-only.`}
            onSend={chat.send}
          />
        </div>

        <OrderDetails
          order={order}
          counterpart={chat.conversation?.counterpart}
          paymentMethodName={paymentMethodName}
        />
      </div>
    </main>
  );
}
