import { Box } from '@mui/material'
import { useEffect } from 'react'
import { Axios } from 'utils/axios'
// import React from 'react'
import LootCard from './LootCard'

export const LookCardGroup = () => {
  useEffect(() => {
    ;(() => {
      Axios.post('/', {
        data: {
          id: 1,
          jsonrpc: '2.0',
          method: 'erc721_accountTokenIDs',
          params: {
            contractAddress: '0x84e3547f63ad6e5a1c4fe82594977525c764f0e8',
            accountAddress: '0x2D3Fff58da3346dCE601F6DB8eeC57906CDB17bE',
            blockNumber: '',
            pageSize: 100,
            pageIndex: 1
          }
        }
      }).then(res => {
        console.log(res)
      })
    })()
  }, [])

  return (
    <Box id={'column-box-body'} display="grid" gridTemplateColumns={'1fr 1fr'} columnGap={50}>
      <LootCard
        imgsrc={`https://ss3.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D450%2C600/sign=a5dda3cf7bf0f736d8ab44053f659f2f/b03533fa828ba61ea66a5d9f4234970a314e59fd.jpg`}
        title={'Bag #5913'}
        progress={0}
        isstaked={false}
      ></LootCard>
      <LootCard
        imgsrc={`https://ss3.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D450%2C600/sign=a5dda3cf7bf0f736d8ab44053f659f2f/b03533fa828ba61ea66a5d9f4234970a314e59fd.jpg`}
        title={'Bag #5913'}
        progress={5}
        isstaked={true}
      ></LootCard>
    </Box>
  )
}
