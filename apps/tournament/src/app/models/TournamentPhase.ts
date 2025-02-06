import { StatusType } from "./Status";

export enum TournamentPhaseType {
    SingleBracketElimination = 'SingleBracketElimination',
    SwissRound = 'SwissRound',
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
