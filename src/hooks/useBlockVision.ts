import { LOOT_M_ADDRESS, LOOT_ADDRESS } from '../constants'
import { useEffect, useMemo, useState } from 'react'
import { fetchAccountERC721Ids } from 'utils/fetch/blockVision'
import { useActiveWeb3React } from '.'

export function useAccountERC721Ids(contractAddress: string | undefined) {
  const { account, chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    contractAddress: string
    ids: string[]
  }>()

  useEffect(() => {
    ;(async () => {
      if (!account || !chainId || !contractAddress) {
        setResult(undefined)
        return
      }
      setLoading(true)
      fetchAccountERC721Ids(account, contractAddress, 0, 1, 500)
        .then(resp => {
          if (resp.status === 200) {
            const list = {
              contractAddress: contractAddress,
              ids: resp.data.result.data.map((item: any) => item.tokenID) as string[]
            }
            setLoading(false)
            setResult(list)
          }
        })
        .catch(err => {
          setLoading(false)
          setResult(undefined)
          console.error('useAccountERC721Ids~ error', err)
        })
    })()
  }, [account, chainId, contractAddress])

  return { loading, result }
}

export function useAccountLootIds(type: 'loot' | 'lootm') {
  const { chainId } = useActiveWeb3React()

  const contractAddress = useMemo(() => {
    if (!chainId) return undefined
    return type === 'loot' ? LOOT_ADDRESS[chainId] || undefined : LOOT_M_ADDRESS[chainId] || undefined
  }, [chainId, type])

  return useAccountERC721Ids(contractAddress)
}
