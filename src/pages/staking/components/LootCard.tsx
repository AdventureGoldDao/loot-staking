import { ButtonBase, styled } from '@mui/material'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import Progress from 'components/Progress'
import useModal from 'hooks/useModal'
import { useStaking } from 'hooks/useStaking'
import { useCallback } from 'react'
import { useNFTInfo } from '../../../hooks/useNFT'
//import { useNFTInfo } from '../../../hooks/useNFT'

const LootCardStyle = styled('div')({
  flex: 1,
  '.loot-card-box': {
    background: 'rgba(55, 65, 47, 0.5)',
    borderRadius: 20,
    padding: 25
  },
  '.loot-card-img-box': {
    width: 205,
    height: 205,
    margin: '0 auto'
  },
  '.loot-card-img-box img': {
    width: '100%',
    height: '100%'
  },
  '.loot-card-title': {
    marginTop: 10,
    marginBottom: 16,
    color: '#fff'
  }
})

interface IProps {
  imgsrc: string
  title: string
  progress: number
  isstaked: boolean
  tokenId: string
}

const StakeButton = styled(ButtonBase)({
  border: 'none',
  width: '100%',
  background: 'linear-gradient(265.56deg, #24F986 -0.27%, #1EF65B -0.26%, #00D060 98.59%)',
  padding: '5px 32px',
  fontSize: 16,
  color: '#fff',
  marginTop: 20,
  borderRadius: '10px',
  '&:disabled': {
    background: 'linear-gradient(265.56deg, #24F986 -0.27%, #17B944 -0.26%, #058942 98.59%)',
    cursor: 'not-allowed'
  }
})

export default function LootCard(props: IProps) {
  const { showModal, hideModal } = useModal()
  const { signalLootStake } = useStaking()
  const { isStake } = useNFTInfo('123', false)
  console.log('isStake', isStake)
  const handleStake = useCallback(async () => {
    showModal(<TransactionPendingModal />)
    signalLootStake(1111)
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
  }, [hideModal, showModal, signalLootStake])

  return (
    <LootCardStyle>
      <div className={'loot-card-box'}>
        <div className={'loot-card-img-box'}>
          <img src={props.imgsrc} />
        </div>
        <p className={'loot-card-title'}>{props.title}</p>
        <Progress val={props.progress} total={7}></Progress>
        <StakeButton disabled={props.isstaked} onClick={handleStake}>
          {props.isstaked ? 'Staked' : 'Stake'}
        </StakeButton>
      </div>
    </LootCardStyle>
  )
}
