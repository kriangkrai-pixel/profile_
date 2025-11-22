import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { S3Service } from '../upload/s3.service';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(private readonly s3Service: S3Service) {}

  /**
   * ดึงไฟล์รูปภาพจาก S3
   * @param path relative path ของไฟล์ (เช่น uploads/portfolio/image.jpg)
   * @returns Buffer และ ContentType ของไฟล์
   */
  async getImage(path: string): Promise<{ body: Buffer; contentType: string }> {
    if (!path) {
      throw new NotFoundException('Image path is required');
    }

    try {
      // แปลง path ให้เป็น relative path format
      const relativePath = path.startsWith('/') ? path : `/${path}`;
      
      const result = await this.s3Service.getFile(relativePath);
      return result;
    } catch (error: any) {
      this.logger.error(`Error retrieving image: ${path}`, error.stack);
      
      if (error.message?.includes('not found') || error.message?.includes('NoSuchKey')) {
        throw new NotFoundException(`Image not found: ${path}`);
      }
      
      throw error;
    }
  }
}

