import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Participant } from '../entities/participant-entity';
import { StatusType } from '../api-model';
import { TournamentPhase } from './tournament-phase-entity';

@Entity()
export class Tournament {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 2 })
  maxParticipants: number;

  @Column({ default: 0 })
  currentParticipantNb: number;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.NotStarted })
  status: StatusType;

  @OneToMany(() => Participant, (participant) => participant.tournament)
  participants: Participant[];

  @OneToMany(() => TournamentPhase, (phase) => phase.tournament)
  phases: TournamentPhase[];
  
}
