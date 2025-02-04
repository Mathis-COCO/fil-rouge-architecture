import { Injectable } from '@nestjs/common';
import { Participant, Tournament } from '../api-model';
import { ParticipantRepositoryService } from './participant-repository.service';

@Injectable()
export class TournamentRepositoryService {
  constructor(private participantRepository: ParticipantRepositoryService) {}
  
  private tournaments = new Map<string, Tournament>();

  // Enregistre le tournoi
  public saveTournament(tournament: Tournament): void {
    this.tournaments.set(tournament.id, tournament);
  }

  // Récupère le tournoi par son ID
  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

  // Récupère le tournoi par nom 
  public getTournamentByName(name: string): Tournament | undefined {
    for (const tournament of this.tournaments.values()) { 
      if (tournament.name.toLowerCase() === name.toLowerCase()) { 
        return tournament;
      }
    }
    return undefined;
  }

  public getTournamentParticipants(tournamentId: string): Participant[] {
    const tournament = this.getTournament(tournamentId);
    return tournament.participants;
  }

  public deleteParticipantFromTournament(tournamentId: string, participantId: string) {
    const tournament = this.getTournament(tournamentId);
    console.log("tournament list : " + tournament)
    console.log("service list : " + this.participantRepository.getParticipantById(participantId))
    tournament.participants = tournament.participants.filter(participant => participant === this.participantRepository.getParticipantById(participantId));
    this.saveTournament(tournament);
  }
  
  public participantExists(participant: Participant): boolean {
    for (const tournament of this.tournaments.values()) {
      for (const currentParticipant of tournament.participants) {
        if (currentParticipant.name === participant.name) { 
          return true;
        }
      }
    }
    return false;
  }
}
