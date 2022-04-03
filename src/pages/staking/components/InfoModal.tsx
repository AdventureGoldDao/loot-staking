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
  fontSize: '20px'
})

export default function InfoModal({ shared }: { shared: string }) {
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
            <Text>1.6 ETH</Text>
          </FlexBetween>
          <FlexBetween>
            <Text>Floor market cap</Text>
            <Text>12,446.4 ETH</Text>
          </FlexBetween>
          <FlexBetween>
            <Text>Reward share</Text>
            <Text>{shared}%</Text>
          </FlexBetween>
          <FlexBetween>
            <Text>Total staked</Text>
            <Text>1.6 ETH</Text>
          </FlexBetween>
          <FlexBetween>
            <Text>Stake value</Text>
            <Text>1.6 ETH</Text>
          </FlexBetween>
        </Box>
        <Box mt={48} display="flex" justifyContent={'space-around'}>
          <OutlineButton width={'152px'} height="48px" primary onClick={() => window.open('/')}>
            View at Opensea
          </OutlineButton>
          <OutlineButton width={'152px'} height="48px" primary onClick={() => window.open('/')}>
            View Contract
          </OutlineButton>
        </Box>
      </Box>
    </Modal>
  )
}
