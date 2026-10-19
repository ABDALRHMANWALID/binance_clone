"use client";

import { useRef, useState } from "react";
import {
  ALLOWED_FILE_TYPES,
  errorMessage,
  uploadFile,
  validateFile,
} from "@/app/lib/chatApi";
import type { UploadedFile } from "../types";

interface Props {
  conversationId: string;
  disabled: boolean;
  disabledReason?: string;
  onSend: (input: {
    content: string;
    uploads: UploadedFile[];
  }) => Promise<void>;
}

interface Pending {
  key: string;
  name: string;
  status: "uploading" | "ready" | "error";
  data?: UploadedFile;
  error?: string;
}

const MAX_FILES = 5;

export default function ChatInput({
  conversationId,
  disabled,
  disabledReason,
  onSend,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [files, setFiles] = useState<Pending[]>([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const uploading = files.some((f) => f.status === "uploading");
  const ready = files.filter((f) => f.status === "ready" && f.data);
  const canSend =
    !disabled &&
    !sending &&
    !uploading &&
    (text.trim() !== "" || ready.length > 0);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    setError("");

    const room = MAX_FILES - files.length;
    if (selected.length > room) {
      setError(`You can attach up to ${MAX_FILES} files`);
    }

    for (const file of selected.slice(0, Math.max(room, 0))) {
      const problem = validateFile(file);
      if (problem) {
        setError(problem);
        continue;
      }

      const key = crypto.randomUUID();
      setFiles((prev) => [
        ...prev,
        { key, name: file.name, status: "uploading" },
      ]);

      try {
        const data = await uploadFile(conversationId, file);
        setFiles((prev) =>
          prev.map((f) =>
            f.key === key ? { ...f, status: "ready", data } : f,
          ),
        );
      } catch (e) {
        const message = errorMessage(e, "Upload failed");
        setFiles((prev) =>
          prev.map((f) =>
            f.key === key ? { ...f, status: "error", error: message } : f,
          ),
        );
      }
    }
  };

  const handleSend = async () => {
    if (!canSend) return;

    try {
      setSending(true);
      await onSend({
        content: text,
        uploads: ready.map((f) => f.data as UploadedFile),
      });
      setText("");
      setFiles([]);
      setError("");
    } finally {
      setSending(false);
    }
  };

  if (disabled) {
    return (
      <div className="border-t border-slate-800 p-4 text-center text-sm text-slate-500">
        {disabledReason ?? "This conversation is closed"}
      </div>
    );
  }

  return (
    <div className="border-t border-slate-800 p-4">
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file) => (
            <span
              key={file.key}
              className={`flex max-w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${
                file.status === "error"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-slate-800 text-slate-300"
              }`}
              title={file.error}
            >
              <span className="max-w-40 truncate">{file.name}</span>
              <span className="opacity-60">
                {file.status === "uploading"
                  ? "uploading..."
                  : file.status === "error"
                    ? "failed"
                    : "ready"}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFiles((prev) => prev.filter((f) => f.key !== file.key))
                }
                aria-label={`Remove ${file.name}`}
                className="opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
          className="hidden"
          onChange={handleFileSelect}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= MAX_FILES}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl transition hover:bg-slate-700 disabled:opacity-40"
          title="Attach file"
        >
          📎
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          maxLength={2000}
          placeholder="Type a message..."
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-base outline-none placeholder:text-slate-600 focus:border-yellow-400 sm:text-sm"
        />

        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!canSend}
          className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <p className="mt-2 text-xs text-slate-600">
        JPEG, PNG, WEBP or PDF, up to 5MB each
      </p>
    </div>
  );
}
