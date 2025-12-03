import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users.service';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
// @UseGuards(JwtAuthGuard) // هتضيف الجارد لما تعمل نظام الدخول الكامل
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const { password, ...result } = user.toObject();
    return result;
  }
}