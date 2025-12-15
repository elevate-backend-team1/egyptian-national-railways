// src/passengers/dto/create-passenger.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
