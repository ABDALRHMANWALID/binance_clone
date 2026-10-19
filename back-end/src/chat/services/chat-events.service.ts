import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';
import { conversationRoom, userRoom } from '../chat.constants.js';

@Injectable()
export class ChatEventsService {
  private server?: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitToConversation(conversationId: string, event: string, payload: unknown) {
    this.server?.to(conversationRoom(conversationId)).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    this.server?.to(userRoom(userId)).emit(event, payload);
  }
}
