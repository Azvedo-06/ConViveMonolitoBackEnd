import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinEvent')
  handleJoinEvent(
    @MessageBody() data: { eventId: string | number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `event_${data.eventId}`;
    client.join(room);
    return { status: 'joined', room };
  }

  @SubscribeMessage('leaveEvent')
  handleLeaveEvent(
    @MessageBody() data: { eventId: string | number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `event_${data.eventId}`;
    client.leave(room);
    return { status: 'left', room };
  }
}
