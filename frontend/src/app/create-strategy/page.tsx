"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Target, Clock, DollarSign, AlertTriangle, TrendingUp, Trash2, X } from "lucide-react";
import { useProposeStrategy } from "@/lib/propose-strategy";
import { useToast } from "@/hooks/use-toast";

interface TokenAllocation {
  id: string;
  address: string;
  amount: number;
}

interface VaultConfig {
  id: string;
  address: string;
  tokens: TokenAllocation[];
}

export default function CreateStrategyPage() {
  const { executeFunction, isPending, isConfirming, isConfirmed } = useProposeStrategy();
  const { toast } = useToast();
  
  const [vaults, setVaults] = useState<VaultConfig[]>([
    { id: '1', address: '', tokens: [{ id: '1', address: '', amount: 0 }] }
  ]);
  const [objectivePercent, setObjectivePercent] = useState<number>(15);
  const [durationDays, setDurationDays] = useState<number>(2);
  const [commission, setCommission] = useState<number>(10);
  const [description, setDescription] = useState("");

  // Add new vault
  const addVault = () => {
    const newVault: VaultConfig = {
      id: Date.now().toString(),
      address: '',
      tokens: [{ id: '1', address: '', amount: 0 }]
    };
    setVaults([...vaults, newVault]);
  };

  // Remove vault
  const removeVault = (vaultId: string) => {
    setVaults(vaults.filter(v => v.id !== vaultId));
  };

  // Update vault address
  const updateVaultAddress = (vaultId: string, address: string) => {
    setVaults(vaults.map(v => 
      v.id === vaultId ? { ...v, address } : v
    ));
  };

  // Add token to vault
  const addTokenToVault = (vaultId: string) => {
    setVaults(vaults.map(v => 
      v.id === vaultId 
        ? { 
            ...v, 
            tokens: [...v.tokens, { id: Date.now().toString(), address: '', amount: 0 }]
          }
        : v
    ));
  };

  // Remove token from vault
  const removeTokenFromVault = (vaultId: string, tokenId: string) => {
    setVaults(vaults.map(v => 
      v.id === vaultId 
        ? { ...v, tokens: v.tokens.filter(t => t.id !== tokenId) }
        : v
    ));
  };

  // Update token in vault
  const updateToken = (vaultId: string, tokenId: string, field: 'address' | 'amount', value: string | number) => {
    setVaults(vaults.map(v => 
      v.id === vaultId 
        ? {
            ...v,
            tokens: v.tokens.map(t => 
              t.id === tokenId ? { ...t, [field]: value } : t
            )
          }
        : v
    ));
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
        toast.error("Invalid configuration", "All vault addresses must be provided");
        return;
      }
      
      if (vault.tokens.length === 0) {
        toast.error("Invalid configuration", "Each vault must have at least one token");
        return;
      }

      for (const token of vault.tokens) {
        if (!token.address.trim() || token.amount <= 0) {
          toast.error("Invalid configuration", "All token addresses and amounts must be provided");
          return;
        }
      }
    }

    if (objectivePercent <= 0 || objectivePercent > 1000) {
      toast.error("Invalid objective", "Objective must be between 0.1% and 1000%");
      return;
    }

    if (durationDays <= 0) {
      toast.error("Invalid duration", "Duration must be greater than 0 days");
      return;
    }

    if (commission < 0 || commission > 50) {
      toast.error("Invalid commission", "Commission must be between 0% and 50%");
      return;
    }

    try {
      // Prepare data for the contract
      const vaultAddresses = vaults.map(v => v.address);
      const allAmounts: number[] = [];
      const allTokens: string[] = [];

      vaults.forEach(vault => {
        vault.tokens.forEach(token => {
          allAmounts.push(token.amount);
          allTokens.push(token.address);
        });
      });

      // Convert duration to timestamp (current time + days)
      const durationTimestamp = Math.floor(Date.now() / 1000) + (durationDays * 24 * 60 * 60);

      await executeFunction(
        vaultAddresses,
        allAmounts,
        allTokens,
        objectivePercent,
        durationTimestamp,
        commission
      );

    } catch (error) {
      console.error('Strategy creation failed:', error);
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
            Configure your vault allocations, tokens, and strategy parameters. Let others bet on your success.
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
                <form onSubmit={handleSubmit} className="space-y-8">
                  
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
                            <CardTitle className="text-base">Vault {vaultIndex + 1}</CardTitle>
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
                            <label className="text-sm font-medium">Vault Address</label>
                            <Input
                              value={vault.address}
                              onChange={(e) => updateVaultAddress(vault.id, e.target.value)}
                              placeholder="0x..."
                              className="font-mono"
                              required
                            />
                          </div>

                          {/* Tokens */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Token Allocations</label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addTokenToVault(vault.id)}
                                className="flex items-center space-x-1"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Add Token</span>
                              </Button>
                            </div>

                            {vault.tokens.map((token, tokenIndex) => (
                              <div key={token.id} className="flex items-center space-x-2 p-3 border rounded-md">
                                <div className="flex-1">
                                  <Input
                                    value={token.address}
                                    onChange={(e) => updateToken(vault.id, token.id, 'address', e.target.value)}
                                    placeholder="Token address (0x...)"
                                    className="font-mono text-sm"
                                    required
                                  />
                                </div>
                                <div className="w-32">
                                  <Input
                                    type="number"
                                    value={token.amount}
                                    onChange={(e) => updateToken(vault.id, token.id, 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Amount"
                                    min="0"
                                    step="0.000001"
                                    className="text-sm"
                                    required
                                  />
                                </div>
                                {vault.tokens.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTokenFromVault(vault.id, token.id)}
                                    className="text-red-500 hover:text-red-600 p-1"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
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
                          onChange={(e) => setObjectivePercent(parseFloat(e.target.value) || 0)}
                          placeholder="15"
                          min="0.1"
                          max="1000"
                          step="0.1"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Target return percentage</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Duration (days)</span>
                        </label>
                        <Input
                          type="number"
                          value={durationDays}
                          onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                          placeholder="2"
                          min="1"
                          max="365"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Strategy duration in days</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Commission (%)</span>
                        </label>
                        <Input
                          type="number"
                          value={commission}
                          onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                          placeholder="10"
                          min="0"
                          max="50"
                          step="0.1"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Your commission on profits</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
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
                    disabled={isPending || isConfirming}
                    className="w-full bg-primary/80 hover:bg-primary font-bold py-3"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {isPending || isConfirming ? 'Creating Strategy...' : 'Create Strategy'}
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
                  <span className="font-medium">{vaults.reduce((acc, v) => acc + v.tokens.length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objective</span>
                  <span className="font-medium text-green-600">+{objectivePercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{durationDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Commission</span>
                  <span className="font-medium">{commission}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium text-xs">
                    {new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How it Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">1</div>
                  <div>
                    <div className="font-medium">Configure Strategy</div>
                    <div className="text-muted-foreground">Set vaults, tokens, and parameters</div>
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
                    <div className="font-medium">Execute & Earn</div>
                    <div className="text-muted-foreground">Execute your strategy and earn commission</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isConfirmed && (
              <Card className="border-green-500/50 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">Strategy Created Successfully!</span>
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