import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Participant, Tournament, TournamentPhase, TournamentPhaseType, TournamentToAdd } from '../../api-model';
import { v4 as uuidv4 } from 'uuid';
import { TournamentRepositoryService } from '../../repositories/tournament-repository.service';

@Controller('tournaments')
export class TournamentController {
  constructor(private tournamentRepository: TournamentRepositoryService) {}

  @Post()
  public createTournament(@Body() tournamentToAdd: TournamentToAdd): { id: string; } {
    const createdTournament = this.tournamentRepository.addTournament(tournamentToAdd)
    return { id: createdTournament.id };

  }

  @Post(':id/participants')
  public addParticipantToTournament( @Param('id') tournamentId: string,
                                     @Body() participant: Participant
                                    ): { id: string } {
    if (!participant.name || participant.name.trim() === '' || !participant.elo) {
      throw new BadRequestException(`Le champ name et/ou elo est incorrect.`);
    }
    const existingParticipant = this.tournamentRepository.participantExists(participant);
    if (existingParticipant) {
      throw new BadRequestException(`Le participant ${participant.name} existe déjà.`);
    }

    const tournament = this.tournamentRepository.getTournament(tournamentId); // Fetch the existing tournament
    if (!tournament) {
      throw new BadRequestException(`Tournament with ID ${tournamentId} not found.`);
    }

    tournament.participants = tournament.participants || [];
    tournament.participants.push(participant);
    this.tournamentRepository.saveTournament(tournament);

    return { id: tournament.id };
  }

  @Post(':id/phases')
  public createPhase(@Param('id') id: string, @Body() phase: TournamentPhase): {
    id: string;
  } {
    if (!phase) {
      throw new BadRequestException(`La phase n'a pas été renseignée.`);
    }
    const tournament = this.tournamentRepository.getTournament(id);
    if (!tournament) {
      throw new BadRequestException(`Tournoi avec l'id ${id} inexistant.`);
    }
    if (!(phase.type in TournamentPhaseType)) {
      throw new BadRequestException(`Type de phase invalide.`);
    }
    for(const currentPhase of tournament.phases) {
      if (currentPhase.type === "SingleBracketElimination") {
        throw new BadRequestException(`La phase SingleBracketElimination existe déjà et elle est finale.`);
      }
    }
    
    tournament.phases = tournament.phases || [];
    tournament.phases.push(phase);
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

    const tournament = this.tournamentRepository.getTournament(id);
    if (!tournament) {
      throw new BadRequestException(`Tournament with ID ${id} not found.`);
    }

    if (!this.tournamentRepository.getTournament(id)) {
      throw new BadRequestException("Le tournoi n'existe pas");
    } else {
      return this.tournamentRepository.getTournamentParticipants(id);
    }
  }

  @Delete(':id/participants/:participantId')
  public deleteTournamentParticipant(@Param('id') id: string, @Param('participantId') participantId: string)
  {
    this.tournamentRepository.deleteParticipantFromTournament(id, participantId);
  }
}
