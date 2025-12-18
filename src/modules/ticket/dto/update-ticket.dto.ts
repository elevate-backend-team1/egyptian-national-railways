import { IsOptional, IsEnum, IsNumber, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { Status } from './status.enum';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string | number }) => new Date(value))
  paidTime?: Date;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  fromStation?: string;

  @IsOptional()
  toStation?: string;
}
