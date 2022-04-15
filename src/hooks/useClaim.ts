import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useStakingContract } from './useContract'
import { LootType } from './useNFTInfo'

export function useClaim() {
  const addTransaction = useTransactionAdder()
  const contract = useStakingContract()
  const { account } = useActiveWeb3React()

  const onClaimLoot = useCallback(
    async (lootType: LootType, tokenIDs: string[]) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = tokenIDs
      const func = lootType === 'loot' ? 'claimLootRewards' : 'claimMLootRewards'
      console.log('🚀 ~ file: useCreateOrderCallback.ts ~ line 18 ~ useCreateOrderCallback ~ args', args)
      return contract.estimateGas[func](args, { from: account }).then(estimatedGasLimit => {
        return contract[func](args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Claim AGLD',
            claim: tokenIDs
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
