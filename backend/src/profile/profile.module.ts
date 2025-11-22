import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { EducationController } from './education.controller';
import { ExperienceController } from './experience.controller';
import { SkillsController } from './skills.controller';
import { PortfolioController } from './portfolio.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule], // Import เพื่อใช้ S3Service
  controllers: [
    ProfileController,
    EducationController,
    ExperienceController,
    SkillsController,
    PortfolioController,
  ],
  providers: [ProfileService],
})
export class ProfileModule {}

