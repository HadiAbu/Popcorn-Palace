import { createTestApp, TestContext } from '../setup';
import * as request from 'supertest';

describe('Showtimes (E2E)', () => {
  let ctx: TestContext;
  let movieId: number;

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
    await ctx.app.close();
  });

  describe('POST /showtimes', () => {
    let showtimeId: number;

    it.skip('should create a showtime', async () => {
      const res = await request(ctx.httpServer)
        .post('/showtimes')
        .send({
          movie_id: movieId,
          theater: 'IMAX 1',
          start_time: '2025-12-01T18:00:00Z',
          end_time: '2025-12-01T21:00:00Z',
          price: 15,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      showtimeId = res.body.id;
    });

    it.skip('should reject invalid time range', async () => {
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
    it.skip('should return list of showtimes', async () => {
      const res = await request(ctx.httpServer).get('/showtimes').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe.skip('PATCH /showtimes/:id', () => {
    let showtimeId: number;

    beforeAll(async () => {
      const res = await request(ctx.httpServer).post('/showtimes').send({
        movie_id: movieId,
        theater: 'IMAX 3',
        start_time: '2025-12-02T14:00:00Z',
        end_time: '2025-12-02T17:00:00Z',
        price: 12,
      });
      showtimeId = res.body.id;
    });

    it.skip('should update showtime', async () => {
      const res = await request(ctx.httpServer)
        .patch(`/showtimes/${showtimeId}`)
        .send({
          price: 18,
        })
        .expect(200);

      expect(res.body.price).toBe(18);
    });
  });
});
