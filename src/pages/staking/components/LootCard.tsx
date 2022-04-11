import { styled } from '@mui/material'
import { useMemo } from 'react'
import Progress from 'components/Progress'
//import { useNFTInfo } from '../../../hooks/useNFT'
import { LootType } from 'hooks/useNFTInfo'
import { NFT } from '../../../hooks/useNFT'
import { useStakingInfo } from '../../../hooks/useStaking'

export const LootCardStyle = styled('div')<{ selected?: boolean; disabled: boolean }>(
  ({ theme, selected, disabled }) => ({
    flex: 1,
    cursor: disabled ? '' : 'pointer',
    border: !disabled && selected ? `1px solid rgba(165, 255, 190, 1)` : `1px solid transparent`,
    borderRadius: 20,
    transition: 'border .3s',
    '&: hover': {
      borderColor: selected ? 'rgba(165, 255, 190, 1)' : 'rgba(165, 255, 190, .3)'
    },
    '.loot-card-box': {
      background: disabled ? 'rgba(145, 145, 145, 0.5)' : 'rgba(55, 65, 47, 0.5)',
      borderRadius: 20,
      padding: '25px 25px 40px 25px',
      [theme.breakpoints.down('md')]: { width: '133px', height: '199px', padding: '13px' }
      // padding: '25px  25px 40px 25px'
    },
    '.loot-card-img-box': {
      width: 205,
      height: 205,
      margin: '0 auto',
      [theme.breakpoints.down('md')]: {
        width: 107,
        height: 107
      }
    },
    '.loot-card-img-box img': {
      width: '100%',
      height: '100%'
    },
    '.loot-card-title': {
      marginTop: 10,
      marginBottom: 16,
      color: '#fff',
      [theme.breakpoints.down('md')]: { fontSize: '12px' }
    }
  })
)

// const StakeButton = styled(ButtonBase)({
//   border: 'none',
//   width: '100%',
//   background: 'linear-gradient(265.56deg, #24F986 -0.27%, #1EF65B -0.26%, #00D060 98.59%)',
//   padding: '5px 32px',
//   fontSize: 16,
//   color: '#fff',
//   marginTop: 20,
//   borderRadius: '10px',
//   '&:disabled': {
//     background: 'linear-gradient(265.56deg, #24F986 -0.27%, #17B944 -0.26%, #058942 98.59%)',
//     cursor: 'not-allowed'
//   }
// })

export default function LootCard({
  nft,
  type,
  selectedList,
  toggleSelect
}: {
  nft: NFT
  type: LootType
  selectedList: string[]
  toggleSelect: (id: string) => void
}) {
  const { tokenId, metaData, isStaked, stakedEpochs } = nft
  const image = metaData?.image
  const name = metaData?.name
  //const { stakedEpochs } = useNFTInfo(nft.tokenId, type)
  const { numEpochs } = useStakingInfo()

  const isSelected = useMemo(() => selectedList.includes(tokenId), [selectedList, tokenId])

  return (
    <LootCardStyle
      disabled={isStaked}
      onClick={() => {
        !isStaked && toggleSelect(tokenId)
      }}
      selected={isSelected}
    >
      <div className={'loot-card-box'}>
        <div className={'loot-card-img-box'}>
          <img alt={''} src={image} />
        </div>
        <p className={'loot-card-title'}>{name}</p>
        <Progress val={parseInt(stakedEpochs ?? '0')} total={parseInt(numEpochs)} />
      </div>
    </LootCardStyle>
  )
}
