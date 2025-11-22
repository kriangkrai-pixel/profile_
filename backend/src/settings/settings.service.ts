import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.siteSettings.findFirst();

    // ถ้ายังไม่มีการตั้งค่า สร้างใหม่ด้วยค่าเริ่มต้น
    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: {
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
          accentColor: '#10b981',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          headerBgColor: '#ffffff',
          headerTextColor: '#1f2937',
          footerBgColor: '#1f2937',
          footerTextColor: '#ffffff',
          headerLogoText: 'KRIANGKRAI.P',
          footerLogoText: 'KRIANGKRAI.P',
          footerDescription: 'พัฒนาและเรียนรู้เทคโนโลยีใหม่ ๆ อย่างต่อเนื่อง',
          footerEmail: 'kik550123@gmail.com',
          footerLocation: 'ภูเก็ต, Thailand',
        } as any,
      });
    }

    return settings;
  }

  async updateSettings(data: any) {
    const {
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      headerBgColor,
      headerTextColor,
      footerBgColor,
      footerTextColor,
      headerLogoText,
      headerMenuItems,
      footerLogoText,
      footerDescription,
      footerEmail,
      footerLocation,
      footerLinks,
    } = data;

    // ดึงการตั้งค่าปัจจุบัน
    let settings = await this.prisma.siteSettings.findFirst();

    if (!settings) {
      // สร้างใหม่ถ้ายังไม่มี
      settings = await this.prisma.siteSettings.create({
        data: {
          primaryColor: primaryColor || '#3b82f6',
          secondaryColor: secondaryColor || '#8b5cf6',
          accentColor: accentColor || '#10b981',
          backgroundColor: backgroundColor || '#ffffff',
          textColor: textColor || '#1f2937',
          headerBgColor: headerBgColor || '#ffffff',
          headerTextColor: headerTextColor || '#1f2937',
          footerBgColor: footerBgColor || '#1f2937',
          footerTextColor: footerTextColor || '#ffffff',
          headerLogoText: headerLogoText || 'KRIANGKRAI.P',
          headerMenuItems: headerMenuItems || null,
          footerLogoText: footerLogoText || 'KRIANGKRAI.P',
          footerDescription: footerDescription || 'พัฒนาและเรียนรู้เทคโนโลยีใหม่ ๆ อย่างต่อเนื่อง',
          footerEmail: footerEmail || 'kik550123@gmail.com',
          footerLocation: footerLocation || 'ภูเก็ต, Thailand',
          footerLinks: footerLinks || null,
        } as any,
      });
    } else {
      // อัปเดตค่าที่มีอยู่
      const updateData: any = {};
      if (primaryColor !== undefined) updateData.primaryColor = primaryColor;
      if (secondaryColor !== undefined) updateData.secondaryColor = secondaryColor;
      if (accentColor !== undefined) updateData.accentColor = accentColor;
      if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
      if (textColor !== undefined) updateData.textColor = textColor;
      if (headerBgColor !== undefined) updateData.headerBgColor = headerBgColor;
      if (headerTextColor !== undefined) updateData.headerTextColor = headerTextColor;
      if (footerBgColor !== undefined) updateData.footerBgColor = footerBgColor;
      if (footerTextColor !== undefined) updateData.footerTextColor = footerTextColor;
      if (headerLogoText !== undefined) updateData.headerLogoText = headerLogoText;
      if (headerMenuItems !== undefined) updateData.headerMenuItems = headerMenuItems;
      if (footerLogoText !== undefined) updateData.footerLogoText = footerLogoText;
      if (footerDescription !== undefined) updateData.footerDescription = footerDescription;
      if (footerEmail !== undefined) updateData.footerEmail = footerEmail;
      if (footerLocation !== undefined) updateData.footerLocation = footerLocation;
      if (footerLinks !== undefined) updateData.footerLinks = footerLinks;

      settings = await this.prisma.siteSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    }

    return settings;
  }
}

