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
  // TODO: vérifier puis compléter / corriger
  rounds: [
    {
      matches: [
        {
          p1: {
            name: 'test';
            elo: 0;
          };
          p2: null;
          status: StatusType.NotPlayable;
          winner: 'test';
        },
        {
          p1: {
            name: 'test2',
            elo: 100,
          };
          p2: {
            name: 'test3',
            elo: 5000
          };
          status: StatusType.Started,
          winner: 'test3'
        }
      ];
    }
  ];
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
