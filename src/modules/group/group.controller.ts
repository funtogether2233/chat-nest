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
}
