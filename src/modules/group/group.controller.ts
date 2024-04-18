import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateGroupDto } from './dto/update-group.dto';
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

  @Public()
  @Post('get-group-info')
  getGroupInfo(@Body() { groupId }: { groupId: string }) {
    return this.groupService.getGroupInfo({ groupId });
  }

  @Public()
  @Post('update-group-info')
  updateGroupInfo(@Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.updateGroupInfo(updateGroupDto);
  }
}
