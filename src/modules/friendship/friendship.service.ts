import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { Friendship } from './entities/friendship.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async getFriendshipList({ userId }: { userId: string }) {
    const friendshipListRes = await this.findAll(userId);
    const friendshipList = await Promise.all(
      friendshipListRes.map(async (friendshipInfo) => {
        const friendId = friendshipInfo.friendId;
        const userDetailInfo = await this.userService.findOne({
          userId: friendId
        });
        const userPostPermission = await this.getPostPermission({
          userId,
          friendId
        });
        const friendPostPermission = await this.getPostPermission({
          userId: friendId,
          friendId: userId
        });
        return {
          ...userDetailInfo,
          userPostPermission: userPostPermission.postPermission,
          friendPostPermission: friendPostPermission.postPermission
        };
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

  addFriendship({ userId, friendId }: { userId: string; friendId: string }) {
    this.create({ userId, friendId, postPermission: 1 });
    this.create({ userId: friendId, friendId: userId, postPermission: 1 });
    return { success: true };
  }

  deleteFriendship({ userId, friendId }: { userId: string; friendId: string }) {
    this.remove({ userId, friendId });
    this.remove({ userId: friendId, friendId: userId });
    return { success: true };
  }

  async isFriendship({
    userId,
    friendId
  }: {
    userId: string;
    friendId: string;
  }) {
    const friendship = await this.friendshipRepository.findOneBy({
      userId,
      friendId
    });
    console.log('friendship', friendship);
    if (friendship) {
      return true;
    }
    return false;
  }

  async getPostPermission({
    userId,
    friendId
  }: {
    userId: string;
    friendId: string;
  }) {
    const friendship = await this.findOne({ userId, friendId });
    return { postPermission: friendship.postPermission };
  }

  async allowPostPermission({
    userId,
    friendId
  }: {
    userId: string;
    friendId: string;
  }) {
    return this.updatePostPermission({ userId, friendId, postPermission: 1 });
  }

  async banPostPermission({
    userId,
    friendId
  }: {
    userId: string;
    friendId: string;
  }) {
    return this.updatePostPermission({ userId, friendId, postPermission: 0 });
  }

  async updatePostPermission({
    userId,
    friendId,
    postPermission
  }: {
    userId: string;
    friendId: string;
    postPermission: number;
  }) {
    const friendship = await this.findOne({ userId, friendId });
    await this.update({
      id: friendship.id,
      updateGroupMemberDto: { postPermission }
    });
    return { success: true };
  }

  create(createFriendshipDto: CreateFriendshipDto) {
    const friendship = this.friendshipRepository.create(createFriendshipDto);
    return this.friendshipRepository.save(friendship);
  }

  async update({
    id,
    updateGroupMemberDto
  }: {
    id: number;
    updateGroupMemberDto: UpdateFriendshipDto;
  }) {
    const friendship = await this.friendshipRepository.preload({
      id: id,
      ...updateGroupMemberDto
    });
    if (!friendship) {
      throw new NotFoundException(
        `User #${updateGroupMemberDto.userId}'s friendship not found`
      );
    }
    this.friendshipRepository.save(friendship);
  }

  async remove({ userId, friendId }: { userId: string; friendId: string }) {
    const friendship = await this.findOne({ userId, friendId });
    return this.friendshipRepository.remove(friendship);
  }

  async findAll(userId: string) {
    const friendship = this.friendshipRepository.findBy({ userId });
    if (!friendship) {
      throw new NotFoundException(`User #${userId}'s friendship not found`);
    }
    return friendship;
  }

  async findOne({ userId, friendId }: { userId: string; friendId: string }) {
    const friendship = await this.friendshipRepository.findOneBy({
      userId,
      friendId
    });
    if (!friendship) {
      throw new NotFoundException(`User #${friendId} not found`);
    }
    return friendship;
  }
}
