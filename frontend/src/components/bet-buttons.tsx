"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BetButtonsProps {
  strategyId: string;
  traderName: string;
}

export const BetButtons = ({ strategyId, traderName }: BetButtonsProps) => {
  const { toast } = useToast();

  const handleQuickBet = (position: 'yes' | 'no') => {
    const loadingId = toast.loading(`Placing ${position.toUpperCase()} bet...`);
    
    // Simulate API call
    setTimeout(() => {
      toast.dismiss(loadingId);
      
      if (Math.random() > 0.8) {
        // Simulate error
        toast.error("Bet failed", "Insufficient balance or network error");
      } else {
        toast.success(
          `${position.toUpperCase()} bet placed!`,
          `0.1 ETH bet on ${traderName}`
        );
      }
    }, 1500);
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => handleQuickBet('yes')}
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
        onClick={() => handleQuickBet('no')}
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
  );
};