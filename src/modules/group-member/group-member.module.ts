import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from '../group/group.module';
import { UserModule } from '../user/user.module';
import { GroupMember } from './entities/group-member.entity';
import { GroupMemberController } from './group-member.controller';
import { GroupMemberService } from './group-member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMember]),
    forwardRef(() => GroupModule),
    forwardRef(() => UserModule)
  ],
  controllers: [GroupMemberController],
  providers: [GroupMemberService],
  exports: [GroupMemberService]
})
export class GroupMemberModule {}
