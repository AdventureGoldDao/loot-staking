import { Box, MenuItem, Typography } from '@mui/material'
import Modal from 'components/Modal'
import { styled } from '@mui/system'
import Select from 'components/Select/Select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Checkbox from 'components/Checkbox'
import NoData from 'components/NoData'
import OutlineButton from 'components/Button/OutlineButton'
import { useMyNFTs } from '../../../hooks/useNFT'
import { useClaim } from '../../../hooks/useClaim'
import TransactionPendingModal from '../../../components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from '../../../components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from '../../../components/Modal/TransactionModals/MessageBox'
import useModal from '../../../hooks/useModal'
import JSBI from 'jsbi'
import { getStakeCount, NFTType, StakeCount } from '../../../utils/graph'
import useAsyncMemo from '../../../hooks/useAsyncMemo'
import { useActiveWeb3React } from '../../../hooks'
import { useBlockNumber } from 'state/application/hooks'

const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default function ClaimModal() {
  const [type, setType] = useState<NFTType>(NFTType.LOOT)
  const [selectList, setSelectList] = useState<string[]>([])
  const { showModal, hideModal } = useModal()

  const lootList = useMyNFTs('loot').nfts
  const mlootList = useMyNFTs('mloot').nfts
  const { chainId } = useActiveWeb3React()

  const [nftIds, setNftIds] = useState<string[]>([])
  const blockNumber = useBlockNumber()

  useEffect(() => {
    const ids = (NFTType.LOOT === type ? lootList : mlootList).map(({ tokenId }) => tokenId).filter(i => i) as string[]
    if (ids.toString() !== nftIds.toString()) setNftIds(ids)
  }, [lootList, mlootList, nftIds, type])

  const stakedCounts: StakeCount[] = useAsyncMemo(
    async () => {
      if (nftIds.length === 0 || !chainId) return []
      const data = await getStakeCount(chainId, nftIds, type)
      if (data === null) {
        return []
      }
      return data
    },
    [],
    [lootList, type, blockNumber]
  )

  useEffect(() => {
    setSelectList([])
  }, [type])

  const currentNFTList = useMemo(() => {
    return type === 'loot' ? lootList : mlootList
  }, [lootList, mlootList, type])

  const toggleSelectList = useCallback(
    (id: string) => {
      const _has = selectList.includes(id)
      if (!_has) {
        setSelectList([...selectList, id])
      } else {
        setSelectList(selectList.filter(i => i !== id))
      }
    },
    [selectList]
  )

  const { onClaimLoot } = useClaim()

  const claimLootCallback = useCallback(async () => {
    if (!selectList.length) return
    showModal(<TransactionPendingModal />)
    onClaimLoot(type, selectList)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [hideModal, onClaimLoot, selectList, showModal, type])

  const btn = useMemo(() => {
    if (!selectList.length) {
      return (
        <OutlineButton disabled height="48px" width="88px" primary>
          Claim
        </OutlineButton>
      )
    }
    return (
      <OutlineButton onClick={claimLootCallback} height="48px" width="88px" primary>
        Claim
      </OutlineButton>
    )
  }, [claimLootCallback, selectList.length])

  const totalRewards = useMemo(() => {
    const NFTList = type === 'loot' ? lootList : mlootList
    const selectNFTs = NFTList
      ? NFTList.filter(({ tokenId }) => {
          return selectList.indexOf(tokenId?.toString()) !== -1
        })
      : []

    const rewards = selectNFTs.map(({ reward }) => {
      return reward
    })
    return rewards.length !== 0
      ? rewards.reduce((previousValue, currentValue) => {
          return previousValue && currentValue ? previousValue.add(currentValue) : undefined
        })
      : undefined
  }, [lootList, mlootList, selectList, type])
  return (
    <Modal closeIcon maxWidth="512px">
      <Box sx={{ padding: 40, color: '#fff' }}>
        <Typography variant="h4" color={'#fff'} fontWeight={600} fontSize={24}>
          Claim AGLD
        </Typography>
        <FlexBetween>
          <Typography>Please select the collection</Typography>
          <Select
            defaultValue={'loot'}
            value={type}
            width="150px"
            height={'32px'}
            style={{
              background: 'transparent',
              border: '1px solid #A5FFBE'
            }}
          >
            <MenuItem value={'loot'} onClick={() => setType(NFTType.LOOT)}>
              Loot
            </MenuItem>
            <MenuItem value={'mloot'} onClick={() => setType(NFTType.MLOOT)}>
              Loot More
            </MenuItem>
          </Select>
        </FlexBetween>
        <Box sx={{ borderBottom: '1px solid #5D8866' }} mt={16} mb={25} />

        {!currentNFTList.length && <NoData />}
        <Box display={'grid'} gap="20px">
          {currentNFTList.map(({ tokenId, reward }) => {
            const claimCountData = stakedCounts
              ? stakedCounts.find(({ id }) => {
                  return id.toString() === tokenId.toString()
                })
              : undefined
            return (
              <FlexBetween key={tokenId}>
                <Checkbox
                  disabled={!reward || reward?.equalTo(JSBI.BigInt(0))}
                  checked={selectList.includes(tokenId)}
                  label={`Bag #${tokenId}`}
                  onChange={() => toggleSelectList(tokenId)}
                />
                <FlexBetween>
                  <Typography fontSize={18}>{reward?.toSignificant().toString()}</Typography>/
                  <Typography marginTop={'5px'} color={''} fontSize={12}>
                    {claimCountData?.unClaimEpoch.split(',').length ?? ''}
                  </Typography>
                </FlexBetween>
              </FlexBetween>
            )
          })}
        </Box>

        <Box sx={{ borderBottom: '1px solid #5D8866' }} mt={32} mb={32} />

        <Box display={'grid'} gap="15px" justifyItems={'center'}>
          <Typography textAlign={'center'} fontSize={16}>
            AGLD Claim : {totalRewards ? totalRewards.toSignificant() : '--'}
          </Typography>
          {btn}
          <Typography color="#FF5530" sx={{ opacity: selectList.length ? 0 : 1 }} textAlign={'center'}>
            Please select NFT
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}
