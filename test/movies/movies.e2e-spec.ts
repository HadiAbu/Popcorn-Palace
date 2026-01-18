import { createTestApp, TestContext } from '../setup';
import * as request from 'supertest';

describe('Movies (E2E)', () => {
  let ctx: TestContext;
  let movieIds: number[] = [];

  beforeAll(async () => {
    ctx = await createTestApp();
  });

  afterAll(async () => {
    // Cleanup created movies
    for (let i = 0; i < movieIds.length; i++) {
      await request(ctx.httpServer).delete(`/movies/${movieIds[i]}`);
    }

    //close connection
    await ctx.app.close();
  });

  describe('POST /movies', () => {
    it('should create a movie', async () => {
      const res = await request(ctx.httpServer)
        .post('/movies')
        .send({
          title: 'Dune: Part Three',
          genre: 'Sci-Fi',
          duration: 166,
          rating: 8.6,
          release_year: 2024,
        })
        .expect(201);
      movieIds.push(res.body.id);

      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toContain('Dune');
    });

    it('should create movies with valid data', async () => {
      let res = await request(ctx.httpServer)
        .post('/movies')
        .send({
          title: 'Valid Movie',
          genre: 'Action',
          duration: 120,
          rating: 5.5,
          release_year: 2025,
        })
        .expect(201);
      movieIds.push(res.body.id);
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
      movieIds.push(createRes.body.id);

      const res = await request(ctx.httpServer)
        .get(`/movies/${createRes.body.id}`)
        .expect(200);

      expect(res.body.title).toBe('Test Movie');
    });
  });

  // it('delete with ID', async () => {
  //   const deleteRes = await request(ctx.httpServer).delete(
  //     `/movies/${movieIds[0]}`,
  //   );
  //   expect(deleteRes.body.status).toBe(200);
  // });

  describe('Movies Cleanup', () => {
    it.skip('should have an empty list after deletion', async () => {
      const resDelete = await request(ctx.httpServer).delete('/movies');

      expect(resDelete.status).toBe(200);

      const res = await request(ctx.httpServer).get('/movies').expect(200);
      expect(res.body.length).toBe(0);
    });
  });
});
