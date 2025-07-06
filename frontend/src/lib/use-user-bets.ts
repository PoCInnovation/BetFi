"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface UserBet {
  id: string;
  strategyId: string;
  user: string;
  side: 'yes' | 'no';
  amount: number;
  transactionHash: string;
  createdAt: string;
  status: 'active' | 'claimed' | 'lost';
}

export function useUserBets() {
  const [bets, setBets] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    const fetchUserBets = async () => {
      if (!address) {
        setBets([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subgraph/bets/user/${address}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user bets');
        }
        
        const data = await response.json();
        setBets(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setBets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBets();
  }, [address]);

  return { bets, loading, error, refetch: () => {
    if (address) {
      const fetchUserBets = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subgraph/bets/user/${address}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch user bets');
          }
          
          const data = await response.json();
          setBets(data);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setBets([]);
        } finally {
          setLoading(false);
        }
      };
      fetchUserBets();
    }
  }};
}