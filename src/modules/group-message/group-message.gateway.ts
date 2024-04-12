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
import { GroupMessageService } from './group-message.service';

@WebSocketGateway({
  cors: {
    origin: originAuth,
    credentials: true
  }
})
export class GroupMessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly groupMessageService: GroupMessageService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('GroupMessage 建立链接:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('GroupMessage 断开链接:', client.id);
  }

  afterInit(server: Server) {
    console.log('GroupMessage server 初始化完成', server);
  }

  @SubscribeMessage('join-group')
  joinGroup(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    console.log(body);
    const { fromId, toId } = body;
    const roomId = toId;
    client.join(roomId);
    console.log(`user ${fromId} join group ${toId}`);
  }

  @SubscribeMessage('leave-group')
  leaveGroup(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    console.log(body);
    const { fromId, toId } = body;
    const roomId = toId;
    client.leave(roomId);
    console.log(`user ${fromId} leave group ${toId}`);
  }

  @SubscribeMessage('group-message')
  handleGroupMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any
  ) {
    console.log(body);
    const { fromId, toId, msg, time } = body;
    console.log(`user ${fromId} to group ${toId} : ${msg}`);
    const roomId = toId;
    this.server.to(roomId).emit('group-message', { fromId, toId, msg, time });
  }
}
