export interface Strategy {
  id: string;
  trader: string;
  objective: string;
  deadline: string;
  currentReturn: number;
  totalBets: number;
  votesYes: number;
  votesNo: number;
  status: 'active' | 'completed' | 'failed';
  description: string;
  traderReputation: number;
  risk: 'low' | 'medium' | 'high';
}

export interface Trader {
  id: string;
  name: string;
  reputation: number;
  totalStrategies: number;
  successRate: number;
  totalVolume: number;
  strategies: Strategy[];
}

export interface UserBet {
  id: string;
  strategyId: string;
  strategyName: string;
  amount: number;
  position: 'yes' | 'no';
  timestamp: string;
  status: 'active' | 'won' | 'lost';
  payout?: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  recommendations?: Strategy[];
}

export const mockStrategies: Strategy[] = [
  {
    id: '1',
    trader: 'CryptoWizard',
    objective: '+15% in 48h',
    deadline: '2025-01-07T12:00:00Z',
    currentReturn: 8.5,
    totalBets: 125000,
    votesYes: 65,
    votesNo: 35,
    status: 'active',
    description: 'Technical analysis strategy focused on emerging DeFi altcoins with high alpha potential',
    traderReputation: 87,
    risk: 'high'
  },
  {
    id: '2',
    trader: 'DefiMaster',
    objective: '+8% in 24h',
    deadline: '2025-01-06T09:00:00Z',
    currentReturn: 3.2,
    totalBets: 89000,
    votesYes: 72,
    votesNo: 28,
    status: 'active',
    description: 'Cross-protocol DeFi arbitrage with controlled risk exposure and yield optimization',
    traderReputation: 92,
    risk: 'medium'
  },
  {
    id: '3',
    trader: 'SafeTrader',
    objective: '+5% in 12h',
    deadline: '2025-01-05T21:00:00Z',
    currentReturn: 4.8,
    totalBets: 67000,
    votesYes: 85,
    votesNo: 15,
    status: 'active',
    description: 'Conservative strategy using stable assets and low-risk blue-chip tokens',
    traderReputation: 95,
    risk: 'low'
  },
  {
    id: '4',
    trader: 'BullMarket',
    objective: '+20% in 72h',
    deadline: '2025-01-08T15:00:00Z',
    currentReturn: -2.1,
    totalBets: 156000,
    votesYes: 45,
    votesNo: 55,
    status: 'active',
    description: 'Aggressive meme coin strategy targeting high volatility for maximum returns',
    traderReputation: 78,
    risk: 'high'
  },
  {
    id: '5',
    trader: 'TechAnalyst',
    objective: '+12% in 36h',
    deadline: '2025-01-07T03:00:00Z',
    currentReturn: 9.8,
    totalBets: 98000,
    votesYes: 78,
    votesNo: 22,
    status: 'active',
    description: 'Advanced technical analysis with precision buy/sell signals and trend pattern recognition',
    traderReputation: 89,
    risk: 'medium'
  }
];

export const mockTraders: Trader[] = [
  {
    id: '1',
    name: 'CryptoWizard',
    reputation: 87,
    totalStrategies: 45,
    successRate: 68,
    totalVolume: 2500000,
    strategies: mockStrategies.filter(s => s.trader === 'CryptoWizard')
  },
  {
    id: '2',
    name: 'DefiMaster',
    reputation: 92,
    totalStrategies: 38,
    successRate: 75,
    totalVolume: 1800000,
    strategies: mockStrategies.filter(s => s.trader === 'DefiMaster')
  },
  {
    id: '3',
    name: 'SafeTrader',
    reputation: 95,
    totalStrategies: 52,
    successRate: 82,
    totalVolume: 1200000,
    strategies: mockStrategies.filter(s => s.trader === 'SafeTrader')
  }
];

export const mockUserBets: UserBet[] = [
  {
    id: '1',
    strategyId: '1',
    strategyName: 'CryptoWizard - +15% in 48h',
    amount: 0.5,
    position: 'yes',
    timestamp: '2025-01-04T14:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    strategyId: '2',
    strategyName: 'DefiMaster - +8% in 24h',
    amount: 0.3,
    position: 'no',
    timestamp: '2025-01-04T10:15:00Z',
    status: 'won',
    payout: 0.42
  },
  {
    id: '3',
    strategyId: '3',
    strategyName: 'SafeTrader - +5% in 12h',
    amount: 0.8,
    position: 'yes',
    timestamp: '2025-01-03T16:45:00Z',
    status: 'lost',
    payout: 0
  }
];

export const mockChartData = [
  { time: '00:00', value: 100 },
  { time: '02:00', value: 102.5 },
  { time: '04:00', value: 101.8 },
  { time: '06:00', value: 104.2 },
  { time: '08:00', value: 106.7 },
  { time: '10:00', value: 108.5 },
  { time: '12:00', value: 105.3 },
  { time: '14:00', value: 107.9 },
  { time: '16:00', value: 109.1 },
  { time: '18:00', value: 108.5 },
  { time: '20:00', value: 111.2 },
  { time: '22:00', value: 108.5 }
];

export const getStrategyById = (id: string): Strategy | undefined => {
  return mockStrategies.find(strategy => strategy.id === id);
};

export const getTraderById = (id: string): Trader | undefined => {
  return mockTraders.find(trader => trader.id === id);
};

export const formatTimeRemaining = (deadline: string): string => {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatETH = (amount: number): string => {
  return `${amount.toFixed(3)} ETH`;
};