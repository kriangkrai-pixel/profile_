import { Controller, Get, Put, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('profile/skills')
export class SkillsController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /api/profile/skills
   * ดึงข้อมูลทักษะทั้งหมด
   */
  @Get()
  async getSkills() {
    try {
      const profile = await this.prisma.profile.findFirst({
        include: { skills: true },
      });

      if (!profile) {
        return [];
      }

      console.log(`📋 Fetched ${profile.skills.length} skills`);
      return profile.skills;
    } catch (error) {
      console.error('❌ Error fetching skills:', error);
      throw error;
    }
  }

  /**
   * PUT /api/profile/skills
   * อัปเดตทักษะทั้งหมด
   */
  @Put()
  async updateSkills(@Body() body: { skills: string[] }) {
    const { skills } = body;

    let profile = await this.prisma.profile.findFirst();
    if (!profile) {
      throw new NotFoundException('ไม่พบข้อมูลโปรไฟล์');
    }

    // ลบทักษะเดิม
    await this.prisma.skill.deleteMany({
      where: { profileId: profile.id },
    });

    // เพิ่มทักษะใหม่
    if (skills && skills.length > 0) {
      await this.prisma.skill.createMany({
        data: skills.map((skill: string) => ({
          name: skill,
          profileId: profile.id,
        })),
      });
    }

    return { success: true, message: 'อัปเดตทักษะสำเร็จ' };
  }
}

