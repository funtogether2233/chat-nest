import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateUserMessageDto } from './dto/create-user-message.dto';
import { UserMessage } from './entities/user-message.entity';

@Injectable()
export class UserMessageService {
  constructor(
    @InjectRepository(UserMessage)
    private readonly userMessageRepository: Repository<UserMessage>,
    private readonly userService: UserService
  ) {}

  async getFromUserInfo({ fromId }: { fromId: string }) {
    const fromUserInfo = await this.userService.getUserInfo({
      userId: fromId
    });
    return { fromUserInfo };
  }

  async getUserMessage({ fromId, toId }: { fromId: string; toId: string }) {
    const messageList = await this.findAll({ fromId, toId });
    const userMessageList = await Promise.all(
      messageList.map(async (messageInfo) => {
        const { fromUserInfo } = await this.getFromUserInfo({
          fromId: messageInfo.fromId
        });
        return {
          fromUserInfo,
          toId,
          msg: messageInfo.msg,
          time: messageInfo.time
        };
      })
    );
    return userMessageList;
  }

  async saveUserMessage(createUserMessageDto: CreateUserMessageDto) {
    await this.create(createUserMessageDto);
  }

  create(createUserMessageDto: CreateUserMessageDto) {
    const userMessage = this.userMessageRepository.create(createUserMessageDto);
    return this.userMessageRepository.save(userMessage);
  }

  async findAll({ fromId, toId }: { fromId: string; toId: string }) {
    const messageListFrom = await this.userMessageRepository.findBy({
      fromId,
      toId
    });
    const messageListTo = await this.userMessageRepository.findBy({
      fromId: toId,
      toId: fromId
    });
    const messageList = [...messageListFrom, ...messageListTo].sort(
      (a, b) => a.time - b.time
    );
    return messageList;
  }
}
