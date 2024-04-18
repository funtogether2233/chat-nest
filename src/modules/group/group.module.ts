import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMemberModule } from '../group-member/group-member.module';
import { Group } from './entities/group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    forwardRef(() => GroupMemberModule)
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule {}
