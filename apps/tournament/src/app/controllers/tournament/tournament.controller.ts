import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Participant, Tournament, TournamentToAdd } from '../../api-model';
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
      throw new BadRequestException(`Le champ nom n'a pas été renseigné.`);
    }
    const existingTournament = this.tournamentRepository.getTournamentByName(tournamentToAdd.name);
    if (existingTournament) {
      throw new BadRequestException(`Tournoi ${tournamentToAdd.name} déjà existant.`);
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

  @Post(':id/participants')
  public addParticipantToTournament(
    @Param('id') id: string,
    @Body() participant: Participant): {
    id: string;
  } {
    if (!participant.name || participant.name.trim() === '' || !participant.elo) {
      throw new BadRequestException(`Le champ name et/ou elo est incorrect.`);
    }
    const existingParticipant = this.tournamentRepository.participantExists(participant);
    if (existingParticipant) {
      throw new BadRequestException(`Le participant ${participant.name} existe déjà.`);
    }

    const tournament = this.tournamentRepository.getTournament(id); // Fetch the existing tournament
    if (!tournament) {
      throw new BadRequestException(`Tournament with ID ${id} not found.`);
    }

    tournament.participants = tournament.participants || [];
    tournament.participants.push(participant);
    this.tournamentRepository.saveTournament(tournament);

    return { id: tournament.id };
  }

  @Get(':id')
  public getTournament(@Param('id') id: string): Tournament {
    if (!this.tournamentRepository.getTournament(id)) {
      throw new BadRequestException("Le tournoi n'existe pas");
    } else {
      return this.tournamentRepository.getTournament(id);
    }
  }

  @Get(':id/participants')
  public getTournamentParticipants(@Param('id') id: string): Participant[] {

    const tournament = this.tournamentRepository.getTournament(id); // Fetch the existing tournament
    if (!tournament) {
      throw new BadRequestException(`Tournament with ID ${id} not found.`);
    }
    
    if (!this.tournamentRepository.getTournament(id)) {
      throw new BadRequestException("Le tournoi n'existe pas");
    } else {
      return this.tournamentRepository.getTournamentParticipants(id);
    }
  }
}
