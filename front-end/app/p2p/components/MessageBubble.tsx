"use client";

import type { LocalMessage } from "../types";
import AttachmentView from "./AttachmentView";

interface Props {
  message: LocalMessage;
  mine: boolean;
  isProof: boolean;
  onRetry: (clientMessageId: string) => void;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function MessageBubble({
  message,
  mine,
  isProof,
  onRetry,
}: Props) {
  const pending =
    message.localStatus === "sending" || message.localStatus === "failed";

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 sm:max-w-[70%] ${
          mine ? "bg-yellow-400 text-black" : "bg-slate-800 text-white"
        } ${message.localStatus === "sending" ? "opacity-70" : ""}`}
      >
        {isProof && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide opacity-70">
            Payment proof
          </p>
        )}

        {message.attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {message.attachments.map((attachment) => (
              <AttachmentView
                key={attachment.id}
                attachment={attachment}
                pending={pending}
              />
            ))}
          </div>
        )}

        {message.content && (
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        )}

        <div className="mt-1 flex items-center justify-end gap-2 text-[11px] opacity-60">
          {message.localStatus === "sending" && <span>Sending...</span>}

          {message.localStatus === "failed" && (
            <>
              <span className="text-red-700">
                {message.localError ?? "Failed"}
              </span>
              <button
                type="button"
                onClick={() =>
                  message.clientMessageId && onRetry(message.clientMessageId)
                }
                className="font-semibold underline"
              >
                Retry
              </button>
            </>
          )}

          {!message.localStatus && <span>{formatTime(message.createdAt)}</span>}
        </div>
      </div>
    </div>
  );
}
