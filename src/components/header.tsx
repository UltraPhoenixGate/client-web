import { Match, Switch } from 'solid-js'
import { useClient } from '@/context/ClientContext'

export function Header() {
  const { status } = useClient()
  return (
    <header class="bg-fill2 h-16 centerRow justify-between border-b px-6">
      <h1 class="text-text1 text-base font-bold">Ultra Phoenix</h1>
      <div>
        <div class="text-text2 centerRow gap-2">
          <div
            classList={{
              'bg-success': status() === 'connected',
              'bg-warning': status() === 'connecting',
              'bg-danger': status() === 'disconnected',
            }}
            class="h-2 w-2 rounded-full"
          >
          </div>
          <Switch>
            <Match when={status() === 'connected'}>设备在线</Match>
            <Match when={status() === 'disconnected'}>设备离线</Match>
            <Match when={status() === 'connecting'}>连接中...</Match>
          </Switch>
        </div>
      </div>
    </header>
  )
}
