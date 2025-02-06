import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tournament } from './tournament-entity';
import { IsDefined } from 'class-validator';

@Entity()
export class Participant {

  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  id: string;

  @Column()
  @IsDefined()
  name: string;

  @Column()
  @IsDefined()
  elo: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.participants)
  tournament: Tournament; // pose problème car on a pas forcément de tournoi lors de la création d'un participant

}
