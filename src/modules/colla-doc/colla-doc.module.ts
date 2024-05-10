import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMemberModule } from '../group-member/group-member.module';
import { GroupModule } from '../group/group.module';
import { CollaDocController } from './colla-doc.controller';
import { CollaDocService } from './colla-doc.service';
import { CollaDoc } from './entities/colla-doc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollaDoc]),
    GroupModule,
    GroupMemberModule
  ],
  controllers: [CollaDocController],
  providers: [CollaDocService]
})
export class CollaDocModule {}
