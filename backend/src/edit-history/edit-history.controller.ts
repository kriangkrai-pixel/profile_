import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EditHistoryService } from './edit-history.service';

@Controller('admin/edit-history')
export class EditHistoryController {
  constructor(private readonly editHistoryService: EditHistoryService) {}

  /**
   * GET /api/admin/edit-history
   * ดึงประวัติการแก้ไข
   * Query: ?page=portfolio&limit=50 (optional)
   */
  @Get()
  async getHistory(@Query('page') page?: string, @Query('limit') limit?: string) {
    console.log(`📋 Fetching edit history (page: ${page || 'all'}, limit: ${limit || 'all'})`);
    return this.editHistoryService.getHistory(page, limit ? parseInt(limit) : undefined);
  }

  /**
   * POST /api/admin/edit-history
   * บันทึกประวัติการแก้ไข
   */
  @Post()
  async createHistory(@Body() data: any) {
    console.log(`📝 Creating edit history for: ${data.page} (${data.action})`);
    return this.editHistoryService.createHistory(data);
  }
}

