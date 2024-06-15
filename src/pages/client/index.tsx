import { For, Show } from 'solid-js'
import { ConnectNew } from './components/ConnectNew'
import { Card } from '@/components/card'
import { useClient } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'
import Button from '@/components/button'
import { openModal } from '@/utils/modalManager'

export default function Home() {
  function connectNewClient() {
    openModal({
      title: '连接新设备',
      content: ConnectNew(),
    })
  }

  // dev only: reopen modal when hot reload
  if (import.meta.hot)
    connectNewClient()

  const { client } = useClient()
  const { data: clients, loading } = useRequest(client.client.getConnectedClients, {})
  return (
    <div class="p-4">
      <div class="row justify-between">
        <h1 class="title">已接入设备</h1>
        <div>
          <Button type="primary" onClick={connectNewClient}>连接新设备</Button>
        </div>
      </div>
      <div class="grid grid-cols-3 mt-3 gap-3">
        <Show when={loading()}>
          <div class="col-span-3 text-center">加载中...</div>
        </Show>
        <For each={clients() || []}>
          {client => (
            <Card>
              <div class="text-lg">{client.name}</div>
              <div class="text-sm text-text2">{client.description}</div>
            </Card>
          )}
        </For>
      </div>
    </div>
  )
}
