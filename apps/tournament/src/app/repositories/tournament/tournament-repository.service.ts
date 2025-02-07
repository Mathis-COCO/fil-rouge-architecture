
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ParticipantRepositoryService } from '../participant/participant-repository.service';
import { v4 as uuidv4 } from 'uuid';
import { Participant } from '../../models/Participant';
import { StatusType } from '../../models/StatusType';
import { Tournament } from '../../models/Tournament';
import { TournamentToAdd } from '../../models/TournamentToAdd';
import { TournamentPhase, TournamentPhaseType } from '../../models/TournamentPhase';

@Injectable()
export class TournamentRepositoryService {
  // Constructeur
  constructor(private participantRepository: ParticipantRepositoryService) {}
  
  // Liste des tournois
  private tournaments = new Map<string, Tournament>();

  // Ajout d'un tournoi
  addTournament(tournamentToAdd: TournamentToAdd): Tournament {
    if (!tournamentToAdd.name || tournamentToAdd.name.trim() === '') {
      throw new BadRequestException(`Le champ nom n'a pas été renseigné.`);
    }
    const existingTournament = this.getTournamentByName(tournamentToAdd.name);
    if (existingTournament) {
      throw new BadRequestException(`Tournoi ${tournamentToAdd.name} déjà existant.`);
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
  public getTournamentById(tournamentId: string): Tournament {
    if (this.tournaments.get(tournamentId) === undefined) {
      throw new NotFoundException(`Tournoi avec l'id ${tournamentId} inexistant.`);
    }
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
    const tournament = this.getTournamentById(tournamentId);
    if (!tournament) {
      throw new NotFoundException(`Tournoi avec l'id ${tournamentId} inexistant.`);
    }
    return tournament.participants;
  }

  // Suppression des participants d'un tournoi
  public deleteParticipantFromTournament(tournamentId: string, participantId: string) {
    const tournament = this.getTournamentById(tournamentId);
    tournament.participants = tournament.participants.filter(
      participant => participant === this.participantRepository.getParticipantById(participantId)
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

  // Ajoute des participants au tournoi
  public addParticipantToTournament(tournamentId: string, participant: Participant): string {
    if (!participant.name || participant.name.trim() === '' || !participant.elo) {
      throw new BadRequestException(`Le champ name et/ou elo est incorrect.`);
    }
    // Participants existants (check doublons)
    const existingParticipant = this.participantExists(participant);
    if (existingParticipant) {
      throw new BadRequestException(`Le participant ${participant.name} existe déjà.`);
    }
    // Récupération du tournoi
    const tournament = this.getTournamentById(tournamentId);
    if (!tournament) {
      throw new BadRequestException(`Tournament with ID ${tournamentId} not found.`);
    }
    if (tournament.participants.length === tournament.maxParticipants) {
      throw new BadRequestException(`Le tournoi est complet.`);
    }
    tournament.participants = tournament.participants || [];
    tournament.participants.push(participant);
    tournament.currentParticipantNb = tournament.participants.length;
    this.saveTournament(tournament);
    return tournament.id;
  }

  // Ajoute des phases au tournoi
  public addPhaseToTournament(phase: TournamentPhase, id: string): string {
    const tournament = this.getTournamentById(id);
    if (!phase) {
      throw new BadRequestException(`La phase n'a pas été renseignée.`);
    }
    if (!tournament) {
      throw new NotFoundException(`Tournoi avec l'id ${id} inexistant.`);
    }
    if (!(phase.type in TournamentPhaseType)) {
      throw new BadRequestException(`Type de phase invalide.`);
    }
    for(const currentPhase of tournament.phases) {
      if (currentPhase.type === "SingleBracketElimination") {
        throw new BadRequestException(`La phase SingleBracketElimination existe déjà et elle est finale.`);
        // TODO: feature #11 ?
      }
    }
    tournament.phases = tournament.phases || [];
    tournament.phases.push(phase);
    this.saveTournament(tournament);
    return tournament.id
  }

  // Gestion des matches en élimination directe (copilot)
  public generateSingleEliminationBracket(tournament: Tournament): TournamentPhase {
    const participants = [...tournament.participants].sort((a, b) => b.elo - a.elo);
    const numParticipants = participants.length;
    const numSeeds = Math.pow(2, Math.floor(Math.log2(numParticipants / 4)));
    const seeds = participants.slice(0, numSeeds);
    const nonSeeds = participants.slice(numSeeds);
    const rounds = [];
    let currentRound = [];
    let matchIndex = 0;

    // Place seeds in the bracket
    for (let i = 0; i < numSeeds; i++) {
      const match = { p1: seeds[i], p2: null, status: 'NotPlayable', winner: null };
      currentRound.push(match);
      if (currentRound.length === Math.pow(2, matchIndex)) {
        rounds.push({ matches: currentRound });
        currentRound = [];
        matchIndex++;
      }
    }

    // Place non-seeds randomly
    while (nonSeeds.length > 0) {
      const match = currentRound.pop();
      match.p2 = nonSeeds.pop();
      match.status = 'Playable';
      currentRound.push(match);
      if (currentRound.length === Math.pow(2, matchIndex)) {
        rounds.push({ matches: currentRound });
        currentRound = [];
        matchIndex++;
      }
    }

    // Create the phase
    const phase: TournamentPhase = {
      type: TournamentPhaseType.SingleBracketElimination,
      status: 'Started',
      rounds: rounds
    };
    return phase;
  }

}
