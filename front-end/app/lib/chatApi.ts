import axios from "axios";
import api from "@/app/lib/axios";
import type {
  ChatMessage,
  ConversationDetails,
  ConversationListItem,
  MessagesPage,
  Order,
  PaymentMethod,
  UploadedFile,
} from "@/app/p2p/types";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
});

export function errorMessage(e: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(e)) {
    const m = e.response?.data?.message;
    return Array.isArray(m) ? m.join(", ") : m || fallback;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

export const getPaymentMethods = () =>
  api.get<PaymentMethod[]>("/payment-methods", auth()).then((r) => r.data);

export const createOrder = (
  adId: number | string,
  body: { amount: string; paymentMethodId: number },
) => api.post<Order>(`/ads/${adId}/orders`, body, auth()).then((r) => r.data);

export const getOrder = (orderId: string) =>
  api.get<Order>(`/orders/${orderId}`, auth()).then((r) => r.data);

export const payOrder = (
  orderId: string,
  body: { uploadIds: string[]; note?: string },
) =>
  api.post<Order>(`/orders/${orderId}/pay`, body, auth()).then((r) => r.data);

export const confirmOrder = (orderId: string) =>
  api.post<Order>(`/orders/${orderId}/confirm`, {}, auth()).then((r) => r.data);

export const cancelOrder = (orderId: string) =>
  api.post<Order>(`/orders/${orderId}/cancel`, {}, auth()).then((r) => r.data);

export const getConversations = (limit = 10) =>
  api
    .get<{ items: ConversationListItem[] }>("/chat/conversations", {
      ...auth(),
      params: { limit },
    })
    .then((r) => r.data);

export const getConversation = (conversationId: string) =>
  api
    .get<ConversationDetails>(`/chat/conversations/${conversationId}`, auth())
    .then((r) => r.data);

export const getMessages = (
  conversationId: string,
  params: { before?: string; after?: string; limit?: number },
) =>
  api
    .get<MessagesPage>(`/chat/conversations/${conversationId}/messages`, {
      ...auth(),
      params,
    })
    .then((r) => r.data);

export const sendMessageRest = (
  conversationId: string,
  body: { content?: string; attachmentIds?: string[]; clientMessageId: string },
) =>
  api
    .post<ChatMessage>(
      `/chat/conversations/${conversationId}/messages`,
      body,
      auth(),
    )
    .then((r) => r.data);

export const markReadRest = (
  conversationId: string,
  lastReadMessageId: string,
) =>
  api
    .post(
      `/chat/conversations/${conversationId}/read`,
      { lastReadMessageId },
      auth(),
    )
    .then((r) => r.data);

export const uploadFile = (conversationId: string, file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api
    .post<UploadedFile>(
      `/chat/conversations/${conversationId}/uploads`,
      form,
      auth(),
    )
    .then((r) => r.data);
};

export const getAttachmentUrl = (attachmentId: string) =>
  api
    .get<{
      url: string;
      expiresAt: string;
    }>(`/chat/attachments/${attachmentId}/url`, auth())
    .then((r) => r.data);

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function validateFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WEBP or PDF files are allowed";
  }
  if (file.size > MAX_FILE_BYTES) return "File size cannot exceed 5MB";
  return null;
}
