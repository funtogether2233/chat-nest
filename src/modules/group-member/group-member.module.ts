import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-member.entity';
import { GroupMemberController } from './group-member.controller';
import { GroupMemberService } from './group-member.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember])],
  controllers: [GroupMemberController],
  providers: [GroupMemberService]
})
export class GroupMemberModule {}
