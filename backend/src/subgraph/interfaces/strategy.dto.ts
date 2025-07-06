export class CreateStrategyDto {
  id: string; 
  trader: string;
  status: 'active' | 'completed';
  description: string; 
  risk: 'low' | 'medium' | 'high';
  createdAt?: number;
}

export class AdditionalStrategyDataDto extends CreateStrategyDto {}
