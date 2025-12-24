import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCardDto } from './dto/create-card.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('cards')
  async addCard(@Req() req: any, @Body() dto: CreateCardDto) {
    const userId = req.user.id;
    return this.paymentService.addCard(userId, dto);
  }

  @Get('cards')
  async getMyCards(@Req() req: any) {
    const userId = req.user.id;
    return this.paymentService.listCards(userId);
  }
}
