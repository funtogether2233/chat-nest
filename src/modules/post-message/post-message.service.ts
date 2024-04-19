import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreatePostMessageDto } from './dto/create-post-message.dto';
import { PostMessage } from './entities/post-message.entity';

@Injectable()
export class PostMessageService {
  constructor(
    @InjectRepository(PostMessage)
    private readonly postMessageRepository: Repository<PostMessage>,
    private readonly userService: UserService
  ) {}

  async getPostMessageList({ postId }: { postId: string }) {
    const postMessageListRes = await this.findAll({ postId });
    const postMessageList = await Promise.all(
      postMessageListRes.map(async (postMessage) => {
        const userInfo = await this.userService.getUserInfo({
          userId: postMessage.userId
        });
        return {
          userInfo,
          ...postMessage
        };
      })
    );
    return {
      postMessageList: postMessageList.sort(
        (a, b) => Number(b.createdTime) - Number(a.createdTime)
      )
    };
  }

  async createPostMessage(createPostMessageDto: CreatePostMessageDto) {
    await this.create(createPostMessageDto);
    return { success: true };
  }

  create(createPostMessageDto: CreatePostMessageDto) {
    const post = this.postMessageRepository.create(createPostMessageDto);
    return this.postMessageRepository.save(post);
  }

  async findAll({ postId }: { postId: string }) {
    const postMessageList = await this.postMessageRepository.findBy({
      postId
    });
    return postMessageList;
  }
}
