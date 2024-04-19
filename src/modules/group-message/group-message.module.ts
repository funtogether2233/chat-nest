import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { GroupMessage } from './entities/group-message.entity';
import { GroupMessageController } from './group-message.controller';
import { GroupMessageGateway } from './group-message.gateway';
import { GroupMessageService } from './group-message.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMessage]), UserModule],
  controllers: [GroupMessageController],
  providers: [GroupMessageService, GroupMessageGateway]
})
export class GroupMessageModule {}
