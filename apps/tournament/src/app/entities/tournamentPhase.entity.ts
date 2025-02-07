import { Column, Entity } from "typeorm";

// Enum type des phases d'un tournoi
export enum TournamentPhaseType {
  SingleBracketElimination = 'SingleBracketElimination',
  SwissRound = 'SwissRound',
}

// Enum type de status d'un tournoi
export enum StatusType {
  Started = 'Started',
  NotStarted = 'Awaiting Start',
  NotPlayable = 'Unplayable'
}

@Entity()
export class TournamentPhase {

  @Column()
  type: TournamentPhaseType;

  @Column()
  status: StatusType;

}