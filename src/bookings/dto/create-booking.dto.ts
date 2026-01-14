import {
  IsNumber,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsPositive,
} from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @IsPositive()
  showtime_id: number;

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsEmail()
  customer_email: string;

  @IsString()
  @IsNotEmpty()
  customer_phone: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  seat_numbers: number[];
}
