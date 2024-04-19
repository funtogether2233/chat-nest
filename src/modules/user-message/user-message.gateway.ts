import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { originAuth } from 'src/utils/cors';
import { UserMessageService } from './user-message.service';

@WebSocketGateway({
  //   transports: ['websocket'],
  cors: {
    origin: originAuth,
    // origin: 'http://127.0.0.1:5173',
    // origin: '*',
    credentials: true
  }
})
export class UserMessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly userMessageService: UserMessageService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('UserMessage 建立链接:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('UserMessage 断开链接:', client.id);
  }

  afterInit(server: Server) {
    console.log('UserMessage server 初始化完成', server);
  }

  @SubscribeMessage('user-message')
  async handleUserMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any
  ) {
    const { fromId, toId, msg, time } = body;
    console.log(`user ${fromId} to user ${toId} : ${msg}`);
    this.userMessageService.saveUserMessage({ fromId, toId, msg, time });
    const { fromUserInfo } = await this.userMessageService.getFromUserInfo({
      fromId
    });
    this.server.emit('user-message', { fromUserInfo, toId, msg, time });
  }
}
