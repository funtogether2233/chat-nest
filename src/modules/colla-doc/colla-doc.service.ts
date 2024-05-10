import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMemberService } from '../group-member/group-member.service';
import { GroupService } from '../group/group.service';
import { CreateCollaDocDto } from './dto/create-colla-doc.dto';
import { UpdateCollaDocDto } from './dto/update-colla-doc.dto';
import { CollaDoc } from './entities/colla-doc.entity';

@Injectable()
export class CollaDocService {
  constructor(
    @InjectRepository(CollaDoc)
    private readonly collaDocRepository: Repository<CollaDoc>,
    private readonly groupService: GroupService,
    private readonly groupMemberService: GroupMemberService
  ) {}

  async addDoc({ groupId }: { groupId: string }) {
    const collaDoc = await this.create({
      groupId,
      docName: '默认文档',
      docIntroduction: '介绍一下群聊吧~',
      isDelete: 0
    });
    return { ...collaDoc, success: true };
  }

  async deleteDoc({ docId }: { docId: string }) {
    const collaDoc = await this.findOneByDocId({ docId });
    const newCollaDoc = await this.collaDocRepository.preload({
      id: collaDoc.id,
      isDelete: 1
    });
    if (!newCollaDoc) {
      throw new NotFoundException(`colla doc #${docId} not found`);
    }
    this.collaDocRepository.save(newCollaDoc);
    return { success: true };
  }

  async getDocInfo({ docId }: { docId: string }) {
    const collaDoc = await this.findOneByDocId({ docId });
    return { ...collaDoc };
  }

  async updateDocInfo({
    docId,
    updateCollaDocDto
  }: {
    docId: string;
    updateCollaDocDto: UpdateCollaDocDto;
  }) {
    const collaDoc = await this.findOneByDocId({ docId });
    const newCollaDoc = await this.collaDocRepository.preload({
      id: collaDoc.id,
      ...updateCollaDocDto
    });
    if (!newCollaDoc) {
      throw new NotFoundException(`colla doc #${collaDoc.id} not found`);
    }
    this.collaDocRepository.save(newCollaDoc);
    return { success: true };
  }

  async getGroupDoclist({ groupId }: { groupId: string }) {
    const groupDocListRes = (await this.findAllByGroupId({ groupId })).filter(
      (collaDoc) => collaDoc.isDelete === 0
    );
    const groupInfo = await this.groupService.getGroupInfo({ groupId });
    const groupDocList = await Promise.all(
      groupDocListRes.map(async (docInfo) => {
        return { ...docInfo, groupInfo };
      })
    );
    return { groupDocList };
  }

  async getDoclist({ userId }: { userId: string }) {
    const groupList = (await this.groupMemberService.getGroupList({ userId }))
      .groupList;
    const docList = [];
    for (let i = 0; i < groupList.length; ++i) {
      const groupInfo = groupList[i];
      const { groupId } = groupInfo;
      const tmpDocList = (await this.getGroupDoclist({ groupId })).groupDocList;
      docList.push(...tmpDocList);
    }
    return { docList };
  }

  async create(createCollaDocDto: CreateCollaDocDto) {
    const collaDoc = this.collaDocRepository.create(createCollaDocDto);
    return this.collaDocRepository.save(collaDoc);
  }

  async findAllByGroupId({ groupId }: { groupId: string }) {
    const collaDoc = await this.collaDocRepository.findBy({ groupId });
    if (!collaDoc) {
      throw new NotFoundException(`group #${groupId} not have colla doc`);
    }
    return collaDoc;
  }

  async findOneByDocId({ docId }: { docId: string }) {
    const collaDoc = await this.collaDocRepository.findOneBy({ id: +docId });
    if (!collaDoc) {
      throw new NotFoundException(`colla doc #${docId} not found`);
    }
    return collaDoc;
  }

  async findOneByGroupId({ groupId }: { groupId: string }) {
    const collaDoc = await this.collaDocRepository.findOneBy({ groupId });
    if (!collaDoc) {
      throw new NotFoundException(`group #${groupId} not have colla doc`);
    }
    return collaDoc;
  }
}
