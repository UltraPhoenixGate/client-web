import { Navigate, Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import { BaseLayout } from './layout'

const Dashboard = lazy(() => import('./dashboard'))
const Client = lazy(() => import('./client'))
const Alert = lazy(() => import('./alert'))
const Camera = lazy(() => import('./camera'))
const Setting = lazy(() => import('./setting'))

function App() {
  return (
    <Router root={BaseLayout}>
      <Route path="/" component={() => <Navigate href="/dashboard" />} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/client" component={Client} />
      <Route path="/alert" component={Alert} />
      <Route path="/camera" component={Camera} />
      <Route path="/setting" component={Setting} />
    </Router>
  )
}

export default App
