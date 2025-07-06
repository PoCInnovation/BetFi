"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, Eye } from "lucide-react";
import {
  formatCurrency,
  formatTimeRemaining,
  truncateAddress,
} from "@/lib/mock-data";
import { usePlaceBet } from "@/lib/place-bet";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Strategy {
  id: string;
  trader: string;
  objective: number;
  deadline: number;
  currentReturn: number;
  totalBets: number;
  votesYes: number;
  votesNo: number;
  status: 'active' | 'completed';
  description: string;
  traderReputation: number;
  risk: 'low' | 'medium' | 'high';
  createdAt?: string | number;
}

interface FilterState {
  status: string;
  risk: string;
  minYesVotes: number;
  minNoVotes: number;
  sortBy: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    risk: "all",
    minYesVotes: 0,
    minNoVotes: 0,
    sortBy: "default",
  });
  const [betAmount, setBetAmount] = useState<number>(0);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [betSide, setBetSide] = useState<boolean | null>(null);
  const [hasBetCallBackend, setHasBetCallBackend] = useState(false);
  
  const { toast } = useToast();
  const { address } = useAccount();
  const { placeBet, isPending, isConfirming, isConfirmed, hash } = usePlaceBet();

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        console.log(process.env.NEXT_PUBLIC_API_URL)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subgraph/strategies`);
        if (!response.ok) {
          throw new Error('Failed to fetch strategies');
        }
        const data = await response.json();
        console.log('Received strategies:', data);
        console.log('Filters:', filters);
        setStrategies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    setSearchTerm(""); 
    fetchStrategies();
  }, []);

  // Call backend when bet is confirmed
  useEffect(() => {
    if (isConfirmed && !hasBetCallBackend && selectedStrategy && betSide !== null) {
      const saveBetToBackend = async () => {
        try {
          const betData = {
            strategyId: selectedStrategy.id,
            user: address || 'unknown',
            side: betSide ? 'yes' : 'no',
            amount: betAmount,
            transactionHash: hash
          };

          const response = await fetch('http://localhost:3000/subgraph/bet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(betData),
          });

          if (response.ok) {
            toast.success('Bet placed successfully!', 'Your bet has been recorded.');
            // Refresh strategies to get updated vote counts
            window.location.reload();
          } else {
            console.error('Failed to save bet to backend');
            toast.error('Bet placed but failed to save to backend');
          }
        } catch (backendError) {
          console.error('Backend call failed:', backendError);
          toast.error('Bet placed but backend call failed');
        }
        setHasBetCallBackend(true);
        setSelectedStrategy(null);
        setBetSide(null);
        setBetAmount(0);
      };

      saveBetToBackend();
    }
  }, [isConfirmed, hasBetCallBackend, selectedStrategy, betSide, betAmount, address, hash, toast]);

  const handleBet = async (strategy: Strategy, isYes: boolean) => {
    if (!address) {
      toast.error('Please connect your wallet to place a bet');
      return;
    }

    if (betAmount <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    setSelectedStrategy(strategy);
    setBetSide(isYes);
    setHasBetCallBackend(false);
    
    try {
      await placeBet(strategy.id, isYes, betAmount);
    } catch (error) {
      console.error('Bet placement failed:', error);
      setSelectedStrategy(null);
      setBetSide(null);
    }
  };

  const filteredAndSortedStrategies = useMemo(() => {
    let filtered = strategies;

    // Sorting
    switch (filters.sortBy) {
      case "return-desc":
        filtered.sort((a, b) => b.currentReturn - a.currentReturn);
        break;
      case "return-asc":
        filtered.sort((a, b) => a.currentReturn - b.currentReturn);
        break;
      case "volume-desc":
        filtered.sort((a, b) => b.totalBets - a.totalBets);
        break;
      case "reputation-desc":
        filtered.sort((a, b) => b.traderReputation - a.traderReputation);
        break;
      case "deadline":
        filtered.sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      status: "all",
      risk: "all",
      minYesVotes: 0,
      minNoVotes: 0,
      sortBy: "default",
    });
    setSearchTerm("");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.risk !== "all") count++;
    if (filters.minYesVotes > 0) count++;
    if (filters.minNoVotes > 0) count++;
    if (filters.sortBy !== "default") count++;
    if (searchTerm) count++;
    return count;
  }, [filters, searchTerm]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground bg-clip-text mb-6">
            Active Trading Strategies
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover strategies from elite traders and bet on their success.
            <span className="text-primary font-semibold">
              {" "}
              Invest alongside them and share the alpha.{" "}
            </span>
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar with Inline Filters */}
          <div className="flex items-center gap-3 max-w-7xl mx-auto flex-wrap lg:flex-nowrap">
            {/* Search */}
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search strategies, traders, or objectives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border/50 focus:border-primary/50 bg-card/50 backdrop-blur-sm h-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Sort */}
            <div className="w-48">
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger className="h-10 border border-border/50 focus:border-primary/50 bg-card/50 backdrop-blur-sm">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="return-desc">Highest Return</SelectItem>
                  <SelectItem value="return-asc">Lowest Return</SelectItem>
                  <SelectItem value="volume-desc">Highest Volume</SelectItem>
                  <SelectItem value="reputation-desc">
                    Best Reputation
                  </SelectItem>
                  <SelectItem value="deadline">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="w-36">
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="h-10 border border-border/50 focus:border-primary/50 bg-card/50 backdrop-blur-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Risk Filter */}
            <div className="w-32">
              <Select
                value={filters.risk}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, risk: value }))
                }
              >
                <SelectTrigger className="h-10 border border-border/50 focus:border-primary/50 bg-card/50 backdrop-blur-sm">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Button */}
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-10 px-3 flex items-center space-x-1 whitespace-nowrap"
              >
                <X className="h-3 w-3" />
                <span>Clear</span>
                <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredAndSortedStrategies.length} of{" "}
              {strategies.length} strategies
            </p>
            {activeFiltersCount > 0 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Active filters:</span>
                <div className="flex space-x-1">
                  {searchTerm && (
                    <Badge variant="secondary">Search: "{searchTerm}"</Badge>
                  )}
                  {filters.status !== "all" && (
                    <Badge variant="secondary">Status: {filters.status}</Badge>
                  )}
                  {filters.risk !== "all" && (
                    <Badge variant="secondary">Risk: {filters.risk}</Badge>
                  )}
                  {filters.minYesVotes > 0 && (
                    <Badge variant="secondary">
                      YES ≥ {filters.minYesVotes}%
                    </Badge>
                  )}
                  {filters.minNoVotes > 0 && (
                    <Badge variant="secondary">
                      NO ≥ {filters.minNoVotes}%
                    </Badge>
                  )}
                  {filters.sortBy !== "default" && (
                    <Badge variant="secondary">Sorted</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Strategy Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading strategies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 border border-border/50 rounded-lg">
            <div className="text-red-500 text-lg mb-4">Error loading strategies</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        ) : filteredAndSortedStrategies.length > 0 ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="col-span-2 text-sm font-medium text-muted-foreground">Trader / Objective</div>
              <div className="col-span-1 text-sm font-medium text-muted-foreground">Risk</div>
              <div className="col-span-1 text-sm font-medium text-muted-foreground">Return</div>
              <div className="col-span-1 text-sm font-medium text-muted-foreground">Time Left</div>
              <div className="col-span-1 text-sm font-medium text-muted-foreground">Volume</div>
              <div className="col-span-2 text-sm font-medium text-muted-foreground">Votes (YES/NO)</div>
              <div className="col-span-4 text-sm font-medium text-muted-foreground ml-5">Actions</div>
            </div>
            
            {/* Strategy Rows */}
            {filteredAndSortedStrategies.map((strategy) => (
              <div
                key={strategy.id}
                className="grid grid-cols-12 gap-2 p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                {/* Trader / Objective */}
                <div className="col-span-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {truncateAddress(strategy.trader)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      +{strategy.objective}%
                    </p>
                  </div>
                </div>
                
                {/* Risk */}
                <div className="col-span-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      {
                        low: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                        medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
                        high: "bg-red-500/20 text-red-400 border border-red-500/30",
                      }[strategy.risk]
                    }`}
                  >
                    {strategy.risk.charAt(0).toUpperCase() + strategy.risk.slice(1)}
                  </span>
                </div>
                
                {/* Return */}
                <div className="col-span-1">
                  <span
                    className={`text-sm font-medium ${
                      strategy.currentReturn >= 0 ? "text-green-500" : "text-red-600"
                    }`}
                  >
                    {strategy.currentReturn > 0 ? "+" : ""}
                    {strategy.currentReturn.toFixed(1)}%
                  </span>
                </div>
                
                {/* Time Left */}
                <div className="col-span-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTimeRemaining(strategy.deadline)}
                  </span>
                </div>
                
                {/* Volume */}
                <div className="col-span-1">
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(strategy.totalBets)}
                  </span>
                </div>
                
                {/* Votes */}
                <div className="col-span-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">
                        {strategy.votesYes}% / {strategy.votesNo}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={strategy.votesYes} className="h-2" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-red-500/20 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                
                {/* Actions */}
                <div className="col-span-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 px-5">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            disabled={isPending || isConfirming}
                            className="w-16 relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            <span className="relative z-10 flex items-center justify-center space-x-1">
                              <span className="text-sm">✓</span>
                              <span className="text-xs">YES</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Place YES Bet</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              You are betting <strong>YES</strong> on strategy by {truncateAddress(strategy.trader)}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Bet Amount</label>
                              <Input
                                type="number"
                                value={betAmount === 0 ? '' : betAmount}
                                onChange={(e) => setBetAmount(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <Button 
                              onClick={() => handleBet(strategy, true)}
                              disabled={isPending || isConfirming || betAmount <= 0}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              {isPending || isConfirming ? 'Placing Bet...' : `Bet ${betAmount} YES`}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || isConfirming}
                            className="w-16 relative overflow-hidden group border-2 border-red-500/60 text-red-400 hover:text-white hover:border-red-400 font-bold bg-red-500/5 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                          >
                            <span className="relative z-10 flex items-center justify-center space-x-1">
                              <span className="text-sm">✗</span>
                              <span className="text-xs">NO</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Place NO Bet</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              You are betting <strong>NO</strong> on strategy by {truncateAddress(strategy.trader)}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Bet Amount</label>
                              <Input
                                type="number"
                                value={betAmount === 0 ? '' : betAmount}
                                onChange={(e) => setBetAmount(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <Button 
                              onClick={() => handleBet(strategy, false)}
                              disabled={isPending || isConfirming || betAmount <= 0}
                              className="w-full bg-red-600 hover:bg-red-700"
                            >
                              {isPending || isConfirming ? 'Placing Bet...' : `Bet ${betAmount} NO`}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="group hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span className="ml-1 text-xs">See more</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl border-0 bg-gradient-to-br from-background via-background to-accent/5">
                        <DialogHeader className="border-b border-border/20 pb-6">
                          <DialogTitle className="text-2xl font-bold text-center">
                            <div className="flex items-center justify-center space-x-3">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-primary/30 flex items-center justify-center border border-primary/30">
                                  <span className="text-xl font-bold text-primary">{strategy.trader.slice(2, 4).toUpperCase()}</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background animate-pulse"></div>
                              </div>
                              <div className="text-left">
                                <div className="text-lg font-semibold">Strategy Details</div>
                                <div className="text-sm text-muted-foreground font-mono">{truncateAddress(strategy.trader)}</div>
                              </div>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-8 p-1">
                          {/* Key Metrics Row */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-green-500/5 to-green-600/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -translate-y-10 translate-x-10"></div>
                              <div className="relative">
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <span className="text-green-500 text-lg">📈</span>
                                  </div>
                                  <p className="text-sm font-medium text-muted-foreground">Return</p>
                                </div>
                                <p className={`text-3xl font-bold ${strategy.currentReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
                                  {strategy.currentReturn > 0 ? "+" : ""}{strategy.currentReturn.toFixed(1)}%
                                </p>
                              </div>
                            </div>
                            
                            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-500/5 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -translate-y-10 translate-x-10"></div>
                              <div className="relative">
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <span className="text-blue-500 text-lg">💰</span>
                                  </div>
                                  <p className="text-sm font-medium text-muted-foreground">Volume</p>
                                </div>
                                <p className="text-3xl font-bold text-blue-500">{formatCurrency(strategy.totalBets)}</p>
                              </div>
                            </div>
                            
                            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-orange-500/5 to-orange-600/10 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -translate-y-10 translate-x-10"></div>
                              <div className="relative">
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                    <span className="text-orange-500 text-lg">⏰</span>
                                  </div>
                                  <p className="text-sm font-medium text-muted-foreground">Time Left</p>
                                </div>
                                <p className="text-3xl font-bold text-orange-500">{formatTimeRemaining(strategy.deadline)}</p>
                              </div>
                            </div>
                            
                            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-purple-500/5 to-purple-600/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -translate-y-10 translate-x-10"></div>
                              <div className="relative">
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <span className="text-purple-500 text-lg">⭐</span>
                                  </div>
                                  <p className="text-sm font-medium text-muted-foreground">Reputation</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <p className="text-3xl font-bold text-purple-500">{strategy.traderReputation}%</p>
                                  <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                          i < Math.floor(strategy.traderReputation / 20)
                                            ? "bg-purple-500 scale-110"
                                            : "bg-muted scale-90"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Strategy Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-xl p-6 bg-gradient-to-br from-accent/30 to-accent/10 border border-border/30">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <span className="text-xl">🎯</span>
                                </div>
                                <h3 className="text-xl font-semibold">Strategy Objective</h3>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/20">
                                  <span className="text-muted-foreground">Target Return</span>
                                  <span className="text-2xl font-bold text-primary">+{strategy.objective}%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/20">
                                  <span className="text-muted-foreground">Risk Level</span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    {
                                      low: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                                      medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
                                      high: "bg-red-500/20 text-red-400 border border-red-500/30",
                                    }[strategy.risk]
                                  }`}>
                                    {strategy.risk.charAt(0).toUpperCase() + strategy.risk.slice(1)} Risk
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="rounded-xl p-6 bg-gradient-to-br from-accent/30 to-accent/10 border border-border/30">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <span className="text-xl">🗳️</span>
                                </div>
                                <h3 className="text-xl font-semibold">Voting Status</h3>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                    <span className="font-medium">YES Votes</span>
                                  </div>
                                  <span className="text-2xl font-bold text-green-500">{strategy.votesYes}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                    <span className="font-medium">NO Votes</span>
                                  </div>
                                  <span className="text-2xl font-bold text-red-500">{strategy.votesNo}%</span>
                                </div>
                                <div className="relative mt-4">
                                  <Progress value={strategy.votesYes} className="h-3" />
                                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-red-500/20 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <div className="rounded-xl p-6 bg-gradient-to-br from-accent/30 to-accent/10 border border-border/30">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="text-xl">📝</span>
                              </div>
                              <h3 className="text-xl font-semibold">Strategy Description</h3>
                            </div>
                            <p className="text-base text-muted-foreground leading-relaxed">
                              {strategy.description}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-border/50 rounded-lg">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No strategies found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find more
              strategies.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
