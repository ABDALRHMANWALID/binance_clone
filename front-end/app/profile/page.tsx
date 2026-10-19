"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  errorMessage,
  getAccount,
  getTransactions,
  isUnauthorized,
  type Account,
  type Transaction,
  type TxFilter,
} from "@/app/lib/accountApi";
import AccountCard from "./components/AccountCard";
import BalanceCard from "./components/BalanceCard";
import TransactionsList from "./components/TransactionsList";

export default function ProfilePage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const [account, setAccount] = useState<Account | null>(null);
  const [accountError, setAccountError] = useState("");
  const [loadingAccount, setLoadingAccount] = useState(true);

  const [filter, setFilter] = useState<TxFilter>("all");
  const [items, setItems] = useState<Transaction[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingTx, setLoadingTx] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [txError, setTxError] = useState("");

  const requestId = useRef(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.assign("/login");
  };

  const expireSession = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoggedIn(false);
      return;
    }
    setLoggedIn(true);

    getAccount()
      .then(setAccount)
      .catch((e) => {
        if (isUnauthorized(e)) return expireSession();
        setAccountError(errorMessage(e, "Failed to load your account"));
      })
      .finally(() => setLoadingAccount(false));
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    const id = ++requestId.current;
    setLoadingTx(true);
    setTxError("");
    setItems([]);
    setCursor(null);

    getTransactions({ type: filter })
      .then((page) => {
        if (id !== requestId.current) return;
        setItems(page.items);
        setCursor(page.nextCursor);
      })
      .catch((e) => {
        if (id !== requestId.current) return;
        if (isUnauthorized(e)) return expireSession();
        setTxError(errorMessage(e, "Failed to load transactions"));
      })
      .finally(() => {
        if (id === requestId.current) setLoadingTx(false);
      });
  }, [filter, loggedIn]);

  const loadMore = async () => {
    if (!cursor) return;

    const id = requestId.current;
    try {
      setLoadingMore(true);
      const page = await getTransactions({ type: filter, before: cursor });
      if (id !== requestId.current) return;
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
    } catch (e) {
      setTxError(errorMessage(e, "Failed to load more transactions"));
    } finally {
      setLoadingMore(false);
    }
  };

  if (loggedIn === false) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-6 py-10 text-center text-white">
        <p className="text-slate-400">Please log in to see your account.</p>
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
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your details, your balance and everything that moved it.
          </p>
        </div>

        {accountError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm text-red-400">{accountError}</p>
          </div>
        )}

        {loadingAccount && !account && (
          <p className="py-10 text-center text-sm text-slate-500">Loading...</p>
        )}

        {account && (
          <>
            <AccountCard user={account.user} onLogout={handleLogout} />
            <BalanceCard balances={account.balances} />
          </>
        )}

        {!account && !loadingAccount && (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-400"
          >
            Log out
          </button>
        )}

        <TransactionsList
          items={items}
          filter={filter}
          onFilterChange={setFilter}
          loading={loadingTx}
          loadingMore={loadingMore}
          hasMore={cursor !== null}
          error={txError}
          onLoadMore={() => void loadMore()}
        />
      </div>
    </div>
  );
}
