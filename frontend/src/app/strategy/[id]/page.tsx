"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, TrendingUp, Users, Target, Award, DollarSign, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  getStrategyById, 
  getTraderById, 
  formatTimeRemaining, 
  formatCurrency, 
  formatETH,
  mockChartData 
} from "@/lib/mock-data";

export default function StrategyPage() {
  const params = useParams();
  const strategyId = params.id as string;
  const strategy = getStrategyById(strategyId);
  const trader = strategy ? getTraderById(strategy.trader) : null;
  
  const [betAmount, setBetAmount] = useState("");
  const [betPosition, setBetPosition] = useState<"yes" | "no">("yes");

  if (!strategy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Stratégie introuvable</h2>
            <p className="text-muted-foreground">Cette stratégie n'existe pas ou a été supprimée.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const yesPercentage = (strategy.votesYes / (strategy.votesYes + strategy.votesNo)) * 100;
  const returnColor = strategy.currentReturn >= 0 ? "text-green-600" : "text-red-600";
  const riskColor = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  }[strategy.risk];

  const handleBet = () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert("Veuillez entrer un montant valide");
      return;
    }
    alert(`Pari de ${betAmount} ETH sur ${betPosition.toUpperCase()} placé avec succès !`);
    setBetAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">{strategy.trader}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskColor}`}>
                {strategy.risk === 'low' ? 'Faible risque' : strategy.risk === 'medium' ? 'Risque moyen' : 'Risque élevé'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-medium">{formatTimeRemaining(strategy.deadline)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-xl font-semibold">{strategy.objective}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className={`h-5 w-5 ${returnColor}`} />
              <span className={`text-xl font-bold ${returnColor}`}>
                {strategy.currentReturn > 0 ? '+' : ''}{strategy.currentReturn.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du Rendement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description de la Stratégie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {strategy.description}
                </p>
              </CardContent>
            </Card>

            {trader && (
              <Card>
                <CardHeader>
                  <CardTitle>Historique du Trader</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{trader.reputation}</div>
                      <div className="text-sm text-muted-foreground">Réputation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{trader.totalStrategies}</div>
                      <div className="text-sm text-muted-foreground">Stratégies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{trader.successRate}%</div>
                      <div className="text-sm text-muted-foreground">Taux de réussite</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{formatCurrency(trader.totalVolume)}</div>
                      <div className="text-sm text-muted-foreground">Volume total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total des mises</span>
                  <span className="font-semibold">{formatCurrency(strategy.totalBets)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Réputation trader</span>
                  <span className="font-semibold">{strategy.traderReputation}/100</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Votes OUI/NON</span>
                    <span className="font-medium">{strategy.votesYes}% / {strategy.votesNo}%</span>
                  </div>
                  <Progress value={yesPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Placer un Pari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Montant (ETH)</label>
                  <Input
                    type="number"
                    placeholder="0.1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    step="0.01"
                    min="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={betPosition === "yes" ? "default" : "outline"}
                      onClick={() => setBetPosition("yes")}
                      className="w-full"
                    >
                      OUI
                    </Button>
                    <Button
                      variant={betPosition === "no" ? "default" : "outline"}
                      onClick={() => setBetPosition("no")}
                      className="w-full"
                    >
                      NON
                    </Button>
                  </div>
                </div>

                {betAmount && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Récapitulatif</div>
                    <div className="flex justify-between">
                      <span>Mise:</span>
                      <span className="font-semibold">{formatETH(parseFloat(betAmount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Position:</span>
                      <span className="font-semibold">{betPosition.toUpperCase()}</span>
                    </div>
                  </div>
                )}

                <Button onClick={handleBet} className="w-full" size="lg">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Confirmer le Pari
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}