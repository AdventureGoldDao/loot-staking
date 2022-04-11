import { useState, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AppBar, Box, IconButton, MenuItem, styled as muiStyled, styled } from '@mui/material'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile, ShowOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
import antimatter from '../../assets/svg/chain_swap.svg'
// import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import NetworkSelect from './NetworkSelect'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const Tabs: Tab[] = [
  { title: 'Staking', route: '/staking' },
  { title: 'Governance', link: '/comingsoon' },
  { title: 'About', link: '/comingsoon' }
]

const navLinkSX = ({ theme }: any) => ({
  textDecoration: 'none',
  fontSize: 14,
  color: theme.palette.text.primary,
  opacity: 0.5,
  '&:hover': {
    opacity: 1
  }
})

const StyledNavLink = styled(NavLink)(navLinkSX)

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  height: theme.height.header,
  backgroundColor: theme.palette.background.paper,
  alignItems: 'left',
  boxShadow: 'none',
  padding: '0 40px 0 25px!important',
  zIndex: theme.zIndex.drawer,
  borderBottom: `1px solid ${theme.palette.text.primary}`,
  // [theme.breakpoints.down('md')]: {
  //   position: 'fixed',
  //   bottom: 0,
  //   left: 0,
  //   top: 'unset',
  //   borderTop: '1px solid ' + theme.bgColor.bg4,
  //   justifyContent: 'center'
  // },
  '#header-main': {
    maxWidth: 1120,
    width: '100%',
    margin: '0 auto'
  },
  '& .link': {
    textDecoration: 'none',
    color: theme.palette.text.disabled,
    // marginRight: 48,
    fontWeight: 600,
    fontStyle: 'normal',
    // paddingBottom: '30px',
    '&.active': {
      color: theme.palette.text.primary
    },
    '&:hover': {
      color: theme.palette.text.primary
    }
  },
  [theme.breakpoints.down('lg')]: {
    padding: '0 24px 0 24px!important'
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 30px!important'
  }
}))

const Filler = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    height: theme.height.header,
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px'
  }
}))

const MainLogo = styled(NavLink)(({ theme }) => ({
  fontSize: 0,
  width: 270,
  '& img': {
    width: 104
  },
  '&:hover': {
    cursor: 'pointer'
  },
  [theme.breakpoints.down('sm')]: {
    width: 'fit-content',
    '& img': { height: '11px', width: 'fit-content' }
    // marginBottom: -10
  }
}))

const LinksWrapper = muiStyled(Box)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0
  }
}))

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const handleMobileMenueDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <StyledAppBar>
        <Box id={'header-main'} display="flex" alignItems="center" height={'100%'} justifyContent={'space-between'}>
          <MainLogo id={'antimatter'} to={'/'}>
            <Image className={'img'} src={antimatter} alt={'antimatter'} />
          </MainLogo>
          <HideOnMobile breakpoint="md">
            <LinksWrapper display={'flex'} gap="48px" alignItems={'center'}>
              {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
                subTab ? (
                  <Box
                    sx={{
                      marginRight: {
                        xs: 15,
                        lg: 48
                      },
                      height: 'auto',
                      paddingBottom: '30px',
                      borderBottom: '2px solid transparent',
                      borderColor: theme =>
                        subTab.some(tab => tab.route && pathname.includes(tab.route))
                          ? theme.palette.text.primary
                          : 'transparnet',
                      display: 'inline'
                    }}
                    key={title + idx}
                  >
                    <PlainSelect
                      key={title + idx}
                      placeholder={title}
                      autoFocus={false}
                      width={title === 'Test' ? '70px' : undefined}
                      style={{
                        height: '16px'
                      }}
                    >
                      {subTab.map((sub, idx) =>
                        sub.link ? (
                          <MenuItem
                            key={sub.link + idx}
                            sx={{ backgroundColor: 'transparent!important', background: 'transparent!important' }}
                            selected={false}
                          >
                            <ExternalLink
                              href={sub.link}
                              className={'link'}
                              sx={{
                                '&:hover': {
                                  color: '#232323!important'
                                }
                              }}
                            >
                              {sub.titleContent ?? sub.title}
                            </ExternalLink>
                          </MenuItem>
                        ) : (
                          <MenuItem key={sub.title + idx}>
                            <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                          </MenuItem>
                        )
                      )}
                    </PlainSelect>
                  </Box>
                ) : link ? (
                  <ExternalLink href={link} className={'link'} key={link + idx} style={{ fontSize: 14 }}>
                    {titleContent ?? title}
                  </ExternalLink>
                ) : (
                  <NavLink
                    key={title + idx}
                    id={`${route}-nav-link`}
                    to={route ?? ''}
                    className={
                      (route
                        ? pathname.includes(route)
                          ? 'active'
                          : pathname.includes('account')
                          ? route.includes('account')
                            ? 'active'
                            : ''
                          : ''
                        : '') + ' link'
                    }
                  >
                    {titleContent ?? title}
                  </NavLink>
                )
              )}
            </LinksWrapper>
          </HideOnMobile>

          <Box display={'flex'} gap="20px">
            <NetworkSelect />
            <Web3Status />
          </Box>

          <ShowOnMobile breakpoint="md">
            <IconButton
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                height: { xs: 24, sm: 32 },
                width: { xs: 24, sm: 32 },
                mb: { xs: 0, sm: 15 },
                mt: { xs: 0, sm: 8 },
                padding: '4px',
                borderRadius: '8px'
              }}
              onClick={() => {
                setMobileMenuOpen(open => !open)
              }}
            >
              <svg width="19" height="12" viewBox="0 0 19 12" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H18C18.5523 2 19 1.55228 19 1C19 0.447715 18.5523 0 18 0H1ZM1 10C0.447715 10 0 10.4477 0 11C0 11.5523 0.447715 12 1 12H18C18.5523 12 19 11.5523 19 11C19 10.4477 18.5523 10 18 10H1Z"
                  fill="white"
                />
              </svg>
            </IconButton>
          </ShowOnMobile>
        </Box>
      </StyledAppBar>
    </>
  )
}
