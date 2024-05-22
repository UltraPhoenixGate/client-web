import { For, Show } from 'solid-js'
import { Card } from '@/components/card'
import { useClient } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'

export default function Home() {
  const { client } = useClient()
  const { data: clients, loading } = useRequest(client.client.getConnectedClients, {})
  return (
    <div class="p-4">
      <h1 class="title">已接入设备</h1>
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
