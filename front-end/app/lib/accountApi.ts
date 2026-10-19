import axios from "axios";
import { z } from "zod";
import api from "@/app/lib/axios";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
});

export const accountSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    createdAt: z.string().nullable(),
  }),
  balances: z.array(
    z.object({
      asset: z.string(),
      available: z.string(),
      locked: z.string(),
      total: z.string(),
    }),
  ),
});

export const transactionSchema = z.object({
  id: z.string(),
  type: z.enum(["deposit", "withdrawal", "buy", "sell"]),
  asset: z.string(),
  amount: z.string(),
  fiatAmount: z.string().nullable(),
  fiat: z.string().nullable(),
  status: z.string(),
  txHash: z.string().nullable(),
  chainId: z.number().nullable(),
  orderId: z.string().nullable(),
  createdAt: z.string(),
});

const transactionsPageSchema = z.object({
  items: z.array(transactionSchema),
  nextCursor: z.string().nullable(),
});

export type Account = z.infer<typeof accountSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionsPage = z.infer<typeof transactionsPageSchema>;
export type TxFilter = "all" | "deposit" | "withdrawal" | "trade";

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

export const isUnauthorized = (e: unknown) =>
  axios.isAxiosError(e) && e.response?.status === 401;

export async function getAccount(): Promise<Account> {
  const { data } = await api.get("/account", auth());
  return parse(accountSchema, data);
}

export async function getTransactions(params: {
  type: TxFilter;
  before?: string | null;
  limit?: number;
}): Promise<TransactionsPage> {
  const { data } = await api.get("/account/transactions", {
    ...auth(),
    params: {
      type: params.type,
      limit: params.limit ?? 20,
      before: params.before ?? undefined,
    },
  });
  return parse(transactionsPageSchema, data);
}
