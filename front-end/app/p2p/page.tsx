"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "@/app/lib/axios";
import { getPaymentMethods } from "@/app/lib/chatApi";
import { trimDecimals } from "@/app/lib/format";
import AdForm from "./AdForm";
import TakeAdModal from "./components/TakeAdModal";
import type { Ad, PaymentMethod } from "./types";

export type { Ad } from "./types";

type Tab = "buy" | "sell";

interface AdsResponse {
  items: Ad[];
}

const DECIMAL = /^\d+(\.\d{1,18})?$/;

const errMsg = (e: any, fallback: string) => {
  const m = e?.response?.data?.message;
  return Array.isArray(m) ? m.join(", ") : m || fallback;
};

const MobileLabel = ({ children }: { children: string }) => (
  <span className="mb-0.5 block text-[11px] uppercase tracking-wide text-slate-500 md:hidden">
    {children}
  </span>
);

const fieldClass =
  "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-base text-white outline-none placeholder:text-slate-600 focus:border-yellow-400 sm:text-sm";

export default function P2PMarket() {
  const [paymentTypes, setPaymentTypes] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    getPaymentMethods()
      .then(setPaymentTypes)
      .catch((error) => console.error(error));
  }, []);

  const [tab, setTab] = useState<Tab>("buy");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [minRemainingInput, setMinRemainingInput] = useState("");
  const [minRemaining, setMinRemaining] = useState("");

  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  useEffect(() => {
    const t = setTimeout(
      () =>
        setMinRemaining(
          DECIMAL.test(minRemainingInput) ? minRemainingInput : "",
        ),
      400,
    );
    return () => clearTimeout(t);
  }, [minRemainingInput]);

  const fetchAds = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError("");
      try {
        const endpoint = tab === "buy" ? "/ads/sell" : "/ads/buy";
        const { data } = await api.get<AdsResponse>(endpoint, {
          signal,
          params: {
            asset: "ETH",
            ...(paymentMethod && { paymentMethod }),
            ...(minRemaining && { minRemaining }),
          },
        });
        setAds(data.items);
      } catch (e) {
        if (axios.isCancel(e)) return;
        setError(errMsg(e, "Failed to load ads"));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [tab, paymentMethod, minRemaining],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchAds(controller.signal);
    return () => controller.abort();
  }, [fetchAds, refreshKey]);

  useEffect(() => {
    if (!showForm) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setShowForm(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showForm]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-white sm:text-2xl">
          P2P Market
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 sm:w-auto sm:py-2.5"
        >
          + Create Ad
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:max-w-xs">
        {(["buy", "sell"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition sm:py-2.5 ${
              tab === t
                ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600"
            }`}
          >
            {t} ETH
          </button>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Asset</label>
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-base text-white sm:text-sm">
            ETH
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Payment method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={fieldClass}
          >
            <option value="">All</option>
            {paymentTypes.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Min available (ETH)
          </label>
          <input
            value={minRemainingInput}
            onChange={(e) => setMinRemainingInput(e.target.value)}
            placeholder="e.g. 0.5"
            inputMode="decimal"
            className={fieldClass}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="hidden grid-cols-12 gap-4 border-b border-slate-800 px-4 py-3 text-xs text-slate-500 md:grid">
          <div className="col-span-2">Advertiser</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-3">Available / Limit</div>
          <div className="col-span-3">Payment</div>
          <div className="col-span-2 text-right">Trade</div>
        </div>

        {ads.length === 0 && !loading && (
          <div className="px-4 py-10 text-center text-sm text-slate-500">
            No ads match your filters.
          </div>
        )}

        {ads.map((ad) => (
          <div
            key={ad.id}
            className="grid grid-cols-2 items-center gap-x-4 gap-y-3 border-b border-slate-800 p-4 last:border-b-0 md:grid-cols-12"
          >
            <div className="min-w-0 md:col-span-2">
              <MobileLabel>Advertiser</MobileLabel>
              <div className="truncate text-sm font-medium text-white">
                {ad.advertiser}
              </div>
            </div>

            <div className="text-right md:col-span-2 md:text-left">
              <MobileLabel>Price</MobileLabel>
              <span className="text-lg font-semibold text-white">
                {trimDecimals(ad.price)}
              </span>
              <span className="text-xs text-slate-500">{ad.fiat}</span>
            </div>

            <div className="col-span-2 md:col-span-3">
              <MobileLabel>Available / Limit</MobileLabel>
              <div className="text-sm text-slate-300">
                {ad.remaining}
                <span className="text-slate-500">{ad.asset}</span>
              </div>
              <div className="text-xs text-slate-500">
                {trimDecimals(ad.minFiat)} - {trimDecimals(ad.maxFiat)}
                {ad.fiat}
              </div>
            </div>

            <div className="col-span-2 md:col-span-3">
              <MobileLabel>Payment</MobileLabel>
              <div className="flex flex-wrap gap-1.5">
                {ad.paymentMethods.map((type) => (
                  <span
                    key={type}
                    className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-2 md:text-right">
              <button
                onClick={() => setSelectedAd(ad)}
                className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition md:w-auto md:py-2 ${
                  tab === "buy"
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                {tab === "buy" ? "Buy" : "Sell"} ETH
              </button>
            </div>
          </div>
        ))}

        {loading && (
          <div className="px-4 py-6 text-center text-sm text-slate-500">
            Loading...
          </div>
        )}
      </div>

      {selectedAd && (
        <TakeAdModal
          ad={selectedAd}
          mode={tab}
          paymentMethods={paymentTypes}
          onClose={() => setSelectedAd(null)}
        />
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-4"
          onClick={() => setShowForm(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="mx-auto my-2 w-full max-w-3xl sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex justify-end">
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700"
              >
                ✕
              </button>
            </div>
            <AdForm
              onSuccess={() => {
                setShowForm(false);
                setRefreshKey((k) => k + 1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
