import { BadRequestException, Injectable } from '@nestjs/common';
import { Participant, StatusType, Tournament, TournamentToAdd } from '../api-model';
import { v4 as uuidv4 } from 'uuid';
import { Tournament } from '../entities/tournament-entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TournamentRepositoryService {

  constructor(@InjectRepository(Tournament)
      private tournamentRepository: Repository<Tournament>
  ) { }
  
  // Liste des tournois
  private tournaments = new Map<string, Tournament>();

  // Ajout d'un tournoi
  addTournament(tournamentToAdd: TournamentToAdd): Tournament {
    if (!tournamentToAdd.name || tournamentToAdd.name.trim() === '') {
      throw new BadRequestException(`Le champ nom n'a pas été renseigné.`);
    }
    const existingTournament = this.getTournamentByName(tournamentToAdd.name);
    if (existingTournament) {
      throw new BadRequestException(
        `Tournoi ${tournamentToAdd.name} déjà existant.`
      );
    }
    const tournament: Tournament = {
      id: uuidv4(),
      name: tournamentToAdd.name,
      maxParticipants: tournamentToAdd.maxParticipants,
      currentParticipantNb: 0,
      status: StatusType.NotStarted,
      phases: [],
      participants: [],
    };
    this.saveTournament(tournament);
    return tournament;
  }

  // Enregistrement d'un tournoi
  public saveTournament(tournament: Tournament): void {
    this.tournaments.set(tournament.id, tournament);
  }

  // Récupération d'un tournoi par son ID
  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

  // Récupération d'un tournoi par son nom
  public getTournamentByName(name: string): Tournament | undefined {
    for (const tournament of this.tournaments.values()) {
      if (tournament.name.toLowerCase() === name.toLowerCase()) {
        return tournament;
      }
    }
    return undefined;
  }

  // Récupération des participants d'un tournoi par son ID
  public getTournamentParticipants(tournamentId: string): Participant[] {
    const tournament = this.getTournament(tournamentId);
    return tournament.participants;
  }

  // Suppression des participants d'un tournoi
  public deleteParticipantFromTournament(
    tournamentId: string,
    participantId: string
  ) {
    const tournament = this.getTournament(tournamentId);
    tournament.participants = tournament.participants.filter(
      (participant) =>
        participant ===
        this.getParticipantById(participantId)
    );
    this.saveTournament(tournament);
  }

  // Vérifie que le participant passé en paramètre existe dans le tournoi donné
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
