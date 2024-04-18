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
}
