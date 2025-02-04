import { BadRequestException, Injectable } from '@nestjs/common';
import { Participant, Tournament, TournamentToAdd } from '../api-model';
import { ParticipantRepositoryService } from './participant-repository.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TournamentRepositoryService {
  constructor(private participantRepository: ParticipantRepositoryService) {}
  
  private tournaments = new Map<string, Tournament>();

  addTournament(tournamentToAdd: TournamentToAdd): Tournament {
    
    if (!tournamentToAdd.name || tournamentToAdd.name.trim() === '') {
      throw new BadRequestException(`Le champ nom n'a pas été renseigné.`);
    }
    const existingTournament = this.getTournamentByName(tournamentToAdd.name);
    if (existingTournament) {
      throw new BadRequestException(`Tournoi ${tournamentToAdd.name} déjà existant.`);
    }

    const tournament = {
      id: uuidv4(),
      name: tournamentToAdd.name,
      maxParticipants: tournamentToAdd.maxParticipants,
      currentParticipantNb: 0,
      phases: [],
      participants: [],
    };
    this.saveTournament(tournament);

    return tournament;
  }

  public saveTournament(tournament: Tournament): void {
    this.tournaments.set(tournament.id, tournament);
  }

  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

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
