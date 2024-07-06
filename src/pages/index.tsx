import { Navigate, Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import { BaseLayout } from './layout'
import { ClientProvider } from '@/context/ClientContext'
import ModalProvider from '@/utils/modalManager'
import { PanelProvider } from '@/context/PanelContext'
import { ConfigProvider } from '@/context/ConfigContext'

const Dashboard = lazy(() => import('./dashboard'))
const Client = lazy(() => import('./client'))
const Alert = lazy(() => import('./alert'))
const Camera = lazy(() => import('./camera'))
const Setting = lazy(() => import('./setting'))
const Setup = lazy(() => import('./setup'))

function AppProvider(props: { children: any }) {
  return (
    <ConfigProvider>
      <ClientProvider>
        <PanelProvider>
          <ModalProvider>
            {props.children}
          </ModalProvider>
        </PanelProvider>
      </ClientProvider>
    </ConfigProvider>
  )
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Route path="/" component={() => <Navigate href="/dashboard" />} />
        <Route path="/" component={BaseLayout}>
          <Route path="dashboard" component={Dashboard} />
          <Route path="client" component={Client} />
          <Route path="alert" component={Alert} />
          <Route path="camera" component={Camera} />
          <Route path="setting" component={Setting} />
        </Route>
        <Route path="/setup/:step" component={Setup} />
      </Router>
    </AppProvider>
  )
}

export default App
