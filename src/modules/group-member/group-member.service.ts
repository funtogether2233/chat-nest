import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from './entities/group-member.entity';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>
  ) {}

  async getGroupList(userId: string) {
    const groupList = await this.findAll(userId);
    return {
      groupList: groupList.map((groupInfo) => {
        return { groupId: groupInfo.groupId };
      })
    };
  }

  async findAll(userId: string) {
    const groupMember = this.groupMemberRepository.findBy({ userId });
    if (!groupMember) {
      throw new NotFoundException(`User #${userId}'s group not found`);
    }
    return groupMember;
  }
}
