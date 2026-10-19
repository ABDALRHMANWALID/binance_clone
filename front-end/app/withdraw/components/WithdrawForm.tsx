"use client";

import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  createWithdrawal,
  errorMessage,
  type Limits,
  type Withdrawal,
} from "@/app/lib/withdrawApi";
import { networkName } from "../networks";
import { fromUnits, minUnits, shortEth, toUnits } from "../units";
import ConfirmWithdrawModal, {
  type WithdrawSummary,
} from "./ConfirmWithdrawModal";

interface Props {
  limits: Limits;
  available: string | null;
  onCreated: (withdrawal: Withdrawal) => void;
}

const ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const AMOUNT = /^\d+(\.\d{1,18})?$/;
const ZERO_ADDRESS = /^0x0{40}$/i;

type FieldErrors = { address?: string; amount?: string };

function buildSchema(limits: Limits, available: bigint | null) {
  const min = toUnits(limits.min);
  const max = toUnits(limits.max);
  const fee = toUnits(limits.fee);
  const remaining = toUnits(limits.remainingToday);

  return z
    .object({
      address: z.string().regex(ADDRESS, "Enter a valid 0x address"),
      amount: z.string().regex(AMOUNT, "Enter a valid amount"),
    })
    .superRefine((data, ctx) => {
      const issue = (path: "address" | "amount", message: string) =>
        ctx.addIssue({ code: "custom", path: [path], message });

      if (ZERO_ADDRESS.test(data.address)) {
        issue("address", "This address cannot receive funds");
      }

      if (!AMOUNT.test(data.amount)) return;

      const amount = toUnits(data.amount);
      if (amount < min)
        return issue("amount", `Minimum withdrawal is ${limits.min} ETH`);
      if (amount > max)
        return issue("amount", `Maximum per withdrawal is ${limits.max} ETH`);
      if (amount > remaining) {
        return issue(
          "amount",
          `Daily limit reached. You can withdraw ${shortEth(limits.remainingToday)} ETH more today`,
        );
      }
      if (available !== null && amount + fee > available) {
        issue(
          "amount",
          "Insufficient balance (the fee is added to the amount)",
        );
      }
    });
}

export default function WithdrawForm({ limits, available, onCreated }: Props) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const [summary, setSummary] = useState<WithdrawSummary | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const availableUnits = available === null ? null : toUnits(available);
  const feeUnits = toUnits(limits.fee);
  const network = networkName(limits.chainId);

  const schema = useMemo(
    () => buildSchema(limits, availableUnits),
    [limits, availableUnits],
  );

  const requestRef = useRef<{ key: string; id: string } | null>(null);
  const requestIdFor = (addressValue: string, amountValue: string) => {
    const key = `${addressValue.toLowerCase()}|${amountValue}`;
    if (!requestRef.current || requestRef.current.key !== key) {
      requestRef.current = { key, id: crypto.randomUUID() };
    }
    return requestRef.current.id;
  };

  const handleMax = () => {
    const candidates = [toUnits(limits.max), toUnits(limits.remainingToday)];
    if (availableUnits !== null) {
      candidates.push(
        availableUnits > feeUnits ? availableUnits - feeUnits : BigInt(0),
      );
    }

    const best = minUnits(...candidates);
    setAmount(best > BigInt(0) ? fromUnits(best) : "");
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleAmountChange = (value: string) => {
    if (!/^\d*\.?\d{0,18}$/.test(value)) return;
    setAmount(value);
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");

    const result = schema.safeParse({
      address: address.trim(),
      amount: amount.trim(),
    });

    if (!result.success) {
      const next: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if ((field === "address" || field === "amount") && !next[field]) {
          next[field] = issue.message;
        }
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setSummary({
      address: result.data.address,
      amount: fromUnits(toUnits(result.data.amount)),
      fee: fromUnits(feeUnits),
      total: fromUnits(toUnits(result.data.amount) + feeUnits),
      network,
    });
  };

  const handleConfirm = async () => {
    if (!summary) return;

    try {
      setSubmitting(true);
      setServerError("");

      const created = await createWithdrawal({
        address: summary.address,
        amount: summary.amount,
        clientRequestId: requestIdFor(summary.address, summary.amount),
      });

      requestRef.current = null;
      setSummary(null);
      setAddress("");
      setAmount("");
      onCreated(created);
    } catch (e) {
      setServerError(errorMessage(e, "Failed to create the withdrawal"));
    } finally {
      setSubmitting(false);
    }
  };

  const used = Number(limits.usedLast24h);
  const daily = Number(limits.dailyLimit);
  const usedPercent = daily > 0 ? Math.min(100, (used / daily) * 100) : 0;
  const dailyDone = toUnits(limits.remainingToday) === BigInt(0);

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Available</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {available !== null ? shortEth(available) : "-"}{" "}
              <span className="text-xs font-normal text-slate-500">ETH</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Network</p>
            <p className="mt-1 text-lg font-semibold text-white">{network}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Withdraw to address
            </label>

            <input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setErrors((prev) => ({ ...prev, address: undefined }));
              }}
              placeholder="0x..."
              autoComplete="off"
              spellCheck={false}
              className={`w-full rounded-xl border bg-slate-950 px-4 py-3 font-mono text-base text-white outline-none transition placeholder:text-slate-600 sm:text-sm ${
                errors.address
                  ? "border-red-500"
                  : "border-slate-800 focus:border-yellow-400"
              }`}
            />

            {errors.address && (
              <p className="mt-2 text-xs text-red-400">{errors.address}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                Amount
              </label>

              <button
                type="button"
                onClick={handleMax}
                className="text-xs font-medium text-yellow-400 hover:underline"
              >
                Max
              </button>
            </div>

            <div className="relative">
              <input
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={`Min ${limits.min}`}
                inputMode="decimal"
                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 pr-16 text-base text-white outline-none transition placeholder:text-slate-600 sm:text-sm ${
                  errors.amount
                    ? "border-red-500"
                    : "border-slate-800 focus:border-yellow-400"
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                ETH
              </span>
            </div>

            {errors.amount && (
              <p className="mt-2 text-xs text-red-400">{errors.amount}</p>
            )}

            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Network fee</span>
                <span>{shortEth(limits.fee)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Total deducted</span>
                <span className="text-slate-300">
                  {AMOUNT.test(amount)
                    ? shortEth(fromUnits(toUnits(amount) + feeUnits))
                    : shortEth(limits.fee)}{" "}
                  ETH
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Daily limit</span>
              <span>
                {shortEth(limits.usedLast24h)} / {shortEth(limits.dailyLimit)}{" "}
                ETH
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full ${dailyDone ? "bg-red-400" : "bg-yellow-400"}`}
                style={{ width: `${usedPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-sm text-yellow-400">
              Only withdraw to an address on the{" "}
              <span className="font-semibold">{network}</span> network. Funds
              sent to a wrong address cannot be recovered.
            </p>
          </div>

          <button
            type="submit"
            disabled={dailyDone}
            className="w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dailyDone ? "Daily limit reached" : "Withdraw"}
          </button>
        </form>
      </div>

      <ConfirmWithdrawModal
        summary={summary}
        loading={submitting}
        error={serverError}
        onConfirm={handleConfirm}
        onCancel={() => {
          setSummary(null);
          setServerError("");
        }}
      />
    </>
  );
}
