import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    private moviesService: MoviesService,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    try {
      // Validate movie exists
      const movie = await this.moviesService.findOne(
        createShowtimeDto.movie_id,
      );

      // Validate times
      const startTime = new Date(createShowtimeDto.start_time);
      const endTime = new Date(createShowtimeDto.end_time);

      if (startTime >= endTime) {
        throw new BadRequestException('End time must be after start time');
      }

      // Check for overlapping showtimes in the same theater
      const overlapping = await this.showtimeRepository.findOne({
        where: [
          {
            theater: createShowtimeDto.theater,
            start_time: LessThan(endTime),
            end_time: MoreThan(startTime),
          },
        ],
      });

      if (overlapping) {
        throw new ConflictException(
          'Overlapping showtime exists for this theater',
        );
      }

      const showtime = this.showtimeRepository.create({
        ...createShowtimeDto,
        available_seats: createShowtimeDto.total_seats || 100,
        total_seats: createShowtimeDto.total_seats || 100,
      });

      const savedShowtime = await this.showtimeRepository.save(showtime);
      return savedShowtime;
    } catch (error) {
      throw new BadRequestException('Failed to create showtime');
    }
    // return await this.showtimeRepository.save(showtime);
  }

  async findAll(): Promise<Showtime[]> {
    return await this.showtimeRepository.find({
      relations: ['movie'],
    });
  }

  async findOne(id: number): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: ['movie'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    return showtime;
  }

  async update(
    id: number,
    updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<Showtime> {
    try {
      const showtime = await this.findOne(id);

      if (updateShowtimeDto.movie_id) {
        await this.moviesService.findOne(updateShowtimeDto.movie_id);
      }

      // Validate times if being updated
      if (updateShowtimeDto.start_time || updateShowtimeDto.end_time) {
        const startTime = new Date(
          updateShowtimeDto.start_time || showtime.start_time,
        );
        const endTime = new Date(
          updateShowtimeDto.end_time || showtime.end_time,
        );

        if (startTime >= endTime) {
          throw new BadRequestException('End time must be after start time');
        }

        // Check for overlapping showtimes
        const overlapping = await this.showtimeRepository.findOne({
          where: {
            id: Not(id),
            theater: updateShowtimeDto.theater || showtime.theater,
            start_time: LessThan(endTime),
            end_time: MoreThan(startTime),
          },
        });

        if (overlapping) {
          throw new ConflictException(
            'Overlapping showtime exists for this theater',
          );
        }
      }

      Object.assign(showtime, updateShowtimeDto);
      return await this.showtimeRepository.save(showtime);
    } catch (error) {
      throw new BadRequestException('Failed to update showtime');
    }
  }

  async remove(id: number): Promise<void> {
    const showtime = await this.findOne(id);
    await this.showtimeRepository.remove(showtime);
  }

  async removeAll(): Promise<void> {
    try {
      await this.showtimeRepository
        .createQueryBuilder()
        .delete()
        .from('showtimes') // Explicitly naming the table
        .execute();
    } catch (error) {
      throw new BadRequestException('Failed to remove all showtimes');
    }
  }
  async updateAvailableSeats(id: number, seatsToBook: number): Promise<void> {
    const showtime = await this.findOne(id);

    if (showtime.available_seats < seatsToBook) {
      throw new BadRequestException('Not enough available seats');
    }

    showtime.available_seats -= seatsToBook;
    await this.showtimeRepository.save(showtime);
  }
}
