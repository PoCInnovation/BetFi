export interface Strategy {
  id: string;
  trader: string;
  objective: number;
  deadline: number;
  currentReturn: number;
  totalBets: number;
  votesYes: number;
  votesNo: number;
  status: 'active' | 'completed' | 'failed';
//   description: string;
//   traderReputation: number;
//   risk: 'low' | 'medium' | 'high';
}