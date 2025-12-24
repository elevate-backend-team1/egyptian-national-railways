import { IsNotEmpty, IsNumber, Max, Min, Length } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  cardholderName: string;

  @IsNotEmpty()
  @Length(12, 19)
  cardNumber: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  expiryMonth: number;

  @IsNumber()
  expiryYear: number;

  @IsNotEmpty()
  @Length(3, 4)
  cvv: string;
}
