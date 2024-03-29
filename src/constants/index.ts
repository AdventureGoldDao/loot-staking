import { AbstractConnector } from '@web3-react/abstract-connector'
import { Token } from './token'
import { injected, walletconnect } from '../connectors'
import JSBI from 'jsbi'
import { ChainId } from './chain'

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BAST_TOKEN: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, '', ''),
  [ChainId.ROPSTEN]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, '', ''),
  [ChainId.RINKEBY]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, '', ''),
  [ChainId.GÖRLI]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, '', ''),
  [ChainId.KOVAN]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, '', ''),
  [ChainId.BSC]: new Token(ChainId.BSC, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, '', '')
}

export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

export const ANTIMATTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x60d0769c4940cA58648C0AA34ecdf390a10F272e',
  [ChainId.ROPSTEN]: '0x60d0769c4940cA58648C0AA34ecdf390a10F272e',
  [ChainId.RINKEBY]: '0xe774A104715ba1B99dEAB30ab33e1C99B0695270',
  [ChainId.KOVAN]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.BSC]: ''
}

export const ANTIMATTER_GOVERNANCE_ADDRESS = '0x78fC5460737EB07Ce9e7d954B294ecA7E6203D19'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GOVERNANCE_ADDRESS = '0x78fC5460737EB07Ce9e7d954B294ecA7E6203D19'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  }
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5'
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

// Rinkeby Loot
// 0xa324e0d0bEc55840BDbcCd760f7a998Df859386c

// Rinkeby More Loot
// 0xD991EafE6b2D36F786365e0cEB3b6Dbe61097c90

// Rinkeby AGLD
// 0xEd31669F29724636d6cBb4F8c63905fedE5e06D2

// Rinkeby Staking
// 0x0482e3E1B59800a2edd587F2F310566168aFBB93

export const LOOT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '0xfDcD980cCd16716b6720A0512EF41eEeb5359fD2',
  [ChainId.KOVAN]: '',
  [ChainId.GÖRLI]: '0xD8323b9939a142908e807A69BD50c88bACbA7E8A',
  [ChainId.BSC]: ''
}

export const LOOT_M_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '0x9Ab5FeB3C7EbA70888284e7697c1249783c768c4',
  [ChainId.KOVAN]: '',
  [ChainId.GÖRLI]: '0x80eDfd92eFF98127A03932e67fb589595a059001',
  [ChainId.BSC]: ''
}

export const STAKING_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '0x10339F71dA739a418b564Df299Eb53c657583bF6',
  [ChainId.KOVAN]: '',
  [ChainId.GÖRLI]: '0x35f6c1DE5FF2D19bC223A5d1366A2D1632d76116',
  [ChainId.BSC]: ''
}

export const EPOCH_DURATION = 3600

export const STAKE_DURATION = EPOCH_DURATION * 288

type GraphEndPointType = {
  [key in ChainId]: string
}

export const SUBGRAPH: GraphEndPointType = {
  [ChainId.MAINNET]: '',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/max0222/loots-taking',
  [ChainId.KOVAN]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.BSC]: ''
}
