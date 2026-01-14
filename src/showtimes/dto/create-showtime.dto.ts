import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDateString,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  @IsPositive()
  movie_id: number;

  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  total_seats?: number;
}
