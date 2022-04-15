import { ChainId } from '../constants/chain'
import { SUBGRAPH } from '../constants'

export enum NFTType {
  LOOT = 'loot',
  MLOOT = 'mloot'
}

export const QUERY_FUNCTION: { [nft in NFTType]: string } = {
  [NFTType.LOOT]: 'lootStakeCounters',
  [NFTType.MLOOT]: 'mlootStakeCounters'
}

const postQuery = async (endpoint: string, query: string) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  }
  const response = await fetch(endpoint, options)
  const data = await response.json()
  if (data.errors) {
    throw new Error(data.errors[0].message)
  } else {
    return data
  }
}

export type StakeCount = {
  id: string
  count: string
  unClaimEpoch: string
}

export async function getStakeCount(
  networkId: ChainId,
  tokenIdArray: string[],
  nftType: NFTType
): Promise<StakeCount[]> {
  if (!tokenIdArray.length) return []
  const query = `{${QUERY_FUNCTION[nftType]}(
            where: {id_in: [${tokenIdArray.toString()}]},subgraphError:deny
        ) {
            id,
            count,
            unClaimEpoch
    }
  }`

  try {
    const response = await postQuery(SUBGRAPH[networkId], query)
    return response.data[QUERY_FUNCTION[nftType]]
  } catch (error) {
    return []
  }
}
