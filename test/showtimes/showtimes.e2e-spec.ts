import { createTestApp, TestContext } from '../setup';
import * as request from 'supertest';

describe('Showtimes (E2E)', () => {
  let ctx: TestContext;
  let movieId: number;
  let showtimeId: number;

  beforeAll(async () => {
    ctx = await createTestApp();

    // Setup prerequisites
    const movieRes = await request(ctx.httpServer).post('/movies').send({
      title: 'Oppenheimer',
      genre: 'Biography',
      duration: 180,
      rating: 8.4,
      release_year: 2023,
    });
    movieId = movieRes.body.id;
  });

  afterAll(async () => {
    await request(ctx.httpServer).delete(`/movies/${movieId}`);
    await request(ctx.httpServer).delete(`/showtimes/${showtimeId}`);

    await ctx.app.close();
  });

  describe('POST /showtimes', () => {
    it('should create a showtime', async () => {
      const res = await request(ctx.httpServer)
        .post('/showtimes')
        .send({
          movie_id: movieId,
          theater: 'IMAX 1',
          start_time: '2025-12-01T18:00:00Z',
          end_time: '2025-12-01T21:00:00Z',
          price: 15,
          total_seats: 2,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      showtimeId = res.body.id;
    });

    it('should update showtime', async () => {
      const res = await request(ctx.httpServer)
        .patch(`/showtimes/${showtimeId}`)
        .send({
          price: 18,
        });
      expect(res.body.price).toBe(18);
    });

    it('should reject invalid time range', async () => {
      await request(ctx.httpServer)
        .post('/showtimes')
        .send({
          movie_id: movieId,
          theater: 'IMAX 2',
          start_time: '2025-12-01T21:00:00Z',
          end_time: '2025-12-01T18:00:00Z', // end before start
          price: 15,
        })
        .expect(400);
    });
  });

  describe('GET /showtimes', () => {
    it('should return list of showtimes', async () => {
      const res = await request(ctx.httpServer).get('/showtimes').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Delete /showtimes', () => {
    it('should delete the showtimes', async () => {
      await request(ctx.httpServer).delete('/showtimes').expect(200);
    });
  });
});
