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
import { CollaDocService } from './colla-doc.service';
import { CreateCollaDocDto } from './dto/create-colla-doc.dto';
import { UpdateCollaDocDto } from './dto/update-colla-doc.dto';

@WebSocketGateway({
  //   path: 'undefined',
  transports: ['websocket'],
  cors: {
    origin: '*'
  }
})
export class CollaDocGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly collaDocService: CollaDocService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('建立链接:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('断开链接:', client.id);
  }

  afterInit(server: Server) {
    console.log('server 初始化完成', server);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any
  ) {
    console.log('接收消息：', message);

    // 发送消息
    this.server.emit('message', 'hi client');

    // 关闭连接
    client.disconnect();
  }

  @SubscribeMessage('chat_message')
  handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any
  ): string {
    // 向所有人广播
    this.server.emit('response_message', message);
    return '发送成功!';
  }

  //   @SubscribeMessage('quill-demo-room')
  //   async getMsgAChat(
  //     @ConnectedSocket() client: any,
  //     @MessageBody()
  //     data: {
  //       roomId: string;
  //       userId: string;
  //     }
  //   ) {
  //     return await new Promise(async (resolve, reject) => {
  //       await this.callServiceBaseService
  //         .getMeetingMsgByRoomId(data.roomId)
  //         .then((res) => {
  //           resolve({
  //             msg: '获取成功',
  //             success: true,
  //             data: res
  //           });
  //         })
  //         .catch((e) => {
  //           reject({
  //             msg: '获取失败',
  //             success: false,
  //             data: []
  //           });
  //         });
  //     });
  //   }

  @SubscribeMessage('createCollaDoc')
  create(@MessageBody() createCollaDocDto: CreateCollaDocDto) {
    return this.collaDocService.create(createCollaDocDto);
  }

  @SubscribeMessage('findAllCollaDoc')
  findAll() {
    return this.collaDocService.findAll();
  }

  @SubscribeMessage('findOneCollaDoc')
  findOne(@MessageBody() id: number) {
    return this.collaDocService.findOne(id);
  }

  @SubscribeMessage('updateCollaDoc')
  update(@MessageBody() updateCollaDocDto: UpdateCollaDocDto) {
    return this.collaDocService.update(updateCollaDocDto.id, updateCollaDocDto);
  }

  @SubscribeMessage('removeCollaDoc')
  remove(@MessageBody() id: number) {
    return this.collaDocService.remove(id);
  }
}
