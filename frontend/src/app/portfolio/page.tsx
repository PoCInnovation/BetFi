"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  DollarSign,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  mockUserBets,
  formatETH,
  formatCurrency,
  truncateAddress,
  formatTimeRemaining,
} from "@/lib/mock-data";

export default function PortfolioPage() {
  // Calculate portfolio statistics
  const totalBets = mockUserBets.reduce((sum, bet) => sum + bet.amount, 0);
  const activeBets = mockUserBets.filter((bet) => bet.betStatus === "active");
  const completedBets = mockUserBets.filter(
    (bet) => bet.betStatus !== "active"
  );
  const wonBets = mockUserBets.filter((bet) => bet.betStatus === "won");
  const lostBets = mockUserBets.filter((bet) => bet.betStatus === "lost");

  const totalPayout = mockUserBets.reduce(
    (sum, bet) => sum + (bet.payout || 0),
    0
  );
  const totalReturn = totalPayout - totalBets;
  const returnPercentage = totalBets > 0 ? (totalReturn / totalBets) * 100 : 0;

  // Data for pie chart
  const pieData = [
    { name: "Won", value: wonBets.length, color: "#10b981" },
    { name: "Lost", value: lostBets.length, color: "#ef4444" },
    { name: "Active", value: activeBets.length, color: "#6366f1" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "text-green-600";
      case "lost":
        return "text-red-600";
      case "active":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "won":
        return "Won";
      case "lost":
        return "Lost";
      case "active":
        return "Active";
      default:
        return status;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "high":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-muted/20 text-muted-foreground";
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
            Track your bets and analyze your performance
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
                      <div className="text-2xl font-bold">
                        {formatETH(totalBets)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Bet
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">
                        {formatETH(totalPayout)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Received
                      </div>
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
                      <div
                        className={`text-2xl font-bold ${
                          totalReturn >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {totalReturn >= 0 ? "+" : ""}
                        {formatETH(totalReturn)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Profit/Loss
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <div
                        className={`text-2xl font-bold ${
                          returnPercentage >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {returnPercentage >= 0 ? "+" : ""}
                        {returnPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Return
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>My Betting History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserBets.map((bet) => (
                    <div
                      key={bet.betId}
                      className="p-6 border border-border/50 rounded-xl hover:bg-accent/50 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        {/* Strategy Info */}
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center border border-primary/20">
                            <span className="text-primary font-bold text-sm">
                              {bet.trader.slice(2, 4).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-base font-semibold text-foreground">
                                {truncateAddress(bet.trader)}
                              </p>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                                  bet.risk
                                )}`}
                              >
                                {bet.risk.charAt(0).toUpperCase() +
                                  bet.risk.slice(1)}{" "}
                                Risk
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                              <span>
                                Target:{" "}
                                <span className="text-primary font-medium">
                                  +{bet.objective}%
                                </span>
                              </span>
                              <span>•</span>
                              <span>
                                Current:{" "}
                                <span
                                  className={`font-medium ${
                                    bet.currentReturn >= 0
                                      ? "text-green-500"
                                      : "text-red-600"
                                  }`}
                                >
                                  {bet.currentReturn > 0 ? "+" : ""}
                                  {bet.currentReturn.toFixed(1)}%
                                </span>
                              </span>
                              <span>•</span>
                              <span>
                                {formatTimeRemaining(bet.deadline)} left
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Betting Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* My Position */}
                        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-4 border border-border/30">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              My Position
                            </h4>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                bet.position === "yes"
                                  ? "bg-green-500/20 text-green-600 border border-green-500/30"
                                  : "bg-red-500/20 text-red-600 border border-red-500/30"
                              }`}
                            >
                              {bet.position.toUpperCase()}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Bet Amount
                              </span>
                              <span className="font-semibold">
                                {formatETH(bet.amount)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Date
                              </span>
                              <span className="font-semibold">
                                {new Date(bet.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Voting Status */}
                        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-4 border border-border/30">
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            Community Votes
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>YES</span>
                              </div>
                              <span className="font-bold text-green-500">
                                {bet.votesYes}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span>NO</span>
                              </div>
                              <span className="font-bold text-red-500">
                                {bet.votesNo}%
                              </span>
                            </div>
                            <div className="relative mt-2">
                              <Progress value={bet.votesYes} className="h-2" />
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-red-500/20 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Results */}
                        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-4 border border-border/30">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Status & Payout
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                bet.betStatus === "won"
                                  ? "bg-green-500/20 text-green-600 border border-green-500/30"
                                  : bet.betStatus === "lost"
                                  ? "bg-red-500/20 text-red-600 border border-red-500/30"
                                  : "bg-blue-500/20 text-blue-600 border border-blue-500/30"
                              }`}
                            >
                              {getStatusText(bet.betStatus)}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Payout
                              </span>
                              {bet.payout !== undefined ? (
                                <span
                                  className={`font-semibold ${
                                    bet.payout > bet.amount
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {bet.payout > 0
                                    ? formatETH(bet.payout)
                                    : "0 ETH"}
                                </span>
                              ) : (
                                <span className="font-semibold text-muted-foreground">
                                  Pending
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">P&L</span>
                              {bet.payout !== undefined ? (
                                <span
                                  className={`font-bold ${
                                    bet.payout > bet.amount
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {bet.payout > bet.amount ? "+" : ""}
                                  {formatETH(bet.payout - bet.amount)}
                                </span>
                              ) : (
                                <span className="font-semibold text-muted-foreground">
                                  -
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
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
                <CardTitle>Bet Distribution</CardTitle>
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
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
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
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Bets
                  </span>
                  <span className="font-semibold">{activeBets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Completed Bets
                  </span>
                  <span className="font-semibold">{completedBets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Success Rate
                  </span>
                  <span className="font-semibold">
                    {completedBets.length > 0
                      ? Math.round(
                          (wonBets.length / completedBets.length) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Average Gain
                  </span>
                  <span className="font-semibold">
                    {wonBets.length > 0
                      ? formatETH(
                          wonBets.reduce(
                            (sum, bet) => sum + (bet.payout || 0),
                            0
                          ) / wonBets.length
                        )
                      : "0.000 ETH"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View winning strategies
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Get AI advice
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Strategies ending soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
