import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('profile/portfolio')
export class PortfolioController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /api/profile/portfolio
   * ดึงข้อมูลผลงานทั้งหมด
   */
  @Get()
  async getPortfolios() {
    try {
      const profile = await this.prisma.profile.findFirst({
        include: { portfolios: true },
      });

      if (!profile) {
        return [];
      }

      console.log(`📋 Fetched ${profile.portfolios.length} portfolios`);
      return profile.portfolios;
    } catch (error) {
      console.error('❌ Error fetching portfolios:', error);
      throw error;
    }
  }

  /**
   * POST /api/profile/portfolio
   * สร้างผลงานใหม่
   */
  @Post()
  async createPortfolio(@Body() data: any) {
    try {
      const { title, description, image, link } = data;

      // Validation
      if (!title || !description) {
        throw new BadRequestException('กรุณากรอกชื่อและคำอธิบายผลงาน');
      }

      // Log image size for debugging
      if (image) {
        const imageSizeKB = Math.round((image.length * 3) / 4 / 1024);
        console.log(`📷 Creating portfolio with image: ${imageSizeKB} KB`);
      }

      let profile = await this.prisma.profile.findFirst();
      if (!profile) {
        throw new NotFoundException('ไม่พบข้อมูลโปรไฟล์');
      }

      const portfolio = await this.prisma.portfolio.create({
        data: {
          title,
          description,
          image: image || null,
          link: link || null,
          profileId: profile.id,
        },
      });

      console.log(`✅ Portfolio created: ${portfolio.title} (ID: ${portfolio.id})`);
      return { success: true, portfolio };
    } catch (error: any) {
      console.error('❌ Error creating portfolio:', error);
      
      // จัดการ error P2000 (ข้อมูลเกินขนาด column)
      if (error.code === 'P2000') {
        const columnName = error.meta?.column_name || 'image';
        throw new BadRequestException(
          `ขนาดรูปภาพใหญ่เกินไป กรุณาลดขนาดรูปภาพหรือบีบอัดรูปภาพก่อนอัปโหลด (Column: ${columnName})`
        );
      }
      
      // จัดการ error อื่นๆ
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException(error.message || 'เกิดข้อผิดพลาดในการสร้างผลงาน');
    }
  }

  /**
   * PUT /api/profile/portfolio
   * อัปเดตผลงานทั้งหมด
   */
  @Put()
  async updatePortfolios(@Body() body: { portfolios: any[] }) {
    const { portfolios } = body;

    try {
      let profile = await this.prisma.profile.findFirst();
      if (!profile) {
        throw new NotFoundException('ไม่พบข้อมูลโปรไฟล์');
      }

      // บันทึกค่าเก่าก่อนลบ
      const oldPortfolios = await this.prisma.portfolio.findMany({
        where: { profileId: profile.id },
      });

      // ลบผลงานเดิมทั้งหมด
      await this.prisma.portfolio.deleteMany({
        where: { profileId: profile.id },
      });

      // เพิ่มผลงานใหม่ทั้งหมด
      if (portfolios && portfolios.length > 0) {
        // Log image sizes for debugging
        portfolios.forEach((port: any, index: number) => {
          if (port.image) {
            const imageSizeKB = Math.round((port.image.length * 3) / 4 / 1024);
            console.log(`📷 Portfolio ${index + 1} image size: ${imageSizeKB} KB`);
          }
        });

        await this.prisma.portfolio.createMany({
          data: portfolios.map((port: any) => ({
            title: port.title,
            description: port.description,
            image: port.image,
            link: port.link,
            profileId: profile.id,
          })),
        });
      }

      // บันทึกประวัติการแก้ไข
      try {
        await this.prisma.editHistory.create({
          data: {
            page: 'portfolio',
            section: 'all',
            action: 'update',
            oldValue: JSON.stringify(oldPortfolios),
            newValue: JSON.stringify(portfolios || []),
          },
        });
      } catch (historyError) {
        console.error('Error logging edit history:', historyError);
      }

      return { success: true, message: 'อัปเดตผลงานสำเร็จ' };
    } catch (error: any) {
      console.error('❌ Error updating portfolios:', error);
      
      // จัดการ error P2000 (ข้อมูลเกินขนาด column)
      if (error.code === 'P2000') {
        const columnName = error.meta?.column_name || 'image';
        throw new BadRequestException(
          `ขนาดรูปภาพใหญ่เกินไป กรุณาลดขนาดรูปภาพหรือบีบอัดรูปภาพก่อนอัปโหลด (Column: ${columnName})`
        );
      }
      
      // จัดการ error อื่นๆ
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException(error.message || 'เกิดข้อผิดพลาดในการอัปเดตผลงาน');
    }
  }

  /**
   * DELETE /api/profile/portfolio?id=X
   * ลบผลงาน
   */
  @Delete()
  async deletePortfolio(@Query('id') id: string) {
    if (!id) {
      throw new NotFoundException('กรุณาระบุ ID ผลงาน');
    }

    // ดึงข้อมูลผลงานก่อนลบ
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: parseInt(id) },
    });

    if (!portfolio) {
      throw new NotFoundException('ไม่พบผลงานที่ต้องการลบ');
    }

    // ลบผลงาน
    await this.prisma.portfolio.delete({
      where: { id: parseInt(id) },
    });

    // บันทึกประวัติการแก้ไข
    try {
      await this.prisma.editHistory.create({
        data: {
          page: 'portfolio',
          section: 'item',
          action: 'delete',
          oldValue: JSON.stringify(portfolio),
          newValue: JSON.stringify({ deleted: true }),
        },
      });
    } catch (historyError) {
      console.error('Error logging edit history:', historyError);
    }

    return {
      success: true,
      message: 'ลบผลงานสำเร็จ',
    };
  }
}

