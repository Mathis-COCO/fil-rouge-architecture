import { Injectable } from '@nestjs/common';
import { Participant } from '../entities/participant-entity';

@Injectable()
export class ParticipantRepositoryService {

  // Liste des participants
  private participants = new Map<string, Participant>();

  // Enregistre le participant
  public saveParticipant(participant: Participant): void {
    this.participants.set(participant.name, participant);
  }

  // Récupère le participant par son ID
  public getParticipantById(participantId: string): Participant {
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
