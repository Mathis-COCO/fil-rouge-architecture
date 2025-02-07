import { Participant } from "./Participant";
import { StatusType } from "./StatusType";
  
export interface Match {
  participant1: Participant;
  participant2: Participant;
  status: StatusType;
  winner: Participant | null;
  score?: string;
}

export interface Round {
  matches: Match[];
}
  