export interface Tournament {
  id: string;
  name: string;
  maxParticipants: number;
  currentParticipantNb: number;
  status: string;
  phases: string;
  participants: string[];
}