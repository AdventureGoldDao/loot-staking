import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'
import { styled } from '@mui/system'
import OutlineButton from 'components/Button/OutlineButton'

const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const Text = styled(Typography)({
  fontSize: '20px',
  fontFamily: 'Inconsolata-VariableFont',
  fontWeight: 400
})

export default function InfoModal({
  shared,
  price,
  cap,
  openseaUrl,
  address,
  totalStaked
}: {
  shared: string
  price: string | undefined
  cap: string | undefined
  openseaUrl: string
  address: string
  totalStaked: string | undefined
}) {
  return (
    <Modal closeIcon maxWidth="512px">
      <Box sx={{ padding: 40, color: '#fff' }}>
        <Typography variant="h4" textAlign={'center'} color={'#fff'} fontWeight={600} fontSize={24}>
          Loot (for Adventures)
        </Typography>
        <Box sx={{ borderBottom: '1px solid #5D8866' }} mt={16} mb={25} />
        <Box display={'grid'} gap="24px">
          <FlexBetween>
            <Text>Floor price</Text>
            <Text>{price} ETH</Text>
          </FlexBetween>
          <FlexBetween>
            <Text>Floor market cap</Text>
            <Text>{(Number(price) * Number(cap)).toString()} ETH</Text>
          </FlexBetween>
          <FlexBetween>
            <Text>Reward share</Text>
            <Text>{shared}%</Text>
          </FlexBetween>
          <FlexBetween>
            <Text>Total staked</Text>
            <Text>{totalStaked ?? '--'}</Text>
          </FlexBetween>
          <FlexBetween>
            <Text>Stake value</Text>
            <Text>{totalStaked && price ? Number(totalStaked) * Number(price) : '--'} ETH</Text>
          </FlexBetween>
        </Box>
        <Box mt={48} display="flex" justifyContent={'space-around'}>
          <OutlineButton width={'152px'} height="48px" primary onClick={() => window.open(openseaUrl)}>
            View at Opensea
          </OutlineButton>
          <OutlineButton width={'152px'} height="48px" primary onClick={() => window.open(address)}>
            View Contract
          </OutlineButton>
        </Box>
      </Box>
    </Modal>
  )
}
