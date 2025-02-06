import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Participant } from '../../entities/participant-entity';
import { ParticipantRepositoryService } from '../../repositories/participant-repository.service';
import { TournamentRepositoryService } from '../../repositories/tournament-repository.service';

@Controller('tournaments/:tournamentId/participants')
export class ParticipantController {

  constructor(private participantRepository: ParticipantRepositoryService,
              private tournamentRepository: TournamentRepositoryService) { }

  // Ajout d'un participant à un tournoi existant
  @Post()
  public addParticipantToTournament(@Param('tournamentId') tournamentId: string,
                                    @Body() participant: Participant): { id: string } {
    // Participant invalide
    if (!participant.name || participant.name.trim() === '' || !participant.elo) {
      throw new BadRequestException(`Le champ name et/ou elo est incorrect.`);
    }

    // Participants existants (check doublons)
    const existingParticipant = this.participantRepository.getParticipantByName(participant.name);
    if (existingParticipant) {
      throw new BadRequestException(`Le participant ${participant.name} existe déjà.`);
    }

    // Récupération du tournoi
    const tournament = this.tournamentRepository.getTournament(tournamentId);
    if (!tournament) {
      throw new NotFoundException(`Tournoi avec l'id ${tournamentId} inexistant.`);
    }

    // Ajout du participant
    tournament.participants.push(participant);
    this.tournamentRepository.saveTournament(tournament);
    return { id: participant.id };
  }

  // Récupération des participants d'un tournoi
  @Get()
  public getTournamentParticipants(@Param('tournamentId') tournamentId: string): Participant[] {
    const tournament = this.tournamentRepository.getTournament(tournamentId);
    if (!tournament) {
      throw new NotFoundException("Le tournoi n'existe pas");
    } else {
      return this.tournamentRepository.getTournamentParticipants(tournamentId);
    }
  }

  // Création d'un participant
  @Post()
  public createParticipant(@Body() participantToAdd: Participant): { id: string; } {
    // Le nom de participant est invalide
    if (!participantToAdd.name || participantToAdd.name.trim() === '' ||
        !participantToAdd.elo || participantToAdd.elo % 1 !== 0) {
      throw new BadRequestException('Nom du participant ou ELO invalide.');
    }
    // Le nom de participant existe déjà
    if (this.participantRepository.getParticipantByName(participantToAdd.name)) {
      throw new BadRequestException(`Le participant ${participantToAdd.name} existe déjà.`);
    }
    // Initialization du participant
    const participant = {
      id: uuidv4(),
      name: participantToAdd.name,
      elo: participantToAdd.elo,
      tournament: null
    };
    this.participantRepository.saveParticipant(participant); // TODO: vérifier si O.K.
    return { id: participant.id };
  }

  // Récupération d'un participant par son ID
  @Get(':id')
  public getParticipant(@Param('id') id: string): Participant {
    if (!this.participantRepository.getParticipantById(id)) {
      throw new BadRequestException("Le participant n'existe pas.");
    } else {
      return this.participantRepository.getParticipantById(id);
    }
  }
}
