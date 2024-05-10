import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { CollaDocService } from './colla-doc.service';
import { UpdateCollaDocDto } from './dto/update-colla-doc.dto';

@Controller('colla-doc')
export class CollaDocController {
  constructor(private readonly collaDocService: CollaDocService) {}

  @Public()
  @Post('add-doc')
  addDoc(@Body() { groupId }: { groupId: string }) {
    return this.collaDocService.addDoc({ groupId });
  }

  @Public()
  @Post('delete-doc')
  deleteDoc(@Body() { docId }: { docId: string }) {
    return this.collaDocService.deleteDoc({ docId });
  }

  @Public()
  @Post('get-doc-info')
  getDocInfo(@Body() { docId }: { docId: string }) {
    return this.collaDocService.getDocInfo({ docId });
  }

  @Public()
  @Post('update-doc-info')
  updateDocInfo(
    @Body()
    {
      docId,
      updateCollaDocDto
    }: {
      docId: string;
      updateCollaDocDto: UpdateCollaDocDto;
    }
  ) {
    return this.collaDocService.updateDocInfo({
      docId,
      updateCollaDocDto
    });
  }

  @Public()
  @Post('get-doc-list')
  getDoclist(@Body() { userId }: { userId: string }) {
    return this.collaDocService.getDoclist({ userId });
  }
}
