import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The info of a user' })
  @IsString()
  readonly userId: string;

  @IsString()
  readonly userName: string;

  @IsString()
  readonly userIntroduction: string;
}
