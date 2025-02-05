import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { Participant } from '../../api-model';
import { ParticipantRepositoryService } from '../../repositories/participant-repository.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('tournaments/:tournamentId/participants')
export class ParticipantController {

  constructor(private participantRepository: ParticipantRepositoryService) {}

  // Ajout d'un participant à un tournoi existant
  @Post()
  public addParticipantToTournament(
    @Param('tournamentId') tournamentId: string,
    @Body() participant: Participant
  ): { id: string } {
    // Participant invalide
    if (
      !participant.name ||
      participant.name.trim() === '' ||
      !participant.elo
    ) {
      throw new BadRequestException(`Le champ name et/ou elo est incorrect.`);
    }

    // Participants existants (check doublons)
    const existingParticipant =
      this.participantRepository.participantExists(participant);
    if (existingParticipant) {
      throw new BadRequestException(
        `Le participant ${participant.name} existe déjà.`
      );
    }

    // Récupération du tournoi
    const tournament = this.participantRepository.getTournament(tournamentId);
    if (!tournament) {
      throw new NotFoundException(
        `Tournoi avec l'id ${tournamentId} inexistant.`
      );
    }

    // Ajout du participant
    tournament.participants.push(participant);
    this.participantRepository.saveTournament(tournament);
    return { id: participant.id };
  }

  // Récupération des participants d'un tournoi
  @Get()
  public getTournamentParticipants(
    @Param('tournamentId') tournamentId: string
  ): Participant[] {
    const tournament = this.participantRepository.getTournament(tournamentId);
    if (!tournament) {
      throw new NotFoundException("Le tournoi n'existe pas");
    } else {
      return this.participantRepository.getTournamentParticipants(tournamentId);
    }
  }

  // Création d'un participant
  @Post()
  public createParticipant(@Body() participantToAdd: Participant): {
    id: string;
  } {
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
    const existingParticipants = this.participantRepository.getParticipantByName(participantToAdd.name);
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
    this.participantRepository.saveParticipant(participant);
    return { id: participant.id };
  }

  // Récupération d'un participant
  @Get(':id')
  public getParticipant(@Param('id') id: string): Participant {
    if (!this.participantRepository.getParticipantById(id)) {
      throw new BadRequestException("Le participant n'existe pas.");
    } else {
      return this.participantRepository.getParticipantById(id);
    }
  }
}
