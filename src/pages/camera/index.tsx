import { For, Show } from 'solid-js'
import { ConnectNew } from './components/ConnectNew'
import { useModal } from '@/utils/modalManager'
import { Button } from '@/components/Button'
import { useClient } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'
import { Card } from '@/components/Card'

export default function Home() {
  return (
    <div class="p-4">
      <CameraList />
    </div>
  )
}

function CameraList() {
  const {
    openModal,
  } = useModal()
  function connectNewCamera() {
    openModal({
      title: '连接新设备',
      content: ConnectNew,
    })
  }
  const { client } = useClient()
  
  const { data, loading } = useRequest(client.camera.getCameras, {})
  return (
    <div>
      <div class="centerRow justify-between">
        <h1 class="title">监控</h1>
        <div>
          <Button
            type="primary"
            onClick={connectNewCamera}
            icon="i-fluent:add-square-24-regular mr-2"
          >
            连接新设备
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-3 mt-3 gap-3">
        <Show when={loading()}>
          <div class="col-span-3 text-center">加载中...</div>
        </Show>
        <For each={data()?.cameras || []}>
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
