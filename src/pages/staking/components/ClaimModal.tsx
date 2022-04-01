import { Box, MenuItem, Typography } from '@mui/material'
import Modal from 'components/Modal'
import { styled } from '@mui/system'
import Select from 'components/Select/Select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LootType } from 'hooks/useNFTInfo'
import Checkbox from 'components/Checkbox'
import NoData from 'components/NoData'
import OutlineButton from 'components/Button/OutlineButton'

const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const list = [
  { name: 'Bag #1', id: '1', days: 'Staked 7 days' },
  { name: 'Bag #2', id: '2', days: 'Staked 5 days' },
  { name: 'Bag #3', id: '3', days: 'Staked 6 days' }
]
export default function ClaimModal() {
  const [type, setType] = useState<LootType>('loot')
  const [selectList, setSelectList] = useState<string[]>([])

  useEffect(() => {
    setSelectList([])
  }, [type])

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

  const claimLoot = useCallback((list: string[]) => {
    list
  }, [])
  const claimLootMore = useCallback((list: string[]) => {
    list
  }, [])

  const btn = useMemo(() => {
    if (!selectList.length) {
      return (
        <OutlineButton disabled height="48px" width="88px" primary>
          Claim
        </OutlineButton>
      )
    }
    return (
      <OutlineButton
        onClick={() => {
          type === 'loot' ? claimLoot(selectList) : claimLootMore(selectList)
        }}
        height="48px"
        width="88px"
        primary
      >
        Claim
      </OutlineButton>
    )
  }, [claimLoot, claimLootMore, selectList, type])

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
            <MenuItem value={'loot'} onClick={() => setType('loot')}>
              Loot
            </MenuItem>
            <MenuItem value={'lootm'} onClick={() => setType('lootm')}>
              Loot More
            </MenuItem>
          </Select>
        </FlexBetween>
        <Box sx={{ borderBottom: '1px solid #5D8866' }} mt={16} mb={25} />

        {!list.length && <NoData />}
        <Box display={'grid'} gap="20px">
          {list.map(item => (
            <FlexBetween key={item.id}>
              <Checkbox
                checked={selectList.includes(item.id)}
                label={item.name}
                onChange={() => toggleSelectList(item.id)}
              />
              <Typography fontSize={18}>{item.days}</Typography>
            </FlexBetween>
          ))}
        </Box>

        <Box sx={{ borderBottom: '1px solid #5D8866' }} mt={32} mb={32} />

        <Box display={'grid'} gap="15px" justifyItems={'center'}>
          <Typography textAlign={'center'} fontSize={16}>
            AGLD earned :100 AGLD
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
