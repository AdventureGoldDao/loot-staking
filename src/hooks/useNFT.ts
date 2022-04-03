import { useLoot721Contract, useStakingContract } from './useContract'
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'
import { useMemo } from 'react'
//import { EPOCH_DURATION } from '../constants'
import { LootType } from './useNFTInfo'
import { CurrencyAmount } from '../constants/token'

interface NFTInfo {
  isStake: boolean
  reward: CurrencyAmount | undefined
  stakedEpochs: number
}

export interface NFT {
  tokenId: string
  reward: CurrencyAmount | undefined
}

export function useNFTInfo(tokenId: string, lootType: LootType): NFTInfo {
  const contract = useStakingContract()
  const currentEpoch = useSingleCallResult(contract, 'getCurrentEpoch').result
  const epochs = currentEpoch ? Array.from(new Array(parseInt(currentEpoch?.[0]) + 1).keys()).slice(1) : []
  const args = tokenId
    ? epochs.map(item => {
        return [item, tokenId]
      })
    : []
  const stakedByEpoch = useSingleContractMultipleData(
    contract,
    lootType === 'loot' ? 'stakedLootIdsByEpoch' : 'stakedMLootIdsByEpoch',
    args
  )
  const stakedEpochs = stakedByEpoch.filter(({ result }) => {
    return result?.[0]
  })

  //const stakedTime = stakedEpochs.length * EPOCH_DURATION
  // const arg = tokenId && currentEpoch?.[0] ? [parseInt(currentEpoch[0].toString()) + 1, tokenId] : [undefined]
  // const isStaked = useSingleCallResult(contract, 'stakedLootIdsByEpoch', arg).result
  const reward = useSingleCallResult(contract, 'getClaimableRewardsForLootBag', [tokenId])
  console.log('isStake', stakedEpochs?.length)
  const isStake = !!(stakedByEpoch && stakedByEpoch[stakedByEpoch?.length - 1]?.result?.[0])
  const rewardAmount = reward && reward.result?.[0] ? CurrencyAmount.ether(reward.result?.[0].toString()) : undefined
  return { isStake, reward: rewardAmount, stakedEpochs: stakedEpochs.length }
}

export function useMyNFTs(type: LootType): { loading: boolean; nfts: NFT[] } {
  const { account } = useActiveWeb3React()
  const contract = useLoot721Contract(type)
  const stakingContract = useStakingContract()
  const count = useSingleCallResult(contract, 'balanceOf', [account ?? undefined])
  const ids = count && account && count.result ? Array.from(new Array(parseInt(count.result?.[0])).keys()).slice(0) : []
  const args = account
    ? ids.map(item => {
        return [account, item]
      })
    : []
  const nftIds = useSingleContractMultipleData(contract, 'tokenOfOwnerByIndex', args)
  const idArgs = nftIds
    .filter(({ result }) => {
      return result?.[0]
    })
    .map(({ result }) => {
      return [result?.[0].toString()]
    })

  const rewards = useSingleContractMultipleData(
    stakingContract,
    type === 'loot' ? 'getClaimableRewardsForLootBag' : 'getClaimableRewardsForMLootBag',
    idArgs
  )
  console.log('rewards', rewards, type)
  return useMemo(() => {
    return {
      loading: count.loading,
      nfts: nftIds.map(({ result }, index) => {
        return {
          tokenId: result?.[0].toString(),
          reward: rewards[index]?.result ? CurrencyAmount.ether(rewards[index]?.result?.[0].toString()) : undefined
        }
      })
    }
  }, [count.loading, nftIds, rewards])
}
