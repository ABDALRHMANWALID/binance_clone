export const CHAT_EVENTS = {
  JOIN: 'conversation:join',
  LEAVE: 'conversation:leave',
  SEND: 'message:send',
  READ: 'conversation:read',
  JOINED: 'conversation:joined',
  NEW: 'message:new',
  FAILED: 'message:failed',
  UNREAD_UPDATED: 'conversation:unread_updated',
  CONVERSATION_CREATED: 'conversation:created',
  ORDER_UPDATED: 'order:updated',
} as const;

export const conversationRoom = (conversationId: string) =>
  `conversation:${conversationId}`;
export const userRoom = (userId: string) => `user:${userId}`;

export const OPEN_ORDER_STATUSES = ['pending_payment', 'paid'];

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_MESSAGE = 5;
