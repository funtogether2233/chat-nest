import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PostMessage } from './entities/post-message.entity';
import { PostMessageController } from './post-message.controller';
import { PostMessageService } from './post-message.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostMessage]), UserModule],
  controllers: [PostMessageController],
  providers: [PostMessageService],
  exports: [PostMessageService]
})
export class PostMessageModule {}
