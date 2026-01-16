import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { createTestApp, TestContext } from './setup';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestApp();
  });

  afterAll(async () => {
    await ctx.app.close();
  });
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // ADD THIS LINE TO THE TEST
    app.setGlobalPrefix('api');

    await app.init();
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api') // Must match the prefix
      .expect(200)
      .expect('Hello World!');
  });
});
