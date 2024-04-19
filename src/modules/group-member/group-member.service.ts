import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupService } from '../group/group.service';
import { UserService } from '../user/user.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { GroupMember } from './entities/group-member.entity';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async getGroupList({ userId }: { userId: string }) {
    const groupListRes = await this.findAllByUserId({ userId });
    const groupList = await Promise.all(
      groupListRes.map(async (groupInfo) => {
        const groupId = groupInfo.groupId;
        const groupDetailInfo = await this.groupService.findOne({ groupId });
        return { ...groupDetailInfo };
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

  async getGroupMemberList({ groupId }: { groupId: string }) {
    const groupMemberListRes = await this.findAllByGroupId({ groupId });
    const groupMemberList = await Promise.all(
      groupMemberListRes.map(async (groupMemberInfo) => {
        const userId = groupMemberInfo.userId;
        const userDetailInfo = await this.userService.findOne({ userId });
        const userStatus = await this.getUserStatus({ userId, groupId });
        return { ...userDetailInfo, ...userStatus };
      })
    );
    groupMemberList.sort((a, b) => {
      if (a.userName < b.userName) {
        return -1;
      }
      if (a.userName > b.userName) {
        return 1;
      }
      return 0;
    });
    return {
      groupMemberList
    };
  }

  async isInGroup({ userId, groupId }: { userId: string; groupId: string }) {
    const groupMember = await this.groupMemberRepository.findOneBy({
      userId,
      groupId
    });
    console.log(userId, groupId);
    if (groupMember) {
      return true;
    }
    return false;
  }

  addGroup({ userId, groupId }: { userId: string; groupId: string }) {
    this.create({ userId, groupId, userStatus: '1' });
    return { success: true };
  }

  async getUserStatus({
    userId,
    groupId
  }: {
    userId: string;
    groupId: string;
  }) {
    const groupMember = await this.findOne({ userId, groupId });
    return { userStatus: groupMember.userStatus };
  }

  async addAdmin({ groupId, userId }: { groupId: string; userId: string }) {
    const groupMember = await this.findOne({ userId, groupId });
    await this.update({
      id: groupMember.id,
      updateGroupMemberDto: { userStatus: '2' }
    });
    return { success: true };
  }

  async deleteAdmin({ groupId, userId }: { groupId: string; userId: string }) {
    const groupMember = await this.findOne({ userId, groupId });
    await this.update({
      id: groupMember.id,
      updateGroupMemberDto: { userStatus: '0' }
    });
    return { success: true };
  }

  async changeOwner({
    groupId,
    userId,
    memberId
  }: {
    groupId: string;
    userId: string;
    memberId: string;
  }) {
    const owner = await this.findOne({ userId, groupId });
    const member = await this.findOne({ userId: memberId, groupId });
    await this.update({
      id: owner.id,
      updateGroupMemberDto: { userStatus: '0' }
    });
    await this.update({
      id: member.id,
      updateGroupMemberDto: { userStatus: '1' }
    });
    return { success: true };
  }

  async exitGroup({ groupId, userId }: { groupId: string; userId: string }) {
    this.remove({ groupId, userId });
    return { success: true };
  }

  async addGroupMember({
    groupId,
    userId
  }: {
    groupId: string;
    userId: string;
  }) {
    this.create({ userId, groupId, userStatus: '0' });
    return { success: true };
  }

  create(createGroupMemberDto: CreateGroupMemberDto) {
    const groupMember = this.groupMemberRepository.create(createGroupMemberDto);
    return this.groupMemberRepository.save(groupMember);
  }

  async update({
    id,
    updateGroupMemberDto
  }: {
    id: number;
    updateGroupMemberDto: UpdateGroupMemberDto;
  }) {
    const groupMember = await this.groupMemberRepository.preload({
      id: id,
      ...updateGroupMemberDto
    });
    if (!groupMember) {
      throw new NotFoundException(
        `Group #${updateGroupMemberDto.groupId} not have User #${updateGroupMemberDto.userId}`
      );
    }
    this.groupMemberRepository.save(groupMember);
  }

  async remove({ groupId, userId }: { groupId: string; userId: string }) {
    const groupMember = await this.findOne({ userId, groupId });
    return this.groupMemberRepository.remove(groupMember);
  }

  async findAllByUserId({ userId }: { userId: string }) {
    const groupMember = this.groupMemberRepository.findBy({ userId });
    if (!groupMember) {
      throw new NotFoundException(`User #${userId}'s group not found`);
    }
    return groupMember;
  }

  async findAllByGroupId({ groupId }: { groupId: string }) {
    const groupMember = this.groupMemberRepository.findBy({ groupId });
    if (!groupMember) {
      throw new NotFoundException(`Group #${groupId}'s user not found`);
    }
    return groupMember;
  }

  async findOne({ userId, groupId }: { userId: string; groupId: string }) {
    const groupMember = await this.groupMemberRepository.findOneBy({
      userId,
      groupId
    });
    if (!groupMember) {
      throw new NotFoundException(`Group #${groupId} not have User #${userId}`);
    }
    return groupMember;
  }
}
