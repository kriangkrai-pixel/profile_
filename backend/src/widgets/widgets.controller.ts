import { Controller, Get, Post, Put, Delete, Body, Query } from '@nestjs/common';
import { WidgetsService } from './widgets.service';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  /**
   * GET /api/widgets?layoutId=X
   * ดึงข้อมูล Widgets ตาม Layout ID
   */
  @Get()
  async getWidgets(@Query('layoutId') layoutId: string) {
    console.log(`📋 Fetching widgets for layout ID: ${layoutId}`);
    return this.widgetsService.getWidgets(parseInt(layoutId));
  }

  /**
   * POST /api/widgets
   * สร้าง Widget ใหม่
   */
  @Post()
  async createWidget(@Body() data: any) {
    console.log(`➕ Creating new widget: ${data.type}`);
    return this.widgetsService.createWidget(data);
  }

  /**
   * PUT /api/widgets
   * อัปเดต Widget
   */
  @Put()
  async updateWidget(@Body() data: any) {
    console.log(`✏️ Updating widget ID: ${data.id}`);
    return this.widgetsService.updateWidget(data.id, data);
  }

  /**
   * DELETE /api/widgets?id=X
   * ลบ Widget
   */
  @Delete()
  async deleteWidget(@Query('id') id: string) {
    console.log(`🗑️ Deleting widget ID: ${id}`);
    return this.widgetsService.deleteWidget(parseInt(id));
  }
}

