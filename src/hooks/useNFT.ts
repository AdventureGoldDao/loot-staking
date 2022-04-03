import { useLoot721Contract, useStakingContract } from './useContract'
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'
import { useMemo } from 'react'
import { EPOCH_DURATION } from '../constants'
import { LootType } from './useNFTInfo'

interface NFTInfo {
  isStake: boolean
  stakedTime: number
  epochs: number
}

export function useNFTInfo(tokenId: string, isLoot: boolean): NFTInfo {
  const contract = useStakingContract()
  const currentEpoch = useSingleCallResult(contract, 'getCurrentEpoch').result
  const epochs = currentEpoch ? Array.from(new Array(parseInt(currentEpoch?.[0]) + 1).keys()).slice(1) : []
  const args = tokenId
    ? epochs.map(item => {
        return [item, tokenId]
      })
    : []
  const stakedByEpoch = useSingleContractMultipleData(contract, 'stakedLootIdsByEpoch', args)
  const stakedEpochs = stakedByEpoch.filter(({ result }) => {
    return result?.[0]
  })

  const stakedTime = stakedEpochs.length * EPOCH_DURATION
  console.log('time--->', stakedTime)

  // const arg = tokenId && currentEpoch?.[0] ? [parseInt(currentEpoch[0].toString()) + 1, tokenId] : [undefined]
  // const isStaked = useSingleCallResult(contract, 'stakedLootIdsByEpoch', arg).result
  // const rewards = useSingleCallResult(contract, 'getRewardsForLootBag', [tokenId])
  // console.log('rewards', rewards, currentEpoch)
  return { isStake: false, stakedTime: 0, epochs: 0 }
}

export function useMyNFTs(type: LootType) {
  const { account } = useActiveWeb3React()
  const contract = useLoot721Contract(type)
  const count = useSingleCallResult(contract, 'balanceOf', [account ?? undefined])
  const ids = count && account && count.result ? Array.from(new Array(parseInt(count.result?.[0])).keys()).slice(0) : []
  const args = account
    ? ids.map(item => {
        return [account, item]
      })
    : []
  const nftIds = useSingleContractMultipleData(contract, 'tokenOfOwnerByIndex', args)
  return useMemo(() => {
    return {
      loading: count.loading,
      nfts: nftIds.map(({ result }) => {
        return result?.[0].toString()
      })
    }
  }, [count.loading, nftIds])
}
