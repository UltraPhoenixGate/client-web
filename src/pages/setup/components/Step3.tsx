import { For, Match, Show, Switch, createEffect, createMemo, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import type { NetworkInfoItem } from 'ultraphx-js-sdk'
import { Step } from './Step'
import Button from '@/components/Button'
import { useClient } from '@/context/ClientContext'
import { useModal } from '@/utils/modalManager'
import { useRequest } from '@/hooks/useRequest'

export function Step3() {
  const [networkStatus, setNetworkStatus] = createSignal<'success' | 'error' | 'loading'>('loading')
  const { client } = useClient()
  const { errorModal } = useModal()
  const navigate = useNavigate()
  const {
    data: networkInfos,
  } = useRequest(client().system.getNetworkInfos, {})

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

  createEffect(() => {
    client().system.checkNetwork().then((res) => {
      if (res.status) {
        setTimeout(() => {
          setNetworkStatus('success')
        }, 1000)
      }
      else {
        setNetworkStatus('error')
      }
    }).catch((e) => {
      setNetworkStatus('error')
      errorModal(`获取网络状态失败${e.message}`)
    })
  })

  return (
    <Step title="设置网络">
      <div class="mt-4vh min-h-15vh centerCol">
        <i classList={{
          'text-80px text-text2': true,
          'i-svg-spinners:bars-fade': networkStatus() === 'loading',
          'i-fluent:checkmark-16-filled text-success': networkStatus() === 'success',
          'i-fluent:cloud-error-24-regular text-danger': networkStatus() === 'error',
        }}
        >
        </i>
        <p class="text-center text-text2">
          <Switch>
            <Match when={networkStatus() === 'loading'}>
              正在检查网络状态
            </Match>

            <Match when={networkStatus() === 'success'}>
              网络状态正常
            </Match>

            <Match when={networkStatus() === 'error'}>
              网络状态异常
            </Match>
          </Switch>
        </p>

        <Show when={networkStatus() === 'error'}>
          <Button
            class="mt-2vh"
            type="primary"
            onClick={() => {
              client().system.openNetworkSettings().catch((e) => {
                errorModal(`${e.message}`)
              })
            }}
          >
            打开网络设置
          </Button>
        </Show>

        <Show when={networkStatus() === 'success'}>
          <div class="mt-4"></div>
          {(['ethernet', 'wifi'] as ['ethernet', 'wifi']).map(type => (
            <div class="mb-4 w-440px">
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
        </Show>
      </div>

      <Button
        class="mt-8vh"
        size="large"
        type="primary"
        onClick={() => navigate('/')}
      >
        完成
      </Button>
    </Step>
  )
}
