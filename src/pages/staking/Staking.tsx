import stakingntftitle from './assets/staking-ntf-title.svg'
import iconmaster from './assets/icon-master.svg'
//import boredtitle from './assets/bored-title.svg'
import icondamons from './assets/icon-damons.svg'
import Button, { BlackButton } from 'components/Button/Button'
//import ActionButton from 'components/Button/ActionButton'
import { NFT, useMyNFTs } from '../../hooks/useNFT'
// import { useAccountLootIds } from 'hooks/useBlockVision'
// import { useLootNFTDetail } from 'hooks/useNFTInfo'
import { Alert, Box, ButtonBase, Collapse, Grid, styled, Typography } from '@mui/material'
import LootCard from './components/LootCard'
import Spinner from 'components/Spinner'
import NoData from 'components/NoData'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import { useStaking, useStakingInfo } from 'hooks/useStaking'
import { useBlockNumber, useWalletModalToggle } from 'state/application/hooks'
import { ExternalLink } from 'theme/components'
import ClaimModal from './components/ClaimModal'
import InfoModal from './components/InfoModal'
import useBreakpoint from 'hooks/useBreakpoint'
import { HideOnMobile, ShowOnMobile } from 'theme'
import { Timer } from '../../components/Timer'
import { NFTSkeleton } from '../../components/skeleton/NFTSkeleton'
import { useProjectInfo } from '../../hooks/useOpensea'
import { CurrencyAmount } from '../../constants/token'
import { getStakeCount, NFTType, StakeCount } from '../../utils/graph'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import JSBI from 'jsbi'

const StakingWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // width: '1120px',
  maxWidth: '1120px',
  width: '100%',
  margin: '0 auto',
  minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.footer})`,
  padding: '30px 0 80px',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  '.staking-ntf-box-title': {
    width: 486,
    height: 50
  },
  '.staking-ntf-box-desc': {
    color: '#B7B7B7',
    marginTop: 0
  },
  '#main-box': {
    marginTop: 70
  },
  '.column-main-box': {
    flex: 1
  },
  '#column-box-header': {
    paddingBottom: 15,
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
    marginTop: 22
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
    // flex: 1,
    // marginLeft: 48
  },
  '.column-item-box': {
    // padding: '50px 40px',
    backgroundColor: `#37412F`,
    background: 'rgba(55, 65, 47, 0.5)',
    backdropFilter: 'blur(64px)',
    /* Note: backdrop-filter has minimal browser support */
    borderRadius: 20
  },
  '.column-item-box .grid-item-box': {
    color: '#fff',
    marginTop: 24,
    fontSize: 20,
    [theme.breakpoints.down('md')]: {
      fontSize: 14
    }
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
    paddingTop: 20,
    marginTop: 54,
    [theme.breakpoints.down('md')]: {
      marginTop: 20
    }
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
  const matches = useBreakpoint('md')
  const [isExtraVisible, setIsExtraVisible] = useState<boolean>(false)

  const lootData = useProjectInfo('lootproject')
  const mlootData = useProjectInfo('mloot-1')
  const { numLootStaked, numMLootStaked, totalReward, perLootReward, permLootReward } = useStakingInfo()
  const myLoot = useMyNFTs('loot')
  const myLootM = useMyNFTs('mloot')
  const { account, chainId } = useActiveWeb3React()
  const { rewardPerEpoch, nextTime, isActive } = useStakingInfo()

  const toggleWalletModal = useWalletModalToggle()

  const [stakedLootCount, stakedMLootCount] = useMemo(() => {
    const lootCount = myLoot.nfts.filter(({ isStaked }) => {
      return isStaked
    })
    const mlootCount = myLootM.nfts.filter(({ isStaked }) => {
      return isStaked
    })
    return [lootCount.length, mlootCount.length]
  }, [myLoot.nfts, myLootM.nfts])

  const myCurrentEpochRewards = useMemo(() => {
    const totalLootRewards = JSBI.multiply(JSBI.BigInt(perLootReward), JSBI.BigInt(stakedLootCount.toString()))
    const totalMLootRewards = JSBI.multiply(JSBI.BigInt(permLootReward), JSBI.BigInt(stakedMLootCount.toString()))
    return CurrencyAmount.ether(JSBI.add(totalLootRewards, totalMLootRewards).toString())
  }, [perLootReward, permLootReward, stakedLootCount, stakedMLootCount])

  const myStakedTotalValue = useMemo(() => {
    const lootValue = parseInt(stakedLootCount?.toString() ?? '0') * parseFloat(lootData?.result?.floorPrice ?? '0')
    const mLootValue = parseInt(stakedMLootCount?.toString() ?? '0') * parseFloat(mlootData?.result?.floorPrice ?? '0')
    return lootValue + mLootValue
  }, [lootData?.result?.floorPrice, mlootData?.result?.floorPrice, stakedLootCount, stakedMLootCount])

  // const myStakedNFTCount = useMemo(() => {
  //   const lootCount = myLoot.nfts.filtermyStakedTotalValue(({ isStaked }) => {
  //     return isStaked
  //   })
  //   const mlootCount = myLootM.nfts.filter(({ isStaked }) => {
  //     return isStaked
  //   })
  //   return lootCount.length + mlootCount.length
  // }, [myLoot.nfts, myLootM.nfts])

  // const unClaimRewards = useMemo(() => {
  //   const lootReward = myLoot.nfts.map(({ reward }) => {
  //     return reward
  //   })
  //   const mlootReward = myLootM.nfts.map(({ reward }) => {
  //     return reward
  //   })
  //
  //   const lootRewardsCurrency =
  //     lootReward.length !== 0
  //       ? lootReward.reduce((previousValue, currentValue) => {
  //           return previousValue && currentValue ? previousValue.add(currentValue) : undefined
  //         })
  //       : CurrencyAmount.ether('0')
  //   const mlootRewardsCurrency =
  //     mlootReward.length !== 0
  //       ? mlootReward.reduce((previousValue, currentValue) => {
  //           return previousValue && currentValue ? previousValue.add(currentValue) : undefined
  //         })
  //       : CurrencyAmount.ether('0')
  //
  //   return lootRewardsCurrency && mlootRewardsCurrency
  //     ? lootRewardsCurrency.add(mlootRewardsCurrency)
  //     : CurrencyAmount.ether('0')
  // }, [myLoot.nfts, myLootM.nfts])

  const [selectedLootNFT, setSelectedLootNFT] = useState<string[]>([])
  const toggleSelectLoot = useCallback(
    (id: string) => {
      const _has = selectedLootNFT.includes(id)
      if (!_has) {
        setSelectedLootNFT([...selectedLootNFT, id])
      } else {
        setSelectedLootNFT(selectedLootNFT.filter(i => i !== id))
      }
    },
    [selectedLootNFT]
  )

  const [selectedLootMoreNFT, setSelectedLootMoreNFT] = useState<string[]>([])
  const toggleSelectLootMore = useCallback(
    (id: string) => {
      const _has = selectedLootMoreNFT.includes(id)
      if (!_has) {
        setSelectedLootMoreNFT([...selectedLootMoreNFT, id])
      } else {
        setSelectedLootMoreNFT(selectedLootMoreNFT.filter(i => i !== id))
      }
    },
    [selectedLootMoreNFT]
  )

  useEffect(() => {
    setSelectedLootNFT([])
    setSelectedLootMoreNFT([])
  }, [account, chainId])

  const { showModal, hideModal } = useModal()
  const { signalLootStake, signalLootMoreStake, claimLoot, claimed } = useStaking()

  const stakeLootCallback = useCallback(async () => {
    if (!selectedLootNFT.length) return
    showModal(<TransactionPendingModal />)
    signalLootStake(selectedLootNFT)
      .then(() => {
        hideModal()
        setSelectedLootNFT([])
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [hideModal, selectedLootNFT, showModal, signalLootStake])

  const stakeLootMoreCallback = useCallback(async () => {
    if (!selectedLootMoreNFT.length) return
    showModal(<TransactionPendingModal />)
    signalLootMoreStake(selectedLootMoreNFT)
      .then(() => {
        hideModal()
        setSelectedLootMoreNFT([])
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [hideModal, selectedLootMoreNFT, showModal, signalLootMoreStake])

  const claimLootCallback = useCallback(async () => {
    showModal(<TransactionPendingModal />)
    claimLoot()
      .then(() => {
        hideModal()
        setSelectedLootMoreNFT([])
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [claimLoot, hideModal, showModal])

  const stakeLootBtn = useMemo(() => {
    if (!account)
      return (
        <Button onClick={toggleWalletModal} width={matches ? '150px' : '205px'} borderRadius="10px" height="30px">
          Connect Wallet
        </Button>
      )
    if (!isActive)
      return (
        <Button
          disabled
          onClick={toggleWalletModal}
          width={matches ? '150px' : '205px'}
          borderRadius="10px"
          height="30px"
        >
          end
        </Button>
      )
    if (!selectedLootNFT.length)
      return (
        <Button disabled width={matches ? '60px' : '205px'} borderRadius="10px" height="30px">
          Stake
        </Button>
      )
    return (
      <Button onClick={stakeLootCallback} width={matches ? '60px' : '205px'} borderRadius="10px" height="30px">
        Stake
      </Button>
    )
  }, [account, toggleWalletModal, matches, selectedLootNFT.length, isActive, stakeLootCallback])

  const stakeLootMoreBtn = useMemo(() => {
    if (!account)
      return (
        <Button onClick={toggleWalletModal} width={matches ? '150px' : '205px'} borderRadius="10px" height="30px">
          Connect Wallet
        </Button>
      )
    if (!isActive)
      return (
        <Button
          disabled
          onClick={toggleWalletModal}
          width={matches ? '150px' : '205px'}
          borderRadius="10px"
          height="30px"
        >
          end
        </Button>
      )
    if (!selectedLootMoreNFT.length)
      return (
        <Button disabled width={matches ? '60px' : '205px'} borderRadius="10px" height="30px">
          Stake
        </Button>
      )
    return (
      <Button
        disabled={!isActive}
        onClick={stakeLootMoreCallback}
        width={matches ? '60px' : '205px'}
        borderRadius="10px"
        height="30px"
      >
        Stake
      </Button>
    )
  }, [account, toggleWalletModal, matches, selectedLootMoreNFT.length, isActive, stakeLootMoreCallback])

  return (
    <StakingWrapper>
      <Alert
        sx={{ width: { xs: '92%' }, margin: { xs: 'auto' }, fontFamily: 'Inconsolata-VariableFont' }}
        variant="outlined"
        severity="info"
      >
        Please note that the current dApp is on GÖRLI testnet.
      </Alert>
      <Box
        className={'staking-ntf-box'}
        sx={{
          padding: { xs: '28px 0px 40px 0px', md: '0 0 40px 0' },
          margin: { xs: '0 41px 0 40px', md: '0' },
          borderBottom: '3px solid #253A27',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ marginTop: 20 }}>
          <Box
            component="img"
            src={stakingntftitle}
            sx={{
              width: { xs: '280px', md: '486px' },
              height: { xs: '29px', md: '50px' }
            }}
            alt={'Staking NFT to get rewards'}
          />
          <p className={'staking-ntf-box-desc'}>Receive earning by signing in every week</p>
          <BlackButton
            onClick={() => {
              window.open('https://mirror.xyz/agld.eth', '_blank')
            }}
            borderRadius={matches ? '16px' : '10px'}
            width={matches ? '111px' : '134px'}
            height={matches ? '32px' : '47px'}
            fontSize={matches ? '12px' : '16px'}
          >
            Learn More
          </BlackButton>
          <Button
            disabled={claimed}
            style={{ marginLeft: 20 }}
            width={matches ? '111px' : '134px'}
            height={matches ? '32px' : '47px'}
            fontSize={matches ? '12px' : '16px'}
            onClick={claimLootCallback}
          >
            {claimed ? 'Claimed' : 'Claim Test Loot'}
          </Button>
        </Box>

        <Box
          component="img"
          src={iconmaster}
          className={'staking-ntf-box-icon'}
          sx={{
            display: { xs: 'none', md: 'inline' },
            marginRight: { xs: '0', md: '173px' }
          }}
          alt={'Staking NFT to get rewards'}
        />
      </Box>
      <Box
        id={'main-box'}
        sx={{
          display: 'flex',
          flexWrap: 'wrap-reverse',
          columnGap: '48px',
          justifyContent: 'center',
          rowGap: '62px',
          paddingLeft: { xs: '40px', md: '0' },
          paddingRight: { xs: '41px', md: '0' },
          marginTop: { xs: '40px', md: '70px' }
        }}
      >
        <div className={'column-main-box'}>
          <div className={'column-box'}>
            <Box id={'column-box-header'} display="flex" justifyContent={'space-between'}>
              <Typography
                variant={'h4'}
                fontWeight={600}
                color="#fff"
                sx={{ fontSize: { xs: 16, md: 24 }, fontFamily: 'Inconsolata-VariableFont' }}
              >
                Loot (for Adventures)
              </Typography>
              <span className={'column-header-right'}>
                <span className={'column-header-data'}>
                  <img className={`column-header-data-icon`} src={icondamons} alt={'damons'} />
                  <i className={'column-header-data-text'}>99.75%</i>
                </span>
                <ButtonBase
                  className={'column-header-more'}
                  onClick={() =>
                    showModal(
                      <InfoModal
                        title={'Loot (for Adventures)'}
                        totalStaked={numLootStaked}
                        openseaUrl={'https://opensea.io/collection/lootproject'}
                        address={'https://rinkeby.etherscan.io/address/0x84e3547f63ad6e5a1c4fe82594977525c764f0e8'}
                        cap={lootData?.result?.totalSupply}
                        price={lootData?.result?.floorPrice}
                        shared={'99.75'}
                      />
                    )
                  }
                >
                  Info
                </ButtonBase>
              </span>
            </Box>
            <Box display={'flex'} mt={'22px'} justifyContent="space-between" alignItems={'center'}>
              <Typography variant={'h5'} fontWeight={600} fontSize={16} color="#fff">
                Please select the NFT to be staked:
              </Typography>
              {stakeLootBtn}
            </Box>
            {myLoot.loading && (
              <Box display={'flex'} justifyContent="center" mt={'20px'} mb="20px">
                <Spinner size={40} />
              </Box>
            )}
            {!myLoot.loading && (!myLoot.nfts || !myLoot.nfts.length) && <NoData />}
            {!myLoot.loading && (
              <ShowNFTList
                selectedList={selectedLootNFT}
                toggleSelect={toggleSelectLoot}
                nfts={myLoot.nfts || []}
                type={NFTType.LOOT}
              />
            )}
          </div>

          <Box className={'column-box'} mt="70px">
            <Box id={'column-box-header'} display="flex" justifyContent={'space-between'}>
              <Typography fontWeight={600} color="#fff" sx={{ fontSize: { xs: 16, md: 24 } }}>
                More Loot
              </Typography>
              <span className={'column-header-right'}>
                <span className={'column-header-data'}>
                  <img className={`column-header-data-icon`} src={icondamons} alt={'damons'} />
                  <i className={'column-header-data-text'}>0.025%</i>
                </span>
                <ButtonBase
                  className={'column-header-more'}
                  onClick={() =>
                    showModal(
                      <InfoModal
                        title={'More Loot'}
                        totalStaked={numMLootStaked}
                        openseaUrl={'https://opensea.io/collection/mloot-1'}
                        address={'https://rinkeby.etherscan.io/address/0xd991eafe6b2d36f786365e0ceb3b6dbe61097c90 '}
                        cap={mlootData?.result?.totalSupply}
                        price={mlootData?.result?.floorPrice}
                        shared="0.025"
                      />
                    )
                  }
                >
                  Info
                </ButtonBase>
              </span>
            </Box>
            <Box display={'flex'} mt={'22px'} justifyContent="space-between" alignItems={'center'}>
              <Typography variant={'h5'} fontWeight={600} fontSize={16} color="#fff">
                Please select the NFT to be staked:
              </Typography>
              {stakeLootMoreBtn}
            </Box>
            {myLootM.loading && (
              <Box display={'flex'} justifyContent="center" mt={'20px'} mb="20px">
                <Spinner size={40} />
              </Box>
            )}
            {!myLootM.loading && (!myLootM.nfts || !myLootM.nfts.length) && <NoData />}
            {!myLootM.loading && (
              <ShowNFTList
                selectedList={selectedLootMoreNFT}
                toggleSelect={toggleSelectLootMore}
                nfts={myLootM.nfts || []}
                type={NFTType.MLOOT}
              />
            )}
          </Box>
        </div>

        <Box /* className={'column-content'} */ sx={{ width: '100%', maxWidth: '508px' }}>
          <Box display="grid" gap="20px">
            <Box className={'column-item-box'} sx={{ padding: { xs: '50px 21px 44px 20px', md: '50px 40px' } }}>
              <Grid className={'grid-item-box'} container>
                <Grid className={'grid-item-title'} item xs={4}>
                  Time to reward
                </Grid>
                <Grid className={'grid-item-value'} item xs={8}>
                  <Timer timer={Number(nextTime.toString()) * 1000} />
                </Grid>
              </Grid>
              <GridItem title={'My NFT staked'} value={(stakedLootCount + stakedMLootCount).toString()} />
              <GridItem title={'Staked value'} value={`${myStakedTotalValue} ETH`} />
              <GridItem
                title={'Expected to earn (staked 7 days)'}
                value={`${rewardPerEpoch ? rewardPerEpoch.toSignificant(6, { groupSeparator: ',' }) : '--'} AGLD`}
              />
              <div className="column-item-footer">
                <GridItem
                  title={'Current epoch AGLD earned'}
                  value={`${myCurrentEpochRewards.toSignificant(6, { groupSeparator: ',' })} AGLD`}
                />
                <Grid className={'grid-item-box earned-item-box'} container>
                  <Grid className={'grid-item-title'} item xs={4} />
                  <Grid className={'grid-item-value earned-item-value'} item xs={8}>
                    ≈$ --
                  </Grid>
                </Grid>

                <Box sx={{ marginTop: { xs: '43px', md: '47px' } }}>
                  <Button
                    width={matches ? '253px' : `280px`}
                    height={matches ? '32px' : `48px`}
                    style={{
                      fontSize: matches ? '12px' : '24px'
                    }}
                    onClick={() => showModal(<ClaimModal />)}
                  >
                    Claim
                  </Button>
                </Box>
              </div>

              <ShowOnMobile>
                <Collapse in={isExtraVisible}>
                  <Box sx={{ marginTop: '56px', marginBottom: '30px' }}>
                    <GridItem title={'Reward settlement time'} value={'2022-03-18 00:00:00 (UTC)'} />
                    <GridItem
                      title={'Total rewards for current epoch'}
                      value={`${rewardPerEpoch ? rewardPerEpoch.toSignificant() : '--'} AGLD`}
                    />
                    <GridItem
                      title={'Cumulative rewards'}
                      value={`${totalReward.toSignificant(6, { groupSeparator: ',' }) ?? '--'} AGLD`}
                    />
                    <GridItem title={'Halving date'} value={'2023-03-18'} />
                    <Box display={'flex'} flexDirection="row-reverse" mt={'40px'}>
                      <ExternalLink href="https://rinkeby.etherscan.io/address/0x84e3547f63ad6e5a1c4fe82594977525c764f0e8">
                        <Box display={'flex'} gap="10px">
                          <Typography>View Contract</Typography>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.07692 0C1.38462 0 0 1.38462 0 3.07692V16.1538C0 17.8462 1.38462 19.2308 3.07692 19.2308H11.5385C11.8462 19.2308 12.0769 19.1585 12.3077 19.1585C11.2308 18.9277 10.3123 18.3846 9.54308 17.6923H3.07692C2.23077 17.6923 1.53846 17 1.53846 16.1538V3.07692C1.53846 2.23077 2.23077 1.53846 3.07692 1.53846H7.93308C8.47154 1.69231 8.46154 2.38462 8.46154 3.07692V5.38462C8.46154 5.84615 8.76923 6.15385 9.23077 6.15385H11.5385C12.3077 6.15385 13.0769 6.15385 13.0769 6.92308V7.69231H13.4615C13.8462 7.69231 14.2308 7.76 14.6154 7.83692V6.15385C14.6154 5.30769 13.8554 4.52923 12.5477 3.22077C12.3169 3.06692 12.1538 2.84615 11.9231 2.69231C11.7692 2.46154 11.5477 2.29769 11.3938 2.06692C10.0869 0.76 9.30769 0 8.46154 0H3.07692ZM13.4615 9.23077C11.1538 9.23077 9.23077 11.1538 9.23077 13.4615C9.23077 15.7692 11.1538 17.6923 13.4615 17.6923C14.4408 17.6923 15.3346 17.33 16.0577 16.7546L16.2985 16.9954C16.2022 17.1381 16.1591 17.31 16.1766 17.4813C16.1942 17.6525 16.2714 17.8122 16.3946 17.9323L18.3177 19.8554C18.6254 20.1631 19.0677 20.1631 19.3754 19.8554L19.76 19.4708C20.0677 19.1631 20.0677 18.6969 19.76 18.3892L17.8369 16.4662C17.7242 16.3481 17.5747 16.272 17.413 16.2502C17.2512 16.2284 17.0869 16.2622 16.9469 16.3462L16.7308 16.1054C17.3254 15.3762 17.6923 14.4592 17.6923 13.4615C17.6923 11.1538 15.7692 9.23077 13.4615 9.23077ZM13.4615 10.3846C15.1538 10.3846 16.5385 11.7692 16.5385 13.4615C16.5385 15.1538 15.1538 16.5385 13.4615 16.5385C11.7692 16.5385 10.3846 15.1538 10.3846 13.4615C10.3846 11.7692 11.7692 10.3846 13.4615 10.3846Z"
                              fill="#A5FFBE"
                            />
                          </svg>
                        </Box>
                      </ExternalLink>
                    </Box>
                  </Box>
                </Collapse>

                <Box sx={{ textAlign: 'center', marginTop: '19px' }}>
                  <Button
                    style={{
                      background: 'transparent',
                      border: '1px solid #A5FFBE',
                      color: '#A5FFBE',
                      fontSize: '12px'
                    }}
                    width={matches ? '253px' : `280px`}
                    height={matches ? '32px' : `48px`}
                    onClick={() => {
                      setIsExtraVisible(!isExtraVisible)
                    }}
                  >
                    {isExtraVisible ? 'Hide' : 'Learn More'}
                  </Button>
                </Box>
              </ShowOnMobile>
            </Box>

            <HideOnMobile>
              <Box className={'column-item-box'} sx={{ padding: { xs: '50px 21px 44px 20px', md: '50px 40px' } }}>
                <GridItem title={'Reward settlement time'} value={'2022-03-18 00:00:00 (UTC)'}></GridItem>
                <GridItem
                  title={'Total Rewards for the current epoch'}
                  value={`${rewardPerEpoch ? rewardPerEpoch.toSignificant() : '--'} AGLD`}
                />
                <GridItem
                  title={'Cumulative Rewards released'}
                  value={`${totalReward.toSignificant(6, { groupSeparator: ',' }) ?? '--'} AGLD`}
                />
                <GridItem title={'Halving date'} value={'2023-03-18'}></GridItem>
                <Box display={'flex'} flexDirection="row-reverse" mt={'40px'}>
                  <ExternalLink href="https://rinkeby.etherscan.io/address/0x84e3547f63ad6e5a1c4fe82594977525c764f0e8">
                    <Box display={'flex'} gap="10px">
                      <Typography>View Contract</Typography>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3.07692 0C1.38462 0 0 1.38462 0 3.07692V16.1538C0 17.8462 1.38462 19.2308 3.07692 19.2308H11.5385C11.8462 19.2308 12.0769 19.1585 12.3077 19.1585C11.2308 18.9277 10.3123 18.3846 9.54308 17.6923H3.07692C2.23077 17.6923 1.53846 17 1.53846 16.1538V3.07692C1.53846 2.23077 2.23077 1.53846 3.07692 1.53846H7.93308C8.47154 1.69231 8.46154 2.38462 8.46154 3.07692V5.38462C8.46154 5.84615 8.76923 6.15385 9.23077 6.15385H11.5385C12.3077 6.15385 13.0769 6.15385 13.0769 6.92308V7.69231H13.4615C13.8462 7.69231 14.2308 7.76 14.6154 7.83692V6.15385C14.6154 5.30769 13.8554 4.52923 12.5477 3.22077C12.3169 3.06692 12.1538 2.84615 11.9231 2.69231C11.7692 2.46154 11.5477 2.29769 11.3938 2.06692C10.0869 0.76 9.30769 0 8.46154 0H3.07692ZM13.4615 9.23077C11.1538 9.23077 9.23077 11.1538 9.23077 13.4615C9.23077 15.7692 11.1538 17.6923 13.4615 17.6923C14.4408 17.6923 15.3346 17.33 16.0577 16.7546L16.2985 16.9954C16.2022 17.1381 16.1591 17.31 16.1766 17.4813C16.1942 17.6525 16.2714 17.8122 16.3946 17.9323L18.3177 19.8554C18.6254 20.1631 19.0677 20.1631 19.3754 19.8554L19.76 19.4708C20.0677 19.1631 20.0677 18.6969 19.76 18.3892L17.8369 16.4662C17.7242 16.3481 17.5747 16.272 17.413 16.2502C17.2512 16.2284 17.0869 16.2622 16.9469 16.3462L16.7308 16.1054C17.3254 15.3762 17.6923 14.4592 17.6923 13.4615C17.6923 11.1538 15.7692 9.23077 13.4615 9.23077ZM13.4615 10.3846C15.1538 10.3846 16.5385 11.7692 16.5385 13.4615C16.5385 15.1538 15.1538 16.5385 13.4615 16.5385C11.7692 16.5385 10.3846 15.1538 10.3846 13.4615C10.3846 11.7692 11.7692 10.3846 13.4615 10.3846Z"
                          fill="#A5FFBE"
                        />
                      </svg>
                    </Box>
                  </ExternalLink>
                </Box>
              </Box>
            </HideOnMobile>
          </Box>
        </Box>
      </Box>
    </StakingWrapper>
  )
}

function ShowNFTList({
  nfts,
  type,
  selectedList,
  toggleSelect
}: {
  nfts: NFT[]
  type: NFTType
  selectedList: string[]
  toggleSelect: (id: string) => void
}) {
  const { chainId } = useActiveWeb3React()
  const [nftIds, setNftIds] = useState<string[]>([])
  const blockNumber = useBlockNumber()

  useEffect(() => {
    const ids = nfts.map(({ tokenId }) => tokenId).filter(i => i) as string[]
    if (ids.toString() !== nftIds.toString()) setNftIds(ids)
  }, [nftIds, nfts])

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
    [nftIds, blockNumber]
  )
  return (
    <Box
      id={'column-box-body'}
      sx={{
        columnGap: { xs: 27, md: 50 },
        rowGap: { xs: 20, md: 45 },
        gridTemplateColumns: { xs: 'repeat(2, 133px)', md: 'repeat(2, 255px)' },
        justifyContent: 'center'
      }}
      display="grid"
      gridTemplateColumns={'1fr 1fr'}
      columnGap={50}
    >
      {nfts.map((nft, index) => {
        const countData = stakedCounts
          ? stakedCounts.find(({ id }) => {
              return id.toString() === nft.tokenId.toString()
            })
          : undefined
        return nft.metaData ? (
          <LootCard
            stakedCount={countData ? countData.count : '0'}
            key={nft.tokenId}
            nft={nft}
            type={type}
            selectedList={selectedList}
            toggleSelect={toggleSelect}
          />
        ) : (
          <NFTSkeleton key={index} />
        )
      })}
    </Box>
  )
}
