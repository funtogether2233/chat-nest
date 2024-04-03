import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UserAuth } from './entities/user-auth.entity';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
    private readonly userService: UserService
  ) {}

  async create(createUserAuthDto: CreateUserAuthDto) {
    const userAuth = this.userAuthRepository.create(createUserAuthDto);
    const userAuthInfo = await this.findOne(createUserAuthDto.userId);
    if (userAuthInfo) {
      throw new UnauthorizedException(`帐号已存在`);
    }
    this.userService.create({
      userId: createUserAuthDto.userId,
      nickName: '默认新用户'
    });
    this.userAuthRepository.save(userAuth);
    return { success: true };
  }

  async login(userId: string, userPwd: string) {
    const userAuthInfo = await this.findOne(userId);
    if (userAuthInfo.userPwd !== userPwd) {
      throw new UnauthorizedException(`帐号或密码错误！`);
    }
    return { userId: userAuthInfo.userId, success: true };
  }

  async findOne(userId: string) {
    const user = await this.userAuthRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user;
  }

  //   findAll(paginationQuery: PaginationQueryDto) {
  //     const { limit, offset } = paginationQuery;
  //     return this.userAuthRepository.find({ skip: offset, take: limit });
  //   }

  //   async update(id: number, updateUserDto: UpdateUserAuthDto) {
  //     const user = await this.userAuthRepository.preload({
  //       id: +id,
  //       ...updateUserDto
  //     });
  //     if (!user) {
  //       throw new NotFoundException(`User #${id} not found`);
  //     }
  //     this.userAuthRepository.save(user);
  //   }

  //   async remove(id: number) {
  //     const user = await this.findOne(id);
  //     return this.userAuthRepository.remove(user);
  //   }
}
