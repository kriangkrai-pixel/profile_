import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/login
   * เข้าสู่ระบบ Admin
   */
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    console.log(`🔐 Login attempt for user: ${body.username}`);
    return this.authService.login(body.username, body.password);
  }

  /**
   * POST /api/auth/logout
   * ออกจากระบบ Admin
   */
  @Post('logout')
  async logout() {
    console.log('🚪 Logout request');
    return this.authService.logout();
  }
}

