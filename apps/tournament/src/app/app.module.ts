import { Module } from '@nestjs/common';
import { PingController } from './controllers/ping/ping.controller';
import { TournamentController } from './controllers/tournament/tournament.controller';
import { TournamentRepositoryService } from './repositories/tournament-repository.service';

@Module({
  imports: [],
  controllers: [PingController, TournamentController],
  providers: [TournamentRepositoryService],
})
export class AppModule {}
