import { For, Match, Show, Switch } from 'solid-js'
import type { Client } from 'ultraphx-js-sdk'
import { ConnectNew } from './components/ConnectNew'
import { Card } from '@/components/Card'
import { useClient } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'
import Button from '@/components/Button'
import { useModal } from '@/utils/modalManager'

export default function Home() {
  const {
    openModal,
  } = useModal()
  function connectNewClient() {
    openModal({
      title: '连接新设备',
      content: ConnectNew,
    })
  }

  const { client } = useClient()
  const { data: clients, loading, refresh } = useRequest(client.client.getConnectedClients, {})
  return (
    <div class="p-4">
      <div class="centerRow justify-between">
        <h1 class="title">已接入设备</h1>
        <div>
          <Button type="primary" icon="i-fluent:add-square-16-regular" onClick={connectNewClient}>连接新设备</Button>
        </div>
      </div>
      <div class="grid grid-cols-2 mt-3 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        <Show when={loading()}>
          <div class="col-span-3 text-center">加载中...</div>
        </Show>
        <For each={clients() || []}>
          {client => (
            <ClientItem client={client} onRemove={refresh} />
          )}
        </For>
      </div>
    </div>
  )
}

function ClientItem(props: {
  client: Client
  onRemove?: () => void
}) {
  const { client } = useClient()
  const { confirmModal, errorModal } = useModal()
  const handleDelete = () => {
    confirmModal({
      title: '确认删除',
      content: () => {
        return (
          <div>
            确认要移除设备
            {' '}
            {props.client.name || '未知设备'}
            {' '}
            吗？
          </div>
        )
      },
      onOk: async () => {
        try {
          await client.client.removeClient(props.client.id)
          props.onRemove?.()
        }
        catch (error: any) {
          errorModal(error.message)
        }
      },
    })
  }

  return (
    <Card class="p-4">
      <div class="h-full flex items-center justify-between">
        <div class="mr-2 h-full col flex-1 justify-between">
          <div>
            <div class="text-lg font-semibold">{props.client.name || '未知设备'}</div>
            <div class="text-sm text-gray-600">{props.client.description || '-'}</div>
          </div>
          <div class="mt-2 text-sm">
            <Switch>
              <Match when={props.client.type === 'sensor'}>
                <div class="textVCenter">
                  <i class="i-fluent:payment-wireless-20-regular mr-1 text-1.3em" />
                  传感器
                </div>
              </Match>
              <Match when={props.client.type === 'sensor_active'}>
                <div class="textVCenter">
                  <i class="i-fluent:payment-wireless-20-regular mr-1 text-1.3em" />
                  传感器（主动）
                </div>
              </Match>
              <Match when={props.client.type === 'plugin'}>
                <div class="textVCenter">
                  <i class="i-fluent:plug-disconnected-24-regular mr-1 text-1.3em" />
                  插件
                </div>
              </Match>
            </Switch>
          </div>
        </div>
        <div class="flex-shrink-0">
          <Button
            onClick={handleDelete}
            size="small"
            class="mt-2"
            icon="i-fluent:delete-16-regular"
          >
            移除
          </Button>
        </div>
      </div>
    </Card>
  )
}
