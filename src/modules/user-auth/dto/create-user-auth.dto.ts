import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserAuthDto {
  @ApiProperty({ description: 'The auth of a user' })
  @IsString()
  readonly userId: string;

  @IsString()
  readonly userPwd: string;
}
