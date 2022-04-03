import { Box, Typography, LinearProgress, linearProgressClasses, styled } from '@mui/material'

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  // height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#474747'
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main
  }
}))

export default function Progress({ val, total }: { val: number; total: number }) {
  const value = (val / total) * 100
  return (
    <Box sx={{ width: '100%' }}>
      <StyledLinearProgress variant="determinate" value={value} sx={{ width: '100%', height: { xs: 4, md: 10 } }} />
      <Box color={'#B7B7B7'} marginTop={5} fontSize={14} display={'flex'} justifyContent={'space-between'}>
        <Typography fontSize={12}>{`Staked epoch`}</Typography>
        <Typography fontSize={12} sx={{ textAlign: 'right' }}>{`${val}/${total}`}</Typography>
      </Box>
    </Box>
  )
}

export function SimpleProgress({
  val,
  total,
  hideValue,
  width
}: {
  val: number
  total: number
  hideValue?: boolean
  width?: string
}) {
  const value = (val / total) * 100
  return (
    <Box display="flex" sx={{ width: width ?? 'max-content' }} alignItems="center">
      {!hideValue && <Typography mr={8}>{value | 0}%</Typography>}
      <StyledLinearProgress variant="determinate" value={value} sx={{ width: width ?? '100px' }} />
    </Box>
  )
}
