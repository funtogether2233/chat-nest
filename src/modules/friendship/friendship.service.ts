import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>
  ) {}

  async getFriendshipList(userId: string) {
    const friendshipList = await this.findAll(userId);
    return {
      friendshipList: friendshipList.map((friendshipInfo) => {
        return { friendId: friendshipInfo.friendId };
      })
    };
  }

  async findAll(userId: string) {
    const friendship = this.friendshipRepository.findBy({ userId });
    if (!friendship) {
      throw new NotFoundException(`User #${userId}'s friendship not found`);
    }
    return friendship;
  }
}
