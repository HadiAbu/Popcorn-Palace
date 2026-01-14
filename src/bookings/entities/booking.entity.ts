import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('bookings')
@Index(['showtime_id', 'seat_number'], { unique: true })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;

  @Column()
  showtime_id: number;

  @Column({ length: 100 })
  customer_name: string;

  @Column({ length: 100 })
  customer_email: string;

  @Column({ length: 20 })
  customer_phone: string;

  @Column({ type: 'int', array: true })
  seat_numbers: number[];

  @Column()
  total_amount: number;

  @CreateDateColumn()
  booking_date: Date;

  @Column({ length: 50, default: 'CONFIRMED' })
  status: string;

  @Column()
  seat_number: string; // For unique constraint
}
