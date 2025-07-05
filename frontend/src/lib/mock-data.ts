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

export interface LeaderboardTrader {
  id: string;
  name: string;
  reputation: number;
  totalStrategies: number;
  successRate: number;
  totalVolume: number;
  avgReturn: number;
  winStreak: number;
  rank: number;
  change: number; // +/- places depuis la semaine dernière
}

export interface LeaderboardBetter {
  id: string;
  name: string;
  totalBets: number;
  successRate: number;
  totalProfit: number;
  avgBetSize: number;
  winStreak: number;
  rank: number;
  change: number;
  level: string;
}

export const mockStrategies: Strategy[] = [
  {
    id: '1',
    trader: '0x742d35Cc6634C0532925a3b8D88B20d06c6A1234',
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
    trader: '0x8ba1f109551bD432803012645Hac189B14d5678',
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
    trader: '0x3C44CdDdB6a900fa2b585dd299e03d12FA429abc',
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
    trader: '0x90F79bf6EB2c4f870365E785982E1f101E93def0',
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
    trader: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
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
    name: '0x742d35Cc6634C0532925a3b8D88B20d06c6A1234',
    reputation: 87,
    totalStrategies: 45,
    successRate: 68,
    totalVolume: 2500000,
    strategies: mockStrategies.filter(s => s.trader === '0x742d35Cc6634C0532925a3b8D88B20d06c6A1234')
  },
  {
    id: '2',
    name: '0x8ba1f109551bD432803012645Hac189B14d5678',
    reputation: 92,
    totalStrategies: 38,
    successRate: 75,
    totalVolume: 1800000,
    strategies: mockStrategies.filter(s => s.trader === '0x8ba1f109551bD432803012645Hac189B14d5678')
  },
  {
    id: '3',
    name: '0x3C44CdDdB6a900fa2b585dd299e03d12FA429abc',
    reputation: 95,
    totalStrategies: 52,
    successRate: 82,
    totalVolume: 1200000,
    strategies: mockStrategies.filter(s => s.trader === '0x3C44CdDdB6a900fa2b585dd299e03d12FA429abc')
  }
];

export const mockUserBets: UserBet[] = [
  {
    id: '1',
    strategyId: '1',
    strategyName: '0x742d35Cc6634C0532925a3b8D88B20d06c6A1234 - +15% in 48h',
    amount: 0.5,
    position: 'yes',
    timestamp: '2025-01-04T14:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    strategyId: '2',
    strategyName: '0x8ba1f109551bD432803012645Hac189B14d5678 - +8% in 24h',
    amount: 0.3,
    position: 'no',
    timestamp: '2025-01-04T10:15:00Z',
    status: 'won',
    payout: 0.42
  },
  {
    id: '3',
    strategyId: '3',
    strategyName: '0x3C44CdDdB6a900fa2b585dd299e03d12FA429abc - +5% in 12h',
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

export const truncateAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const mockLeaderboardTraders: LeaderboardTrader[] = [
  {
    id: '1',
    name: '0x3C44CdDdB6a900fa2b585dd299e03d12FA429abc',
    reputation: 95,
    totalStrategies: 52,
    successRate: 82,
    totalVolume: 1200000,
    avgReturn: 12.8,
    winStreak: 8,
    rank: 1,
    change: 0
  },
  {
    id: '2',
    name: '0x8ba1f109551bD432803012645Hac189B14d5678',
    reputation: 92,
    totalStrategies: 38,
    successRate: 75,
    totalVolume: 1800000,
    avgReturn: 15.2,
    winStreak: 5,
    rank: 2,
    change: 1
  },
  {
    id: '3',
    name: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    reputation: 89,
    totalStrategies: 43,
    successRate: 71,
    totalVolume: 985000,
    avgReturn: 18.5,
    winStreak: 3,
    rank: 3,
    change: 2
  },
  {
    id: '4',
    name: '0x742d35Cc6634C0532925a3b8D88B20d06c6A1234',
    reputation: 87,
    totalStrategies: 45,
    successRate: 68,
    totalVolume: 2500000,
    avgReturn: 22.1,
    winStreak: 2,
    rank: 4,
    change: -1
  },
  {
    id: '5',
    name: '0x90F79bf6EB2c4f870365E785982E1f101E93def0',
    reputation: 78,
    totalStrategies: 29,
    successRate: 62,
    totalVolume: 1560000,
    avgReturn: 28.3,
    winStreak: 1,
    rank: 5,
    change: -3
  },
  {
    id: '6',
    name: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    reputation: 84,
    totalStrategies: 35,
    successRate: 69,
    totalVolume: 750000,
    avgReturn: 16.7,
    winStreak: 4,
    rank: 6,
    change: 1
  },
  {
    id: '7',
    name: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    reputation: 91,
    totalStrategies: 41,
    successRate: 73,
    totalVolume: 680000,
    avgReturn: 11.2,
    winStreak: 6,
    rank: 7,
    change: 0
  },
  {
    id: '8',
    name: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    reputation: 79,
    totalStrategies: 67,
    successRate: 64,
    totalVolume: 1100000,
    avgReturn: 19.8,
    winStreak: 1,
    rank: 8,
    change: -2
  }
];

export const mockLeaderboardBetters: LeaderboardBetter[] = [
  {
    id: '1',
    name: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
    totalBets: 234,
    successRate: 78,
    totalProfit: 45.8,
    avgBetSize: 2.3,
    winStreak: 12,
    rank: 1,
    change: 2,
    level: 'Diamond'
  },
  {
    id: '2',
    name: '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
    totalBets: 186,
    successRate: 82,
    totalProfit: 38.2,
    avgBetSize: 1.1,
    winStreak: 8,
    rank: 2,
    change: 0,
    level: 'Platinum'
  },
  {
    id: '3',
    name: '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
    totalBets: 298,
    successRate: 65,
    totalProfit: 32.7,
    avgBetSize: 0.8,
    winStreak: 3,
    rank: 3,
    change: -1,
    level: 'Gold'
  },
  {
    id: '4',
    name: '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
    totalBets: 145,
    successRate: 86,
    totalProfit: 29.1,
    avgBetSize: 0.6,
    winStreak: 15,
    rank: 4,
    change: 1,
    level: 'Platinum'
  },
  {
    id: '5',
    name: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
    totalBets: 412,
    successRate: 58,
    totalProfit: 24.3,
    avgBetSize: 0.4,
    winStreak: 2,
    rank: 5,
    change: -2,
    level: 'Silver'
  },
  {
    id: '6',
    name: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
    totalBets: 167,
    successRate: 72,
    totalProfit: 21.8,
    avgBetSize: 1.5,
    winStreak: 5,
    rank: 6,
    change: 3,
    level: 'Gold'
  },
  {
    id: '7',
    name: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    totalBets: 89,
    successRate: 89,
    totalProfit: 19.4,
    avgBetSize: 0.9,
    winStreak: 7,
    rank: 7,
    change: 0,
    level: 'Gold'
  },
  {
    id: '8',
    name: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    totalBets: 203,
    successRate: 69,
    totalProfit: 17.2,
    avgBetSize: 0.7,
    winStreak: 4,
    rank: 8,
    change: -1,
    level: 'Silver'
  }
];
