"use client";

import Link from "next/link";
import type { Account } from "@/app/lib/accountApi";
import { shortAmount } from "../format";

export default function BalanceCard({
  balances,
}: {
  balances: Account["balances"];
}) {
  const eth = balances.find((b) => b.asset === "ETH");
  const others = balances.filter(
    (b) => b.asset !== "ETH" && Number(b.total) > 0,
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-xs text-slate-500">Total balance</p>
      <p className="mt-1 text-3xl font-bold text-white">
        {shortAmount(eth?.total ?? "0")}{" "}
        <span className="text-base font-normal text-slate-500">ETH</span>
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">Available</p>
          <p className="mt-1 font-semibold text-white">
            {shortAmount(eth?.available ?? "0")} ETH
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">In orders / withdrawals</p>
          <p className="mt-1 font-semibold text-white">
            {shortAmount(eth?.locked ?? "0")} ETH
          </p>
        </div>
      </div>

      {others.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-slate-800 pt-4 text-sm">
          {others.map((b) => (
            <div key={b.asset} className="flex justify-between">
              <span className="text-slate-400">{b.asset}</span>
              <span className="text-white">{shortAmount(b.total)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Link
          href="/deposit"
          className="rounded-lg bg-yellow-400 px-3 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-yellow-300"
        >
          Deposit
        </Link>
        <Link
          href="/withdraw"
          className="rounded-lg border border-slate-700 px-3 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:border-yellow-400 hover:text-yellow-400"
        >
          Withdraw
        </Link>
        <Link
          href="/p2p"
          className="rounded-lg border border-slate-700 px-3 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:border-yellow-400 hover:text-yellow-400"
        >
          P2P
        </Link>
      </div>
    </div>
  );
}
