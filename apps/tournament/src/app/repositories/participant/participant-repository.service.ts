import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Participant } from '../../models/Participant';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ParticipantRepositoryService {
  private participants = new Map<string, Participant>();

  // Enregistre le participant
  public saveParticipant(participant: Participant): Participant {
    // Le nom de participant est invalide
    if ((!participant.name || participant.name.trim() === '') ||
        (!participant.elo || participant.elo % 1 !== 0)) { 
      throw new BadRequestException('Nom du participant ou ELO invalide.');
    }
    // Le nom de participant existe déjà
    const existingParticipants = this.getParticipantByName(
      participant.name
    );
    if (existingParticipants) {
      throw new BadRequestException(`Le participant ${participant.name} existe déjà.`);
    }
    // Initialization du participant
    const newParticipant = {
      id: uuidv4(),
      name: participant.name,
      elo: participant.elo
    };

    this.participants.set(newParticipant.id, newParticipant);
    return newParticipant;
  }

  // Récupère le participant par son ID
  public getParticipantById(participantId: string): Participant {
    console.log(this.participants)
    console.log(participantId)
    if (this.participants.get(participantId) === undefined) {
      throw new NotFoundException(`Le participant avec l'ID ${participantId} n'existe pas.`);
    }
    return this.participants.get(participantId);
  }

  // Récupère le participant par nom
  public getParticipantByName(name: string): Participant | undefined {
    for (const participant of this.participants.values()) {
      if (participant.name.toLowerCase() === name.toLowerCase()) {
        return participant;
      }
    }
    return undefined;
  }

}