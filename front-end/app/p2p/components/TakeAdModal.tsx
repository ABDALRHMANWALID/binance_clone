"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createOrder, errorMessage } from "@/app/lib/chatApi";
import type { Ad, PaymentMethod } from "../types";

interface Props {
  ad: Ad;
  mode: "buy" | "sell";
  paymentMethods: PaymentMethod[];
  onClose: () => void;
}

const DECIMAL = /^\d+(\.\d{1,18})?$/;

const floorTo8 = (value: number) =>
  (Math.floor(value * 1e8) / 1e8).toFixed(8).replace(/\.?0+$/, "");

export default function TakeAdModal({
  ad,
  mode,
  paymentMethods,
  onClose,
}: Props) {
  const router = useRouter();

  const adMethods = useMemo(
    () => paymentMethods.filter((m) => ad.paymentMethods.includes(m.name)),
    [paymentMethods, ad.paymentMethods],
  );

  const [amount, setAmount] = useState("");
  const [methodId, setMethodId] = useState<number | "">(
    adMethods.length === 1 ? adMethods[0].id : "",
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (methodId === "" && adMethods.length === 1) setMethodId(adMethods[0].id);
  }, [adMethods, methodId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const price = Number(ad.price);
  const remaining = Number(ad.remaining);
  const minFiat = Number(ad.minFiat);
  const maxFiat = Number(ad.maxFiat);

  const fiatTotal = DECIMAL.test(amount) ? Number(amount) * price : null;
  const maxAmount = Math.min(remaining, maxFiat / price);

  const schema = useMemo(
    () =>
      z
        .object({
          amount: z.string().regex(DECIMAL, "Enter a valid amount"),
          paymentMethodId: z.number().int().min(1, "Select a payment method"),
        })
        .superRefine((data, ctx) => {
          const value = Number(data.amount);
          const fiat = value * price;
          const issue = (message: string) =>
            ctx.addIssue({ code: "custom", path: ["amount"], message });

          if (value <= 0) return issue("Amount must be greater than 0");
          if (value > remaining) {
            return issue(`Only ${ad.remaining} ${ad.asset} is available`);
          }
          if (fiat < minFiat || fiat > maxFiat) {
            issue(
              `Order value must be between ${ad.minFiat} and ${ad.maxFiat} ${ad.fiat}`,
            );
          }
        }),
    [price, remaining, minFiat, maxFiat, ad],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = schema.safeParse({
      amount,
      paymentMethodId: methodId === "" ? 0 : methodId,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid data");
      return;
    }

    try {
      setSubmitting(true);
      const order = await createOrder(ad.id, result.data);
      router.push(`/p2p/order/${order.id}`);
    } catch (e) {
      setError(errorMessage(e, "Failed to start the order"));
      setSubmitting(false);
    }
  };

  const isBuy = mode === "buy";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="mx-auto my-4 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:my-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isBuy ? "Buy" : "Sell"} {ad.asset}
            </h2>
            <p className="mt-1 text-sm text-slate-400">with {ad.advertiser}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Price</span>
            <span className="text-white">
              {ad.price} {ad.fiat}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Available</span>
            <span className="text-white">
              {ad.remaining} {ad.asset}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Limit</span>
            <span className="text-white">
              {ad.minFiat} - {ad.maxFiat} {ad.fiat}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                {isBuy ? "I want to buy" : "I want to sell"}
              </label>

              <button
                type="button"
                onClick={() => setAmount(floorTo8(maxAmount))}
                className="text-xs font-medium text-yellow-400 hover:underline"
              >
                Max
              </button>
            </div>

            <div className="relative">
              <input
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                placeholder="0.00"
                inputMode="decimal"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 pr-16 text-base text-white outline-none placeholder:text-slate-600 focus:border-yellow-400 sm:text-sm"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                {ad.asset}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {isBuy ? "You will pay" : "You will receive"}{" "}
              <span className="font-medium text-slate-300">
                {fiatTotal !== null ? fiatTotal.toFixed(2) : "0.00"} {ad.fiat}
              </span>
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Payment method
            </label>

            <select
              value={methodId}
              onChange={(e) => {
                setMethodId(e.target.value ? Number(e.target.value) : "");
                setError("");
              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-base text-white outline-none focus:border-yellow-400 sm:text-sm"
            >
              <option value="">Select payment method</option>
              {adMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-400">
            {isBuy
              ? "After you start, you have a limited time to pay and send the transfer proof in the chat."
              : "Your ETH will be locked until the order is completed or cancelled."}
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isBuy
                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                : "bg-red-500 text-white hover:bg-red-400"
            }`}
          >
            {submitting
              ? "Starting..."
              : `${isBuy ? "Buy" : "Sell"} ${ad.asset}`}
          </button>
        </form>
      </div>
    </div>
  );
}
