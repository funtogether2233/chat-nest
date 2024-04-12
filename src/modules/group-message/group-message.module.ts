import { Module } from '@nestjs/common';
import { GroupMessageController } from './group-message.controller';
import { GroupMessageGateway } from './group-message.gateway';
import { GroupMessageService } from './group-message.service';

@Module({
  controllers: [GroupMessageController],
  providers: [GroupMessageService, GroupMessageGateway]
})
export class GroupMessageModule {}
