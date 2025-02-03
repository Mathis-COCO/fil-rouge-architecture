import { BadRequestException, Body, ConflictException, Controller, Get, Param, Post } from '@nestjs/common';
import { Tournament, TournamentToAdd } from '../../api-model';
import { v4 as uuidv4 } from 'uuid';
import { TournamentRepositoryService } from '../../repositories/tournament-repository.service';

@Controller('tournaments')
export class TournamentController {
  constructor(private tournamentRepository: TournamentRepositoryService) {}

  @Post()
  public createTournament(@Body() tournamentToAdd: TournamentToAdd): {
    id: string;
  } {
    if (!tournamentToAdd.name || tournamentToAdd.name.trim() === '') {
      throw new BadRequestException(`Le champ name n'a pas été renseigné`);
    }
    const existingTournament = this.tournamentRepository.getTournamentByName(tournamentToAdd.name);
    console.log("existingTournament", existingTournament)

    if (existingTournament) {
      throw new ConflictException(`Tournament avec ${tournamentToAdd.name} existe déjà`);
    }

    const tournament = {
      id: uuidv4(),
      name: tournamentToAdd.name,
      phases: [],
      participants: [],
    };
    this.tournamentRepository.saveTournament(tournament);

    return { id: tournament.id };
  }

  @Get(':id')
  public getTournament(@Param('id') id: string): Tournament {
    return this.tournamentRepository.getTournament(id);
  }
}
