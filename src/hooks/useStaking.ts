import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useStakingContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { CurrencyAmount } from '../constants/token'
import { EPOCH_DURATION } from '../constants'
import JSBI from 'jsbi'

export function useStaking() {
  const addTransaction = useTransactionAdder()
  const contract = useStakingContract()
  const { account } = useActiveWeb3React()

  const signalLootStake = useCallback(
    async (tokenIDs: string[]) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = tokenIDs
      console.log('🚀 ~ file: useStaking.ts ~ line 18 ~ args', args)

      return contract.estimateGas.signalLootStake(args, { from: account }).then(estimatedGasLimit => {
        return contract
          .signalLootStake(args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Stake ${tokenIDs.length} Loot`,
              stake: tokenIDs
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )

  const signalLootMoreStake = useCallback(
    async (tokenIDs: string[]) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = tokenIDs
      console.log('🚀 ~ file: useStaking.ts ~ line 43 ~ args', args)

      return contract.estimateGas.signalMLootStake(args, { from: account }).then(estimatedGasLimit => {
        return contract
          .signalMLootStake(args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Stake ${tokenIDs.length} mLoot`,
              stake: tokenIDs
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )

  return {
    signalLootStake,
    signalLootMoreStake
  }
}

export function useStakingInfo() {
  //const { account } = useActiveWeb3React()
  const contract = useStakingContract()
  const currentEpoch = useSingleCallResult(contract, 'getCurrentEpoch').result
  const numEpochs = useSingleCallResult(contract, 'numEpochs').result
  const rewardPerEpoch = useSingleCallResult(contract, 'getTotalRewardPerEpoch').result
  const startTime = useSingleCallResult(contract, 'stakingStartTime').result
  const currentEpochReward = useSingleCallResult(contract, 'getRewardsForEpoch', [
    currentEpoch?.[0].toString() ?? undefined
  ]).result
  const looStakedCount = useSingleCallResult(contract, 'numLootStakedByEpoch', [
    currentEpoch?.[0].toString() ?? undefined
  ]).result
  const mLooStakedCount = useSingleCallResult(contract, 'numMLootStakedByEpoch', [
    currentEpoch?.[0].toString() ?? undefined
  ]).result

  const lootReward = currentEpochReward?.[0]
  const mLootReward = currentEpochReward?.[1]
  const perLootReward = lootReward / looStakedCount?.[0]
  const permLootReward = mLootReward / lootReward?.[0]

  console.log(
    'tag--->',
    currentEpoch?.[0].toString(),
    lootReward?.toString(),
    mLootReward?.toString(),
    looStakedCount?.[0].toString(),
    mLooStakedCount?.[0].toString(),
    perLootReward,
    permLootReward
  )
  const isActive = currentEpoch?.[0] < numEpochs?.[0]

  const nextTime =
    currentEpoch?.[0] && startTime?.[0]
      ? JSBI.ADD(JSBI.BigInt(currentEpoch[0] * EPOCH_DURATION), JSBI.BigInt(startTime[0].toString()))
      : JSBI.BigInt(0)

  const numLootStaked = useSingleCallResult(
    contract,
    'numLootStakedByEpoch',
    [currentEpoch?.[0].toString()] ?? undefined
  ).result
  const numMLootStaked = useSingleCallResult(
    contract,
    'numMLootStakedByEpoch',
    [currentEpoch?.[0].toString()] ?? undefined
  ).result
  return {
    isActive,
    numEpochs: numEpochs?.[0].toString() ?? '0',
    numLootStaked: numLootStaked?.[0].toString() ?? '0',
    numMLootStaked: numMLootStaked?.[0].toString() ?? '0',
    myLooStakedCount: 0,
    myMLooStakedCount: 0,
    claimedAGLD: 0,
    rewardPerEpoch: rewardPerEpoch ? CurrencyAmount.ether(rewardPerEpoch[0].toString()) : undefined,
    nextTime,
    totalReward:
      currentEpoch && rewardPerEpoch
        ? CurrencyAmount.ether(currentEpoch?.[0] + rewardPerEpoch?.[0])
        : CurrencyAmount.ether(JSBI.BigInt(0))
  }
}
