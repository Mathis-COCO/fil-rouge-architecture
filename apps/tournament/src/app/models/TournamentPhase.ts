import { Round } from "./Match";

export enum TournamentPhaseType {
    SingleBracketElimination = 'SingleBracketElimination',
    SwissRound = 'SwissRound',
  }

export interface TournamentPhase {
  type: TournamentPhaseType;
  status: 'Started';
  rounds: Round[];
}
