import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { GroupMemberService } from '../group-member/group-member.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(forwardRef(() => GroupMemberService))
    private readonly groupMemberService: GroupMemberService
  ) {}

  async getGroupInfo({ groupId }: { groupId: string }) {
    const group = await this.findOne({ groupId });
    return group;
  }

  async updateGroupInfo(updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne({ groupId: updateGroupDto.groupId });
    const newGroup = await this.groupRepository.preload({
      id: group.id,
      ...updateGroupDto
    });
    if (!newGroup) {
      throw new NotFoundException(`group #${updateGroupDto.groupId} not found`);
    }
    this.groupRepository.save(newGroup);
  }

  async searchGroupList({
    groupId,
    userId
  }: {
    groupId: string;
    userId: string;
  }) {
    const groupListRes = await this.findAll({ groupId });
    const groupList = await Promise.all(
      groupListRes.map(async (groupInfo) => {
        const isInGroup = await this.groupMemberService.isInGroup({
          userId,
          groupId: groupInfo.groupId
        });
        return {
          groupId: groupInfo.groupId,
          groupName: groupInfo.groupName,
          isInGroup
        };
      })
    );
    return {
      groupList: groupList.sort((a, b) => {
        if (a.groupName < b.groupName) {
          return -1;
        }
        if (a.groupName > b.groupName) {
          return 1;
        }
        return 0;
      })
    };
  }

  async setUpNewGroup({
    userId,
    groupId,
    groupName
  }: {
    userId: string;
    groupId: string;
    groupName: string;
  }) {
    await this.create({
      groupId,
      groupName,
      groupIntroduction: '介绍一下群聊吧~',
      avatarImg: 'https://img2.imgtp.com/2024/04/20/I2HmK2PR.png'
    });
    this.groupMemberService.addGroup({ userId, groupId });
    console.log('结束');
    return { success: true };
  }

  async create(createGroupDto: CreateGroupDto) {
    const group = await this.groupRepository.findOneBy({
      groupId: createGroupDto.groupId
    });
    if (group) {
      throw new UnauthorizedException(`帐号已存在`);
    }
    const newGroup = this.groupRepository.create(createGroupDto);
    return this.groupRepository.save(newGroup);
  }

  async findAll({ groupId }: { groupId: string }) {
    const groupList = await this.groupRepository.findBy({
      groupId: Like(`%${groupId}%`)
    });
    if (groupList.length === 0) {
      throw new NotFoundException(`group #${groupId} not found`);
    }
    return groupList;
  }

  async findOne({ groupId }: { groupId: string }) {
    const group = await this.groupRepository.findOneBy({ groupId });
    if (!group) {
      throw new NotFoundException(`group #${groupId} not found`);
    }
    return group;
  }
}
