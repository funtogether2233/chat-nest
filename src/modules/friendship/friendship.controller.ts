import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Public()
  @Post('get-friendship-list')
  getFriendshipList(@Body() { userId }: { userId: string }) {
    return this.friendshipService.getFriendshipList({ userId });
  }

  @Public()
  @Post('add-friendship')
  addFriendship(
    @Body() { userId, friendId }: { userId: string; friendId: string }
  ) {
    return this.friendshipService.addFriendship({ userId, friendId });
  }

  @Public()
  @Post('delete-friendship')
  deleteFriendship(
    @Body() { userId, friendId }: { userId: string; friendId: string }
  ) {
    return this.friendshipService.deleteFriendship({ userId, friendId });
  }

  @Public()
  @Post('get-user-post-permission')
  getUserPostPermission(
    @Body() { userId, friendId }: { userId: string; friendId: string }
  ) {
    return this.friendshipService.getPostPermission({ userId, friendId });
  }

  @Public()
  @Post('get-friend-post-permission')
  getFriendPostPermission(
    @Body() { userId, friendId }: { userId: string; friendId: string }
  ) {
    return this.friendshipService.getPostPermission({
      userId: friendId,
      friendId: userId
    });
  }

  @Public()
  @Post('allow-post-permission')
  allowPostPermission(
    @Body() { userId, friendId }: { userId: string; friendId: string }
  ) {
    return this.friendshipService.allowPostPermission({ userId, friendId });
  }

  @Public()
  @Post('ban-post-permission')
  banPostPermission(
    @Body() { userId, friendId }: { userId: string; friendId: string }
  ) {
    return this.friendshipService.banPostPermission({ userId, friendId });
  }
}
