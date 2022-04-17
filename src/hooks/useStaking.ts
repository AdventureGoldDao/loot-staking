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
    currentEpoch?.[0] ? (currentEpoch?.[0] + 1).toString() : undefined
  ]).result
  const looStakedCount = useSingleCallResult(contract, 'numLootStakedByEpoch', [
    currentEpoch?.[0] ? JSBI.ADD(JSBI.BigInt(currentEpoch?.[0]), JSBI.BigInt('1')).toString() : undefined
  ]).result
  const mLooStakedCount = useSingleCallResult(contract, 'numMLootStakedByEpoch', [
    currentEpoch?.[0] ? JSBI.ADD(JSBI.BigInt(currentEpoch?.[0]), JSBI.BigInt('1')).toString() : undefined
  ]).result

  const lootReward = currentEpochReward?.[0].toString()
  const mLootReward = currentEpochReward?.[1].toString()
  const perLootReward =
    looStakedCount?.[0] && lootReward && JSBI.greaterThan(JSBI.BigInt(looStakedCount?.[0].toString()), JSBI.BigInt('0'))
      ? JSBI.divide(JSBI.BigInt(lootReward), JSBI.BigInt(looStakedCount?.[0].toString())).toString()
      : '0'
  const permLootReward =
    mLooStakedCount?.[0] && mLootReward && JSBI.greaterThan(JSBI.BigInt(mLooStakedCount?.[0]), JSBI.BigInt('0'))
      ? JSBI.divide(JSBI.BigInt(mLootReward), JSBI.BigInt(mLooStakedCount?.[0].toString())).toString()
      : '0'

  const isActive =
    numEpochs?.[0] && currentEpoch?.[0] && JSBI.greaterThan(JSBI.BigInt(numEpochs?.[0]), JSBI.BigInt(currentEpoch?.[0]))

  const nextTime =
    currentEpoch?.[0] && startTime?.[0]
      ? JSBI.ADD(JSBI.BigInt(currentEpoch[0] * EPOCH_DURATION), JSBI.BigInt(startTime[0].toString()))
      : JSBI.BigInt(0)

  // const numLootStaked = useSingleCallResult(
  //   contract,
  //   'numLootStakedByEpoch',
  //   [currentEpoch?.[0].toString()] ?? undefined
  // ).result
  // const numMLootStaked = useSingleCallResult(
  //   contract,
  //   'numMLootStakedByEpoch',
  //   [currentEpoch?.[0].toString()] ?? undefined
  // ).result
  return {
    isActive,
    numEpochs: numEpochs?.[0].toString() ?? '0',
    numLootStaked: looStakedCount?.[0].toString() ?? '0',
    numMLootStaked: mLooStakedCount?.[0].toString() ?? '0',
    rewardPerEpoch: rewardPerEpoch ? CurrencyAmount.ether(rewardPerEpoch[0].toString()) : undefined,
    nextTime,
    perLootReward,
    permLootReward,
    totalReward:
      currentEpoch && rewardPerEpoch
        ? CurrencyAmount.ether(currentEpoch?.[0] + rewardPerEpoch?.[0])
        : CurrencyAmount.ether(JSBI.BigInt(0))
  }
}
