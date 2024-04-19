import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipModule } from '../friendship/friendship.module';
import { PostMessageModule } from '../post-message/post-message.module';
import { UserModule } from '../user/user.module';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    PostMessageModule,
    UserModule,
    FriendshipModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
