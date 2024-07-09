import { For, Match, Show, Switch, createSignal } from 'solid-js'
import type { AddCameraParams, OnvifDevice } from 'ultraphx-js-sdk'
import { createStore } from 'solid-js/store'
import Button from '@/components/Button'
import { Form, FormItem } from '@/components/Form'
import { Input } from '@/components/Input'
import { useModal, useModalInner } from '@/utils/modalManager'
import { useClient } from '@/context/ClientContext'
import { Card } from '@/components/Card'

export function ConnectNew() {
  const [status, setStatus] = createSignal<'ChooseCamera' | 'SearchCamera' | 'AddCamera'>('ChooseCamera')
  return (
    <Switch>
      <Match when={status() === 'ChooseCamera'}>
        <ChooseCamera onChoose={(m) => {
          setStatus(m)
        }}
        />
      </Match>
      <Match when={status() === 'SearchCamera'}>
        <SearchCamera />
      </Match>
      <Match when={status() === 'AddCamera'}>
        <AddCamera />
      </Match>
    </Switch>
  )
}

function ChooseCamera({
  onChoose,
}: {
  onChoose: (method: 'SearchCamera' | 'AddCamera') => void
}) {
  return (
    <div class="w-500px centerCol">
      <Button
        onClick={() => onChoose('AddCamera')}
        icon="i-fluent:camera-add-20-regular"
        size="large"
      >
        手动添加
      </Button>
      <Button
        onClick={() => onChoose('SearchCamera')}
        class="mt-4"
        icon="i-fluent:globe-search-20-regular"
        size="large"
      >
        在本地网络中搜索
      </Button>
    </div>
  )
}

function SearchCamera() {
  const {
    openModal,
    errorModal,
    closeAll,
  } = useModal()
  const [devices, setDevices] = createSignal<OnvifDevice[]>([])
  const [loading, setLoading] = createSignal(true)
  const { client } = useClient()

  function search() {
    setLoading(true)
    client().camera.scanOnvifDevices().then((res) => {
      setDevices(res.devices)
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  function connect(device: OnvifDevice) {
    openModal({
      title: '连接到设备',
      content() {
        const [status, setStatus] = createSignal<string>('')
        const [isConnecting, setIsConnecting] = createSignal(false)
        const [auth, setAuth] = createStore({
          user: '',
          password: '',
        })
        async function connect() {
          setIsConnecting(true)
          setStatus('正在获取设备信息...')
          const streamInfo = await client().camera.getOnvifDeviceInfo({
            xAddr: device.xAddr,
            ...auth,
          })
          setStatus('正在添加设备...')
          await client().camera.addCamera({
            name: device.name,
            description: device.model,
            streamUrl: streamInfo.streamUrl,
            protocol: 'rtsp',
          })
          setStatus('添加成功')
          await new Promise((resolve) => {
            setTimeout(resolve, 1000)
          })
          closeAll()
        }

        function handelConnect() {
          connect().catch((e) => {
            errorModal(e.message)
            setIsConnecting(false)
          })
        }

        return (
          <div class="w-400px col">
            <Show when={isConnecting()}>
              <div class="h-200px w-full center">
                <i class="i-svg-spinners:bars-scale-fade text-gray-700" />
                <span>
                  {status()}
                </span>
              </div>
            </Show>
            <Show when={!isConnecting()}>
              <p>
                连接设备
                {device.name}
              </p>
              <Form>
                <FormItem label="用户名">
                  <Input
                    type="text"
                    placeholder="请输入用户名，如果没有验证请留空"
                    value={status()}
                    onInput={(v) => {
                      setAuth('user', v)
                    }}
                  />
                </FormItem>
                <FormItem label="密码">
                  <Input
                    type="password"
                    value={status()}
                    placeholder="请输入密码，如果没有设置密码请留空"
                    onInput={(v) => {
                      setAuth('password', v)
                    }}
                  />
                </FormItem>
              </Form>
              <Button onClick={handelConnect} class="mt-4">连接</Button>
            </Show>
          </div>
        )
      },

    })
  }

  search()

  return (
    <div class="min-h-200px w-500px centerCol">
      <Show when={loading()}>
        <p>正在本地网络中搜索...</p>
      </Show>
      <Show when={!loading()}>
        <div class="w-full">
          <Show when={devices().length === 0}>
            <p>未找到可用设备</p>
          </Show>
          <For each={devices()}>
            {device => (
              <Card class="w-full row items-center justify-between">
                <div class="text-sm">
                  <div>{device.name}</div>
                  <div>{device.manufacturer}</div>
                  <div>{device.model}</div>
                  <div>{device.xAddr}</div>
                </div>
                <Button onClick={() => connect(device)}>
                  连接
                </Button>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

function AddCamera() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement>()
  const {
    openModal,
    errorModal,
  } = useModal()
  const {
    closeSelfModal,
  } = useModalInner()

  const [params, setParams] = createStore<AddCameraParams>({
    name: '',
    description: '',
    streamUrl: '',
    protocol: 'rtsp',
  })
  const [isTesting, setIsTesting] = createSignal(false)
  const [isAdding, setIsAdding] = createSignal(false)
  const { client } = useClient()

  function runTest() {
    setIsTesting(true)
    const form = formRef()
    if (!form)
      return

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    client().camera.getCurrentFrame(params.streamUrl).then((res) => {
      openModal({
        title: '测试结果',
        content: <img src={res.image} width={500} />,
      })
    }).catch((e) => {
      errorModal(e.message)
    }).finally(() => {
      setIsTesting(false)
    })
  }

  function addCamera() {
    setIsAdding(true)
    const form = formRef()
    if (!form)
      return

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    client().camera.addCamera(params).then(() => {
      openModal({
        title: '添加成功',
        content: '添加成功',
      })
      closeSelfModal()
    }).catch((e) => {
      errorModal(e.message)
    }).finally(() => {
      setIsAdding(false)
    })
  }

  return (
    <div class="w-500px col">
      <Form ref={setFormRef} labelAlign="left" labelWidth="100px">
        <FormItem label="名称">
          <Input
            type="text"
            value={params.name}
            onInput={(v) => {
              setParams('name', v)
            }}
            placeholder="在此输入名称"
            class=""
            required
          />
        </FormItem>
        <FormItem label="描述">
          <Input
            type="text"
            value={params.description}
            onInput={(v) => {
              setParams('description', v)
            }}
            placeholder="在此输入描述"
            class="flex-1"
            required
          />
        </FormItem>
        <FormItem label="串流地址">
          <Input
            type="text"
            value={params.streamUrl}
            onInput={(v) => {
              setParams('streamUrl', v)
            }}
            placeholder="例如：rtsp://192.168.1.188:8554/live0"
            class="flex-1"
            required
          />
        </FormItem>

      </Form>

      <div class="mt-4 row">
        <Button
          onClick={runTest}
          icon="i-fluent:link-20-regular"
          loading={isTesting()}
        >
          测试连接
        </Button>
        <Button
          loading={isAdding()}
          onClick={addCamera}
          icon="i-fluent:camera-add-20-regular"
          type="primary"
          class="ml-2"
        >
          添加
        </Button>
      </div>

    </div>
  )
}
