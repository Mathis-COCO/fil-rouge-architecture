import { Module } from '@nestjs/common';
import { PingController } from './controllers/ping/ping.controller';
import { TournamentController } from './controllers/tournament/tournament.controller';
import { TournamentRepositoryService } from './repositories/tournament/tournament-repository.service';
import { ParticipantRepositoryService } from './repositories/participant/participant-repository.service';
import { ParticipantController } from './controllers/participant/participant.controller';

@Module({
  imports: [],
  controllers: [PingController, TournamentController, ParticipantController],
  providers: [TournamentRepositoryService, ParticipantRepositoryService],
})
export class AppModule {}
