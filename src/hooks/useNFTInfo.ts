import { useLoot721Contract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useMemo } from 'react'

export interface NFTInfo {
  name: string
  image: string
  id: string
  description: string
}

export type LootType = 'loot' | 'mloot'

export function useLootNFTDetail(type: LootType, id: string | undefined): { loading: boolean; data: NFTInfo | null } {
  const contract = useLoot721Contract(type)
  const url = useSingleCallResult(contract, 'tokenURI', [id])
  const nftUrl = useMemo(() => {
    if (!url.result) return null
    let str = url.result[0].toString()
    str = str.replace(/^data:application\/json;base64,/, '')
    return JSON.parse(window.atob(str))
  }, [url])

  const data = useMemo(() => {
    if (url.result) {
      return {
        id,
        ...nftUrl
      }
    }
    return null
  }, [id, nftUrl, url.result])

  return {
    loading: url.loading,
    data
  }
}
