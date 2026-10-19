import type { Transaction } from "@/app/lib/accountApi";

export function shortAmount(value: string, maxDecimals = 8): string {
  const [whole, fraction = ""] = value.split(".");
  const cut = fraction.slice(0, maxDecimals).replace(/0+$/, "");
  return cut ? `${whole}.${cut}` : whole;
}

export const shortHash = (value: string) =>
  value.length > 14 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value;

const EXPLORERS: Record<number, string> = {
  1: "https://etherscan.io",
  11155111: "https://sepolia.etherscan.io",
};

export const txUrl = (chainId: number | null, txHash: string) =>
  chainId !== null && EXPLORERS[chainId]
    ? `${EXPLORERS[chainId]}/tx/${txHash}`
    : null;

export const TYPE_LABEL: Record<Transaction["type"], string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  buy: "Bought via P2P",
  sell: "Sold via P2P",
};

export const isIncoming = (type: Transaction["type"]) =>
  type === "deposit" || type === "buy";

export const TYPE_ICON: Record<
  Transaction["type"],
  { symbol: string; style: string }
> = {
  deposit: { symbol: "↓", style: "bg-green-500/10 text-green-400" },
  withdrawal: { symbol: "↑", style: "bg-red-500/10 text-red-400" },
  buy: { symbol: "⇄", style: "bg-green-500/10 text-green-400" },
  sell: { symbol: "⇄", style: "bg-red-500/10 text-red-400" },
};

const GREEN = "bg-green-500/10 text-green-400";
const BLUE = "bg-blue-500/10 text-blue-400";
const YELLOW = "bg-yellow-400/10 text-yellow-400";
const RED = "bg-red-500/10 text-red-400";
const GRAY = "bg-slate-700/40 text-slate-400";

export const STATUS: Record<string, { label: string; style: string }> = {
  completed: { label: "Completed", style: GREEN },
  pending: { label: "Queued", style: YELLOW },
  processing: { label: "Sending", style: BLUE },
  sent: { label: "Confirming", style: BLUE },
  pending_payment: { label: "Awaiting payment", style: YELLOW },
  paid: { label: "Awaiting release", style: BLUE },
  failed: { label: "Failed", style: RED },
  cancelled: { label: "Cancelled", style: GRAY },
};

export const statusOf = (status: string) =>
  STATUS[status] ?? { label: status, style: GRAY };
