"use client";

import { useState } from "react";
import { cancelOrder, confirmOrder, errorMessage } from "@/app/lib/chatApi";
import { useCountdown } from "../hooks/useCountdown";
import type { Order } from "../types";
import ConfirmDialog from "./ConfirmDialog";
import PayProofModal from "./PayProofModal";

interface Props {
  order: Order;
  conversationId: string;
  onOrderChange: (order: Order) => void;
  onSync: () => void;
}

type Dialog = "cancel" | "confirm" | null;

export default function OrderActions({
  order,
  conversationId,
  onOrderChange,
  onSync,
}: Props) {
  const countdown = useCountdown(
    order.status === "pending_payment" ? order.expiresAt : null,
  );

  const [dialog, setDialog] = useState<Dialog>(null);
  const [showProof, setShowProof] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (action: () => Promise<Order>) => {
    try {
      setBusy(true);
      setError("");
      onOrderChange(await action());
      setDialog(null);
    } catch (e) {
      setError(errorMessage(e, "The action failed"));
    } finally {
      setBusy(false);
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setError("");
  };

  const isBuyer = order.role === "buyer";
  const isSeller = order.role === "seller";

  let tone = "border-slate-800 bg-slate-950 text-slate-300";
  let title = "";
  let text = "";

  if (order.status === "pending_payment") {
    tone = "border-yellow-500/20 bg-yellow-500/5 text-yellow-400";
    if (isBuyer) {
      title = countdown.expired
        ? "Payment time is over"
        : `Pay within ${countdown.label}`;
      text = `Transfer ${order.fiatAmount} ${order.fiat} to the seller, then press "I have paid" and send the proof.`;
    } else {
      title = "Waiting for the buyer to pay";
      text = countdown.expired
        ? "The time is over. The order will be cancelled automatically."
        : `The order is cancelled automatically in ${countdown.label} if the buyer does not pay.`;
    }
  } else if (order.status === "paid") {
    tone = "border-blue-500/20 bg-blue-500/5 text-blue-400";
    if (isSeller) {
      title = "The buyer says the payment was sent";
      text =
        "Check the proof in the chat and your own account. Confirm only after the money arrived.";
    } else {
      title = "Waiting for the seller to confirm";
      text =
        "The seller received your proof and will release the crypto after checking the transfer.";
    }
  } else if (order.status === "completed") {
    tone = "border-green-500/20 bg-green-500/5 text-green-400";
    title = "Order completed";
    text = isBuyer
      ? `${order.amount} ${order.asset} was added to your balance.`
      : `${order.amount} ${order.asset} was released to the buyer.`;
  } else {
    title = "Order cancelled";
    text = "No funds were moved. The chat is read-only now.";
  }

  return (
    <>
      <div className={`border-b px-6 py-4 ${tone}`}>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs opacity-80">{text}</p>

        {error && !dialog && (
          <p className="mt-2 text-xs text-red-400">{error}</p>
        )}

        {isBuyer && order.status === "pending_payment" && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowProof(true)}
              disabled={countdown.expired}
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              I have paid
            </button>

            <button
              type="button"
              onClick={() => setDialog("cancel")}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-400"
            >
              Cancel order
            </button>
          </div>
        )}

        {isSeller && order.status === "paid" && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setDialog("confirm")}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Confirm payment received
            </button>
          </div>
        )}
      </div>

      <PayProofModal
        open={showProof}
        order={order}
        conversationId={conversationId}
        onClose={() => setShowProof(false)}
        onPaid={(updated) => {
          setShowProof(false);
          onOrderChange(updated);
          onSync();
        }}
      />

      <ConfirmDialog
        open={dialog === "cancel"}
        title="Cancel this order?"
        description="Only cancel if you have NOT paid. The amount goes back to the ad."
        confirmLabel="Cancel order"
        danger
        loading={busy}
        error={error}
        onConfirm={() => run(() => cancelOrder(order.id))}
        onCancel={closeDialog}
      />

      <ConfirmDialog
        open={dialog === "confirm"}
        title="Release the crypto?"
        description={`Confirm only if ${order.fiatAmount} ${order.fiat} is already in your account. ${order.amount} ${order.asset} will be sent to the buyer and this cannot be undone.`}
        confirmLabel="Confirm and release"
        loading={busy}
        error={error}
        onConfirm={() => run(() => confirmOrder(order.id))}
        onCancel={closeDialog}
      />
    </>
  );
}
