import axios from "axios";
import { z } from "zod";
import api from "@/app/lib/axios";
import { fromUnits, toUnits } from "@/app/withdraw/units";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
});

export const limitsSchema = z.object({
  asset: z.string(),
  chainId: z.number(),
  min: z.string(),
  max: z.string(),
  fee: z.string(),
  dailyLimit: z.string(),
  usedLast24h: z.string(),
  remainingToday: z.string(),
});

export const withdrawalSchema = z.object({
  id: z.string(),
  asset: z.string(),
  chainId: z.number(),
  address: z.string(),
  amount: z.string(),
  fee: z.string(),
  status: z.enum(["pending", "processing", "sent", "completed", "failed"]),
  txHash: z.string().nullable(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
});

const withdrawalsListSchema = z.object({ items: z.array(withdrawalSchema) });

export type Limits = z.infer<typeof limitsSchema>;
export type Withdrawal = z.infer<typeof withdrawalSchema>;

export const OPEN_STATUSES: Withdrawal["status"][] = [
  "pending",
  "processing",
  "sent",
];

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) throw new Error("Unexpected response from the server");
  return result.data;
}

export function errorMessage(e: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(e)) {
    const message = e.response?.data?.message;
    return Array.isArray(message) ? message.join(", ") : message || fallback;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

export async function getLimits(): Promise<Limits> {
  const { data } = await api.get("/withdrawals/limits", {
    ...auth(),
    params: { asset: "ETH" },
  });
  return parse(limitsSchema, data);
}

export async function getWithdrawals(): Promise<Withdrawal[]> {
  const { data } = await api.get("/withdrawals", auth());
  return parse(withdrawalsListSchema, data).items;
}

export async function createWithdrawal(body: {
  address: string;
  amount: string;
  clientRequestId: string;
}): Promise<Withdrawal> {
  const { data } = await api.post(
    "/withdrawals",
    { asset: "ETH", ...body },
    auth(),
  );
  return parse(withdrawalSchema, data);
}

export async function getAvailableEth(): Promise<string | null> {
  try {
    const { data } = await api.get("/balances/my-balance", {
      ...auth(),
      params: { asset: "ETH" },
    });

    const wrapped = data as { balances?: unknown };
    const list = Array.isArray(data)
      ? data
      : Array.isArray(wrapped?.balances)
        ? wrapped.balances
        : [data];

    const item = z
      .array(
        z.object({
          asset: z.string().optional(),
          available: z.union([z.string(), z.number()]),
        }),
      )
      .safeParse(list);
    if (!item.success) return null;

    const eth = item.data.find((b) => !b.asset || b.asset === "ETH");
    return eth ? fromUnits(toUnits(String(eth.available))) : null;
  } catch {
    return null;
  }
}
