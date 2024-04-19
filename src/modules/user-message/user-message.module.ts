import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserMessage } from './entities/user-message.entity';
import { UserMessageController } from './user-message.controller';
import { UserMessageGateway } from './user-message.gateway';
import { UserMessageService } from './user-message.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserMessage]), UserModule],
  controllers: [UserMessageController],
  providers: [UserMessageService, UserMessageGateway]
})
export class UserMessageModule {}
