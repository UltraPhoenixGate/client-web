import { AlertRecords } from './components/AlertRecords'
import { AlertRules } from './components/AlertRules'

export default function Home() {
  return (
    <div class="grid grid-cols-2 gap-4 p-4">
      <AlertRecords />
      <AlertRules />
    </div>
  )
}
