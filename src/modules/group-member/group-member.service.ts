import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupService } from '../group/group.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { GroupMember } from './entities/group-member.entity';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    private readonly groupService: GroupService
  ) {}

  async getGroupList(userId: string) {
    const groupListRes = await this.findAll(userId);
    const groupList = await Promise.all(
      groupListRes.map(async (groupInfo) => {
        const groupId = groupInfo.groupId;
        const groupDetailInfo = await this.groupService.findOne(groupId);
        return { groupId, groupName: groupDetailInfo.groupName };
      })
    );
    groupList.sort((a, b) => {
      if (a.groupName < b.groupName) {
        return -1;
      }
      if (a.groupName > b.groupName) {
        return 1;
      }
      return 0;
    });
    return {
      groupList
    };
  }

  addGroup(userId: string, groupId: string) {
    this.create({ userId, groupId });
    return { success: true };
  }

  create(createGroupMemberDto: CreateGroupMemberDto) {
    const groupMember = this.groupMemberRepository.create(createGroupMemberDto);
    return this.groupMemberRepository.save(groupMember);
  }

  async findAll(userId: string) {
    const groupMember = this.groupMemberRepository.findBy({ userId });
    if (!groupMember) {
      throw new NotFoundException(`User #${userId}'s group not found`);
    }
    return groupMember;
  }
}
