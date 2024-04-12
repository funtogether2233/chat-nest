import { Module } from '@nestjs/common';
import { UserMessageController } from './user-message.controller';
import { UserMessageGateway } from './user-message.gateway';
import { UserMessageService } from './user-message.service';

@Module({
  controllers: [UserMessageController],
  providers: [UserMessageService, UserMessageGateway]
})
export class UserMessageModule {}
