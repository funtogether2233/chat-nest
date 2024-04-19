import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('search-friend-list')
  searchFriendList(
    @Body()
    {
      userId,
      friendId,
      groupId
    }: {
      userId: string;
      friendId?: string;
      groupId?: string;
    }
  ) {
    return this.userService.getFriendList({ userId, friendId, groupId });
  }

  @Public()
  @Post('get-user-info')
  getUserInfo(@Body() { userId }: { userId: string }) {
    return this.userService.getUserInfo({ userId });
  }

  @Public()
  @Post('update-user-info')
  updateUserInfo(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserInfo(updateUserDto);
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get()
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    console.log(protocol);
    return this.userService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  findOne(@Param('userId', ParseIntPipe) userId: string) {
    return this.userService.findOne({ userId });
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
