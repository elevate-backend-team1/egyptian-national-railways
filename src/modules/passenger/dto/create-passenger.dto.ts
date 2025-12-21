// src/passengers/dto/create-passenger.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '29807012345678', description: 'National ID of the passenger' })
  nationalId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'Full name of the passenger' })
  name: string;
}
