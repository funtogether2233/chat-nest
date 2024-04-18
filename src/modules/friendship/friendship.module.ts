import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Friendship } from './entities/friendship.entity';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship]), UserModule],
  controllers: [FriendshipController],
  providers: [FriendshipService]
})
export class FriendshipModule {}
