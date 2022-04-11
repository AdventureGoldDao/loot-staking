import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useStakingContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { CurrencyAmount } from '../constants/token'
import { EPOCH_DURATION, STAKE_DURATION } from '../constants'
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
              summary: `Stake ${tokenIDs.length} Loot`
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
              summary: `Stake ${tokenIDs.length} mLoot`
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
  //const myLooStakedCount = useSingleCallResult(contract, 'numLootStakedByAccount', [account ?? undefined]).result
  //const myMLooStakedCount = useSingleCallResult(contract, 'numMLootStakedByAccount', [account ?? undefined]).result
  //const claimedAGLD = useSingleCallResult(contract, 'claimByAccount', [account ?? undefined]).result
  const now = Date.parse(new Date().toString()) / 1000
  const endTime = now + STAKE_DURATION
  const isActive = !!(now && startTime?.[0] && now > startTime[0] && now < endTime)

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
