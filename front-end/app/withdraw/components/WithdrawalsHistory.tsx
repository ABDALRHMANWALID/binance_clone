"use client";

import { type Withdrawal } from "@/app/lib/withdrawApi";
import { txUrl } from "../networks";
import { shortEth } from "../units";

const STATUS: Record<Withdrawal["status"], { label: string; style: string }> = {
  pending: { label: "Queued", style: "bg-yellow-400/10 text-yellow-400" },
  processing: { label: "Sending", style: "bg-blue-500/10 text-blue-400" },
  sent: { label: "Confirming", style: "bg-blue-500/10 text-blue-400" },
  completed: { label: "Completed", style: "bg-green-500/10 text-green-400" },
  failed: { label: "Failed", style: "bg-red-500/10 text-red-400" },
};

const shortHash = (value: string) =>
  value.length > 14 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value;

export default function WithdrawalsHistory({
  items,
  loading,
}: {
  items: Withdrawal[];
  loading: boolean;
}) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-white">Recent withdrawals</h2>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {loading && items.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">Loading...</p>
        )}

        {!loading && items.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No withdrawals yet.</p>
        )}

        {items.map((item) => {
          const status = STATUS[item.status];
          const link = item.txHash ? txUrl(item.chainId, item.txHash) : null;

          return (
            <div
              key={item.id}
              className="border-b border-slate-800 p-4 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">
                  {shortEth(item.amount)} {item.asset}
                </span>

                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.style}`}>
                  {status.label}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="font-mono">To {shortHash(item.address)}</span>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>

              {Number(item.fee) > 0 && (
                <p className="mt-1 text-xs text-slate-500">Fee {shortEth(item.fee)} {item.asset}</p>
              )}

              {item.status === "failed" && (
                <p className="mt-2 text-xs text-slate-400">
                  The withdrawal could not be sent. The funds were returned to your balance.
                </p>
              )}

              {item.txHash && (
                <p className="mt-2 text-xs">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-yellow-400 hover:underline"
                    >
                      {shortHash(item.txHash)}
                    </a>
                  ) : (
                    <span className="font-mono text-slate-400">{shortHash(item.txHash)}</span>
                  )}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
