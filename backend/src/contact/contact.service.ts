import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: CreateContactDto) {
    // Validation is handled by DTO decorators
    const contactMessage = await this.prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });

    return {
      success: true,
      message: 'บันทึกข้อความเรียบร้อยแล้ว',
      data: contactMessage,
    };
  }

  async getMessages(unreadOnly?: boolean) {
    const messages = await this.prisma.contactMessage.findMany({
      where: unreadOnly ? { isRead: false } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return messages;
  }

  async updateMessage(data: UpdateMessageDto) {
    // Validation is handled by DTO decorators
    const updated = await this.prisma.contactMessage.update({
      where: { id: data.id },
      data: { isRead: data.isRead },
    });

    return updated;
  }

  async deleteMessage(id: number) {
    // Validation is handled at controller level
    try {
      await this.prisma.contactMessage.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      // Prisma error code P2025 = Record not found
      if (error.code === 'P2025') {
        throw new NotFoundException(`ไม่พบข้อความที่ต้องการลบ (ID: ${id})`);
      }
      // Re-throw other errors
      throw error;
    }
  }
}

