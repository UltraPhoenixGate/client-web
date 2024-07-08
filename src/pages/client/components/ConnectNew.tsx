import { For, Match, Show, Switch, createSignal } from 'solid-js'
import type { AddActiveSensorParams } from 'ultraphx-js-sdk'
import { createStore } from 'solid-js/store'
import Button from '@/components/Button'
import { Form, FormItem } from '@/components/Form'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
import { useClient } from '@/context/ClientContext'
import Radio from '@/components/Radio'
import { useModal, useModalInner } from '@/utils/modalManager'

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
        手动添加（主动）
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
  const { client } = useClient()
  let form!: HTMLFormElement

  const {
    errorModal,
    openModal,
  } = useModal()

  const { closeSelfModal } = useModalInner()

  const [basicInfo, setBasicInfo] = createStore({
    name: '',
    description: '',
  })

  const [connectionInfo, setConnectionInfo] = createStore<AddActiveSensorParams['collectionInfo']>({
    dataType: 'json',
    collectionPeriod: 0,
    collectionEndpoint: '',
    ipAddress: '',
    authToken: '',
    customLabels: '',
  })

  const [isAdding, setIsAdding] = createSignal(false)
  async function add() {
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setIsAdding(true)
    client().client.addActiveSensor({
      ...basicInfo,
      collectionInfo: connectionInfo,
    }).then(() => {
      form.reset()
    }).catch((err) => {
      console.error(err)
      errorModal(err.message)
    }).finally(() => {
      setIsAdding(false)
      closeSelfModal()
    })
  }
  const [isTesting, setIsTesting] = createSignal(false)
  function testPull() {
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setIsTesting(true)
    fetch(connectionInfo.collectionEndpoint, {
      headers: {
        Authorization: connectionInfo.authToken || '',
      },
    }).then((res) => {
      if (connectionInfo.dataType === 'json')
        return res.json()
      return res.text()
    }).then((res) => {
      openModal({
        title: '测试结果',
        content: (
          <pre>{JSON.stringify(res, null, 2)}</pre>
        ),
      })
    }).catch((err) => {
      errorModal(err.message)
    }).finally(() => {
      setIsTesting(false)
    })
  }

  return (
    <div class="w-400px">
      <p class="desc">
        注意：仅支持添加
        <strong>主动</strong>
        设备
      </p>
      <Form
        ref={form}
        labelAlign="left"
        labelWidth="80px"
        class="mt-2 w-full"
      >
        <FormItem label="名称">
          <Input
            value={basicInfo.name}
            onInput={v => setBasicInfo('name', v)}
            required
            placeholder="请输入输入名称"
          />
        </FormItem>
        <FormItem label="描述">
          <Input
            value={basicInfo.description}
            onInput={v => setBasicInfo('description', v)}
            placeholder="可选，设备描述"
          />
        </FormItem>
        <FormItem label="数据地址">
          <Input
            value={connectionInfo.collectionEndpoint}
            onInput={v => setConnectionInfo('collectionEndpoint', v)}
            required
            placeholder="数据地址，例如：http://10.10.9.212/data/json"
          />
        </FormItem>
        <FormItem label="数据格式">
          <Radio
            options={[
              { label: 'JSON', value: 'json' },
              { label: 'Metrics', value: 'metrics' },
            ]}
            name="dataType"
            selectedValue={connectionInfo.dataType}
            onChange={v => setConnectionInfo('dataType', v)}
          />
        </FormItem>
        <FormItem label="验证密码">
          <Input />
        </FormItem>
      </Form>
      <div class="mt-4 row">
        <Button
          type="secondary"
          icon="i-fluent:link-20-regular"
          onClick={testPull}
          loading={isTesting()}
        >
          测试连接
        </Button>
        <Button
          type="primary"
          class="ml-2"
          onClick={add}
          icon="i-fluent:add-square-16-regular"
          loading={isAdding()}
        >
          添加
        </Button>
      </div>
    </div>
  )
}

interface MockedLocalDevice {
  name: string
}

function SearchLocal() {
  const [devices, setDevices] = createSignal<MockedLocalDevice[]>([])
  const [loading, setLoading] = createSignal(true)
  const { openModal } = useModal()

  function search() {
    setLoading(true)
    setTimeout(() => {
      setDevices([
        {
          name: 'Ultraphx_0F21',
        },
      ])
      setLoading(false)
    }, 300)
  }

  search()

  function add(device: MockedLocalDevice) {
    openModal({
      title: '连接本地设备',
      content: () => {
        return (
          <ConnectLocal device={device} />
        )
      },
    })
  }

  return (
    <div class="w-400px centerCol">
      <Show when={loading()}>
        <div class="mt-4 text-center">搜索中...</div>
      </Show>
      <For each={devices()}>
        {device => (
          <Card class="w-full centerRow justify-between">
            <div>{device.name}</div>
            <Button
              type="primary"
              onClick={() => add(device)}
            >
              添加
            </Button>
          </Card>
        )}
      </For>
    </div>
  )
}

function ConnectLocal(_props: {
  device: MockedLocalDevice
}) {
  let form!: HTMLFormElement
  const { client } = useClient()
  const { closeAll } = useModal()

  const [basicInfo, setBasicInfo] = createStore({
    name: '',
    description: '',
  })

  const [connectionInfo, setConnectionInfo] = createStore<AddActiveSensorParams['collectionInfo']>({
    dataType: 'json',
    collectionPeriod: 0,
    collectionEndpoint: '',
    ipAddress: '',
    authToken: '',
    customLabels: '',
  })

  const [localWifi, setLocalWifi] = createStore({
    ssid: '',
    password: '',
  })

  const [isAdding, setIsAdding] = createSignal(false)
  const [addingStatus, setAddingStatus] = createSignal<string>('Add')
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  async function add() {
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setIsAdding(true)
    // 1. 连接设备
    setIsAdding(true)
    setAddingStatus('正在连接设备...')
    await sleep(1600)
    // 2. 连接WIFI
    setAddingStatus('正在连接网络...')
    await sleep(2400)
    // 3. 获取设备信息
    setAddingStatus('正在获取设备信息...')
    await sleep(500)
    // 4. 添加设备
    setAddingStatus('正在添加设备...')
    setConnectionInfo('collectionEndpoint', 'http://sensors.hk.dev.wearzdk.me/data/temperature-humidity')
    setConnectionInfo('dataType', 'json')
    setConnectionInfo('ipAddress', '192.168.43.182')
    await client().client.addActiveSensor({
      ...basicInfo,
      collectionInfo: connectionInfo,
    })
    await sleep(100)
    setAddingStatus('添加成功')
    setIsAdding(false)
    closeAll()
  }

  return (
    <div>
      <Show when={isAdding()}>
        <div class="h-200px w-full center">
          <i class="i-svg-spinners:bars-scale-fade text-gray-700" />
          <span>
            {addingStatus()}
          </span>
        </div>
      </Show>
      <Show when={!isAdding()}>
        <h1 class="desc">设备信息</h1>
        <Form
          ref={form}
          labelAlign="left"
          labelWidth="80px"
          class="mt-2 w-full"
        >
          <FormItem label="名称">
            <Input
              value={basicInfo.name}
              onInput={v => setBasicInfo('name', v)}
              required
              placeholder="请输入输入名称"
            />
          </FormItem>
          <FormItem label="描述">
            <Input
              value={basicInfo.description}
              onInput={v => setBasicInfo('description', v)}
              placeholder="可选，设备描述"
            />
          </FormItem>
          <FormItem label="本地WIFI SSID">
            <Input
              value={localWifi.ssid}
              onInput={v => setLocalWifi('ssid', v)}
              required
              placeholder="本地WIFI SSID"
            />
          </FormItem>

          <FormItem label="本地WIFI 密码">
            <Input
              value={localWifi.password}
              onInput={v => setLocalWifi('password', v)}
              type="password"
              placeholder="本地WIFI 密码，可为空"
            />
          </FormItem>

          <Button onClick={add} type="primary" class="mt-4">
            连接
          </Button>
        </Form>
      </Show>
    </div>
  )
}
