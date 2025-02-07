import { Participant } from "./Participant";
import { StatusType } from "./StatusType";
import { TournamentPhase } from "./TournamentPhase";

export interface Tournament {
  id: string;
  name: string;
  maxParticipants: number;
  currentParticipantNb: number;
  status?: StatusType,
  phases: TournamentPhase[];
  participants: Participant[];
}