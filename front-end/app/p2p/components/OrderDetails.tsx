"use client";

import { STATUS_LABEL, STATUS_STYLE } from "../orderUi";
import type { Order } from "../types";

interface Props {
  order: Order;
  counterpart?: string;
  paymentMethodName?: string;
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs text-slate-500">{label}</p>
    <div className="mt-1 text-sm font-medium text-white">{children}</div>
  </div>
);

export default function OrderDetails({ order, counterpart, paymentMethodName }: Props) {
  return (
    <aside className="w-full rounded-xl border border-slate-800 bg-slate-900 lg:w-80">
      <div className="flex items-center justify-between border-b border-slate-800 p-5">
        <h2 className="font-semibold">Order details</h2>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="space-y-5 p-5">
        <Row label="You are the">
          <span className="capitalize">{order.role}</span>
        </Row>

        <Row label={order.role === "buyer" ? "Seller" : "Buyer"}>{counterpart ?? "-"}</Row>

        <Row label="Amount">
          {order.amount} {order.asset}
        </Row>

        <Row label="Price">
          {order.price} {order.fiat}
        </Row>

        <Row label={order.role === "buyer" ? "You pay" : "You receive"}>
          {order.fiatAmount} {order.fiat}
        </Row>

        <Row label="Payment method">{paymentMethodName ?? "-"}</Row>

        <Row label="Order ID">
          <span className="break-all text-xs font-normal text-slate-300">{order.id}</span>
        </Row>

        <Row label="Created">
          <span className="text-xs font-normal text-slate-300">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </Row>
      </div>
    </aside>
  );
}
