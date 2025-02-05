import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
//import { Tournament } from './tournament-entity';
import { TournamentPhaseType } from '../api-model';

@Entity()
export class TournamentPhase {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TournamentPhaseType })
  type: TournamentPhaseType;

  @Column()
  status: string;

  //@ManyToOne(() => Tournament, (tournament) => tournament.phases)
  //tournament: Tournament;

}
