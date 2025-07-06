import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { useEffect } from "react";
import strategyBetAbi from "@/abis/StrategyBet.json";
import { useToast } from "@/hooks/use-toast";

export function usePlaceBet() {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const placeBet = async (
    strategyAddress: string,
    isYes: boolean,
    amount: number 
  ) => {
    try {
      // Preliminary checks
      if (!isConnected) {
        toast.error("Error", "Please connect your wallet");
        return;
      }

      if (!address) {
        toast.error("Error", "Wallet address not available");
        return;
      }

      if (!strategyAddress || !strategyAddress.startsWith("0x")) {
        toast.error("Error", "Invalid contract address");
        return;
      }

      console.log("Placing bet with params:", {
        strategyAddress,
        isYes,
        amount,
        account: address,
      });

      // Contract call with await
      await writeContract({
        address: strategyAddress as `0x${string}`,
        abi: strategyBetAbi,
        functionName: "placeBet",
        args: [isYes, amount],
        account: address,
      });

      toast.success("Transaction initiated", "Your bet is being processed...");
    } catch (err) {
      console.error("Error placing bet:", err);

      if (err instanceof Error) {
        toast.error("Failed to place bet", err.message);
      } else {
        toast.error("Failed to place bet");
      }
    }
  };

  // Effect to handle writeContract errors
  useEffect(() => {
    if (error) {
      console.error("WriteContract error:", error);
      toast.error("Failed to place bet", error.message || "An error occurred");
    }
  }, [error, toast]);

  // Effect to handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Your bet has been placed successfully!");
    }
  }, [isConfirmed, toast]);

  return {
    placeBet,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    isConnected,
  };
}
