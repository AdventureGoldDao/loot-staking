import { styled } from '@mui/material'
import Footer from 'components/Footer'
import Header from 'components/Header'
import { ReactChild } from 'react'

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
  width: '100%',
  minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.footer})`,
  padding: '50px 0 80px',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
    paddingTop: 20
  }
}))

interface ILayoutProps {
  children: ReactChild | ReactChild[]
}

export const Layout = ({ children }: ILayoutProps) => {
  return (
    <AppWrapper id="app">
      <ContentWrapper>
        <Header />
        <BodyWrapper id="body">{children}</BodyWrapper>
        <Footer />
      </ContentWrapper>
    </AppWrapper>
  )
}
