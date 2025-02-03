import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { startApp } from './test.utils';

describe('Ping', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await startApp();
  });

  it(`/GET ping`, () => {
    return request(app.getHttpServer())
      .get('/api/ping')
      .expect(200)
      .expect('Pong');
  });
});
