import { Module } from '@nestjs/common';
import { LayoutController } from './layout.controller';
import { LayoutService } from './layout.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule], // Import เพื่อใช้ S3Service
  controllers: [LayoutController],
  providers: [LayoutService],
})
export class LayoutModule {}

