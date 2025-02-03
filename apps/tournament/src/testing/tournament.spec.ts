import { TournamentToAdd } from '../app/api-model';
import { INestApplication } from '@nestjs/common';
import { startApp } from './test.utils';
import request from 'supertest';

const exampleTournament = {
  name: 'Unreal',
} as TournamentToAdd;

describe('/tournament endpoint', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await startApp();
  });

  describe('[POST] when creating a tournament', () => {
    it('should return the correct id', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/tournaments')
        .send(exampleTournament)
        .expect(201);

      expect(body.id).not.toBeUndefined();
    });

    it('should have stored the tournament', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/tournaments')
        .send(exampleTournament)
        .expect(201);

      const get = await request(app.getHttpServer())
        .get(`/api/tournaments/${body.id}`)
        .expect(200);

      expect(get.body.name).toEqual(exampleTournament.name);
    });
  });
});
