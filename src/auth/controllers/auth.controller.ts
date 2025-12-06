// src/auth/controllers/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  UseGuards,
  Headers,
  Req,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { VerifyOTPDto } from '../dto/verify-otp.dto';
import { ResendOTPDto } from '../dto/resend-otp.dto';
import { CompleteProfileDto } from '../dto/complete-profile.dto';
import { TempTokenGuard } from '../guards/temp-token.guard';
import { UserId } from '../decorators/user-id.decorator';
import { ApiResponse } from '../../common/dto/response.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
   * POST /auth/signup
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto): Promise<ApiResponse<any>> {
    const result = await this.authService.signUp(signUpDto);
    return ApiResponse.success(result.message, { email: result.email });
  }

  /**
   * POST /auth/verify-otp
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOTP(
    @Body() verifyOTPDto: VerifyOTPDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.verifyOTP(verifyOTPDto);
    return ApiResponse.success(result.message, {
      tempToken: result.tempToken,
      email: result.email,
    });
  }

  /**
   * POST /auth/resend-otp
   */
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() resendOTPDto: ResendOTPDto) {
    return await this.authService.resendOTP(resendOTPDto);
  }

  /**
   * POST /auth/complete-profile
   */
  @Post('complete-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(TempTokenGuard)
  async completeProfile(
    @Body() completeProfileDto: CompleteProfileDto,
    @UserId() userId: string,
  ) {
    return await this.authService.completeProfile(userId, completeProfileDto);
  }

  /**
   * GET /auth/validate-temp-token?token=...
   */
  @Get('validate-temp-token')
  @HttpCode(HttpStatus.OK)
  async validateTempToken(@Query('token') token: string) {
    return await this.authService.validateTempToken(token);
  }

  /**
   * GET /auth/otp-status?email=...
   */
  @Get('otp-status')
  @HttpCode(HttpStatus.OK)
  async getOTPStatus(@Query('email') email: string) {
    return await this.authService.getOTPStatus(email);
  }

  /**
   * POST /auth/reset-password
   */
  @Post('reset-password')
  // @UseGuards(AuthGuard('jwt')) >>... wait for auth guard implementation
  async resetPassword(@Req() req, @Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(req.user._id.toString(), body);
  }

  /**
   * POST /auth/forget-password
   */
  @Post('forget-password')
  async forgetPassword(@Body() body: any) {}
}
