import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { styled, Box, ButtonBase } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import WarningModal from '../components/Modal/WarningModal'
import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
import stakingntftitle from '../assets/svg/staking-ntf-title.svg'
import iconmaster from '../assets/svg/icon-master.svg'
import loottitle from '../assets/svg/loot-title.svg'
import icondamons from '../assets/svg/icon-damons.svg'
import Footer from 'components/Footer'
import { BlackButton } from '../components/Button/Button'
import LootCard from './components/LootCard'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%',
  maxHeight: '100vh',
  overflow: 'auto',
  alignItems: 'center'
})

const BodyWrapper = styled('div')(({ theme }) => ({
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
  '#loot-box': {
    marginTop: 70
  },
  '.loot-column-box': {
    flex: 1
  },
  '#loot-column-box-header': {
    'padding-bottom': 31,
    borderBottom: `1px solid #253A27`
  },
  '.loot-column-header-data': {
    marginRight: 20
  },
  '.loot-column-header-data-text': {
    fontStyle: 'normal'
  },
  '.loot-column-header-data-icon': {
    verticalAlign: '-6px',
    marginRight: '6px'
  },
  '.loot-column-header-more': {
    border: 'none',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    'vertical-align': 2
  },
  '#loot-column-box-body': {
    marginTop: 40
  },
  '.loot-column-content': {
    flex: 1
  },
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
    paddingTop: 20
  }
}))

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app">
          <ContentWrapper>
            <Header />
            <BodyWrapper id="body">
              <div className={'staking-ntf-box'}>
                <img className={'staking-ntf-box-title'} src={stakingntftitle} alt={'Staking NFT to get rewards'} />
                <p className={'staking-ntf-box-desc'}>Receive earning by signing in every week</p>
                <BlackButton>Learn More</BlackButton>
                <img className={'staking-ntf-box-icon'} src={iconmaster} alt={''} />
              </div>
              <Box id={'loot-box'} display="flex">
                <div className={'loot-column-box'}>
                  <Box id={'loot-column-box-header'} display="flex" justifyContent={'space-between'}>
                    <img src={loottitle} alt={'Loot (for Adventures)'} />
                    <span className={'loot-column-header-right'}>
                      <span className={'loot-column-header-data'}>
                        <img className={'loot-column-header-data-icon'} src={icondamons} alt={'damons'} />
                        <i className={'loot-column-header-data-text'}>60%</i>
                      </span>
                      <ButtonBase className={'loot-column-header-more'}>More</ButtonBase>
                    </span>
                  </Box>
                  <Box id={'loot-column-box-body'} display="grid" gridTemplateColumns={'1fr 1fr'} columnGap={50}>
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
                </div>
                <div className={'loot-column-content'}></div>
              </Box>
              <Popups />
              <Polling />
              <WarningModal />
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/test1" component={ComingSoon} />
                </Switch>
              </Web3ReactManager>
            </BodyWrapper>
            <Footer />
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}
