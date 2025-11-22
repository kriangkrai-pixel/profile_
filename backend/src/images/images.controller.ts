import { Controller, Get, Req, Res, NotFoundException } from '@nestjs/common';
import { Response, Request } from 'express';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * GET /api/images/*
   * Serve รูปภาพจาก S3 (private) ผ่าน proxy endpoint
   * 
   * ตัวอย่าง:
   * GET /api/images/uploads/portfolio/image.jpg
   * GET /api/images/uploads/profile/hero.jpg
   */
  @Get('*')
  async getImage(@Req() req: Request, @Res() res: Response) {
    // ดึง path จาก request URL โดยตรง
    // req.url จะเป็น "/api/images/uploads/widget/image.jpg"
    // เราต้องตัด "/api/images" ออก
    const fullPath = req.url;
    const path = fullPath.replace(/^\/api\/images\//, '').replace(/^\/api\/images$/, '');
    
    console.log(`🖼️ Fetching image via proxy: ${path}`);
    console.log(`🔍 Full request URL: ${req.url}`);
    console.log(`🔍 Extracted path: ${path}`);
    
    if (!path || path === '/') {
      throw new NotFoundException('Image path is required');
    }

    try {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      
      const { body, contentType } = await this.imagesService.getImage(normalizedPath);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Length', body.length.toString());

      res.send(body);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve image',
        error: error.message,
      });
    }
  }
}

