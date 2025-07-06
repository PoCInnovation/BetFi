export class CreateBetDto {
  strategyId: string;
  user: string;
  side: 'yes' | 'no';
  amount: number;
  transactionHash: string;
}