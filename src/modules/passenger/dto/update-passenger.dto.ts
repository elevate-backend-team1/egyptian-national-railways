// src/passengers/dto/update-passenger.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdatePassengerDto {
  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
