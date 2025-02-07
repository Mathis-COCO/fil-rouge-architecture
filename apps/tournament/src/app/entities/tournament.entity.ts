import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Participant } from '../entities/participant.entity';
import { StatusType } from '../models/StatusType'; 
import { TournamentPhase } from '../entities/tournamentPhase.entity';

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

  @Column({ type: 'enum', enum: StatusType, default: StatusType.NotStarted, nullable: true })
  status: StatusType;

  @ManyToOne(() => Participant, (participant) => participant.tournament)
  participants: Participant[];

  // à corriger
  @OneToMany(() => TournamentPhase, (phase) => phase.type)
  phases: TournamentPhase[];
}