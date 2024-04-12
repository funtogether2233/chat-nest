import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { GroupMemberService } from './group-member.service';

@Controller('group-member')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Public()
  @Post('get-group-list')
  getGroupList(@Body() { userId }: { userId: string }) {
    return this.groupMemberService.getGroupList(userId);
  }
}
