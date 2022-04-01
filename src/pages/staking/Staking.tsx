import stakingntftitle from './assets/staking-ntf-title.svg'
import iconmaster from './assets/icon-master.svg'
import loottitle from './assets/loot-title.svg'
import boredtitle from './assets/bored-title.svg'
import icondamons from './assets/icon-damons.svg'
import { BlackButton } from 'components/Button/Button'
import ActionButton from 'components/Button/ActionButton'
import { LookCardGroup } from './components/LookCardGroup'
import { Box, ButtonBase, Grid, styled } from '@mui/material'
import { useMyNFTs } from '../../hooks/useNFT'
// import { useAccountLootIds } from 'hooks/useBlockVision'
// import { useLootNFTDetail } from 'hooks/useNFTInfo'

const StakingWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '1120px',
  margin: '0 auto',
  minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.footer})`,
  padding: '60px 0 80px',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  '.staking-ntf-box': {
    position: 'resolve',
    paddingBottom: 50,
    borderBottom: `3px solid #253A27`
  },
  '.staking-ntf-box-title': {
    width: 486,
    height: 50
  },
  '.staking-ntf-box-desc': {
    color: '#B7B7B7',
    marginTop: 0
  },
  '.staking-ntf-box-icon': {
    top: 40,
    position: 'absolute',
    right: '0'
  },
  '#main-box': {
    marginTop: 70
  },
  '.column-main-box': {
    flex: 1
  },
  '#column-box-header': {
    paddingBottom: 31,
    borderBottom: `1px solid #253A27`
  },
  '.column-header-data': {
    marginRight: 20
  },
  '.column-header-data-text': {
    fontStyle: 'normal'
  },
  '.column-header-data-icon': {
    verticalAlign: '-6px',
    marginRight: '6px'
  },
  '.column-header-more': {
    border: 'none',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    verticalAlign: 2
  },
  '.bored-box': {
    marginTop: 70
  },
  '#column-box-body': {
    marginTop: 40
  },
  '.no-bored-box': {
    color: '#B7B7B7',
    fontSize: 16,
    textAlign: 'center'
  },
  '.no-bored-box-desc': {
    marginBottom: 34
  },
  '.column-content': {
    flex: 1,
    marginLeft: 48
  },
  '.column-item-box': {
    padding: 40,
    backgroundColor: `#37412F`,
    borderRadius: 20
  },
  '.column-item-box .grid-item-box': {
    color: '#fff',
    marginTop: 24,
    fontSize: 14
  },
  '.column-item-box .grid-item-box:first-of-type': {
    marginTop: 0
  },
  '.column-item-box .grid-item-box .grid-item-title': {
    textAlign: 'left'
  },
  '.column-item-box .grid-item-box .grid-item-value': {
    textAlign: 'right'
  },
  '.column-item-footer': {
    textAlign: 'center',
    borderTop: '1px solid #253A27',
    paddingTop: 30,
    marginTop: 54
  },
  '.earned-item-box': {
    marginTop: '0 !important'
  },
  '.earned-item-value': {
    color: '#B7B7B7'
  },
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
    paddingTop: 20
  }
}))

function GridItem(props: { title?: string; value: string }) {
  return (
    <Grid className={'grid-item-box'} container>
      <Grid className={'grid-item-title'} item xs={4}>
        {props.title}
      </Grid>
      <Grid className={'grid-item-value'} item xs={8}>
        {props.value}
      </Grid>
    </Grid>
  )
}

export const Staking = () => {
  // const res1 = useAccountLootIds('loot')
  // console.log('🚀 ~ file: Staking.tsx ~ line 136 ~ Staking ~ res', res1)
  // const res = useLootNFTDetail('loot', '300')
  // console.log('🚀 ~ file: Staking.tsx ~ line 139 ~ Staking ~ res', res)

  useMyNFTs()

  return (
    <StakingWrapper>
      <div className={'staking-ntf-box'}>
        <img className={'staking-ntf-box-title'} src={stakingntftitle} alt={'Staking NFT to get rewards'} />
        <p className={'staking-ntf-box-desc'}>Receive earning by signing in every week</p>
        <BlackButton>Learn More</BlackButton>
        <img className={'staking-ntf-box-icon'} src={iconmaster} alt={''} />
      </div>
      <Box id={'main-box'} display="flex">
        <div className={'column-main-box'}>
          <div className={'column-box'}>
            <Box id={'column-box-header'} display="flex" justifyContent={'space-between'}>
              <img src={loottitle} alt={'Loot (for Adventures)'} />
              <span className={'column-header-right'}>
                <span className={'column-header-data'}>
                  <img className={`column-header-data-icon`} src={icondamons} alt={'damons'} />
                  <i className={'column-header-data-text'}>60%</i>
                </span>
                <ButtonBase className={'column-header-more'}>More</ButtonBase>
              </span>
            </Box>
            <LookCardGroup />
          </div>
          <div className={'column-box bored-box'}>
            <Box id={'column-box-header'} display="flex" justifyContent={'space-between'}>
              <img src={boredtitle} alt={'Bored Ape Yacht Club'} />
              <span className={'column-header-right'}>
                <span className={'column-header-data'}>
                  <img className={`column-header-data-icon`} src={icondamons} alt={'damons'} />
                  <i className={'column-header-data-text'}>40%</i>
                </span>
                <ButtonBase className={'column-header-more'}>More</ButtonBase>
              </span>
            </Box>
            <Box id={'column-box-body'}>
              <div className={'no-bored-box'}>
                <p className={'no-bored-box-desc'}>No “Bored Ape Yacht Club” found in your wallet</p>
                <ActionButton
                  width={`205px`}
                  height={`30px`}
                  actionText={'Buy'}
                  onAction={function() {
                    window.open('https://opensea.io/collection/lootproject')
                  }}
                ></ActionButton>
              </div>
            </Box>
          </div>
        </div>
        <div className={'column-content'}>
          <div className={'column-item-box'}>
            <GridItem title={'Time to reward'} value={'01d 23h 22m 12s'}></GridItem>
            <GridItem title={'My NFT staked'} value={'5'}></GridItem>
            <GridItem title={'Staked value'} value={'13.3 ETH'}></GridItem>
            <GridItem title={'Expected to earn (staked 7 days)'} value={'20.33 AGLD'}></GridItem>
            <div className="column-item-footer">
              <GridItem title={'AGLD earned'} value={'100.33 AGLD'}></GridItem>
              <Grid className={'grid-item-box earned-item-box'} container>
                <Grid className={'grid-item-title'} item xs={4}></Grid>
                <Grid className={'grid-item-value earned-item-value'} item xs={8}>
                  ≈$130
                </Grid>
              </Grid>
              <Box marginTop={'47px'}>
                <ActionButton
                  width={`280px`}
                  height={`48px`}
                  actionText={'Claim'}
                  onAction={function() {}}
                ></ActionButton>
              </Box>
            </div>
          </div>
        </div>
      </Box>
    </StakingWrapper>
  )
}
