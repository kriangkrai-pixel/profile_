import { Controller, Get, Put, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('profile/education')
export class EducationController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /api/profile/education
   * ดึงข้อมูลการศึกษา
   */
  @Get()
  async getEducation() {
    try {
      const profile = await this.prisma.profile.findFirst({
        include: { education: true },
      });

      if (!profile) {
        return [];
      }

      console.log(`📋 Fetched ${profile.education.length} education records`);
      return profile.education;
    } catch (error) {
      console.error('❌ Error fetching education:', error);
      throw error;
    }
  }

  /**
   * PUT /api/profile/education
   * อัปเดตการศึกษา
   */
  @Put()
  async updateEducation(@Body() body: { education: any }) {
    try {
      const { education } = body;
      
      // Debug: แสดงข้อมูลที่ได้รับ
      console.log('📥 Received education data:', JSON.stringify(education, null, 2));

      if (!education) {
        throw new BadRequestException('ไม่พบข้อมูลการศึกษา');
      }

      let profile = await this.prisma.profile.findFirst();
      if (!profile) {
        throw new NotFoundException('ไม่พบข้อมูลโปรไฟล์');
      }

      // บันทึกค่าเก่าก่อนลบ
      const oldEducation = await this.prisma.education.findMany({
        where: { profileId: profile.id },
      });
      console.log(`📋 Found ${oldEducation.length} old education records`);

      // ลบการศึกษาเดิม
      await this.prisma.education.deleteMany({
        where: { profileId: profile.id },
      });
      console.log('🗑️ Deleted old education records');

      // เพิ่มการศึกษาใหม่
      const educationData = [];
      if (education.university) {
        const universityData: any = {
          type: 'university',
          field: education.university.field || '',
          institution: education.university.university || education.university.institution || '',
          year: education.university.year || '',
          status: education.university.status || 'studying',
          profileId: profile.id,
        };
        // เพิ่ม GPA ถ้ามี (สำหรับกรณีจบการศึกษาแล้ว)
        if (education.university.gpa) {
          universityData.gpa = education.university.gpa;
        }
        console.log('📝 University data:', universityData);
        educationData.push(universityData);
      }
      
      if (education.highschool) {
        const highschoolData = {
          type: 'highschool',
          field: education.highschool.field || '',
          institution: education.highschool.school || education.highschool.institution || '',
          gpa: education.highschool.gpa || '',
          profileId: profile.id,
        };
        console.log('📝 Highschool data:', highschoolData);
        educationData.push(highschoolData);
      }

      if (educationData.length > 0) {
        const result = await this.prisma.education.createMany({
          data: educationData,
        });
        console.log(`✅ Created ${result.count} education records`);
      } else {
        console.warn('⚠️ No education data to save');
      }

      // บันทึกประวัติการแก้ไข
      try {
        await this.prisma.editHistory.create({
          data: {
            page: 'education',
            section: 'all',
            action: 'update',
            oldValue: JSON.stringify(oldEducation),
            newValue: JSON.stringify(educationData),
          },
        });
        console.log('📝 Edit history saved');
      } catch (historyError) {
        console.error('⚠️ Error logging edit history:', historyError);
        // ไม่ throw error เพราะไม่ใช่ปัญหาหลัก
      }

      return { success: true, message: 'อัปเดตการศึกษาสำเร็จ' };
    } catch (error) {
      console.error('❌ Error updating education:', error);
      throw error;
    }
  }
}

