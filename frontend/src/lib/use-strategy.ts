"use client";

import { useState, useEffect } from 'react';

export interface Strategy {
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

export function useStrategy(strategyId: string) {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategy = async () => {
      if (!strategyId) {
        setStrategy(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subgraph/strategies/${strategyId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch strategy');
        }
        
        const data = await response.json();
        setStrategy(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setStrategy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategy();
  }, [strategyId]);

  return { strategy, loading, error };
}