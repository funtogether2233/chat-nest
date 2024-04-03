import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { UserAuth } from './entities/user-auth.entity';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAuth]), UserModule],
  controllers: [UserAuthController],
  providers: [UserAuthService]
})
export class UserAuthModule {}
