import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
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
    const user = await this.userAuthRepository.findOneBy({
      userId: createUserAuthDto.userId
    });

    if (user) {
      throw new UnauthorizedException(`帐号已存在`);
    }
    const userAuth = this.userAuthRepository.create(createUserAuthDto);
    this.userService.create({
      userId: createUserAuthDto.userId,
      userName: '默认新用户',
      userIntroduction: '介绍一下你自己吧~'
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
}
