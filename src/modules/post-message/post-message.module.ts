import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { PostMessage } from './entities/post-message.entity';
import { PostMessageController } from './post-message.controller';
import { PostMessageService } from './post-message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostMessage]),
    forwardRef(() => PostModule),
    UserModule
  ],
  controllers: [PostMessageController],
  providers: [PostMessageService],
  exports: [PostMessageService]
})
export class PostMessageModule {}
