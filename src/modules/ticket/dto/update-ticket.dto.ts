import { IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(['booked', 'paid', 'cancelled', 'refunded', 'expired'])
  status?: 'booked' | 'paid' | 'cancelled' | 'refunded' | 'expired';

  @IsOptional()
  @IsDateString()
  paidTime?: Date;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  fromStation?: string;

  @IsOptional()
  toStation?: string;
}
