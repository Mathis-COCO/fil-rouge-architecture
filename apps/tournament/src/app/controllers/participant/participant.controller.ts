import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Participant } from '../../api-model';
import { v4 as uuidv4 } from 'uuid';
import { ParticipantRepositoryService } from '../../repositories/participant-repository.service';

@Controller('participants')
export class ParticipantController {
  constructor(private participantRepository: ParticipantRepositoryService) {}

  @Post()
  public createParticipant(@Body() participantToAdd: Participant): { id: string; } {
    // Le nom de participant est invalide
    if ((!participantToAdd.name || participantToAdd.name.trim() === '') ||
        (!participantToAdd.elo || participantToAdd.elo % 1 !== 0)) { // TODO: check que elo est bien entier
      throw new BadRequestException('Nom du participant ou ELO invalide.');
    }
    // Le nom de participant existe déjà
    const existingParticipants = this.participantRepository.getParticipantByName(
      participantToAdd.name
    );
    if (existingParticipants) {
      throw new BadRequestException(`Le participant ${participantToAdd.name} existe déjà.`);
    }

    const participant = {
      id: uuidv4(),
      name: participantToAdd.name,
      elo: participantToAdd.elo
    };
    this.participantRepository.saveParticipant(participant);

    return { id: participant.id };
  }

  @Get(':id')
  public getParticipant(@Param('id') id: string): Participant {
    if (!this.participantRepository.getParticipantById(id)) {
      throw new BadRequestException("Le participant n'existe pas.");
    } else {
      return this.participantRepository.getParticipantById(id);
    }
  }
  // TODO: vérifier qu'aucun participant n'est en double (nom x2) sur un tournoi donné 
}