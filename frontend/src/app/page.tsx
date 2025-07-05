"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import {
  formatCurrency,
  formatTimeRemaining,
  mockStrategies,
  truncateAddress,
} from "@/lib/mock-data";
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

interface FilterState {
  status: string;
  risk: string;
  minYesVotes: number;
  minNoVotes: number;
  sortBy: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    risk: "all",
    minYesVotes: 0,
    minNoVotes: 0,
    sortBy: "default",
  });

  const filteredAndSortedStrategies = useMemo(() => {
    let filtered = mockStrategies.filter((strategy) => {
      // Search term filter
      const matchesSearch =
        strategy.trader.toLowerCase().includes(searchTerm.toLowerCase()) ||
        strategy.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
        strategy.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        filters.status === "all" || strategy.status === filters.status;

      // Risk filter
      const matchesRisk =
        filters.risk === "all" || strategy.risk === filters.risk;

      // Vote filters
      const matchesYesVotes = strategy.votesYes >= filters.minYesVotes;
      const matchesNoVotes = strategy.votesNo >= filters.minNoVotes;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRisk &&
        matchesYesVotes &&
        matchesNoVotes
      );
    });

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
              {mockStrategies.length} strategies
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

        {/* Strategy List */}
        {filteredAndSortedStrategies.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedStrategies.map((strategy) => (
              <div
                key={strategy.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          {
                            low: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                            medium:
                              "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
                            high: "bg-red-500/20 text-red-400 border border-red-500/30",
                          }[strategy.risk]
                        }`}
                      >
                        {strategy.risk.charAt(0).toUpperCase() +
                          strategy.risk.slice(1)}{" "}
                        Risk
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {truncateAddress(strategy.trader)}
                        </p>
                        <span className="text-xs text-muted-foreground">·</span>
                        <p className="text-xs text-muted-foreground truncate">
                          {strategy.objective}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-10">
                    <span
                      className={`text-sm font-medium ${
                        strategy.currentReturn >= 0
                          ? "text-green-500"
                          : "text-red-600"
                      }`}
                    >
                      {strategy.currentReturn > 0 ? "+" : ""}
                      {strategy.currentReturn.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeRemaining(strategy.deadline)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Vol: {formatCurrency(strategy.totalBets)}
                    </span>
                  </div>
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        YES/NO Votes
                      </span>
                      <span className="font-bold">
                        {strategy.votesYes}% / {strategy.votesNo}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={strategy.votesYes} className="h-3" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-red-500/20 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full mx-0.5 ${
                            i < Math.floor(strategy.traderReputation / 20)
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <span className="text-lg">✓</span>
                        <span>BET YES</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 relative overflow-hidden group border-2 border-red-500/60 text-red-400 hover:text-white hover:border-red-400 font-bold bg-red-500/5 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <span className="text-lg">✗</span>
                        <span>BET NO</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Button>
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
