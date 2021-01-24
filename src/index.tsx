import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode } from 'react'
// import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import Blocklist from './components/Blocklist'
import { NetworkContextName } from './constants'
import './i18n'
import App from './pages/App'
import store from './state'
import ApplicationContextProvider from './contexts/Application'
import GlobalDataContextProvider from './contexts/GlobalData'
import TokenDataContextProvider, { Updater as TokenDataContextUpdater } from './contexts/TokenData'
import PairDataContextProvider, { Updater as PairDataContextUpdater } from './contexts/PairData'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      {/* <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <TokenDataContextUpdater />
      <PairDataContextUpdater />
      <MulticallUpdater /> */}
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <TokenDataContextUpdater />
      <PairDataContextUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  // <StrictMode>
  //   <FixedGlobalStyle />
  //   <Web3ReactProvider getLibrary={getLibrary}>
  //     <Web3ProviderNetwork getLibrary={getLibrary}>
  //       <ApplicationContextProvider>
  //         <TokenDataContextProvider>
  //           <GlobalDataContextProvider>
  //             <PairDataContextProvider>
  //               {/* <Blocklist> */}
  //                 <Provider store={store}>
  //                   <Updaters />
  //                   <ThemeProvider>
  //                     <ThemedGlobalStyle />
  //                     <HashRouter>
  //                       <App />
  //                     </HashRouter>
  //                   </ThemeProvider>
  //                 </Provider>
  //               {/* </Blocklist> */}
  //             </PairDataContextProvider>
  //           </GlobalDataContextProvider>
  //         </TokenDataContextProvider>
  //       </ApplicationContextProvider>
  //     </Web3ProviderNetwork>
  //   </Web3ReactProvider>
  // </StrictMode>,
  <StrictMode>
    <FixedGlobalStyle />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <ApplicationContextProvider>
          <TokenDataContextProvider>
            <GlobalDataContextProvider>
              <PairDataContextProvider>
                <Blocklist>
                  <Provider store={store}>
                    <Updaters />
                    <ThemeProvider>
                      <ThemedGlobalStyle />
                      <HashRouter>
                        <App />
                      </HashRouter>
                    </ThemeProvider>
                  </Provider>
                </Blocklist>
              </PairDataContextProvider>
            </GlobalDataContextProvider>
          </TokenDataContextProvider>
        </ApplicationContextProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)
