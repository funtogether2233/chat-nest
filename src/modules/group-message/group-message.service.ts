import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { GroupMessage } from './entities/group-message.entity';

@Injectable()
export class GroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly userMessageRepository: Repository<GroupMessage>,
    private readonly userService: UserService
  ) {}

  async getFromUserInfo({ fromId }: { fromId: string }) {
    const fromUserInfo = await this.userService.getUserInfo({
      userId: fromId
    });
    return { fromUserInfo };
  }

  async getGroupMessage({ toId }: { fromId: string; toId: string }) {
    const messageList = await this.findAll({ toId });
    const userMessageList = await Promise.all(
      messageList.map(async (messageInfo) => {
        const { fromUserInfo } = await this.getFromUserInfo({
          fromId: messageInfo.fromId
        });
        return {
          fromUserInfo,
          toId: messageInfo.toId,
          msg: messageInfo.msg,
          createdTime: messageInfo.createdTime
        };
      })
    );
    return { userMessageList };
  }

  async saveUserMessage(createGroupMessageDto: CreateGroupMessageDto) {
    return await this.create(createGroupMessageDto);
  }

  create(createGroupMessageDto: CreateGroupMessageDto) {
    const userMessage = this.userMessageRepository.create(
      createGroupMessageDto
    );
    return this.userMessageRepository.save(userMessage);
  }

  async findAll({ toId }: { toId: string }) {
    const messageListRes = await this.userMessageRepository.findBy({ toId });
    const messageList = messageListRes.sort(
      (a, b) => Number(a.createdTime) - Number(b.createdTime)
    );
    return messageList;
  }
}
