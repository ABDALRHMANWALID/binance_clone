import type { OrderStatus, Role } from "./types";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Waiting for payment",
  paid: "Payment sent",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  pending_payment: "bg-yellow-400/10 text-yellow-400",
  paid: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-slate-700/40 text-slate-400",
};

export const isOpen = (status: OrderStatus) =>
  status === "pending_payment" || status === "paid";

export function actionHint(role: Role, status: OrderStatus): string | null {
  if (role === "buyer" && status === "pending_payment") return "Pay now";
  if (role === "seller" && status === "paid") return "Confirm payment";
  return null;
}
