import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'KiK550123';

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new UnauthorizedException('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    }

    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      // สร้าง token แบบง่ายๆ (ใน production ควรใช้ JWT)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      return {
        success: true,
        token,
        message: 'เข้าสู่ระบบสำเร็จ',
      };
    } else {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  }

  async logout() {
    return {
      success: true,
      message: 'ออกจากระบบสำเร็จ',
    };
  }
}

