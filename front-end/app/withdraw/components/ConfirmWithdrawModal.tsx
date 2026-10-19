"use client";

import { useEffect } from "react";

export interface WithdrawSummary {
  address: string;
  amount: string;
  fee: string;
  total: string;
  network: string;
}

interface Props {
  summary: WithdrawSummary | null;
  loading: boolean;
  error: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4">
    <span className="shrink-0 text-sm text-slate-500">{label}</span>
    <span className="break-all text-right text-sm font-medium text-white">
      {children}
    </span>
  </div>
);

export default function ConfirmWithdrawModal({
  summary,
  loading,
  error,
  onConfirm,
  onCancel,
}: Props) {
  const open = summary !== null;

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, loading, onCancel]);

  if (!summary) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-4"
      onClick={() => !loading && onCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="mx-auto my-6 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:my-12"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white">Confirm withdrawal</h2>
        <p className="mt-1 text-sm text-slate-400">
          Check the address carefully. A withdrawal cannot be reversed.
        </p>

        <div className="mt-5 space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <Row label="Network">{summary.network}</Row>
          <Row label="Address">
            <span className="font-mono text-xs">{summary.address}</span>
          </Row>
          <Row label="You receive">{summary.amount} ETH</Row>
          <Row label="Fee">{summary.fee} ETH</Row>

          <div className="border-t border-slate-800 pt-3">
            <Row label="Total deducted">{summary.total} ETH</Row>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
