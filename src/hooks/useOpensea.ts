import { useEffect, useState } from 'react'
import { fetchOpenseaProject } from '../utils/fetch/opensea'

export function useProjectInfo(project: string | undefined) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    floorPrice: string
    totalSupply: string
  }>()

  useEffect(() => {
    ;(async () => {
      if (!project) {
        setResult(undefined)
        return
      }
      setLoading(true)
      fetchOpenseaProject(project)
        .then(resp => {
          if (resp.status === 200) {
            const data = {
              floorPrice: resp.data.stats.floor_price,
              totalSupply: resp.data.stats.total_supply
            }
            setLoading(false)
            setResult(data)
          }
        })
        .catch(err => {
          setLoading(false)
          setResult(undefined)
          console.error('useAccountERC721Ids~ error', err)
        })
    })()
  }, [])

  return { loading, result }
}
