import { useStakingContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

interface NFTInfo {
  isStake: boolean
}

export function useNFTInfo(tokenId: string, isLoot: boolean): NFTInfo {
  const contract = useStakingContract()
  const currentEpoch = useSingleCallResult(contract, 'getCurrentEpoch').result
  const args = (tokenId && currentEpoch?.[0]) ? [parseInt(currentEpoch[0].toString()) + 1, tokenId] : [undefined]
  const isStaked = useSingleCallResult(contract, 'stakedLootIdsByEpoch', args).result
  return { isStake: isStaked ? isStaked[0] : false }
}
