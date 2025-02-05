import { TournamentToAdd, Participant, Tournament, TournamentPhase, TournamentPhaseType } from '../app/api-model';
import { INestApplication } from '@nestjs/common';
import { startApp } from './test.utils';
import request from 'supertest';

// Cas de test participant
const exampleParticipant1 = {
  name: "John Pork",
  elo: 0
} as Participant;

// Cas de test participant 2
const exampleParticipant2 = {
  name: "Mark Jeff",
  elo: 100
} as Participant;

// Cas de test participant 3
const exampleParticipant3 = {
  name: 'Pete Peter',
  elo: 1,
} as Participant;

// Cas de test participant 4
const exampleParticipant4 = {
  name: 'Féfé la Fripouille',
  elo: 5000,
} as Participant;

// Liste de participants cas de tests
const participants: Participant[] = [
  exampleParticipant1,
  exampleParticipant2,
  exampleParticipant3,
  exampleParticipant4
];

// Cas de test phases tournois
enum phaseTypeTest {
  SingleBracketElimination = 'SingleBracketElimination',
  SwissRound = 'SwissRound',
}
const exampleTournamentPhase = {
  type: phaseTypeTest
}

// Cas de test tournoi a créer
const exampleTournament = {
  name: 'Unreal',
  maxParticipants: 4
} as TournamentToAdd;

// Cas de test tournoi créé
const exampleExistingTournament = {
  id: "",
  name: 'TestBis',
  maxParticipants: 2,
  currentParticipantNb: 2,
  status: 'Started',
  phases: exampleTournamentPhase,
  participants: participants,
}

// ----- CAS DE TESTS ----- //
describe('/tournament endpoint', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await startApp();
  });
  describe('[POST] when creating a tournament', () => {

    // Vérifier ID tournoi
    it('should return the correct id', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/tournaments')
        .send(exampleTournament)
        .expect(201);
      expect(body.id).not.toBeUndefined();
    });

    // Vérifier enregistrement (et nom) tournoi
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

    // Vérifier nb participants max
    it('should return the correct number of max allowed participants', async () => {
      // On envoi le tournoi...
      const { body } = await request(app.getHttpServer())
        .post('/api/tournaments')
        .send(exampleTournament)
        .expect(201);
      // ...on le récupère
      const get = await request(app.getHttpServer())
        .get(`/api/tournaments/${body.maxParticipants}`)
        .expect(200);
      expect(get.body.maxParticipants).toEqual(exampleTournament.maxParticipants);
    });

    // Vérifier nb participants
    it('should return the correct number of participants in the current tournament', async () => {
      // On envoi le tournoi...
      const { body } = await request(app.getHttpServer())
        .post('/api/tournaments')
        .send(exampleExistingTournament)
        .expect(201);
      // ...on le récupère
      const get = await request(app.getHttpServer())
        .get(`/api/tournaments/${body.currentParticipantNb}`)
        .expect(200);
      expect(get.body.currentParticipantNb).toEqual(exampleExistingTournament.currentParticipantNb);
    });
  });
});
