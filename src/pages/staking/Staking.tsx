import stakingntftitle from './assets/staking-ntf-title.svg'
import iconmaster from './assets/icon-master.svg'
import loottitle from './assets/loot-title.svg'
import boredtitle from './assets/bored-title.svg'
import icondamons from './assets/icon-damons.svg'
import { BlackButton } from 'components/Button/Button'
import LootCard from './components/LootCard'
import ActionButton from 'components/Button/ActionButton'
import { Box, ButtonBase, styled } from '@mui/material'

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
      'padding-bottom': 31,
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
      'vertical-align': 2
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
      flex: 1
    },
    [theme.breakpoints.down('md')]: {
      minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
      paddingTop: 20
    }
  }))

export const Staking = () => {
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
                                        onAction={function () { }}
                                    ></ActionButton>
                                </div>
                            </Box>
                        </div>
                    </div>
                    <div className={'column-content'}></div>
                </Box>
        </StakingWrapper>
    )
}
