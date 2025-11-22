import { Controller, Get, Post, Put, Delete, Body, Query, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * GET /api/contact
   * ดึงข้อความติดต่อทั้งหมด
   * Query: ?unreadOnly=true (optional)
   */
  @Get()
  async getMessages(@Query('unreadOnly') unreadOnly?: string) {
    console.log(`📋 Fetching messages (unreadOnly: ${unreadOnly})`);
    return this.contactService.getMessages(unreadOnly === 'true');
  }

  // ดูลำดับการว่า @Get('hello') อยู่ตรงไหน
  // @Get('hello')
  // async getHello() {
  //   return "Hello World";
  // }


  /**
   * POST /api/contact
   * สร้างข้อความติดต่อใหม่
   */
  @Post()
  async createMessage(@Body() data: CreateContactDto) {
    console.log(`📧 Creating new contact message from: ${data.name}`);
    return this.contactService.createMessage(data);
  }

  /**
   * PUT /api/contact
   * อัปเดตสถานะข้อความ (อ่านแล้ว/ยังไม่อ่าน)
   */
  @Put()
  async updateMessage(@Body() data: UpdateMessageDto) {
    console.log(`✏️ Updating contact message ID: ${data.id}, isRead: ${data.isRead}`);
    return this.contactService.updateMessage(data);
  }

  /**
   * DELETE /api/contact?id=X
   * ลบข้อความติดต่อ
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Query('id', ParseIntPipe) id: number) {
    console.log(`🗑️ Deleting contact message ID: ${id}`);
    await this.contactService.deleteMessage(id);
  }


  @Get('/:id')
  async getMessageById(@Query('id') id: string) {
    return "Get id";
  }
}

