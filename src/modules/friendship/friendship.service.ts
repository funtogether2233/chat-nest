import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { Friendship } from './entities/friendship.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    private readonly userService: UserService
  ) {}

  async getFriendshipList(userId: string) {
    const friendshipListRes = await this.findAll(userId);
    const friendshipList = await Promise.all(
      friendshipListRes.map(async (friendshipInfo) => {
        const userId = friendshipInfo.friendId;
        const userDetailInfo = await this.userService.findOne(userId);
        return { userId: userId, userName: userDetailInfo.userName };
      })
    );
    friendshipList.sort((a, b) => {
      if (a.userName < b.userName) {
        return -1;
      }
      if (a.userName > b.userName) {
        return 1;
      }
      return 0;
    });
    return {
      friendshipList
    };
  }

  addFriendship(userId: string, friendId: string) {
    this.create({ userId, friendId });
    this.create({ userId: friendId, friendId: userId });
    return { success: true };
  }

  create(createFriendshipDto: CreateFriendshipDto) {
    const friendship = this.friendshipRepository.create(createFriendshipDto);
    return this.friendshipRepository.save(friendship);
  }

  async findAll(userId: string) {
    const friendship = this.friendshipRepository.findBy({ userId });
    if (!friendship) {
      throw new NotFoundException(`User #${userId}'s friendship not found`);
    }
    return friendship;
  }
}
