import { ConnectNew } from './components/ConnectNew'
import { Button } from '@/components/Button'
import { openModal } from '@/utils/modalManager'

export default function Home() {
  return (
    <div class="p-4">
      <CameraList />
    </div>
  )
}

function CameraList() {
  function connectNewCamera() {
    openModal({
      title: '连接新设备',
      content: ConnectNew(),
    })
  }
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
    </div>
  )
}
