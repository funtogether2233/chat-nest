import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Like, Repository } from 'typeorm';
import { FriendshipService } from '../friendship/friendship.service';
import { GroupMemberService } from '../group-member/group-member.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => FriendshipService))
    private readonly friendshipService: FriendshipService,
    @Inject(forwardRef(() => GroupMemberService))
    private readonly groupMemberService: GroupMemberService
  ) {}

  async getUserInfo({ userId }: { userId: string }) {
    const user = await this.findOne({ userId });
    return user;
  }

  async updateUserInfo(updateUserDto: UpdateUserDto) {
    const user = await this.findOne({ userId: updateUserDto.userId });
    const newUser = await this.userRepository.preload({
      id: user.id,
      ...updateUserDto
    });
    if (!newUser) {
      throw new NotFoundException(`User #${user.userId} not found`);
    }
    this.userRepository.save(newUser);
  }

  async getFriendList({
    userId,
    friendId,
    groupId
  }: {
    userId: string;
    friendId?: string;
    groupId?: string;
  }) {
    const friendshipListRes = await this.findAllFriend(userId);
    const friendshipList = await Promise.all(
      friendshipListRes.map(async (friendshipInfo) => {
        const isFriendship = await this.friendshipService.isFriendship({
          userId: friendshipInfo.userId,
          friendId
        });
        const isInGroup = await this.groupMemberService.isInGroup({
          userId: friendshipInfo.userId,
          groupId
        });
        return {
          userId: friendshipInfo.userId,
          userName: friendshipInfo.userName,
          isFriendship,
          isInGroup
        };
      })
    );
    return {
      friendshipList: friendshipList.sort((a, b) => {
        if (a.userName < b.userName) {
          return -1;
        }
        if (a.userName > b.userName) {
          return 1;
        }
        return 0;
      })
    };
  }

  async findAllFriend(userId: string) {
    const friendshipList = await this.userRepository.findBy({
      userId: Like(`%${userId}%`)
    });
    if (friendshipList.length === 0) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return friendshipList;
  }

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.userRepository.find({ skip: offset, take: limit });
  }

  async findOne({ userId }: { userId: string }) {
    const user = await this.userRepository.findOneBy({ userId });
    //   findOne({where:{id:Number(id)},relation:['flavors']})
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne({ userId: id });
    return this.userRepository.remove(user);
  }
}
