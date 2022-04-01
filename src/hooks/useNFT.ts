import { useLoot721Contract, useStakingContract } from './useContract'
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'
import { useMemo } from 'react'

interface NFTInfo {
  isStake: boolean
}

export function useNFTInfo(tokenId: string, isLoot: boolean): NFTInfo {
  const contract = useStakingContract()
  const currentEpoch = useSingleCallResult(contract, 'getCurrentEpoch').result
  const args = tokenId && currentEpoch?.[0] ? [parseInt(currentEpoch[0].toString()) + 1, tokenId] : [undefined]
  const isStaked = useSingleCallResult(contract, 'stakedLootIdsByEpoch', args).result
  const rewards = useSingleCallResult(contract, 'getRewardsForLootBag', [tokenId]).result
  console.log('rewards', rewards?.toString(), tokenId, isStaked, currentEpoch?.toString())
  return { isStake: isStaked ? isStaked[0] : false }
}

export function useMyNFTs() {
  const { account } = useActiveWeb3React()
  const contract = useLoot721Contract('loot')
  const count = useSingleCallResult(contract, 'balanceOf', [account ?? undefined]).result
  const ids = count && account ? Array.from(new Array(parseInt(count[0])).keys()).slice(0) : []
  const args = account
    ? ids.map(item => {
        return [account, item]
      })
    : []
  const nftIds = useSingleContractMultipleData(contract, 'tokenOfOwnerByIndex', args)
  return useMemo(() => {
    return nftIds.map(({ result }) => {
      return result?.[0].toString()
    })
  }, [nftIds])
}
