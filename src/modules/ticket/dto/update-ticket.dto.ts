import { IsOptional, IsEnum, IsNumber, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { Status } from './status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTicketDto {
  @ApiPropertyOptional({ enum: Status, description: 'Ticket status' })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ description: 'Payment timestamp', example: '2023-12-25T10:30:00Z' })
  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string | number }) => new Date(value))
  paidTime?: Date;

  @ApiPropertyOptional({ description: 'Ticket price', example: 150 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'Departure station', example: 'Cairo' })
  @IsOptional()
  fromStation?: string;

  @ApiPropertyOptional({ description: 'Arrival station', example: 'Alexandria' })
  @IsOptional()
  toStation?: string;
}
