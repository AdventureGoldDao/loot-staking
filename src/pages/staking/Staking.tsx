import stakingntftitle from './assets/staking-ntf-title.svg'
import iconmaster from './assets/icon-master.svg'
//import boredtitle from './assets/bored-title.svg'
import icondamons from './assets/icon-damons.svg'
import Button, { BlackButton } from 'components/Button/Button'
//import ActionButton from 'components/Button/ActionButton'
import { NFT, useMyNFTs } from '../../hooks/useNFT'
// import { useAccountLootIds } from 'hooks/useBlockVision'
// import { useLootNFTDetail } from 'hooks/useNFTInfo'
import { Box, ButtonBase, Grid, styled, Typography } from '@mui/material'
import LootCard from './components/LootCard'
import Spinner from 'components/Spinner'
import NoData from 'components/NoData'
import { LootType } from 'hooks/useNFTInfo'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import { useStaking } from 'hooks/useStaking'
import { useWalletModalToggle } from 'state/application/hooks'
import { ExternalLink } from 'theme/components'
import ClaimModal from './components/ClaimModal'
import InfoModal from './components/InfoModal'

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
    flex: 1,
    marginLeft: 48
  },
  '.column-item-box': {
    padding: '50px 40px',
    backgroundColor: `#37412F`,
    background: 'rgba(55, 65, 47, 0.5)',
    backdropFilter: 'blur(64px)',
    /* Note: backdrop-filter has minimal browser support */
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
    paddingTop: 20,
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
  const myLoot = useMyNFTs('loot')
  const myLootM = useMyNFTs('mloot')
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

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
  const { signalLootStake, signalLootMoreStake } = useStaking()

  const stakeLootCallback = useCallback(async () => {
    if (!selectedLootNFT.length) return
    showModal(<TransactionPendingModal />)
    signalLootStake(selectedLootNFT)
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
  }, [hideModal, selectedLootNFT, showModal, signalLootStake])

  const stakeLootMoreCallback = useCallback(async () => {
    if (!selectedLootMoreNFT.length) return
    showModal(<TransactionPendingModal />)
    signalLootMoreStake(selectedLootMoreNFT)
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
  }, [hideModal, selectedLootMoreNFT, showModal, signalLootMoreStake])

  const stakeLootBtn = useMemo(() => {
    if (!account)
      return (
        <Button onClick={toggleWalletModal} width="205px" borderRadius="10px" height="30px">
          Connect Wallet
        </Button>
      )
    if (!selectedLootNFT.length)
      return (
        <Button disabled width="205px" borderRadius="10px" height="30px">
          Stake
        </Button>
      )
    return (
      <Button onClick={stakeLootCallback} width="205px" borderRadius="10px" height="30px">
        Stake
      </Button>
    )
  }, [account, selectedLootNFT.length, stakeLootCallback, toggleWalletModal])

  const stakeLootMoreBtn = useMemo(() => {
    if (!account)
      return (
        <Button onClick={toggleWalletModal} width="205px" borderRadius="10px" height="30px">
          Connect Wallet
        </Button>
      )
    if (!selectedLootMoreNFT.length)
      return (
        <Button disabled width="205px" borderRadius="10px" height="30px">
          Stake
        </Button>
      )
    return (
      <Button onClick={stakeLootMoreCallback} width="205px" borderRadius="10px" height="30px">
        Stake
      </Button>
    )
  }, [account, selectedLootMoreNFT.length, stakeLootMoreCallback, toggleWalletModal])

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
              <Typography fontWeight={600} fontSize={24} color="#fff">
                Loot (for Adventures)
              </Typography>
              <span className={'column-header-right'}>
                <span className={'column-header-data'}>
                  <img className={`column-header-data-icon`} src={icondamons} alt={'damons'} />
                  <i className={'column-header-data-text'}>60%</i>
                </span>
                <ButtonBase className={'column-header-more'} onClick={() => showModal(<InfoModal />)}>
                  More
                </ButtonBase>
              </span>
            </Box>
            <Box display={'flex'} mt={'22px'} justifyContent="space-between" alignItems={'center'}>
              <Typography fontWeight={600} fontSize={16} color="#fff">
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
                type="loot"
              />
            )}
          </div>

          <Box className={'column-box'} mt="70px">
            <Box id={'column-box-header'} display="flex" justifyContent={'space-between'}>
              <Typography fontWeight={600} fontSize={24} color="#fff">
                LootM (for Adventures)
              </Typography>
              <span className={'column-header-right'}>
                <span className={'column-header-data'}>
                  <img className={`column-header-data-icon`} src={icondamons} alt={'damons'} />
                  <i className={'column-header-data-text'}>60%</i>
                </span>
                <ButtonBase className={'column-header-more'} onClick={() => showModal(<InfoModal />)}>
                  More
                </ButtonBase>
              </span>
            </Box>
            <Box display={'flex'} mt={'22px'} justifyContent="space-between" alignItems={'center'}>
              <Typography fontWeight={600} fontSize={16} color="#fff">
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
                type="mloot"
              />
            )}
          </Box>
        </div>

        <Box className={'column-content'}>
          <Box display="grid" gap="20px">
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
                  <Button width={`280px`} height={`48px`} onClick={() => showModal(<ClaimModal />)}>
                    Claim
                  </Button>
                </Box>
              </div>
            </div>

            <div className={'column-item-box'}>
              <GridItem title={'Reward settlement time'} value={'2022-03-18 00:00:00 (UTC)'}></GridItem>
              <GridItem title={'Current rewards'} value={'153,846.15 AGLD'}></GridItem>
              <GridItem title={'Total staked NFT value'} value={'54.4 ETH'}></GridItem>
              <GridItem title={'Cumulative rewards'} value={'2,153,846.15 AGLD'}></GridItem>
              <GridItem title={'Halving date'} value={'2023-03-18'}></GridItem>
              <Box display={'flex'} flexDirection="row-reverse" mt={'40px'}>
                <ExternalLink href="">
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
            </div>
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
  type: LootType
  selectedList: string[]
  toggleSelect: (id: string) => void
}) {
  return (
    <Box id={'column-box-body'} display="grid" gridTemplateColumns={'1fr 1fr'} columnGap={50}>
      {nfts.map(({ tokenId }) => (
        <LootCard
          key={tokenId}
          tokenId={tokenId}
          type={type}
          selectedList={selectedList}
          toggleSelect={toggleSelect}
        ></LootCard>
      ))}
    </Box>
  )
}
