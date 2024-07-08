import { For, Show } from 'solid-js'
import type { AlertRecord } from 'ultraphx-js-sdk'
import { useClient } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'

export function AlertRecords() {
  const { client } = useClient()
  const { data: records, loading } = useRequest(client().alert.getAlertRecords, {})
  return (
    <div>
      <h1 class="title">
        警报记录
      </h1>
      <Show when={loading()}>
        <div class="text-center">加载中...</div>
      </Show>
      <div class="grid grid-cols-2 mt-4">
        <For each={records() || []}>
          {alert => (
            <AlertItem alert={alert} />
          )}
        </For>
      </div>
    </div>
  )
}

function AlertItem(props: { alert: AlertRecord }) {
  const levelColorMap: { [key: string]: string } = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }

  const levelClasses = levelColorMap[props.alert.level] || 'bg-gray-100 text-gray-800'

  return (
    <div class={`border border-gray-200 p-2 text-sm ${levelClasses}`}>
      <div class="mb-1 flex items-center justify-between">
        <span class="truncate font-medium">{props.alert.client.name}</span>
        <span class="truncate font-semibold">{props.alert.level}</span>
      </div>
      <div class="mb-1 truncate text-gray-500">
        <span>{props.alert.ruleName}</span>
      </div>
      <div class="truncate text-gray-400">
        <span>{new Date(props.alert.createdAt).toLocaleString()}</span>
      </div>
    </div>
  )
}
