import { For, Show, createMemo } from 'solid-js'
import type { NetworkInfoItem } from 'ultraphx-js-sdk'
import { client } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'

export function NetworkInfo() {
  const {
    data: networkInfos,
  } = useRequest(client().system.getNetworkInfos, {
    refreshInterval: 5000,
  })

  const networkInfo = createMemo(() => {
    const res: {
      wifi: NetworkInfoItem[]
      ethernet: NetworkInfoItem[]
    } = {
      wifi: [],
      ethernet: [],
    }
    if (!networkInfos())
      return res
    const wifi = networkInfos()!.filter(info => info.deviceType === 'wifi')
    const eth = networkInfos()!.filter(info => info.deviceType === 'ethernet')

    return {
      wifi: wifi || [],
      ethernet: eth || [],
    }
  })

  return (
    <div>
      <h1 class="mb-4 mt-4 text-xl font-bold">网络状态</h1>
      <div class="grid grid-cols-3 gap-4">
        {(['ethernet', 'wifi'] as ['ethernet', 'wifi']).map(type => (
          <div class="mb-4 w-full">
            <h2 class="mb-2 textVCenterFlex text-xl font-bold">
              <i classList={{
                'i-fluent:globe-20-regular': type === 'ethernet',
                'i-fluent:wifi-1-20-regular': type === 'wifi',
                'text-20px mr-2': true,
              }}
              >
              </i>
              <span>
                {type === 'ethernet' ? '有线网络' : '无线网络'}
              </span>
            </h2>
            <Show when={networkInfo()[type].length === 0}>
              <p class="text-gray-500">无设备</p>
            </Show>
            <Show when={networkInfo()[type].length > 0}>
              <For each={networkInfo()[type]}>
                {info => (
                  <div class="mt-2 row justify-between border border-gray-200 p-2">
                    <p class="mb-1">
                      <span class="font-semibold">设备名称：</span>
                      {info.device}
                    </p>
                    <p class="mb-1">
                      <span class="font-semibold">IP地址：</span>
                      {info.ip}
                    </p>
                    <p>
                      <span class="font-semibold">状态：</span>
                      {info.connected ? '已连接' : '未连接'}
                    </p>
                  </div>
                )}
              </For>
            </Show>
          </div>
        ))}
      </div>
    </div>
  )
}
