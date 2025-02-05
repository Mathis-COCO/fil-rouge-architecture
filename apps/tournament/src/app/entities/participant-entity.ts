import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tournament } from './tournament-entity';

@Entity()
export class Participant {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  elo: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.participants)
  tournament: Tournament;
  
}
