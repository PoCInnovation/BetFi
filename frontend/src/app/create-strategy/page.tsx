"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Target, Clock, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

export default function CreateStrategyPage() {
  const [strategyName, setStrategyName] = useState("");
  const [objective, setObjective] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement strategy creation logic
    console.log({
      name: strategyName,
      objective,
      duration,
      description,
      riskLevel
    });
    alert("Strategy creation submitted! (Mock implementation)");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Create New Strategy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Design your trading strategy and let others bet on your success. Share your alpha with the community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Strategy Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Strategy Name</label>
                    <Input
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                      placeholder="e.g., DeFi Arbitrage Alpha"
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>Objective</span>
                      </label>
                      <Input
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        placeholder="e.g., +15% return"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Duration</span>
                      </label>
                      <Input
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., 48 hours"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Risk Level</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as const).map((risk) => (
                        <Button
                          key={risk}
                          type="button"
                          variant={riskLevel === risk ? "default" : "outline"}
                          onClick={() => setRiskLevel(risk)}
                          className={
                            riskLevel === risk
                              ? risk === 'low' ? 'bg-green-500 hover:bg-green-600' :
                                risk === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                'bg-red-500 hover:bg-red-600'
                              : ''
                          }
                        >
                          {risk === 'low' ? 'Low Risk' : risk === 'medium' ? 'Medium Risk' : 'High Risk'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Strategy Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your trading strategy, methodology, and approach..."
                      className="w-full h-32 px-3 py-2 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary/80 hover:bg-primary font-bold py-3"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Create Strategy
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How it Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">1</div>
                  <div>
                    <div className="font-medium">Create Strategy</div>
                    <div className="text-muted-foreground">Define your trading objective and timeline</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">2</div>
                  <div>
                    <div className="font-medium">Users Bet</div>
                    <div className="text-muted-foreground">Others bet YES or NO on your success</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">3</div>
                  <div>
                    <div className="font-medium">Execute & Share</div>
                    <div className="text-muted-foreground">Execute your strategy and share profits with winners</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Potential Earnings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strategy Success</span>
                  <span className="font-medium text-green-600">Share 70% of profits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strategy Failure</span>
                  <span className="font-medium text-red-600">Share losses with NO bettors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
