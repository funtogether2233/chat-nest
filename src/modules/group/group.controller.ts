import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Public()
  @Post('search-group-list')
  searchGroupList(@Body() { groupId }: { groupId: string }) {
    return this.groupService.searchGroupList(groupId);
  }

  @Public()
  @Post('set-up-new-group')
  setUpNewGroup(
    @Body()
    {
      userId,
      groupId,
      groupName
    }: {
      userId: string;
      groupId: string;
      groupName: string;
    }
  ) {
    return this.groupService.setUpNewGroup({ userId, groupId, groupName });
  }
}
