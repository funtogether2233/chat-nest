import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>
  ) {}

  async searchGroupList(groupId: string) {
    const groupList = await this.findAll(groupId);
    return {
      groupList: groupList
        .map((groupInfo) => {
          return { groupId: groupInfo.groupId, groupName: groupInfo.groupName };
        })
        .sort((a, b) => {
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

  async findAll(groupId: string) {
    const groupList = this.groupRepository.findBy({ groupId });
    if (!groupList) {
      throw new NotFoundException(`group #${groupId} not found`);
    }
    return groupList;
  }

  async findOne(groupId: string) {
    const group = await this.groupRepository.findOneBy({ groupId });
    if (!group) {
      throw new NotFoundException(`group #${groupId} not found`);
    }
    return group;
  }
}
