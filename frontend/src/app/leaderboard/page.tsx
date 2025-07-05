"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Crown, 
  Target, 
  Zap,
  DollarSign,
  Medal,
  Award,
  Users,
  ChevronUp,
  ChevronDown,
  Minus
} from "lucide-react";
import { 
  mockLeaderboardTraders, 
  mockLeaderboardBetters, 
  formatCurrency, 
  formatETH,
  LeaderboardTrader,
  LeaderboardBetter
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'traders' | 'betters'>('traders');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      'Diamond': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Platinum': 'bg-gray-300/20 text-gray-300 border-gray-300/30',
      'Gold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Silver': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[level as keyof typeof colors] || colors['Silver'];
  };

  const TraderCard = ({ trader }: { trader: LeaderboardTrader }) => (
    <Card className="crypto-card transition-all duration-300 hover:scale-[1.02] border-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getRankIcon(trader.rank)}
            <div>
              <h3 className="text-lg font-bold text-foreground">{trader.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Rep: {trader.reputation}/100
                </Badge>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(trader.change)}
                  <span className="text-xs text-muted-foreground">
                    {trader.change !== 0 && Math.abs(trader.change)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-500">
              {trader.avgReturn.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Return</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-medium">{trader.successRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Strategies</span>
              <span className="font-medium">{trader.totalStrategies}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Volume</span>
              <span className="font-medium">{formatCurrency(trader.totalVolume)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Win Streak</span>
              <span className="font-medium text-primary">{trader.winStreak}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BetterCard = ({ better }: { better: LeaderboardBetter }) => (
    <Card className="crypto-card transition-all duration-300 hover:scale-[1.02] border-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getRankIcon(better.rank)}
            <div>
              <h3 className="text-lg font-bold text-foreground">{better.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getLevelBadge(better.level))}
                >
                  {better.level}
                </Badge>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(better.change)}
                  <span className="text-xs text-muted-foreground">
                    {better.change !== 0 && Math.abs(better.change)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-500">
              +{formatETH(better.totalProfit)}
            </div>
            <div className="text-xs text-muted-foreground">Total Profit</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-medium">{better.successRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Bets</span>
              <span className="font-medium">{better.totalBets}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Bet</span>
              <span className="font-medium">{formatETH(better.avgBetSize)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Win Streak</span>
              <span className="font-medium text-primary">{better.winStreak}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            🏆 Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the top performers in the BetFi ecosystem. 
            <span className="text-primary font-semibold"> Elite traders and smart bettors. </span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 p-1 bg-muted rounded-lg">
            <Button
              variant={activeTab === 'traders' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('traders')}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-md transition-all",
                activeTab === 'traders' 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Target className="h-4 w-4" />
              <span>Top Traders</span>
            </Button>
            <Button
              variant={activeTab === 'betters' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('betters')}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-md transition-all",
                activeTab === 'betters' 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap className="h-4 w-4" />
              <span>Top Bettors</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'traders' ? (
            <>
              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {mockLeaderboardTraders.slice(0, 3).map((trader, index) => (
                  <Card 
                    key={trader.id} 
                    className={cn(
                      "crypto-card border-2 relative overflow-hidden",
                      index === 0 && "border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]",
                      index === 1 && "border-gray-400/50 shadow-[0_0_30px_rgba(156,163,175,0.3)]",
                      index === 2 && "border-amber-600/50 shadow-[0_0_30px_rgba(217,119,6,0.3)]"
                    )}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-2">
                        {getRankIcon(trader.rank)}
                      </div>
                      <CardTitle className="text-xl">{trader.name}</CardTitle>
                      <div className="text-3xl font-bold text-green-500">
                        {trader.avgReturn.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Average Return</div>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="font-medium">{trader.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Win Streak</span>
                        <span className="font-medium text-primary">{trader.winStreak}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Volume</span>
                        <span className="font-medium">{formatCurrency(trader.totalVolume)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Rest of traders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockLeaderboardTraders.slice(3).map((trader) => (
                  <TraderCard key={trader.id} trader={trader} />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {mockLeaderboardBetters.slice(0, 3).map((better, index) => (
                  <Card 
                    key={better.id} 
                    className={cn(
                      "crypto-card border-2 relative overflow-hidden",
                      index === 0 && "border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]",
                      index === 1 && "border-gray-400/50 shadow-[0_0_30px_rgba(156,163,175,0.3)]",
                      index === 2 && "border-amber-600/50 shadow-[0_0_30px_rgba(217,119,6,0.3)]"
                    )}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-2">
                        {getRankIcon(better.rank)}
                      </div>
                      <CardTitle className="text-xl">{better.name}</CardTitle>
                      <div className="text-3xl font-bold text-green-500">
                        +{formatETH(better.totalProfit)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Profit</div>
                      <Badge 
                        variant="outline" 
                        className={cn("mx-auto", getLevelBadge(better.level))}
                      >
                        {better.level}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="font-medium">{better.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Win Streak</span>
                        <span className="font-medium text-primary">{better.winStreak}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Bets</span>
                        <span className="font-medium">{better.totalBets}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Rest of betters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockLeaderboardBetters.slice(3).map((better) => (
                  <BetterCard key={better.id} better={better} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}