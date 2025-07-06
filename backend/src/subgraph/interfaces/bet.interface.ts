export interface Bet {
  id: string;
  strategyId: string;
  user: string;
  side: 'yes' | 'no';
  amount: number;
  transactionHash: string;
  createdAt: string;
  status: 'active' | 'claimed' | 'lost';
}