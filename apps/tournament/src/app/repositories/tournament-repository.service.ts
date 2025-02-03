import { Injectable } from '@nestjs/common';
import { Tournament } from '../api-model';

@Injectable()
export class TournamentRepositoryService {
  private tournaments = new Map<string, Tournament>();

  public saveTournament(tournament: Tournament): void {
    this.tournaments.set(tournament.id, tournament);
  }

  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

  public getTournamentByName(name: string): boolean {
    for (const [id, tournament] of this.tournaments) { 
      if (tournament.name.toLowerCase() === name.toLowerCase()) { 
        return true;
      }
    }
    return false;
  }
}
