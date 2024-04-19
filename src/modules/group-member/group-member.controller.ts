import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { GroupMemberService } from './group-member.service';

@Controller('group-member')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Public()
  @Post('get-group-list')
  getGroupList(@Body() { userId }: { userId: string }) {
    return this.groupMemberService.getGroupList({ userId });
  }

  @Public()
  @Post('get-group-member-list')
  getGroupMemberList(@Body() { groupId }: { groupId: string }) {
    return this.groupMemberService.getGroupMemberList({ groupId });
  }

  @Public()
  @Post('get-user-status')
  getUserStatus(
    @Body() { userId, groupId }: { userId: string; groupId: string }
  ) {
    return this.groupMemberService.getUserStatus({ userId, groupId });
  }

  @Public()
  @Post('add-group')
  addGroup(@Body() { userId, groupId }: { userId: string; groupId: string }) {
    return this.groupMemberService.addGroup({ userId, groupId });
  }

  @Public()
  @Post('add-Group-member')
  addGroupMember(
    @Body()
    { groupId, userId }: { groupId: string; userId: string }
  ) {
    return this.groupMemberService.addGroupMember({ groupId, userId });
  }

  @Public()
  @Post('exit-group')
  exitGroup(
    @Body()
    { groupId, userId }: { groupId: string; userId: string }
  ) {
    return this.groupMemberService.exitGroup({ groupId, userId });
  }

  @Public()
  @Post('change-owner')
  changeOwner(
    @Body()
    {
      groupId,
      userId,
      memberId
    }: {
      groupId: string;
      userId: string;
      memberId: string;
    }
  ) {
    return this.groupMemberService.changeOwner({ groupId, userId, memberId });
  }

  @Public()
  @Post('add-admin')
  addAdmin(@Body() { groupId, userId }: { groupId: string; userId: string }) {
    return this.groupMemberService.addAdmin({ groupId, userId });
  }

  @Public()
  @Post('delete-admin')
  deleteAdmin(
    @Body() { groupId, userId }: { groupId: string; userId: string }
  ) {
    return this.groupMemberService.deleteAdmin({ groupId, userId });
  }
}
