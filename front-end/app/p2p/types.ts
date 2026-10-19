export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "completed"
  | "cancelled";
export type Role = "buyer" | "seller";

export interface Ad {
  id: number | string;
  side: "buy" | "sell";
  asset: string;
  fiat: string;
  price: string;
  total: string;
  remaining: string;
  minFiat: string;
  maxFiat: string;
  advertiser: string;
  paymentMethods: string[];
}

export interface PaymentMethod {
  id: number;
  name: string;
}

export interface Order {
  id: string;
  adId: number;
  conversationId: string | null;
  role: Role;
  buyerId: string;
  sellerId: string;
  paymentMethodId: number;
  asset: string;
  fiat: string;
  amount: string;
  price: string;
  fiatAmount: string;
  status: OrderStatus;
  paymentProofMessageId: string | null;
  expiresAt: string;
  paidAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface ChatAttachment {
  id: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
}

export type MessageType = "text" | "image" | "file";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string | null;
  clientMessageId: string | null;
  createdAt: string;
  attachments: ChatAttachment[];
}

export interface LocalMessage extends ChatMessage {
  localStatus?: "sending" | "failed";
  localError?: string;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  asset: string;
  fiat: string;
  amount: string;
  price: string;
  fiatAmount: string;
  expiresAt: string;
}

export interface ConversationDetails {
  id: string;
  orderId: string;
  role: Role;
  counterpart: string;
  unreadCount: number;
  order: OrderSummary;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListItem {
  id: string;
  orderId: string;
  role: Role;
  counterpart: string;
  order: OrderSummary;
  lastMessage: {
    id: string;
    senderId: string;
    type: MessageType;
    content: string | null;
    createdAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface MessagesPage {
  items: ChatMessage[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface UploadedFile {
  id: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  expiresAt: string;
}
