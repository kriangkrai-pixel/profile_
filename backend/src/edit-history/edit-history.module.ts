import { Module } from '@nestjs/common';
import { EditHistoryController } from './edit-history.controller';
import { EditHistoryService } from './edit-history.service';

@Module({
  controllers: [EditHistoryController],
  providers: [EditHistoryService],
})
export class EditHistoryModule {}

