import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('profile/experience')
export class ExperienceController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /api/profile/experience
   * ดึงข้อมูลประสบการณ์ทั้งหมด
   */
  @Get()
  async getExperiences() {
    const profile = await this.prisma.profile.findFirst({
      include: { experiences: true },
    });

    if (!profile) {
      return [];
    }

    return profile.experiences;
  }

  /**
   * POST /api/profile/experience
   * สร้างประสบการณ์ใหม่
   */
  @Post()
  async createExperience(@Body() data: any) {
    const { title, company, location, period, description } = data;

    let profile = await this.prisma.profile.findFirst();
    if (!profile) {
      throw new NotFoundException('ไม่พบข้อมูลโปรไฟล์');
    }

    const experience = await this.prisma.experience.create({
      data: {
        title,
        company,
        location,
        period,
        description,
        profileId: profile.id,
      },
    });

    return { success: true, experience };
  }

  /**
   * PUT /api/profile/experience
   * อัปเดตประสบการณ์ทั้งหมด
   */
  @Put()
  async updateExperiences(@Body() body: { experiences: any[] }) {
    const { experiences } = body;

    let profile = await this.prisma.profile.findFirst();
    if (!profile) {
      throw new NotFoundException('ไม่พบข้อมูลโปรไฟล์');
    }

    // บันทึกค่าเก่าก่อนลบ
    const oldExperiences = await this.prisma.experience.findMany({
      where: { profileId: profile.id },
    });

    // ลบประสบการณ์เดิมทั้งหมด
    await this.prisma.experience.deleteMany({
      where: { profileId: profile.id },
    });

    // เพิ่มประสบการณ์ใหม่ทั้งหมด
    if (experiences && experiences.length > 0) {
      await this.prisma.experience.createMany({
        data: experiences.map((exp: any) => ({
          title: exp.title,
          company: exp.company,
          location: exp.location,
          period: exp.period,
          description: exp.description,
          profileId: profile.id,
        })),
      });
    }

    // บันทึกประวัติการแก้ไข
    try {
      await this.prisma.editHistory.create({
        data: {
          page: 'experience',
          section: 'all',
          action: 'update',
          oldValue: JSON.stringify(oldExperiences),
          newValue: JSON.stringify(experiences || []),
        },
      });
    } catch (historyError) {
      console.error('Error logging edit history:', historyError);
    }

    return { success: true, message: 'อัปเดตประสบการณ์สำเร็จ' };
  }

  /**
   * DELETE /api/profile/experience?id=X
   * ลบประสบการณ์
   */
  @Delete()
  async deleteExperience(@Query('id') id: string) {
    if (!id) {
      throw new NotFoundException('ไม่พบ ID');
    }

    // บันทึกค่าเก่าก่อนลบ
    const oldExperience = await this.prisma.experience.findUnique({
      where: { id: parseInt(id) },
    });

    if (!oldExperience) {
      throw new NotFoundException('ไม่พบประสบการณ์');
    }

    // ลบประสบการณ์
    await this.prisma.experience.delete({
      where: { id: parseInt(id) },
    });

    // บันทึกประวัติการแก้ไข
    try {
      await this.prisma.editHistory.create({
        data: {
          page: 'experience',
          section: oldExperience.title,
          action: 'delete',
          oldValue: JSON.stringify(oldExperience),
          newValue: null,
        },
      });
    } catch (historyError) {
      console.error('Error logging edit history:', historyError);
    }

    return {
      success: true,
      message: 'ลบประสบการณ์สำเร็จ',
    };
  }
}

