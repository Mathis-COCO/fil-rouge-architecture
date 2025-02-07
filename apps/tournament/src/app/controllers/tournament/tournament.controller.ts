import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TournamentRepositoryService } from '../../repositories/tournament/tournament-repository.service';
import { Participant } from '../../models/Participant';
import { StatusType } from '../../models/StatusType';
import { Tournament } from '../../models/Tournament';
import { TournamentToAdd } from '../../models/TournamentToAdd';
import { TournamentPhase } from '../../models/TournamentPhase';

@Controller('tournaments')
export class TournamentController {
  constructor(private tournamentRepository: TournamentRepositoryService) {}

  // Création d'un tournoi
  @Post()
  public createTournament(@Body() tournamentToAdd: TournamentToAdd): { id: string; } {
    return { id: this.tournamentRepository.addTournament(tournamentToAdd).id };

  }

  // Ajout de participants à un tournoi
  @Post(':id/participants')
  public addParticipantToTournament( @Param('id') tournamentId: string,
                                     @Body() participant: Participant): { id: string } {
    return { id: this.tournamentRepository.addParticipantToTournament(tournamentId, participant) };
  }

  // Création des phases d'un tournoi
  @Post(':id/phases')
  public createPhase(@Param('id') id: string, @Body() phase: TournamentPhase): { id: string; } {
    return { id: this.tournamentRepository.addPhaseToTournament(phase, id) };
  }

  // Récupération d'un tournoi par son ID
  @Get(':id')
  public getTournament(@Param('id') id: string): Tournament {
    return this.tournamentRepository.getTournamentById(id);
  }

  // Récupération des participants d'un tournoi par son ID
  @Get(':id/participants')
  public getTournamentParticipants(@Param('id') id: string): Participant[] {
    return this.tournamentRepository.getTournamentParticipants(id);
  }

  // Démarrage d'un tournoi
  @Patch(':id')
  public startTournament(@Param('id') id: string, @Body() body: { status: StatusType }) {
    const tournament = this.getTournament(id);
    tournament.status = body.status;
    // Features #11 (copilot)
    if (tournament.status === StatusType.Started) {
      const phase = this.tournamentRepository.generateSingleEliminationBracket(tournament);
      tournament.phases.push(phase);
    }
    this.tournamentRepository.saveTournament(tournament);
  }

  // Suppression des participants d'un tournoi
  @Delete(':id/participants/:participantId')
  public deleteTournamentParticipant(@Param('id') id: string, @Param('participantId') participantId: string) {
    this.tournamentRepository.deleteParticipantFromTournament(id, participantId);
  }
}
