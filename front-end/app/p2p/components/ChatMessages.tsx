"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { LocalMessage } from "../types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: LocalMessage[];
  myId: string;
  proofMessageId: string | null;
  hasMoreOlder: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: (clientMessageId: string) => void;
}

export default function ChatMessages({
  messages,
  myId,
  proofMessageId,
  hasMoreOlder,
  loadingOlder,
  onLoadOlder,
  onRetry,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const heightBeforeOlder = useRef<number | null>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    stickToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const handleLoadOlder = () => {
    heightBeforeOlder.current = containerRef.current?.scrollHeight ?? null;
    onLoadOlder();
  };

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (heightBeforeOlder.current !== null) {
      el.scrollTop = el.scrollHeight - heightBeforeOlder.current;
      heightBeforeOlder.current = null;
      return;
    }

    if (stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!loadingOlder) heightBeforeOlder.current = null;
  }, [loadingOlder]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex h-[55vh] min-h-[360px] flex-col gap-3 overflow-y-auto p-4 sm:p-6"
    >
      {hasMoreOlder && (
        <button
          type="button"
          onClick={handleLoadOlder}
          disabled={loadingOlder}
          className="mx-auto rounded-full border border-slate-700 px-4 py-1.5 text-xs text-slate-400 transition hover:border-slate-500 disabled:opacity-50"
        >
          {loadingOlder ? "Loading..." : "Load older messages"}
        </button>
      )}

      {messages.length === 0 && (
        <p className="m-auto text-center text-sm text-slate-500">
          No messages yet. Say hello and agree on the payment details.
        </p>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.clientMessageId ?? message.id}
          message={message}
          mine={message.senderId === myId}
          isProof={proofMessageId !== null && message.id === proofMessageId}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}
