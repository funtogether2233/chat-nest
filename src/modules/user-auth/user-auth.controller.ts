import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UserAuthService } from './user-auth.service';

@ApiTags('user-auth')
@Controller('user-auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserAuthDto) {
    return this.userAuthService.create(createUserDto);
  }

  @Public()
  @Post('login')
  login(@Body() { userId, userPwd }: { userId: string; userPwd: string }) {
    return this.userAuthService.login(userId, userPwd);
  }
}
