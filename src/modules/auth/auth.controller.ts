import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: createUserDto) {
    const user = await this.authService.create(createUserDto);
    if (!user) {
      throw new Error('User registration failed');
    }
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
  async login(
    @Body() body: LoginDto
  ) {
    return await this.authService.login(body);
  }
}
