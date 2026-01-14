import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private showtimesService: ShowtimesService,
    private dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get showtime with lock to prevent concurrent bookings
      const showtime = await this.showtimesService.findOne(
        createBookingDto.showtime_id,
      );

      // Validate seat numbers
      const maxSeatNumber = showtime.total_seats;
      const invalidSeats = createBookingDto.seat_numbers.filter(
        (seat) => seat < 1 || seat > maxSeatNumber,
      );

      if (invalidSeats.length > 0) {
        throw new BadRequestException(
          `Invalid seat numbers: ${invalidSeats.join(', ')}`,
        );
      }

      // Check if seats are already booked
      const existingBookings = await queryRunner.manager.find(Booking, {
        where: {
          showtime_id: createBookingDto.showtime_id,
        },
      });

      const bookedSeats = new Set();
      existingBookings.forEach((booking) => {
        booking.seat_numbers.forEach((seat) => bookedSeats.add(seat));
      });

      const conflictingSeats = createBookingDto.seat_numbers.filter((seat) =>
        bookedSeats.has(seat),
      );

      if (conflictingSeats.length > 0) {
        throw new ConflictException(
          `Seats already booked: ${conflictingSeats.join(', ')}`,
        );
      }

      // Check available seats
      if (showtime.available_seats < createBookingDto.seat_numbers.length) {
        throw new BadRequestException('Not enough available seats');
      }

      // Calculate total amount
      const totalAmount = showtime.price * createBookingDto.seat_numbers.length;

      // Create booking
      const booking = this.bookingRepository.create({
        ...createBookingDto,
        total_amount: totalAmount,
        seat_number: createBookingDto.seat_numbers.join(','), // For unique constraint
      });

      const savedBooking = await queryRunner.manager.save(booking);

      // Update available seats
      showtime.available_seats -= createBookingDto.seat_numbers.length;
      await queryRunner.manager.save(showtime);

      await queryRunner.commitTransaction();

      return savedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['showtime', 'showtime.movie'],
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['showtime', 'showtime.movie'],
    });

    if (!booking) {
      throw new BadRequestException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async findByShowtime(showtimeId: number): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { showtime_id: showtimeId },
      relations: ['showtime', 'showtime.movie'],
    });
  }
}
