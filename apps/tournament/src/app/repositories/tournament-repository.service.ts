import { Injectable } from '@nestjs/common';
import { Tournament } from '../api-model';

@Injectable()
export class TournamentRepositoryService {
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
}
