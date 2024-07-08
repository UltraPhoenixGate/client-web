import { For, Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import type { Camera } from 'ultraphx-js-sdk'
import { ConnectNew } from './components/ConnectNew'
import { useModal } from '@/utils/modalManager'
import { Button } from '@/components/Button'
import { useClient } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'
import { useConfig } from '@/context/ConfigContext'

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
  const { client } = useClient()

  const { data: list, loading, refresh } = useRequest(client().camera.getCameras, {}, {
    onError(err) {
      errorModal(err.message)
    },
  })
  return (
    <div>
      <div class="centerRow justify-between">
        <h1 class="title">监控列表</h1>
        <div class="row">
          <Button
            type="primary"
            onClick={connectNewCamera}
            icon="i-fluent:add-square-24-regular mr-2"
          >
            连接新设备
          </Button>
          <Button
            class="ml-2"
            type="secondary"
            icon={`i-fluent:arrow-sync-20-regular ${
              loading() ? 'animate-spin' : ''
            }`}
            onClick={refresh}
          >
            刷新
          </Button>
        </div>
      </div>
      <p class="mt-1 desc">
        点击画面可查看实时画面
      </p>

      <div class="grid grid-cols-3 mt-3 gap-3">
        <Show when={loading()}>
          <div class="col-span-3 text-center">加载中...</div>
        </Show>
        <Show when={!loading()}>
          <For each={list()?.cameras || []}>
            {camera => (
              <CameraItem camera={camera} />
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

function CameraItem(props: {
  camera: Camera
}) {
  const [currentFrame, setCurrentFrame] = createSignal<string>('')
  const [loading, setLoading] = createSignal(true)
  const { client } = useClient()

  function getFrame() {
    setLoading(true)
    client().camera.getCurrentFrame(props.camera.streamUrl).then((res) => {
      setCurrentFrame(res.image)
    }).finally(() => {
      setLoading(false)
    })
  }
  const { openModal } = useModal()

  function openCamera(camera: Camera) {
    openModal({
      title: camera.name,
      content: () => (
        <CameraPlayer id={camera.id} />
      ),
    })
  }

  createEffect(() => {
    getFrame()

    const timer = setInterval(() => {
      getFrame()
    }, 30000)

    onCleanup(() => {
      clearInterval(timer)
    })
  })

  return (
    <div class="relative w-full pt-60%">
      <div class="absolute inset-0 col border">
        <div class="border-b bg-gray-200 p-2">
          <h3 class="text-base text-black font-semibold">
            {props.camera.name}
          </h3>
        </div>
        <div
          onClick={() => openCamera(props.camera)}
          class="w-full flex-1"
        >
          {loading()
            ? (
                <div class="h-full flex items-center justify-center bg-fill2">
                  <i class="i-svg-spinners:bars-scale-fade mr-2 text-gray-700" />
                </div>
              )
            : (
                <img src={currentFrame()} class="h-full w-full" alt="Camera Frame"></img>
              )}
        </div>
      </div>
    </div>
  )
}

function CameraPlayer(props: {
  id: string
}) {
  let video!: HTMLVideoElement
  const { config } = useConfig()
  const { client } = useClient()
  const { errorModal } = useModal()
  async function getFlvStreamUrl() {
    const res = await client().camera.openStream({
      id: props.id,
      width: 480,
      height: 270,
    })
    return `${res.url}&token=${config.token}`
  }

  onMount(() => {
    async function setup() {
      const playerUrl = await getFlvStreamUrl()
      const flvJs = (await import('flv.js')) as any
      const flvPlayer = flvJs.createPlayer({
        type: 'flv',
        url: playerUrl,
      })
      flvPlayer.attachMediaElement(video)
      flvPlayer.load()
      flvPlayer.play()
      flvPlayer.on('error', (err: any) => {
        console.error(err)
        throw new Error(`播放器错误：${err}`)
      })
    }

    setup().catch((err) => {
      errorModal(err.message)
    })
  })
  return (
    <div class="relative w-1024px">
      <video ref={video} class="h-auto w-full" controls></video>
    </div>
  )
}
