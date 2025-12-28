import { Body, Controller, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Public } from 'src/common/decorators/public.decorator';
import type { AuthRequest } from 'src/common/interfaces/AuthRequest.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered and OTP sent' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: createUserDto })
  async register(@Body() createUserDto: createUserDto) {
    await this.authService.create(createUserDto);
    return await this.authService.generateOtp(createUserDto.email);
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        code: { type: 'string', example: '123456' }
      }
    }
  })
  async verifyOtp(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    return await this.authService.verifyOtp(email, code);
  }

  @Put('complete-profile/:email')
  @Public()
  @ApiOperation({ summary: 'Complete user profile' })
  @ApiParam({ name: 'email', description: 'User email address', example: 'user@example.com' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: updateUserDto })
  async completeProfile(@Body() updateUserDto: updateUserDto, @Param('email') email: string) {
    return await this.authService.completeRegister(email, updateUserDto);
  }

  @Get('resend-otp/:email')
  @ApiOperation({ summary: 'Resend OTP code' })
  @ApiParam({ name: 'email', description: 'User email address', example: 'user@example.com' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resendOtp(@Param('email') email: string) {
    return await this.authService.resendOtp(email);
  }

  /**
   * POST/auth/login
   * @param body
   * @returns token
   */
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
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
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(ForgotPasswordDto);
  }

  /**
   * POST/reset-password
   * @param ChangePasswordDto
   * @returns
   */
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token or expired' })
  @ApiBody({ type: ChangePasswordDto })
  async resetPassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: AuthRequest) {
    return await this.authService.changeUserPassword(req.user.userId, changePasswordDto);
  }

  /**
   * POST/logout
   * @Req
   * @returns
   */
  @Post('logout')
  async logout(@Req() req: AuthRequest) {
    return this.authService.logout(req);
  }

  /**
   * PATCH/updateProfile
   * @Req
   * @return string | user
   */

  @Patch('updateProfile')
  async updateProfile(@Req() req: AuthRequest, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.userId;
    return this.authService.updateProfile(userId, updateProfileDto);
  }
}
