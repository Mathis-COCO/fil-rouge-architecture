import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { StatusType, TournamentPhaseType, TournamentToAdd } from '../../api-model';
import { Participant } from '../../entities/participant-entity';
import { Tournament } from '../../entities/tournament-entity';
import { TournamentPhase } from '../../entities/tournament-phase-entity';
import { TournamentRepositoryService } from '../../repositories/tournament-repository.service';

@Controller('tournaments')
export class TournamentController {

  constructor(private tournamentRepository: TournamentRepositoryService) { }

  // Création d'un tournoi
  @Post()
  public createTournament(@Body() tournamentToAdd: TournamentToAdd): { id: string; } {
    const createdTournament = this.tournamentRepository.addTournament(tournamentToAdd);
    return { id: createdTournament.id };
  }

  // Création de la phase d'un tournoi
  @Post(':id/phases')
  public createPhase(@Param('id') id: string, @Body() phase: TournamentPhase): { id: string } {
    const tournament = this.tournamentRepository.getTournament(id);
    // Phase non renseignée
    if (!phase) {
      throw new BadRequestException(`La phase n'a pas été renseignée.`);
    }
    // Tournoi inexistant
    if (!tournament) {
      throw new NotFoundException(`Tournoi avec l'id ${id} inexistant.`);
    }
    // Type de phase invalide
    if (!(phase.type in TournamentPhaseType)) {
      throw new BadRequestException(`Type de phase invalide.`);
    }
    // On vérifie les phases du tournoi
    for (const currentPhase of tournament.phases) {
      if (currentPhase.type === 'SingleBracketElimination') {
        throw new BadRequestException(`La phase SingleBracketElimination existe déjà et elle est finale.`);
      }
    }
    tournament.phases = tournament.phases || [];
    tournament.phases.push(phase);
    this.tournamentRepository.saveTournament(tournament);
    return { id: tournament.id };
  }

  // Récupération d'un tournoi par ID 
  @Get(':id')
  public getTournament(@Param('id') id: string): Tournament {
    if (!this.tournamentRepository.getTournament(id)) {
      throw new NotFoundException("Le tournoi n'existe pas");
    } else {
      return this.tournamentRepository.getTournament(id);
    }
  }

  // Récupération des participants d'un tournoi
  @Get(':id/participants')
  public getTournamentParticipants(@Param('id') id: string): Participant[] {
    const tournament = this.tournamentRepository.getTournament(id);
    if (!tournament) {
      throw new NotFoundException("Le tournoi n'existe pas");
    } else {
      return this.tournamentRepository.getTournamentParticipants(id);
    }
  }

  // Démarrage d'un tournoi
  @Patch(':id')
  public startTournament(
    @Param('id') id: string,
    @Body() body: { status: StatusType }
  ) {
    const tournament = this.getTournament(id);
    tournament.status = body.status;
    this.tournamentRepository.saveTournament(tournament);
  }

  // Suppression des participants d'un tournoi
  @Delete(':id/participants/:participantId')
  public deleteTournamentParticipant(
    @Param('id') id: string,
    @Param('participantId') participantId: string
  ) {
    this.tournamentRepository.deleteParticipantFromTournament(
      id,
      participantId
    );
  }
}