"use client";

import Link from "next/link";
import type { Transaction, TxFilter } from "@/app/lib/accountApi";
import {
  TYPE_ICON,
  TYPE_LABEL,
  isIncoming,
  shortAmount,
  shortHash,
  statusOf,
  txUrl,
} from "../format";

const FILTERS: { value: TxFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "deposit", label: "Deposits" },
  { value: "withdrawal", label: "Withdrawals" },
  { value: "trade", label: "P2P" },
];

interface Props {
  items: Transaction[];
  filter: TxFilter;
  onFilterChange: (filter: TxFilter) => void;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string;
  onLoadMore: () => void;
}

export default function TransactionsList({
  items,
  filter,
  onFilterChange,
  loading,
  loadingMore,
  hasMore,
  error,
  onLoadMore,
}: Props) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Transactions</h2>

        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onFilterChange(f.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                filter === f.value
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                  : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {loading && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">Loading...</p>
        )}

        {!loading && items.length === 0 && !error && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No transactions yet.</p>
        )}

        {!loading &&
          items.map((tx) => {
            const icon = TYPE_ICON[tx.type];
            const status = statusOf(tx.status);
            const incoming = isIncoming(tx.type);
            const link = tx.txHash ? txUrl(tx.chainId, tx.txHash) : null;

            return (
              <div
                key={tx.id}
                className="flex items-start gap-3 border-b border-slate-800 p-4 last:border-b-0"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${icon.style}`}
                >
                  {icon.symbol}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white">{TYPE_LABEL[tx.type]}</span>

                    <span
                      className={`shrink-0 text-sm font-semibold ${
                        incoming ? "text-green-400" : "text-white"
                      }`}
                    >
                      {incoming ? "+" : "-"}
                      {shortAmount(tx.amount)} {tx.asset}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>{new Date(tx.createdAt).toLocaleString()}</span>

                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${status.style}`}>
                      {status.label}
                    </span>
                  </div>

                  {tx.fiatAmount && tx.fiat && (
                    <p className="mt-1 text-xs text-slate-500">
                      {tx.type === "buy" ? "Paid" : "Received"} {tx.fiatAmount} {tx.fiat}
                    </p>
                  )}

                  {tx.txHash && (
                    <p className="mt-1 text-xs">
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-yellow-400 hover:underline"
                        >
                          {shortHash(tx.txHash)}
                        </a>
                      ) : (
                        <span className="font-mono text-slate-400">{shortHash(tx.txHash)}</span>
                      )}
                    </p>
                  )}

                  {tx.orderId && (
                    <Link
                      href={`/p2p/order/${tx.orderId}`}
                      className="mt-1 inline-block text-xs text-yellow-400 hover:underline"
                    >
                      View order
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {hasMore && !loading && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="w-full rounded-xl border border-slate-700 px-5 py-3 text-sm text-slate-300 transition hover:border-slate-500 disabled:opacity-50 sm:mx-auto sm:block sm:w-auto sm:py-2.5"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
