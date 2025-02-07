import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentRepositoryService } from './repositories/tournament/tournament-repository.service';
import { ParticipantRepositoryService } from './repositories/participant/participant-repository.service';
import { PingController } from './controllers/ping/ping.controller';
import { TournamentController } from './controllers/tournament/tournament.controller';
import { ParticipantController } from './controllers/participant/participant.controller';
import { Tournament } from './entities/tournament.entity';
import { Participant } from './entities/participant.entity';
import { TournamentPhase } from './entities/tournamentPhase.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'tournament_password',
      username: 'tournament_user',
      entities: [Tournament, Participant, TournamentPhase],
      database: 'tournament_db',
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [PingController, TournamentController, ParticipantController],
  providers: [TournamentRepositoryService, ParticipantRepositoryService],
})
export class AppModule {}
