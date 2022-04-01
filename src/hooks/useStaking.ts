import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useStakingContract } from './useContract'

export function useStaking() {
  const addTransaction = useTransactionAdder()
  const contract = useStakingContract()
  const { account } = useActiveWeb3React()

  const signalLootStake = useCallback(
    async (tokenID: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = [tokenID]
      console.log('🚀 ~ file: useCreateOrderCallback.ts ~ line 18 ~ useCreateOrderCallback ~ args', args)

      return contract.estimateGas.signalLootStake(args, { from: account }).then(estimatedGasLimit => {
        return contract
          .signalLootStake(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Staking'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )

  return {
    signalLootStake
  }
}
