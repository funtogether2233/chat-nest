import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendshipService } from '../friendship/friendship.service';
import { PostMessageService } from '../post-message/post-message.service';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly postMessageService: PostMessageService,
    private readonly userService: UserService,
    private readonly friendshipService: FriendshipService
  ) {}

  async getUserPostList({ userId }: { userId: string }) {
    const postListRes = await this.findAll({ userId });
    const postList = await Promise.all(
      postListRes.map(async (postInfo) => {
        const userInfo = await this.userService.getUserInfo({
          userId: postInfo.userId
        });
        return {
          userInfo,
          ...postInfo
        };
      })
    );
    return {
      postList: postList.sort(
        (a, b) => Number(b.createdTime) - Number(a.createdTime)
      )
    };
  }

  async getAllPostList({ userId }: { userId: string }) {
    const friendList = (
      await this.friendshipService.getFriendshipList({
        userId
      })
    ).friendshipList;
    const allPostList = (await this.getUserPostList({ userId })).postList;
    for (let i = 0; i < friendList.length; ++i) {
      const friendInfo = friendList[i];
      const { userId } = friendInfo;
      const friendPostList = (await this.getUserPostList({ userId })).postList;
      allPostList.push(...friendPostList);
    }
    return {
      allPostList: allPostList.sort(
        (a, b) => Number(b.createdTime) - Number(a.createdTime)
      )
    };
  }

  async getPostDetail({ postId }: { postId: string }) {
    const postInfo = await this.findOneByPostId({ postId });
    const postMessageList = (
      await this.postMessageService.getPostMessageList({
        postId
      })
    ).postMessageList;
    const userInfo = await this.userService.getUserInfo({
      userId: postInfo.userId
    });
    return {
      postDetail: {
        postInfo: { ...postInfo, userInfo },
        postMessageList
      }
    };
  }

  async createPost(createPostDto: CreatePostDto) {
    const post = await this.create(createPostDto);
    return { postId: String(post.id), success: true };
  }

  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll({ userId }: { userId: string }) {
    const postList = await this.postRepository.findBy({
      userId
    });
    return postList;
  }

  async findOneByPostId({ postId }: { postId: string }) {
    const post = await this.postRepository.findOneBy({ id: +postId });
    if (!post) {
      throw new NotFoundException(`post #${postId} not found`);
    }
    return post;
  }
}
