import { Controller, Get, Put, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * GET /api/profile
   * ดึงข้อมูลโปรไฟล์ทั้งหมด (รวม Portfolio, Experience, Education, Skills)
   */
  @Get()
  async getProfile() {
    console.log('📋 Fetching complete profile data');
    return this.profileService.getProfile();
  }

  /**
   * PUT /api/profile
   * อัปเดตข้อมูลโปรไฟล์หลัก (ชื่อ, อีเมล, ฯลฯ)
   */
  @Put()
  async updateProfile(@Body() data: any) {
    console.log('✏️ Updating profile data');
    return this.profileService.updateProfile(data);
  }
}

