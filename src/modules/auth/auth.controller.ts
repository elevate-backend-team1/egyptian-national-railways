import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: createUserDto) {
    await this.authService.create(createUserDto);
    return await this.authService.generateOtp(createUserDto.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    return await this.authService.verifyOtp(email, code);
  }

  @Put('complete-profile/:email')
  async completeProfile(@Body() updateUserDto: updateUserDto, @Param('email') email: string) {
    return await this.authService.completeRegister(email, updateUserDto);
  }

  @Get('resend-otp/:email')
  async resendOtp(@Param('email') email: string) {
    return await this.authService.resendOtp(email);
  }

  @Post('login')
  @Public()
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
  /**
   * POST/forgot-password
   * @body ForgotPasswordDto
   * @returns
   */
  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(ForgotPasswordDto);
  }

  /**
   * POST/reset-password
   * @param ResetPasswordDto
   * @returns
   */
  @Post('reset-password')
  async resetPassword(@Body() ResetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(ResetPasswordDto);
  }
}
