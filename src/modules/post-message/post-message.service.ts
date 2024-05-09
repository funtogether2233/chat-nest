import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { CreatePostMessageDto } from './dto/create-post-message.dto';
import { PostMessage } from './entities/post-message.entity';

@Injectable()
export class PostMessageService {
  constructor(
    @InjectRepository(PostMessage)
    private readonly postMessageRepository: Repository<PostMessage>,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly userService: UserService
  ) {}

  async getPostMessageList({ postId }: { postId: string }) {
    const postMessageListRes = (await this.findAllByPostId({ postId })).filter(
      (postMessage) => postMessage.isDelete === 0
    );
    const postUserId = (await this.postService.getPostUserId({ postId }))
      .postUserId;
    const postMessageList = await Promise.all(
      postMessageListRes.map(async (postMessage) => {
        const userInfo = await this.userService.getUserInfo({
          userId: postMessage.userId
        });
        return {
          userInfo,
          postUserId,
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

  async createPostMessage({
    postId,
    userId,
    content
  }: {
    postId: string;
    userId: string;
    content: string;
  }) {
    await this.create({
      postId,
      userId,
      content,
      isDelete: 0
    });
    return { success: true };
  }

  async deletePostMessage({ postMessageId }: { postMessageId: string }) {
    const post = await this.findOneByPostMsgId({ postMessageId });
    const newPostMessage = await this.postMessageRepository.preload({
      id: post.id,
      isDelete: 1
    });
    if (!newPostMessage) {
      throw new NotFoundException(`post message #${postMessageId} not found`);
    }
    this.postMessageRepository.save(newPostMessage);
    return { success: true };
  }

  create(createPostMessageDto: CreatePostMessageDto) {
    const post = this.postMessageRepository.create(createPostMessageDto);
    return this.postMessageRepository.save(post);
  }

  async findAllByPostId({ postId }: { postId: string }) {
    const postMessageList = await this.postMessageRepository.findBy({
      postId
    });
    return postMessageList;
  }

  async findOneByPostMsgId({ postMessageId }: { postMessageId: string }) {
    const post = await this.postMessageRepository.findOneBy({
      id: +postMessageId
    });
    if (!post) {
      throw new NotFoundException(`post message #${postMessageId} not found`);
    }
    return post;
  }
}
