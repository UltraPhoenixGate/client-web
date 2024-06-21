import { For, Match, Show, Switch, createSignal } from 'solid-js'
import type { OnvifDevice } from 'ultraphx-js-sdk'
import { createStore } from 'solid-js/store'
import Button from '@/components/Button'
import { Form, FormItem } from '@/components/Form'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'

export function ConnectNew() {
  const [status, setStatus] = createSignal<'AddManual' | 'SearchLocal' | 'ChooseOption'>('ChooseOption')
  return (
    <Switch>
      <Match when={status() === 'ChooseOption'}>
        <ChooseOption onChoose={(m) => {
          setStatus(m)
        }}
        />
      </Match>
      <Match when={status() === 'AddManual'}>
        <AddManual />
      </Match>
      <Match when={status() === 'SearchLocal'}>
        <SearchLocal />
      </Match>
    </Switch>
  )
}

function ChooseOption({
  onChoose,
}: {
  onChoose: (method: 'AddManual' | 'SearchLocal') => void
}) {
  return (
    <div class="w-500px centerCol">
      <Button
        onClick={() => onChoose('AddManual')}
        icon="i-fluent:camera-add-20-regular"
        size="large"
      >
        手动添加
      </Button>
      <Button
        onClick={() => onChoose('SearchLocal')}
        class="mt-4"
        icon="i-fluent:globe-search-20-regular"
        size="large"
      >
        在本地网络中搜索
      </Button>
    </div>
  )
}

function AddManual() {
  const [form, setForm] = createStore({
    name: '',
    ip: '',
    port: 80,
    username: '',
    password: '',
  })

  async function add() {
  }

  return (
    <Form>
      <FormItem label="名称">
        <Input />
      </FormItem>
      <FormItem label="描述">
        <Input />
      </FormItem>
      <FormItem label="数据地址">
        <Input />
      </FormItem>
      <FormItem label="数据格式">
        <Input />
      </FormItem>
      <FormItem label="验证密码">
        <Input />
      </FormItem>
      <div class="mt-4">
        <Button type="primary" onClick={add}>添加</Button>
      </div>
    </Form>
  )
}

function SearchLocal() {
  const [devices, setDevices] = createSignal<OnvifDevice[]>([])
  const [loading, setLoading] = createSignal(true)

  function search() {
    setLoading(true)
  }

  async function add(device: OnvifDevice) {
  }

  return (
    <div class="w-500px centerCol">
      <Button
        onClick={search}
        icon="i-fluent:globe-search-20-regular"
        size="large"
      >
        搜索
      </Button>
      <Show when={loading()}>
        <div class="mt-4 text-center">搜索中...</div>
      </Show>
      <For each={devices()}>
        {device => (
          <div class="mt-4">
            <Card>
              <div class="mt-2">
                <Button
                  type="primary"
                  onClick={() => add(device)}
                >
                  添加
                </Button>
              </div>
            </Card>
          </div>
        )}
      </For>
    </div>
  )
}
