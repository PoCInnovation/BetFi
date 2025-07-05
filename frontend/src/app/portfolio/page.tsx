"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, TrendingUp, TrendingDown, Clock, Target, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUserBets, formatETH, formatCurrency } from "@/lib/mock-data";

export default function PortfolioPage() {
  // Calculate portfolio statistics
  const totalBets = mockUserBets.reduce((sum, bet) => sum + bet.amount, 0);
  const activeBets = mockUserBets.filter(bet => bet.status === 'active');
  const completedBets = mockUserBets.filter(bet => bet.status !== 'active');
  const wonBets = mockUserBets.filter(bet => bet.status === 'won');
  const lostBets = mockUserBets.filter(bet => bet.status === 'lost');
  
  const totalPayout = mockUserBets.reduce((sum, bet) => sum + (bet.payout || 0), 0);
  const totalReturn = totalPayout - totalBets;
  const returnPercentage = totalBets > 0 ? (totalReturn / totalBets) * 100 : 0;
  
  // Data for pie chart
  const pieData = [
    { name: 'Gagnés', value: wonBets.length, color: '#10b981' },
    { name: 'Perdus', value: lostBets.length, color: '#ef4444' },
    { name: 'En cours', value: activeBets.length, color: '#6366f1' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'text-green-600';
      case 'lost': return 'text-red-600';
      case 'active': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'won': return 'Gagné';
      case 'lost': return 'Perdu';
      case 'active': return 'En cours';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            👜 My Portfolio 
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suivez vos paris et analysez vos performances
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{formatETH(totalBets)}</div>
                      <div className="text-sm text-muted-foreground">Total misé</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{formatETH(totalPayout)}</div>
                      <div className="text-sm text-muted-foreground">Total reçu</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    {totalReturn >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalReturn >= 0 ? '+' : ''}{formatETH(totalReturn)}
                      </div>
                      <div className="text-sm text-muted-foreground">Gain/Perte</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <div className={`text-2xl font-bold ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Rendement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historique des Paris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserBets.map((bet) => (
                    <div key={bet.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium">{bet.strategyName}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(bet.timestamp).toLocaleDateString('fr-FR')} • Position: {bet.position.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatETH(bet.amount)}</div>
                        <div className={`text-sm ${getStatusColor(bet.status)}`}>
                          {getStatusText(bet.status)}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        {bet.payout !== undefined && (
                          <div className={`font-medium ${bet.payout > bet.amount ? 'text-green-600' : 'text-red-600'}`}>
                            {bet.payout > 0 ? formatETH(bet.payout) : '-'}
                          </div>
                        )}
                        {bet.status === 'active' && (
                          <div className="text-sm text-blue-600">En cours</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Paris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                      <span className="text-sm font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paris actifs</span>
                  <span className="font-semibold">{activeBets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paris terminés</span>
                  <span className="font-semibold">{completedBets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taux de réussite</span>
                  <span className="font-semibold">
                    {completedBets.length > 0 ? Math.round((wonBets.length / completedBets.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gain moyen</span>
                  <span className="font-semibold">
                    {wonBets.length > 0 ? formatETH(wonBets.reduce((sum, bet) => sum + (bet.payout || 0), 0) / wonBets.length) : '0.000 ETH'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Voir les stratégies gagnantes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Demander conseil à l'IA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Stratégies se terminant bientôt
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
