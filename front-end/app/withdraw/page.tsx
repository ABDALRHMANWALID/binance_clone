"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  OPEN_STATUSES,
  errorMessage,
  getAvailableEth,
  getLimits,
  getWithdrawals,
  type Limits,
  type Withdrawal,
} from "@/app/lib/withdrawApi";
import WithdrawForm from "./components/WithdrawForm";
import WithdrawalsHistory from "./components/WithdrawalsHistory";

const POLL_MS = 8000;

export default function WithdrawPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const [limits, setLimits] = useState<Limits | null>(null);
  const [available, setAvailable] = useState<string | null>(null);
  const [items, setItems] = useState<Withdrawal[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setItems(await getWithdrawals());
    } catch {}
  }, []);

  const loadAll = useCallback(async () => {
    const [limitsResult, balance] = await Promise.all([
      getLimits().then(
        (value) => ({ value }),
        (e: unknown) => ({
          error: errorMessage(e, "Failed to load the withdrawal limits"),
        }),
      ),
      getAvailableEth(),
      loadHistory(),
    ]);

    if ("value" in limitsResult) {
      setLimits(limitsResult.value);
      setError("");
    } else {
      setError(limitsResult.error);
    }
    setAvailable(balance);
  }, [loadHistory]);

  useEffect(() => {
    const hasToken = !!localStorage.getItem("token");
    setLoggedIn(hasToken);

    if (!hasToken) {
      setLoading(false);
      return;
    }

    loadAll().finally(() => setLoading(false));
  }, [loadAll]);

  const hasOpen = items.some((w) => OPEN_STATUSES.includes(w.status));
  const hadOpen = useRef(false);

  useEffect(() => {
    if (!hasOpen) return;
    const id = setInterval(() => void loadHistory(), POLL_MS);
    return () => clearInterval(id);
  }, [hasOpen, loadHistory]);

  useEffect(() => {
    if (hadOpen.current && !hasOpen) void loadAll();
    hadOpen.current = hasOpen;
  }, [hasOpen, loadAll]);

  if (loggedIn === false) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-6 py-10 text-center text-white">
        <p className="text-slate-400">Please log in to withdraw.</p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm text-yellow-400 hover:underline"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Withdraw Crypto</h1>
          <p className="mt-2 text-sm text-slate-400">
            Send ETH from your balance to your own wallet.
          </p>
        </div>

        {notice && (
          <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm text-green-400">{notice}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {loading && !limits && (
          <p className="py-10 text-center text-sm text-slate-500">Loading...</p>
        )}

        {limits && (
          <WithdrawForm
            limits={limits}
            available={available}
            onCreated={(created) => {
              setNotice(
                "Withdrawal requested. It is sent in a few seconds and you can follow it below.",
              );
              setItems((prev) => [
                created,
                ...prev.filter((w) => w.id !== created.id),
              ]);
              void loadAll();
            }}
          />
        )}

        <WithdrawalsHistory items={items} loading={loading} />
      </div>
    </div>
  );
}
