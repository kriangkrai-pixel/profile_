import { Module, forwardRef } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { S3Service } from './s3.service';
import { WidgetsModule } from '../widgets/widgets.module';

@Module({
  imports: [forwardRef(() => WidgetsModule)],
  controllers: [UploadController],
  providers: [UploadService, S3Service],
  exports: [S3Service], // Export เพื่อให้ modules อื่นใช้ได้
})
export class UploadModule {}

