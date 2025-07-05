"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Target,
  Clock,
  DollarSign,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { useProposeStrategy } from "@/lib/propose-strategy";
import { useToast } from "@/hooks/use-toast";

interface VaultConfig {
  id: string;
  address: string;
  tokenAddress: string;
  amount: number;
}

export default function CreateStrategyPage() {
  const { executeFunction, isPending, isConfirming, isConfirmed } =
    useProposeStrategy();
  const { toast } = useToast();

  const [vaults, setVaults] = useState<VaultConfig[]>([
    { id: "1", address: "", tokenAddress: "", amount: 0 },
  ]);
  const [objectivePercent, setObjectivePercent] = useState<number>(15);
  const [durationDays, setDurationDays] = useState<number>(2);
  const [commission, setCommission] = useState<number>(10);
  const [description, setDescription] = useState("");

  // Add new vault
  const addVault = () => {
    const newVault: VaultConfig = {
      id: Date.now().toString(),
      address: "",
      tokenAddress: "",
      amount: 0,
    };
    setVaults([...vaults, newVault]);
  };

  // Remove vault
  const removeVault = (vaultId: string) => {
    setVaults(vaults.filter((v) => v.id !== vaultId));
  };

  // Update vault field
  const updateVault = (
    vaultId: string,
    field: keyof VaultConfig,
    value: string | number
  ) => {
    setVaults(
      vaults.map((v) => (v.id === vaultId ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (vaults.length === 0) {
      toast.error("Invalid configuration", "At least one vault is required");
      return;
    }

    for (const vault of vaults) {
      if (!vault.address.trim()) {
        toast.error(
          "Invalid configuration",
          "All vault addresses must be provided"
        );
        return;
      }

      if (!vault.tokenAddress.trim()) {
        toast.error(
          "Invalid configuration",
          "All token addresses must be provided"
        );
        return;
      }

      if (vault.amount <= 0) {
        toast.error(
          "Invalid configuration",
          "All token amounts must be greater than 0"
        );
        return;
      }
    }

    if (objectivePercent <= 0 || objectivePercent > 1000) {
      toast.error(
        "Invalid objective",
        "Objective must be between 0.1% and 1000%"
      );
      return;
    }

    if (durationDays <= 0) {
      toast.error("Invalid duration", "Duration must be greater than 0 days");
      return;
    }

    if (commission < 0 || commission > 50) {
      toast.error(
        "Invalid commission",
        "Commission must be between 0% and 50%"
      );
      return;
    }

    try {
      // Prepare data for the contract
      const vaultAddresses = vaults.map((v) => v.address);
      const amounts = vaults.map((v) => v.amount);
      const tokens = vaults.map((v) => v.tokenAddress);

      // Convert duration to timestamp (current time + 5 minutes voting + execution days)
      const votingPeriod = 5 * 60; // 5 minutes in seconds
      const executionPeriod = durationDays * 24 * 60 * 60; // execution days in seconds
      const durationTimestamp =
        Math.floor(Date.now() / 1000) + votingPeriod + executionPeriod;

      await executeFunction(
        vaultAddresses,
        amounts,
        tokens,
        objectivePercent,
        durationTimestamp,
        commission
      );
    } catch (error) {
      console.error("Strategy creation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Create New Strategy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure your vault allocations and strategy parameters. Each vault
            trades one specific token.{" "}
            <span className="text-primary">
              Users have 5 minutes to vote on your strategy.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Strategy Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Vaults Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Vault Allocations</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVault}
                        className="flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Vault</span>
                      </Button>
                    </div>

                    {vaults.map((vault, vaultIndex) => (
                      <Card key={vault.id} className="border-2 border-muted">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              Vault {vaultIndex + 1}
                            </CardTitle>
                            {vaults.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVault(vault.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Vault Address */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Vault Address
                            </label>
                            <Input
                              value={vault.address}
                              onChange={(e) =>
                                updateVault(vault.id, "address", e.target.value)
                              }
                              placeholder="0x..."
                              className="font-mono"
                              required
                            />
                          </div>

                          {/* Token Configuration */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Token Address
                              </label>
                              <Input
                                value={vault.tokenAddress}
                                onChange={(e) =>
                                  updateVault(
                                    vault.id,
                                    "tokenAddress",
                                    e.target.value
                                  )
                                }
                                placeholder="0x..."
                                className="font-mono"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Amount
                              </label>
                              <Input
                                type="number"
                                value={vault.amount}
                                onChange={(e) =>
                                  updateVault(
                                    vault.id,
                                    "amount",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder="0.0"
                                min="0"
                                step="0.000001"
                                required
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Strategy Parameters */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Strategy Parameters</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>Objective (%)</span>
                        </label>
                        <Input
                          type="number"
                          value={objectivePercent}
                          onChange={(e) =>
                            setObjectivePercent(parseFloat(e.target.value) || 0)
                          }
                          placeholder="15"
                          min="0.1"
                          max="1000"
                          step="0.1"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Target return percentage
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Execution Duration (days)</span>
                        </label>
                        <Input
                          type="number"
                          value={durationDays}
                          onChange={(e) =>
                            setDurationDays(parseInt(e.target.value) || 0)
                          }
                          placeholder="2"
                          min="1"
                          max="365"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Strategy execution duration after voting ends
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Commission (%)</span>
                        </label>
                        <Input
                          type="number"
                          value={commission}
                          onChange={(e) =>
                            setCommission(parseFloat(e.target.value) || 0)
                          }
                          placeholder="10"
                          min="0"
                          max="50"
                          step="0.1"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Your commission on profits
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Strategy Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your trading strategy, methodology, and approach..."
                      className="w-full h-20 px-3 py-2 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="w-full bg-primary/80 hover:bg-primary font-bold py-3"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {isPending || isConfirming
                      ? "Creating Strategy..."
                      : "Create Strategy"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vaults</span>
                  <span className="font-medium">{vaults.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tokens</span>
                  <span className="font-medium">{vaults.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objective</span>
                  <span className="font-medium text-green-600">
                    +{objectivePercent}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Execution Duration
                  </span>
                  <span className="font-medium">{durationDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voting Period</span>
                  <span className="font-medium">5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Commission</span>
                  <span className="font-medium">{commission}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voting Ends</span>
                  <span className="font-medium text-xs">
                    {new Date(Date.now() + 5 * 60 * 1000).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strategy Ends</span>
                  <span className="font-medium text-xs">
                    {new Date(
                      Date.now() + (5 * 60 + durationDays * 24 * 60 * 60) * 1000
                    ).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vault Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {vaults.map((vault, index) => (
                  <div key={vault.id} className="p-3 border rounded-md">
                    <div className="font-medium mb-2">Vault {index + 1}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vault:</span>
                        <span className="font-mono">
                          {vault.address || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Token:</span>
                        <span className="font-mono">
                          {vault.tokenAddress || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">{vault.amount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How it Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="font-medium">Configure Strategy</div>
                    <div className="text-muted-foreground">
                      Set vault addresses and token allocations
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="font-medium">5-Minute Voting</div>
                    <div className="text-muted-foreground">
                      Users vote YES or NO in 5 minutes
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Execute & Earn</div>
                    <div className="text-muted-foreground">
                      If approved, execute strategy for set duration
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isConfirmed && (
              <Card className="border-green-500/50 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">
                      Strategy Created Successfully!
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
