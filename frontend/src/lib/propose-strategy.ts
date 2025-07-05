import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import strategyFactoryAbi from '@/abis/StrategyFactory.json'
import { useToast } from '@/hooks/use-toast'

export function useProposeStrategy() {
  const { toast } = useToast()
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

  const executeFunction = async (vaults: string[], amounts: number[], tokens: string[], objectivePercent: number, duration: number, commission: number) => {
    try {
      writeContract({
        address: '0x63d54A0563D15C13c31607F3556E48379f84bCA7',
        abi: strategyFactoryAbi,
        functionName: 'proposeStrategy',
        args: [
          vaults,
          amounts,
          tokens,
          objectivePercent * 100,
          duration,
          commission * 100
        ]
      })
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to propose strategy ${err.message}`)
      } else {
        toast.error('Failed to propose strategy')
      }
    }
  }
  
  return {
    executeFunction,
    isPending,
    isConfirming,
    isConfirmed,
    error
  }
}
