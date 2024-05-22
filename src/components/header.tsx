import { For, Match, Show, Switch } from 'solid-js'
import { appWindow } from '@tauri-apps/api/window'
import { useClient } from '@/context/ClientContext'
import { isApp } from '@/store'

export function Header() {
  const { status } = useClient()
  return (
    <header class="bg-fill2 col shrink-0">
      <Show when={isApp}>
        <WindowDecoration />
      </Show>
      <div data-tauri-drag-region class="h-12 centerRow justify-between border-b px-6">
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
        height: '24px',
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
      class="hover:bg-accent bg-transparent px-3 py-2 hover:bg-op-20"
    >
      <span class={iconClass}></span>
    </button>
  )
}
