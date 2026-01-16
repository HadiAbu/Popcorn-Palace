// create-booking.dto.ts
import { IsString, IsArray, IsNumber, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  showtime_id: number;

  @IsString()
  customer_name: string;

  @IsEmail()
  customer_email: string;

  @IsString()
  customer_phone: string;

  @IsArray() // This allows the [1, 2] from your test
  @IsNumber({}, { each: true })
  seat_numbers: number[];

  @IsNumber()
  total_amount: number;
}
