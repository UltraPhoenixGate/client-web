import { Match, Switch, createSignal } from 'solid-js'
import type { AddCameraParams } from 'ultraphx-js-sdk'
import { createStore } from 'solid-js/store'
import Button from '@/components/Button'
import { Form, FormItem } from '@/components/Form'
import { Input } from '@/components/Input'
import { client, useClient } from '@/context/ClientContext'
import { errorModal, openModal } from '@/utils/modalManager'

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
  return (
    <div class="w-500px centerCol">
      SearchCamera
    </div>
  )
}

function AddCamera() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement>()
  const [params, setParams] = createStore<AddCameraParams>({
    name: '',
    description: '',
    streamUrl: '',
    protocol: 'rtsp',
  })
  const [isTesting, setIsTesting] = createSignal(false)
  const [isAdding, setIsAdding] = createSignal(false)

  function runTest() {
    setIsTesting(true)
    const form = formRef()
    if (!form)
      return

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    client.camera.getCurrentFrame(params.streamUrl).then((res) => {
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

    client.camera.addCamera(params).then(() => {
      openModal({
        title: '添加成功',
        content: '添加成功',
      })
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
