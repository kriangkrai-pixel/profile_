import { Module, forwardRef } from '@nestjs/common';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [forwardRef(() => UploadModule)], // Import เพื่อใช้ S3Service
  controllers: [WidgetsController],
  providers: [WidgetsService],
  exports: [WidgetsService], // Export เพื่อให้ module อื่นใช้ได้
})
export class WidgetsModule {}

