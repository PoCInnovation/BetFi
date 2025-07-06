import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import strategyBetAbi from '@/abis/StrategyBet.json'
import { useToast } from '@/hooks/use-toast'

export function usePlaceBet() {
  const { toast } = useToast()
  const { address } = useAccount()
  
  const { 
    data: hash, 
    writeContract, 
    isPending, 
    error 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({
      hash,
    })

  const placeBet = async (strategyAddress: string, isYes: boolean, amount: number) => {
    try {
      writeContract({
        address: strategyAddress as `0x${string}`,
        abi: strategyBetAbi,
        functionName: 'placeBet',
        account: address,
        args: [isYes, amount]
      })
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to place bet: ${err.message}`)
      } else {
        toast.error('Failed to place bet')
      }
    }
  }
  
  return {
    placeBet,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash
  }
}
