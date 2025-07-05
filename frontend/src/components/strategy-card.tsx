import Link from "next/link";
import { Clock, TrendingUp, Users, Target, Award } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Strategy, formatTimeRemaining, formatCurrency } from "@/lib/mock-data";

interface StrategyCardProps {
  strategy: Strategy;
}

const StrategyCard = ({ strategy }: StrategyCardProps) => {
  const yesPercentage = (strategy.votesYes / (strategy.votesYes + strategy.votesNo)) * 100;
  const returnColor = strategy.currentReturn >= 0 ? "text-green-500" : "text-red-600";
  const riskColor = {
    low: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    high: "bg-red-500/20 text-red-400 border border-red-500/30"
  }[strategy.risk];

  const riskLabel = {
    low: "Low Risk",
    medium: "Medium Risk", 
    high: "High Risk"
  }[strategy.risk];

  return (
    <Card className="crypto-card transition-all duration-300 hover:scale-[1.02] border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg bg-white bg-clip-text text-transparent">
              {strategy.trader}
            </CardTitle>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${riskColor} glow-effect`}>
            {riskLabel}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>{strategy.objective}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatTimeRemaining(strategy.deadline)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className={`h-4 w-4 ${returnColor}`} />
            <span className={`text-sm font-medium ${returnColor}`}>
              {strategy.currentReturn > 0 ? '+' : ''}{strategy.currentReturn.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Volume</span>
            <span className="font-bold text-primary">{formatCurrency(strategy.totalBets)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Reputation</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold">{strategy.traderReputation}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full mx-0.5 ${
                      i < Math.floor(strategy.traderReputation / 20) ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">YES/NO Votes</span>
            <span className="font-bold">{strategy.votesYes}% / {strategy.votesNo}%</span>
          </div>
          <div className="relative">
            <Progress value={yesPercentage} className="h-3" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-red-500/20 pointer-events-none" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {strategy.description}
        </p>
      </CardContent>

      <CardFooter className="flex space-x-2 pt-4">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 font-bold glow-green"
        >
          BET YES
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 font-bold"
        >
          BET NO
        </Button>
        <Link href={`/strategy/${strategy.id}`}>
          <Button variant="ghost" size="sm" className="px-4 hover:bg-primary/10 hover:text-primary font-bold">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StrategyCard;
