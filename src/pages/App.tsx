import { Suspense } from 'react'
import { ModalProvider } from 'context/ModalContext'
import Polling from 'components/essential/Polling'
import Popups from 'components/essential/Popups'
import Web3ReactManager from 'components/essential/Web3ReactManager'
import WarningModal from 'components/Modal/WarningModal'
import { Layout } from './Layout'
import { Routes } from './Routes'

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <Layout>
          <Popups />
          <Polling />
          <WarningModal />
          <Web3ReactManager>
            <Routes />
          </Web3ReactManager>
        </Layout>
      </ModalProvider>
    </Suspense>
  )
}
