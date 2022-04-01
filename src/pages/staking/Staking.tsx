import stakingntftitle from './assets/staking-ntf-title.svg'
import iconmaster from './assets/icon-master.svg'
import boredtitle from './assets/bored-title.svg'
import icondamons from './assets/icon-damons.svg'
import Button, { BlackButton } from 'components/Button/Button'
import ActionButton from 'components/Button/ActionButton'
import { Box, ButtonBase, Grid, styled, Typography } from '@mui/material'
import { useAccountLootIds } from 'hooks/useBlockVision'
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
  const myLoot = useAccountLootIds('loot')
  const myLootM = useAccountLootIds('lootm')
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
                <ButtonBase className={'column-header-more'}>More</ButtonBase>
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
            {!myLoot.loading && (!myLoot.result || !myLoot.result.ids.length) && <NoData />}
            {!myLoot.loading && (
              <ShowNFTList
                selectedList={selectedLootNFT}
                toggleSelect={toggleSelectLoot}
                ids={myLoot.result?.ids || []}
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
                <ButtonBase className={'column-header-more'}>More</ButtonBase>
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
            {!myLootM.loading && (!myLootM.result || !myLootM.result.ids.length) && <NoData />}
            {!myLootM.loading && (
              <ShowNFTList
                selectedList={selectedLootMoreNFT}
                toggleSelect={toggleSelectLootMore}
                ids={myLootM.result?.ids || []}
                type="lootm"
              />
            )}
          </Box>

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
                  <ActionButton
                    width={`280px`}
                    height={`48px`}
                    actionText={'Claim'}
                    onAction={function() {}}
                  ></ActionButton>
                </Box>
              </div>
            </div>

            <div className={'column-item-box'}>
              <GridItem title={'Reward settlement time'} value={'2022-03-18 00:00:00 (UTC)'}></GridItem>
              <GridItem title={'Current rewards'} value={'153,846.15 AGLD'}></GridItem>
              <GridItem title={'Total staked NFT value'} value={'54.4 ETH'}></GridItem>
              <GridItem title={'Cumulative rewards'} value={'2,153,846.15 AGLD'}></GridItem>
              <GridItem title={'Halving date'} value={'2023-03-18'}></GridItem>
            </div>
          </Box>
        </Box>
      </Box>
    </StakingWrapper>
  )
}

function ShowNFTList({
  ids,
  type,
  selectedList,
  toggleSelect
}: {
  ids: string[]
  type: LootType
  selectedList: string[]
  toggleSelect: (id: string) => void
}) {
  return (
    <Box id={'column-box-body'} display="grid" gridTemplateColumns={'1fr 1fr'} columnGap={50}>
      {ids.map(id => (
        <LootCard key={id} tokenId={id} type={type} selectedList={selectedList} toggleSelect={toggleSelect}></LootCard>
      ))}
    </Box>
  )
}
