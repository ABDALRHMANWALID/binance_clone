"use client";

import { useEffect, useRef, useState } from "react";
import {
  ALLOWED_FILE_TYPES,
  errorMessage,
  payOrder,
  uploadFile,
  validateFile,
} from "@/app/lib/chatApi";
import type { Order, UploadedFile } from "../types";

interface Props {
  open: boolean;
  order: Order;
  conversationId: string;
  onClose: () => void;
  onPaid: (order: Order) => void;
}

export default function PayProofModal({
  open,
  order,
  conversationId,
  onClose,
  onPaid,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (open) {
      setFile(null);
      setUploaded(null);
      setNote("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, submitting, onClose]);

  if (!open) return null;

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    const problem = validateFile(selected);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setUploaded(null);
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Attach the transfer proof first");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const upload = uploaded ?? (await uploadFile(conversationId, file));
      setUploaded(upload);

      const updated = await payOrder(order.id, {
        uploadIds: [upload.id],
        note: note.trim() || undefined,
      });
      onPaid(updated);
    } catch (e) {
      setError(errorMessage(e, "Failed to send the proof"));
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-4"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="mx-auto my-4 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:my-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white">I have paid</h2>
        <p className="mt-2 text-sm text-slate-400">
          Transfer{" "}
          <span className="font-medium text-white">
            {order.fiatAmount} {order.fiat}
          </span>{" "}
          to the seller, then attach a screenshot or receipt of the transfer.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_FILE_TYPES.join(",")}
          className="hidden"
          onChange={handleSelect}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={submitting}
          className="mt-5 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 p-5 text-sm text-slate-400 transition hover:border-yellow-400 disabled:opacity-50"
        >
          {preview ? (
            <img
              src={preview}
              alt="Transfer proof"
              className="max-h-48 rounded-lg object-contain"
            />
          ) : file ? (
            <span className="text-2xl">📄</span>
          ) : (
            <span className="text-2xl">📎</span>
          )}

          <span className="mt-2 max-w-full truncate">
            {file ? file.name : "Choose an image or PDF (max 5MB)"}
          </span>
        </button>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={2}
          placeholder="Add a note (optional)"
          className="mt-4 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-base text-white outline-none placeholder:text-slate-600 focus:border-yellow-400 sm:text-sm"
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !file}
            className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send proof"}
          </button>
        </div>
      </div>
    </div>
  );
}
