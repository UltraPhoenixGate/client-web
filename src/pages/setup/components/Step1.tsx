import { useNavigate } from '@solidjs/router'
import { Show, createEffect, createSignal } from 'solid-js'
import { Step } from './Step'
import Button from '@/components/Button'
import { FormItem } from '@/components/Form'
import { Input } from '@/components/Input'
import { useClient } from '@/context/ClientContext'
import { useConfig } from '@/context/ConfigContext'

export function Step1() {
  const [isAvailable, setIsAvailable] = createSignal(false)
  const [isPing, setIsPing] = createSignal(true)
  const { client } = useClient()
  const { config, setConfig } = useConfig()
  const navigate = useNavigate()

  // 高级选项
  const [isAdvanced, setIsAdvanced] = createSignal(false)

  createEffect(() => {
    setIsPing(true)
    client().http.get('/ping').then(() => {
      setIsAvailable(true)
    }).catch(() => {
      setIsAvailable(false)
    }).finally(() => {
      setIsPing(false)
    })
  })

  return (
    <Step title="欢迎使用 UltraPhoenix 工业网关">
      <div class="mt-8vh">
        <div class="relative">
          <i class="i-fluent:router-24-regular text-160px text-text2"></i>
          <i class={[
            'absolute right-0px bottom-10px text-20px',
            isAvailable() ? 'i-fluent:checkmark-16-filled text-success' : 'i-fluent:dismiss-12-filled text-danger',
          ].join(' ')}
          >
          </i>
        </div>
      </div>

      <Button
        disabled={!isAvailable() || isPing()}
        loading={isPing()}
        class="mt-8vh"
        size="large"
        type="primary"
        onClick={() => navigate('/setup/2')}
      >
        开始使用
      </Button>

      <div class="mt-8 w-full centerCol">
        <a
          onClick={() => setIsAdvanced(!isAdvanced())}
          class="textVCenterFlex cursor-pointer text-text2 hover:text-op-80"
        >
          <span>高级选项</span>
          <i classList={{
            'i-fluent:chevron-right-24-regular ml-1 transform transition-transform': true,
            'rotate-90': isAdvanced(),
          }}
          >
          </i>
        </a>
        <Show when={isAdvanced()}>
          <div class="mt-4 w-400px">
            <FormItem label="设备地址" labelAlign="left" description="通常保持默认即可">
              <Input
                value={config.backendUrl}
                onInput={v => setConfig('backendUrl', v)}
                placeholder="请输入设备地址"
              />
            </FormItem>
          </div>
        </Show>
      </div>
    </Step>
  )
}
