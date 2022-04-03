import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useStakingContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useStaking() {
  const addTransaction = useTransactionAdder()
  const contract = useStakingContract()
  const { account } = useActiveWeb3React()

  const signalLootStake = useCallback(
    async (tokenID: string[]) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = tokenID
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
              summary: 'Stake Loot'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )

  const signalLootMoreStake = useCallback(
    async (tokenID: string[]) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = tokenID
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
              summary: 'Stake Loot more'
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
  const contract = useStakingContract()
  const currentEpoch = useSingleCallResult(contract, 'getCurrentEpoch').result
  const numEpochs = useSingleCallResult(contract, 'numEpochs').result
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
  console.log('numLootStaked', numLootStaked?.toString(), numMLootStaked?.toString())
  return {
    numEpochs,
    numLootStaked: numLootStaked?.[0].toString() ?? '0',
    numMLootStaked: numMLootStaked?.[0].toString() ?? '0'
  }
}
