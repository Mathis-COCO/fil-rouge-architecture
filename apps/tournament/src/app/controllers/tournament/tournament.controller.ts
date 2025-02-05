import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { Participant, StatusType, Tournament, TournamentPhase, TournamentPhaseType, TournamentToAdd } from '../../api-model';
import { TournamentRepositoryService } from '../../repositories/tournament-repository.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('tournaments')
export class TournamentController {
  constructor(private tournamentRepository: TournamentRepositoryService) { }

  @Post()
  public createTournament(@Body() tournamentToAdd: TournamentToAdd): {
    id: string;
  } {
    const createdTournament =
      this.tournamentRepository.addTournament(tournamentToAdd);
    return { id: createdTournament.id };
  }

  @Post(':id/participants')
  public addParticipantToTournament(
    @Param('id') tournamentId: string,
    @Body() participant: Participant
  ): { id: string } {
    if (
      !participant.name ||
      participant.name.trim() === '' ||
      !participant.elo
    ) {
      throw new BadRequestException(`Le champ name et/ou elo est incorrect.`);
    }

    // Participants existants (check doublons)
    const existingParticipant =
      this.tournamentRepository.participantExists(participant);
    if (existingParticipant) {
      throw new BadRequestException(
        `Le participant ${participant.name} existe déjà.`
      );
    }

    // Récupération du tournoi
    const tournament = this.tournamentRepository.getTournament(tournamentId);
    if (!tournament) {
      throw new BadRequestException(
        `Tournament with ID ${tournamentId} not found.`
      );
    }
    if (tournament.participants.length === tournament.maxParticipants) {
      throw new BadRequestException(`Le tournoi est complet.`);
    }

    tournament.participants = tournament.participants || [];
    tournament.participants.push(participant);
    tournament.currentParticipantNb = tournament.participants.length;
    this.tournamentRepository.saveTournament(tournament);
    return { id: tournament.id };
  }

  @Post(':id/phases')
  public createPhase(
    @Param('id') id: string,
    @Body() phase: TournamentPhase
  ): { id: string } {
    const tournament = this.tournamentRepository.getTournament(id);

    if (!phase) {
      throw new BadRequestException(`La phase n'a pas été renseignée.`);
    }
    if (!tournament) {
      throw new NotFoundException(`Tournoi avec l'id ${id} inexistant.`);
    }
    if (!(phase.type in TournamentPhaseType)) {
      throw new BadRequestException(`Type de phase invalide.`);
    }
    for (const currentPhase of tournament.phases) {
      if (currentPhase.type === 'SingleBracketElimination') {
        throw new BadRequestException(
          `La phase SingleBracketElimination existe déjà et elle est finale.`
        );
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
      throw new NotFoundException("Le tournoi n'existe pas");
    } else {
      return this.tournamentRepository.getTournament(id);
    }
  }

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

  //************* ANCIENNEMENT participant-controller ! **************//

  // Création d'un participant
  @Post()
  public createParticipant(@Body() participantToAdd: Participant): { id: string; } {
    // Le nom de participant est invalide
    if (
      !participantToAdd.name ||
      participantToAdd.name.trim() === '' ||
      !participantToAdd.elo ||
      participantToAdd.elo % 1 !== 0
    ) {
      throw new BadRequestException('Nom du participant ou ELO invalide.');
    }
    // Le nom de participant existe déjà
    const existingParticipants = this.tournamentRepository.getParticipantByName(participantToAdd.name);
    if (existingParticipants) {
      throw new BadRequestException(
        `Le participant ${participantToAdd.name} existe déjà.`
      );
    }
    // Initialization du participant
    const participant = {
      id: uuidv4(),
      name: participantToAdd.name,
      elo: participantToAdd.elo,
    };
    this.tournamentRepository.saveParticipant(participant);
    return { id: participant.id };
  }

  // Récupération d'un participant
  @Get(':id')
  public getParticipant(@Param('id') id: string): Participant {
    if (!this.tournamentRepository.getParticipantById(id)) {
      throw new BadRequestException("Le participant n'existe pas.");
    } else {
      return this.tournamentRepository.getParticipantById(id);
    }
  }

  // Enregistre le participant

}