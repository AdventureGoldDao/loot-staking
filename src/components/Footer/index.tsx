import { Box, useTheme } from '@mui/material'
import { HideOnMobile } from 'theme/index'
import { ReactComponent as Discord } from 'assets/socialLinksIcon/discord.svg'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'
import { ReactComponent as Mirror } from 'assets/socialLinksIcon/mirror.svg'
import { ExternalLink } from 'theme/components'
import TextButton from 'components/Button/TextButton'

export default function Footer() {
  const theme = useTheme()

  return (
    <HideOnMobile>
      <footer
        style={{
          height: theme.height.footer
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
          padding="9px 60px 28px"
          gap="40px"
        >
          <TextButton>
            <ExternalLink href="https://discord.gg/phSq2EuusS">
              <Discord />
            </ExternalLink>
          </TextButton>
          <TextButton>
            <ExternalLink href="https://twitter.com/GoldAdventure">
              <Twitter />
            </ExternalLink>
          </TextButton>
          <TextButton>
            <ExternalLink href="https://mirror.xyz/agld.eth">
              <Mirror />
            </ExternalLink>
          </TextButton>
        </Box>
      </footer>
    </HideOnMobile>
  )
}
