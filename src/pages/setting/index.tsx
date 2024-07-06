import { NetworkInfo } from './components/NetworkInfo'
import { SystemInfo } from './components/SystemInfo'

export default function Home() {
  return (
    <div class="p-4">
      <SystemInfo />
      <NetworkInfo />
    </div>
  )
}
