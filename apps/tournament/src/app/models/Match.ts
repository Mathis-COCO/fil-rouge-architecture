import { Participant } from "./Participant";


export interface Round {
    name: string;
    matches: Match[];
  }
  
  export interface Match {
    participant1: Participant;
    participant2: Participant;
  }
  