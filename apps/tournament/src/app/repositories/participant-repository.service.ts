import { Injectable } from '@nestjs/common';
import { Participant } from '../api-model';

@Injectable()
export class ParticipantRepositoryService {
  private participants = new Map<string, Participant>();

  // Enregistre le participant
  public saveParticipant(participant: Participant): void {
      this.participants.set(participant.name, participant);
    }

  // Récupère le tournoi par son ID
  public getParticipantById(participantId: string): Participant {
    return this.participants.get(participantId);
  }

  // Récupère le tournoi par nom
  public getParticipantByName(name: string): Participant | undefined {
    for (const participant of this.participants.values()) {
      if (participant.name.toLowerCase() === name.toLowerCase()) {
        return participant;
      }
    }
    return undefined;
  }

  // TODO
}