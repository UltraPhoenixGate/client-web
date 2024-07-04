import { For, Match, Show, Switch, createSignal, onMount } from 'solid-js'
import { appWindow } from '@tauri-apps/api/window'
import type { Client } from 'ultraphx-js-sdk'
import Button from './Button'
import { useClient } from '@/context/ClientContext'
import { isApp } from '@/store'
import { useModal } from '@/utils/modalManager'

export function Header() {
  const { status } = useClient()
  return (
    <header class="col shrink-0 bg-fill2">
      <Show when={isApp}>
        <WindowDecoration />
      </Show>
      <ConnectionGate />
      <div data-tauri-drag-region class="h-12 centerRow justify-between border-b px-6">
        <h1 class="text-base text-text1 font-bold">Ultra Phoenix 工业网关</h1>
        <div>
          <div class="centerRow text-text2">
            <div
              classList={{
                'bg-success': status() === 'connected',
                'bg-warning': status() === 'connecting',
                'bg-danger': status() === 'disconnected',
              }}
              class="mr-2 h-2 w-2"
            >
            </div>
            <Switch>
              <Match when={status() === 'connected'}>设备在线</Match>
              <Match when={status() === 'disconnected'}>设备离线</Match>
              <Match when={status() === 'connecting'}>连接中...</Match>
            </Switch>
          </div>
        </div>
      </div>
    </header>
  )
}

function WindowDecoration() {
  const buttons = [{
    iconClass: 'i-fluent:subtract-16-filled',
    onClick: () => appWindow.minimize(),
  }, {
    iconClass: 'i-fluent:maximize-16-filled',
    onClick: () => appWindow.toggleMaximize(),
  }, {
    iconClass: 'i-fluent:dismiss-16-filled text-0.9em',
    onClick: () => appWindow.close(),
  }]
  return (
    <div
      data-tauri-drag-region
      style={{
        height: 'auto',
      }}
      class="centerRow justify-end"
    >
      <For each={buttons}>
        {button => (
          <WindowButton iconClass={button.iconClass} onClick={button.onClick} />
        )}
      </For>
    </div>
  )
}

function WindowButton({ iconClass, onClick }: {
  iconClass: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      class="bg-transparent px-3 py-2 hover:bg-accent hover:bg-op-20"
    >
      <span class={iconClass}></span>
    </button>
  )
}

function ConnectionGate() {
  const {
    client: clientCtx,
  } = useClient()

  const {
    openModal,
    closeModal,
  } = useModal()

  function acceptClient(client: Client) {
    return clientCtx.client.setClientStatus(client.id, 'active')
  }

  function rejectClient(client: Client) {
    return clientCtx.client.setClientStatus(client.id, 'expired')
  }

  async function checkPendingClient() {
    const pendingClient = await clientCtx.client.getPendingClients()
    // debug
    // pendingClient.push({
    //   id: 'test',
    //   name: 'test',
    //   status: 'pending',
    //   description: 'test',
    //   type: 'plugin',
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // })
    if (pendingClient.length > 0) {
      return new Promise<void>((resolve) => {
        const modalId = openModal({
          title: '新设备接入',
          content: () => {
            const [countDown, setCountDown] = createSignal(60)
            let timer!: number
            onMount(async () => {
              timer = setInterval(() => {
                setCountDown(countDown() - 1)
              }, 1000)
              if (countDown() === 0) {
                clearInterval(timer)
                await rejectClient(pendingClient[0])
                closeModal(modalId)
                resolve()
              }
            })

            const client = pendingClient[0]

            return (
              <div>
                <div class="centerCol gap-2 py-4">
                  <p class="">
                    设备
                    {' '}
                    <strong>{client.name}</strong>
                    {' '}
                    请求连接
                  </p>
                  <p class="text-sm text-text2">
                    描述：
                    {client.description}
                  </p>
                  <p class="centerRow text-sm text-text2">
                    类型：
                    <Switch>
                      <Match when={client.type === 'sensor'}>
                        <div class="textVCenter">
                          <i class="i-fluent:payment-wireless-20-regular mr-1 text-1.3em" />
                          传感器
                        </div>
                      </Match>
                      <Match when={client.type === 'sensor_active'}>
                        <div class="textVCenter">
                          <i class="i-fluent:payment-wireless-20-regular mr-1 text-1.3em" />
                          传感器（主动）
                        </div>
                      </Match>
                      <Match when={client.type === 'plugin'}>
                        <div class="textVCenter">
                          <i class="i-fluent:plug-disconnected-24-regular mr-1 text-1.3em" />
                          插件
                        </div>
                      </Match>
                    </Switch>
                  </p>
                </div>
                <div class="w-full row justify-between gap-1px">
                  <Button
                    class="h-40px center flex-1"
                    onClick={() => {
                      clearInterval(timer)
                      acceptClient(client)
                      closeModal(modalId)
                      resolve()
                    }}
                  >
                    接受
                  </Button>
                  <Button
                    class="h-40px center flex-1"
                    onClick={() => {
                      clearInterval(timer)
                      rejectClient(client)
                      closeModal(modalId)
                      resolve()
                    }}
                  >
                    拒绝 (
                    {countDown()}
                    )
                  </Button>
                </div>
              </div>
            )
          },
          customModal(props) {
            return (
              <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="min-w-120 col bg-white shadow-lg">
                  <div class="center pt-4 text-xl font-semibold">
                    <h3>{props.title}</h3>
                  </div>
                  <div>{props.content}</div>
                </div>
              </div>
            )
          },
        })
      })
    }
  }

  onMount(async () => {
    while (true) {
      await checkPendingClient()
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  })
  return null
}
