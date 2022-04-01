import { Box } from '@mui/material'

export default function Index({ children, border }: { children?: any; border?: string }) {
  return (
    <Box
      display="flex"
      pt={40}
      pb={40}
      mt={20}
      sx={{
        border: border || '1px solid #ddd',
        borderRadius: '20px'
      }}
      justifyContent="center"
    >
      {children || 'No data'}
    </Box>
  )
}
