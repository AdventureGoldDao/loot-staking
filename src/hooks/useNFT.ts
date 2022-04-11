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
  stakedEpochs: string | undefined
  isStaked: boolean
  metaData: { name: string; description: string; image: string } | undefined
}

export function useNFTInfo(tokenId: string, lootType: LootType): NFTInfo {
  const contract = useStakingContract()
  const currentEpoch = useSingleCallResult(contract, 'getCurrentEpoch').result
  const stakedEpoch = useSingleCallResult(contract, lootType === 'loot' ? 'numLootStakedById' : 'numMLootStakedById', [
    tokenId
  ]).result
  // const epochs = currentEpoch ? Array.from(new Array(parseInt(currentEpoch?.[0].toString()) + 2).keys()).slice(1) : []
  // console.log('currentEpoch', currentEpoch?.[0].toString(), epochs)
  // const args = tokenId
  //   ? epochs.map(item => {
  //       return [item, tokenId]
  //     })
  //   : []
  // const stakedByEpoch = useSingleContractMultipleData(
  //   contract,
  //   lootType === 'loot' ? 'stakedLootIdsByEpoch' : 'stakedMLootIdsByEpoch',
  //   args
  // )
  // console.log('stakedByEpoch', stakedByEpoch)
  // const stakedEpochs = stakedByEpoch.filter(({ result }) => {
  //   return result?.[0]
  // })

  //const stakedTime = stakedEpochs.length * EPOCH_DURATION

  const arg = tokenId && currentEpoch?.[0] ? [parseInt(currentEpoch[0].toString()) + 1, tokenId] : [undefined]
  const isStaked = useSingleCallResult(
    contract,
    lootType === 'loot' ? 'stakedLootIdsByEpoch' : 'stakedMLootIdsByEpoch',
    arg
  ).result
  // const reward = useSingleCallResult(
  //   contract,
  //   lootType === 'loot' ? 'getClaimableRewardsForLootBag' : 'getClaimableRewardsForMLootBag',
  //   [tokenId]
  // )
  const isStake = !!isStaked?.[0]
  //const rewardAmount = reward && reward.result?.[0] ? CurrencyAmount.ether(reward.result?.[0].toString()) : undefined
  return { isStake, reward: undefined, stakedEpochs: stakedEpoch?.[0] }
}

export function useMyNFTs(type: LootType): { loading: boolean; nfts: NFT[] } {
  const { account } = useActiveWeb3React()
  const contract = useLoot721Contract(type)
  const stakingContract = useStakingContract()
  const count = useSingleCallResult(contract, 'balanceOf', [account ?? undefined])
  const currentEpoch = useSingleCallResult(stakingContract, 'getCurrentEpoch').result

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

  const isStakeArgs = currentEpoch?.[0]
    ? nftIds
        .filter(({ result }) => {
          return result?.[0]
        })
        .map(({ result }) => {
          return [parseInt(currentEpoch[0].toString()) + 1, result?.[0].toString()]
        })
    : []

  const isStakeList = useSingleContractMultipleData(
    stakingContract,
    type === 'loot' ? 'stakedLootIdsByEpoch' : 'stakedMLootIdsByEpoch',
    isStakeArgs
  )

  const stakedEpochsList = useSingleContractMultipleData(
    stakingContract,
    type === 'loot' ? 'getClaimableEpochsForLootBag' : 'getClaimableEpochsForMLootBag',
    idArgs
  )
  console.log('stakedEpochsList', stakedEpochsList)
  const urls = useSingleContractMultipleData(contract, 'tokenURI', idArgs)

  const rewards = useSingleContractMultipleData(
    stakingContract,
    type === 'loot' ? 'getClaimableRewardsForLootBag' : 'getClaimableRewardsForMLootBag',
    idArgs
  )

  return useMemo(() => {
    return {
      loading: count.loading,
      nfts: nftIds.map(({ result }, index) => {
        const reward = rewards[index]?.result
        const url = urls[index]?.result
        const stakedEpochs = stakedEpochsList[index]?.result
        return {
          tokenId: result?.[0].toString(),
          reward: reward ? CurrencyAmount.ether(reward?.[0].toString()) : undefined,
          isStaked: !!isStakeList[index]?.result?.[0],
          stakedEpochs: stakedEpochs?.[0].length,
          metaData: url
            ? JSON.parse(window.atob(url?.[0].toString().replace(/^data:application\/json;base64,/, '')))
            : undefined
        }
      })
    }
  }, [count.loading, isStakeList, nftIds, rewards, urls])
}
