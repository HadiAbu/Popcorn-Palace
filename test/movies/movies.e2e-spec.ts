import { createTestApp, TestContext } from '../setup';
import * as request from 'supertest';

describe('Movies (E2E)', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestApp();
    await request(ctx.httpServer).delete('/showtimes');
    await request(ctx.httpServer).delete('/bookings');
    await request(ctx.httpServer).delete('/movies');
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  describe('POST /movies', () => {
    it('should create a movie', async () => {
      const res = await request(ctx.httpServer)
        .post('/movies')
        .send({
          title: 'Dune: Part Two',
          genre: 'Sci-Fi',
          duration: 166,
          rating: 8.6,
          release_year: 2024,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Dune: Part Two');
    });

    it('should create movies with valid data', async () => {
      await request(ctx.httpServer)
        .post('/movies')
        .send({
          title: 'Invalid Movie',
          genre: 'Action',
          duration: 120,
          rating: 5.5,
          release_year: 2025,
        })
        .expect(201);
    });
  });

  describe('GET /movies', () => {
    it('should return list of movies', async () => {
      const res = await request(ctx.httpServer).get('/movies').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /movies/:id', () => {
    it('should return a single movie', async () => {
      const createRes = await request(ctx.httpServer).post('/movies').send({
        title: 'Test Movie',
        genre: 'Drama',
        duration: 120,
        rating: 7.5,
        release_year: 2024,
      });

      const res = await request(ctx.httpServer)
        .get(`/movies/${createRes.body.id}`)
        .expect(200);

      expect(res.body.title).toBe('Test Movie');
    });
  });

  // Usage in your test suite
  describe('Movies Cleanup', () => {
    it('should have an empty list after deletion', async () => {
      const resDelete = await request(ctx.httpServer).delete('/movies');
      // .expect(200);

      expect(resDelete.status).toBe(200);

      const res = await request(ctx.httpServer).get('/movies').expect(200);
      expect(res.body.length).toBe(0);
    });
  });
});
