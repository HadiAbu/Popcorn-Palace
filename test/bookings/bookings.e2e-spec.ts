import { createTestApp, TestContext } from '../setup';
import * as request from 'supertest';

describe('Bookings (E2E)', () => {
  let ctx: TestContext;
  let showtimeId: number;
  let movieId: number;
  let bookingId: number;

  beforeAll(async () => {
    ctx = await createTestApp();

    // Create movie and showtime
    const movie = await request(ctx.httpServer).post('/movies').send({
      title: 'Barbie',
      genre: 'Comedy',
      duration: 114,
      rating: 6.9,
      release_year: 2023,
    });
    movieId = movie.body.id;

    const showtimeRes = await request(ctx.httpServer).post('/showtimes').send({
      movie_id: movie.body.id,
      theater: 'Cinema 5',
      start_time: '2025-12-10T20:00:00Z',
      end_time: '2025-12-10T22:00:00Z',
      total_seats: 2,
      price: 12,
    });
    showtimeId = showtimeRes.body.id;
  });

  afterAll(async () => {
    await request(ctx.httpServer).delete(`/movies/${movieId}`);
    await request(ctx.httpServer).delete(`/showtimes/${showtimeId}`);
    await request(ctx.httpServer).delete(`/bookings/${bookingId}`);

    await ctx.app.close();
  });

  describe('POST /bookings', () => {
    it('should create a booking', async () => {
      const res = await request(ctx.httpServer)
        .post('/bookings')
        .send({
          showtime_id: Number(showtimeId),
          customer_name: 'Alice',
          customer_email: 'alice@example.com',
          customer_phone: '555-1234',
          seat_numbers: [1, 2],
          total_amount: 24,
        });
      bookingId = res.body.id;

      expect(res.body).toHaveProperty('id');
      expect(res.body.customer_name).toBe('Alice');
    });

    it('should reject booking with missing fields', async () => {
      await request(ctx.httpServer)
        .post('/bookings')
        .send({
          showtime_id: showtimeId,
          customer_name: 'Bob',
        })
        .expect(400);
    });
  });

  describe('GET /bookings', () => {
    it('should return list of bookings', async () => {
      const res = await request(ctx.httpServer).get('/bookings').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
