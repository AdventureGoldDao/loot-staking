import axios from 'axios'

const client = axios.create({
  baseURL: `https://eth-rinkeby.blockvision.org/v1/${process.env.REACT_APP_BLOCK_VISION_KEY}`,
  responseType: 'json'
})

export async function fetchAccountPositions(accountAddress: string, pageIndex: number, pageSize = 5) {
  return await client.post('/', {
    id: 1,
    jsonrpc: '2.0',
    method: 'erc20_accountPositions',
    params: {
      accountAddress: accountAddress,
      blockNumber: '',
      pageSize: pageSize,
      pageIndex: pageIndex
    }
  })
}

export async function fetchAccountERC721Ids(
  accountAddress: string,
  contractAddress: string,
  blockNumber: number,
  pageIndex: number,
  pageSize = 100
) {
  return await client.post('/', {
    id: 1,
    jsonrpc: '2.0',
    method: 'erc721_accountTokenIDs',
    params: {
      contractAddress,
      accountAddress,
      blockNumber,
      pageSize: pageSize,
      pageIndex: pageIndex
    }
  })
}
