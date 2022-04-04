import styled from 'styled-components'
import { SubAppBody } from '../AppBody'
import { Skeleton } from '@mui/material'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { LootCardStyle } from '../../pages/staking/components/LootCard'

const TitleWrapper = styled(RowFixed)`
  flex-wrap: nowrap;
  width: 100%;
`

// const Divider = styled.div`
//   border-bottom: 1px solid ${({ theme }) => theme.bg4};
//   width: calc(100% + 40px);
//   margin: 0 -20px;
// `

export function NFTSkeleton() {
  return (
    <LootCardStyle disabled={false}>
      <div className={'loot-card-box'}>
        <SubAppBody isCard>
          <AutoColumn gap="8px">
            <TitleWrapper>
              <AutoColumn gap="5px">
                <Skeleton variant="rectangular" width={205} height={205} animation="wave" />
              </AutoColumn>
            </TitleWrapper>
            <Skeleton variant="text" width={50} height={24} animation="wave" />
            <Skeleton variant="text" width="100%" height={12} animation="wave" />
            <AutoColumn gap="12px">
              <RowBetween>
                <Skeleton variant="text" width={50} height={16} animation="wave" />
                <Skeleton variant="text" width={50} height={16} animation="wave" />
              </RowBetween>
            </AutoColumn>
          </AutoColumn>
        </SubAppBody>
      </div>
    </LootCardStyle>
  )
}
