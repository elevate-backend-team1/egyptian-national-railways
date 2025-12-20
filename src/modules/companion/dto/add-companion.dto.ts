import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCompanionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  national_id?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  birth_date?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;
}
