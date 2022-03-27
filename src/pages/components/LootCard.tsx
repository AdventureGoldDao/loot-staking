import { ButtonBase, styled } from '@mui/material'
import Progress from '../../components/Progress'

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
}

const StakeButton = styled(ButtonBase)({
  border: 'none',
  width: '100%',
  background: 'linear-gradient(265.56deg, #24F986 -0.27%, #1EF65B -0.26%, #00D060 98.59%)',
  padding: '5px 32px',
  fontSize: 16,
  color: '#fff',
  marginTop: 20,
  'border-radius': '10px',
  '&:disabled': {
    background: 'linear-gradient(265.56deg, #24F986 -0.27%, #17B944 -0.26%, #058942 98.59%)',
    cursor: 'not-allowed'
  }
})

export default function LootCard(props: IProps) {
  return (
    <LootCardStyle>
      <div className={'loot-card-box'}>
        <div className={'loot-card-img-box'}>
          <img src={props.imgsrc} />
        </div>
        <p className={'loot-card-title'}>{props.title}</p>
        <Progress val={props.progress} total={7}></Progress>
        <StakeButton disabled={props.isstaked}>{props.isstaked ? 'Staked' : 'Stake'}</StakeButton>
      </div>
    </LootCardStyle>
  )
}
