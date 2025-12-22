import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { JwtAuthGuard } from './guards';
import { CurrentUser, Public } from './decorators';
import type { JwtPayload } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('sub') userId: string,
    @Body() dto: RefreshTokenDto,
  ) {
    return this.authService.logout(userId, dto.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: { name?: string },
  ) {
    return this.authService.updateProfile(userId, dto);
  }
}
