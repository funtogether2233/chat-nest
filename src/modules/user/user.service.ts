import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getUserInfo(userId: string) {
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

  async getFriendList(userId: string) {
    const friendshipList = await this.findAllFriend(userId);
    return {
      friendshipList: friendshipList
        .map((friendshipInfo) => {
          return {
            userId: friendshipInfo.userId,
            userName: friendshipInfo.userName
          };
        })
        .sort((a, b) => {
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
    const friendshipList = await this.userRepository.findBy({ userId });
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
