export enum TournamentPhaseType {
  SingleBracketElimination = 'SingleBracketElimination',
  SwissRound = 'SwissRound',
}

export enum StatusType {
  Started = 'Started',
  NotStarted = 'Awaiting Start',
  NotPlayable = 'Unplayable'
}

export interface TournamentPhase {
  type: TournamentPhaseType;
  status: 'Started';
}

export interface Participant {
  id: string;
  name: string;
  elo: number;
}

export interface TournamentToAdd {
  name: string;
  maxParticipants: number;
}

export interface Tournament {
  id: string;
  name: string;
  maxParticipants: number;
  currentParticipantNb: number;
  status?: StatusType,
  phases: TournamentPhase[];
  participants: Participant[];
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface Match {
  participant1: Participant;
  participant2: Participant;
}
