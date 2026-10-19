import { useCallback, useEffect, useRef, useState } from "react";
import {
  errorMessage,
  getConversation,
  getMessages,
  getOrder,
  markReadRest,
  sendMessageRest,
} from "@/app/lib/chatApi";
import { CHAT_EVENTS, getChatSocket } from "@/app/lib/chatSocket";
import type {
  ChatMessage,
  ConversationDetails,
  LocalMessage,
  Order,
  UploadedFile,
} from "../types";

const PAGE_SIZE = 30;

interface SendPayload {
  conversationId: string;
  content?: string;
  attachmentIds?: string[];
  clientMessageId: string;
}

interface Ack {
  ok: boolean;
  message?: ChatMessage;
  error?: string;
}

const isLocal = (m: LocalMessage) => m.id.startsWith("local-");

const compareIds = (a: string, b: string) =>
  a.length !== b.length ? a.length - b.length : a < b ? -1 : a > b ? 1 : 0;

function sortMessages(list: LocalMessage[]): LocalMessage[] {
  return [...list].sort((a, b) => {
    const localA = isLocal(a);
    const localB = isLocal(b);
    if (localA !== localB) return localA ? 1 : -1;
    if (localA) return a.createdAt < b.createdAt ? -1 : 1;
    return compareIds(a.id, b.id);
  });
}

export function useOrderChat(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [conversation, setConversation] = useState<ConversationDetails | null>(
    null,
  );
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [hasMoreOlder, setHasMoreOlder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [visibleTick, setVisibleTick] = useState(0);

  const conversationId = order?.conversationId ?? null;
  const myId = order
    ? order.role === "buyer"
      ? order.buyerId
      : order.sellerId
    : null;

  const messagesRef = useRef<LocalMessage[]>([]);
  messagesRef.current = messages;
  const nextCursorRef = useRef<string | null>(null);
  const pendingRef = useRef(new Map<string, SendPayload>());
  const lastReadRef = useRef<string | null>(null);

  const upsertMessage = useCallback((incoming: ChatMessage) => {
    setMessages((prev) => {
      let index = prev.findIndex((m) => m.id === incoming.id);
      if (index === -1 && incoming.clientMessageId) {
        index = prev.findIndex(
          (m) => m.clientMessageId === incoming.clientMessageId,
        );
      }

      if (index === -1) return sortMessages([...prev, incoming]);

      const next = [...prev];
      next[index] = { ...incoming };
      return sortMessages(next);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const loadedOrder = await getOrder(orderId);
        if (cancelled) return;
        setOrder(loadedOrder);

        if (!loadedOrder.conversationId) {
          throw new Error("This order has no conversation");
        }

        const [details, page] = await Promise.all([
          getConversation(loadedOrder.conversationId),
          getMessages(loadedOrder.conversationId, { limit: PAGE_SIZE }),
        ]);
        if (cancelled) return;

        setConversation(details);
        setMessages(sortMessages(page.items));
        setHasMoreOlder(page.hasMore);
        nextCursorRef.current = page.nextCursor;
      } catch (e) {
        if (!cancelled) setError(errorMessage(e, "Failed to load the order"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const refreshOrder = useCallback(async () => {
    try {
      setOrder(await getOrder(orderId));
    } catch {}
  }, [orderId]);

  const syncMissed = useCallback(async () => {
    if (!conversationId) return;

    try {
      const lastReal = [...messagesRef.current]
        .reverse()
        .find((m) => !isLocal(m));
      let cursor = lastReal?.id;

      for (let i = 0; i < 5; i++) {
        const page = await getMessages(
          conversationId,
          cursor ? { after: cursor, limit: 100 } : { limit: PAGE_SIZE },
        );
        page.items.forEach(upsertMessage);
        if (!cursor || !page.hasMore || !page.nextCursor) break;
        cursor = page.nextCursor;
      }
    } catch {}
  }, [conversationId, upsertMessage]);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getChatSocket();
    if (!socket) return;

    const join = () => socket.emit(CHAT_EVENTS.JOIN, { conversationId });

    const onConnect = () => {
      setConnected(true);
      join();
      void syncMissed();
      void refreshOrder();
    };
    const onDisconnect = () => setConnected(false);
    const onNew = (message: ChatMessage) => {
      if (message.conversationId === conversationId) upsertMessage(message);
    };
    const onOrderUpdated = (payload: { orderId: string }) => {
      if (payload.orderId === orderId) void refreshOrder();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(CHAT_EVENTS.NEW, onNew);
    socket.on(CHAT_EVENTS.ORDER_UPDATED, onOrderUpdated);

    if (socket.connected) {
      setConnected(true);
      join();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(CHAT_EVENTS.NEW, onNew);
      socket.off(CHAT_EVENTS.ORDER_UPDATED, onOrderUpdated);
      if (socket.connected) socket.emit(CHAT_EVENTS.LEAVE, { conversationId });
    };
  }, [conversationId, orderId, upsertMessage, syncMissed, refreshOrder]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") setVisibleTick((t) => t + 1);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    if (!conversationId || !myId) return;
    if (document.visibilityState !== "visible") return;

    const lastIncoming = [...messages]
      .reverse()
      .find((m) => m.senderId !== myId && !isLocal(m));
    if (!lastIncoming || lastReadRef.current === lastIncoming.id) return;

    lastReadRef.current = lastIncoming.id;

    const socket = getChatSocket();
    if (socket?.connected) {
      socket.emit(CHAT_EVENTS.READ, {
        conversationId,
        lastReadMessageId: lastIncoming.id,
      });
    } else {
      markReadRest(conversationId, lastIncoming.id).catch(() => {
        lastReadRef.current = null;
      });
    }
  }, [messages, conversationId, myId, visibleTick]);

  const deliver = useCallback(
    async (payload: SendPayload) => {
      try {
        let saved: ChatMessage;
        const socket = getChatSocket();

        if (socket?.connected) {
          const ack = await new Promise<Ack>((resolve) => {
            socket
              .timeout(10000)
              .emit(CHAT_EVENTS.SEND, payload, (err: Error | null, res: Ack) =>
                resolve(
                  err
                    ? { ok: false, error: "No response from the server" }
                    : res,
                ),
              );
          });
          if (!ack.ok || !ack.message)
            throw new Error(ack.error ?? "Failed to send");
          saved = ack.message;
        } else {
          saved = await sendMessageRest(payload.conversationId, {
            content: payload.content,
            attachmentIds: payload.attachmentIds,
            clientMessageId: payload.clientMessageId,
          });
        }

        pendingRef.current.delete(payload.clientMessageId);
        upsertMessage(saved);
      } catch (e) {
        const reason = errorMessage(e, "Failed to send");
        setMessages((prev) =>
          prev.map((m) =>
            isLocal(m) && m.clientMessageId === payload.clientMessageId
              ? { ...m, localStatus: "failed", localError: reason }
              : m,
          ),
        );
      }
    },
    [upsertMessage],
  );

  const send = useCallback(
    async (input: { content: string; uploads: UploadedFile[] }) => {
      if (!conversationId || !myId) return;

      const text = input.content.trim();
      if (!text && input.uploads.length === 0) return;

      const clientMessageId = crypto.randomUUID();
      const payload: SendPayload = {
        conversationId,
        content: text || undefined,
        attachmentIds: input.uploads.length
          ? input.uploads.map((u) => u.id)
          : undefined,
        clientMessageId,
      };
      pendingRef.current.set(clientMessageId, payload);

      const allImages = input.uploads.every((u) =>
        u.mimeType.startsWith("image/"),
      );
      const local: LocalMessage = {
        id: `local-${clientMessageId}`,
        conversationId,
        senderId: myId,
        type:
          input.uploads.length === 0 ? "text" : allImages ? "image" : "file",
        content: text || null,
        clientMessageId,
        createdAt: new Date().toISOString(),
        attachments: input.uploads.map((u) => ({
          id: u.id,
          originalFilename: u.originalFilename,
          mimeType: u.mimeType,
          sizeBytes: u.sizeBytes,
        })),
        localStatus: "sending",
      };
      setMessages((prev) => sortMessages([...prev, local]));

      await deliver(payload);
    },
    [conversationId, myId, deliver],
  );

  const retry = useCallback(
    async (clientMessageId: string) => {
      const payload = pendingRef.current.get(clientMessageId);
      if (!payload) return;

      setMessages((prev) =>
        prev.map((m) =>
          isLocal(m) && m.clientMessageId === clientMessageId
            ? { ...m, localStatus: "sending", localError: undefined }
            : m,
        ),
      );
      await deliver(payload);
    },
    [deliver],
  );

  const loadOlder = useCallback(async () => {
    const cursor = nextCursorRef.current;
    if (!conversationId || !cursor || loadingOlder) return;

    try {
      setLoadingOlder(true);
      const page = await getMessages(conversationId, {
        before: cursor,
        limit: PAGE_SIZE,
      });

      nextCursorRef.current = page.nextCursor;
      setHasMoreOlder(page.hasMore);
      setMessages((prev) => {
        const known = new Set(prev.map((m) => m.id));
        return sortMessages([
          ...page.items.filter((m) => !known.has(m.id)),
          ...prev,
        ]);
      });
    } finally {
      setLoadingOlder(false);
    }
  }, [conversationId, loadingOlder]);

  return {
    order,
    setOrder,
    conversation,
    conversationId,
    myId,
    messages,
    hasMoreOlder,
    loading,
    loadingOlder,
    error,
    connected,
    send,
    retry,
    loadOlder,
    refreshOrder,
    syncMissed,
  };
}
