import { For, Show, createSignal, onMount } from 'solid-js'
import type { Camera } from 'ultraphx-js-sdk'
import { ConnectNew } from './components/ConnectNew'
import { useModal } from '@/utils/modalManager'
import { Button } from '@/components/Button'
import { client } from '@/context/ClientContext'

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
    errorModal,
  } = useModal()
  function connectNewCamera() {
    openModal({
      title: '连接新设备',
      content: ConnectNew,
    })
  }
  const [list, setList] = createSignal<Camera[]>([])
  const [loading, setLoading] = createSignal(true)
  function refresh() {
    setLoading(true)
    client.camera.getCameras().then((res) => {
      setList(res.cameras)
    }).catch((err) => {
      errorModal(err.message)
    }).finally(() => {
      setLoading(false)
    })
  }
  onMount(() => {
    refresh()
  })
  // client.camera.getCameras().then((res) => {
  //   console.log(res)
  // })
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
        <For each={list() || []}>
          {camera => (
            <CameraItem camera={camera} />
          )}
        </For>
      </div>
    </div>
  )
}

function CameraItem(props: {
  camera: Camera
}) {
  const [currentFrame, setCurrentFrame] = createSignal<string>('')
  const [loading, setLoading] = createSignal(true)

  function getFrame() {
    setLoading(true)
    client.camera.getCurrentFrame(props.camera.streamUrl).then((res) => {
      setCurrentFrame(res.image)
    }).finally(() => {
      setLoading(false)
    })
  }

  onMount(() => {
    getFrame()

    setInterval(() => {
      getFrame()
    }, 30000)
  })

  return (
    <div class="relative w-full pt-60%">
      <div class="absolute inset-0">
        <div class="bg-gray-200 p-2">
          <h3 class="text-base text-black font-semibold">
            {props.camera.name}
          </h3>
        </div>
        {loading()
          ? (
            <div class="h-full flex items-center justify-center bg-gray-300">
              <i class="i-svg-spinners:bars-scale-fade text-gray-700" />
            </div>
            )
          : (
            <img src={currentFrame()} class="h-full w-full" alt="Camera Frame"></img>
            )}
      </div>
    </div>
  )
}
