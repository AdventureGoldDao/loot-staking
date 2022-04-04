import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useStakingContract } from './useContract'

export function useClaim() {
  const addTransaction = useTransactionAdder()
  const contract = useStakingContract()
  const { account } = useActiveWeb3React()

  const onClaimLoot = useCallback(
    async (tokenIDs: string[]) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = tokenIDs
      console.log('🚀 ~ file: useCreateOrderCallback.ts ~ line 18 ~ useCreateOrderCallback ~ args', args)
      return contract.estimateGas.claimLootRewards(args, { from: account }).then(estimatedGasLimit => {
        return contract
          .claimLootRewards(args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Claim AGLD'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )

  return {
    onClaimLoot
  }
}
