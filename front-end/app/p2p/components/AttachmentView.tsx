"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAttachmentUrl } from "@/app/lib/chatApi";
import type { ChatAttachment } from "../types";

interface Props {
  attachment: ChatAttachment;
  pending?: boolean;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const REFRESH_AFTER_MS = 4 * 60 * 1000;

export default function AttachmentView({ attachment, pending }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const loadedAt = useRef(0);
  const retriedImage = useRef(false);

  const load = useCallback(async () => {
    try {
      const data = await getAttachmentUrl(attachment.id);
      loadedAt.current = Date.now();
      setUrl(data.url);
      setFailed(false);
      return data.url;
    } catch {
      setFailed(true);
      return null;
    }
  }, [attachment.id]);

  useEffect(() => {
    if (!pending) void load();
  }, [pending, load]);

  const open = async () => {
    let target = url;
    if (!target || Date.now() - loadedAt.current > REFRESH_AFTER_MS) {
      target = await load();
    }
    if (target) window.open(target, "_blank", "noopener,noreferrer");
  };

  const isImage = attachment.mimeType.startsWith("image/");

  if (isImage && !pending) {
    if (failed) {
      return (
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg bg-black/20 px-3 py-2 text-xs"
        >
          Could not load the image. Tap to retry
        </button>
      );
    }

    if (!url) {
      return <div className="h-32 w-48 animate-pulse rounded-lg bg-black/20" />;
    }

    return (
      <img
        src={url}
        alt={attachment.originalFilename}
        onClick={open}
        onError={() => {
          if (retriedImage.current) return setFailed(true);
          retriedImage.current = true;
          void load();
        }}
        className="max-h-60 max-w-full cursor-zoom-in rounded-lg object-contain"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      disabled={pending}
      className="flex w-full items-center gap-3 rounded-lg bg-black/20 p-3 text-left disabled:cursor-default"
    >
      <span className="text-2xl">{isImage ? "🖼️" : "📄"}</span>

      <span className="min-w-0">
        <span className="block max-w-48 truncate text-sm font-medium">
          {attachment.originalFilename}
        </span>
        <span className="block text-xs opacity-60">
          {pending
            ? "Uploading..."
            : failed
              ? "Tap to retry"
              : `Open - ${formatSize(attachment.sizeBytes)}`}
        </span>
      </span>
    </button>
  );
}
