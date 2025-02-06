import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ParticipantRepositoryService } from '../../repositories/participant/participant-repository.service';
import { Participant } from '../../models/Participant';

@Controller('participants')
export class ParticipantController {
  constructor(private participantRepository: ParticipantRepositoryService) {}

  // Création d'un participant
  @Post()
  public createParticipant(@Body() participantToAdd: Participant): { id: string; } {
    return { id: this.participantRepository.saveParticipant(participantToAdd).id };
  }

  // Récupération d'un participant
  @Get(':id')
  public getParticipant(@Param('id') id: string): Participant {
    return this.participantRepository.getParticipantById(id);
  }
}