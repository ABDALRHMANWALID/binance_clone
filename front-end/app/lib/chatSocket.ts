import { io, type Socket } from "socket.io-client";
import api from "@/app/lib/axios";

export const CHAT_EVENTS = {
  JOIN: "conversation:join",
  LEAVE: "conversation:leave",
  SEND: "message:send",
  READ: "conversation:read",
  NEW: "message:new",
  UNREAD_UPDATED: "conversation:unread_updated",
  CONVERSATION_CREATED: "conversation:created",
  ORDER_UPDATED: "order:updated",
} as const;

let socket: Socket | null = null;

export function getChatSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  if (!localStorage.getItem("token")) return null;

  if (!socket) {
    const base = (api.defaults.baseURL ?? "http://localhost:4000").replace(
      /\/$/,
      "",
    );

    socket = io(`${base}/chat`, {
      transports: ["websocket"],
      auth: (cb) => cb({ token: localStorage.getItem("token") }),
    });
  }
  return socket;
}

export function disconnectChatSocket() {
  socket?.disconnect();
  socket = null;
}
