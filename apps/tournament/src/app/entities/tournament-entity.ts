import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Participant } from '../entities/participant-entity';
import { StatusType } from '../api-model';

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

  @ManyToOne(() => Participant, (participant) => participant.tournament)
  participants: Participant[];

  // @OneToMany(() => TournamentPhase, (phase) => phase.tournament)
  // phases: TournamentPhase[];
}
