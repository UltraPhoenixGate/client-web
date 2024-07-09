import { For, Show, createEffect, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Form, FormItem } from '../Form'
import { Input } from '../Input'
import Button from '../Button'
import { Select } from '../Select'
import { type DataPanelConfig, type DataSource, type RenderConfig, timeRangeLabels, timeRanges } from './types'
import { fetchDataByDataSources } from './fetchData'
import { useModal, useModalInner } from '@/utils/modalManager'
import { useRequest } from '@/hooks/useRequest'
import { client } from '@/context/ClientContext'
import { usePanel } from '@/context/PanelContext'

interface DataPanelEditorProps {
  initialConfig: DataPanelConfig
  onSave: (config: DataPanelConfig) => void
}

export function DataPanelEditor(props: DataPanelEditorProps) {
  const [config, setConfig] = createSignal<DataPanelConfig>({ ...props.initialConfig })
  let form!: HTMLFormElement
  const {
    errorModal,
    confirmModal,
  } = useModal()

  const {
    closeSelfModal,
  } = useModalInner()

  const { hasPanel, removePanel } = usePanel()

  const handleSave = () => {
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    // 数据源不能为空
    if (config().source.length === 0) {
      errorModal('数据源不能为空')
      return
    }
    props.onSave(config())
  }

  const handleRenderChange = (field: keyof RenderConfig, value: any) => {
    setConfig(prev => ({ ...prev, render: { ...prev.render, [field]: value } }))
  }

  const handleRefreshIntervalChange = (value: number) => {
    setConfig(prev => ({ ...prev, refreshInterval: value }))
  }

  function handelRemovePanel() {
    confirmModal({
      title: '删除面板',
      content: '确定删除该面板吗？',
      onOk: () => {
        removePanel(config().uuid)
        closeSelfModal()
      },
    })
  }

  return (
    <div>
      <Form labelAlign="left" labelWidth="110px" ref={form}>
        <FormItem label="标题">
          <Input
            type="text"
            class="mt-1 block w-full"
            placeholder="请输入面板标题"
            value={config().render.title}
            onInput={v => handleRenderChange('title', v)}
            required
          />
        </FormItem>

        <FormItem label="描述">
          <Input
            type="text"
            class="mt-1 block w-full"
            value={config().render.description}
            placeholder="请输入描述信息"
            onInput={v => handleRenderChange('description', v)}
          />
        </FormItem>

        <FormItem label="面板宽度" description="范围 1-12 如6则代表占一半位置">
          <Input
            type="number"
            class="mt-1 block w-full"
            value={config().render.size?.toString()}
            onInput={v => handleRenderChange('size', Number.parseInt(v))}
          />
        </FormItem>

        <FormItem label="面板类型">
          <Select
            class="mt-1 block w-full"
            value={config().render.type}
            onChange={v => handleRenderChange('type', v)}
            options={[
              { value: 'line', label: '折线图' },
              { value: 'bar', label: '柱状图' },
              { value: 'pie', label: '饼图' },
              { value: 'card', label: '卡片' },
            ]}
          />
        </FormItem>

        <FormItem label="刷新间隔（秒）">
          <Input
            type="number"
            class="mt-1 block w-full"
            value={config().refreshInterval?.toString()}
            onInput={v => handleRefreshIntervalChange(Number.parseInt(v))}
          />
        </FormItem>

        <FormItem label="数据单位">
          <Input
            type="text"
            class="mt-1 block w-full"
            value={config().render.unit}
            placeholder="如：mg/m³"
            onInput={v => handleRenderChange('unit', v)}
          />
        </FormItem>

      </Form>

      {/* 数据源 */}
      <FormItem labelAlign="left" labelWidth="110px" label="数据源" class="mt-2">
        <DataSourceEditor
          initialSources={config().source}
          onChange={sources => setConfig(prev => ({ ...prev, source: sources }))}
          onClose={() => { }}
        />
      </FormItem>

      <div class="mt-2 row">
        <Button class="mr-2" onClick={handleSave} type="primary">保存</Button>
        <Show when={hasPanel(config().uuid)}>
          <Button type="danger" onClick={handelRemovePanel}>删除</Button>
        </Show>
      </div>
    </div>
  )
}

function getEmptyDataSource(): DataSource {
  return {
    type: 'default',
    labels: {
      sensorId: '',
      __name__: '',
    },
    timeRange: { type: 'latest' },
  }
}

interface DataSourceEditorProps {
  initialSources: DataSource[]
  onChange: (sources: DataSource[]) => void
  onClose: () => void
}

function DataSourceEditor(props: DataSourceEditorProps) {
  const [sources, setSources] = createSignal<DataSource[]>([...props.initialSources])
  const {
    openModal,
    closeModal,
  } = useModal()
  const removeSource = (index: number) => {
    setSources(prev => prev.filter((_, i) => i !== index))
    props.onChange(sources())
  }

  function handelAddSource() {
    const modalId = openModal({
      title: '新增数据源',
      content: () => {
        return (
          <DataSourceForm
            source={getEmptyDataSource()}
            onSave={(source) => {
              setSources(prev => [...prev, source])
              closeModal(modalId)
              props.onChange(sources())
            }}
          />
        )
      },
    })
  }

  function handelEditSource(index: number) {
    const modalId = openModal({
      title: '编辑数据源',
      content: () => {
        return (
          <DataSourceForm
            source={sources()[index]}
            onSave={(source) => {
              setSources(prev => prev.map((item, i) => i === index ? source : item))
              closeModal(modalId)
              props.onChange(sources())
            }}
          />
        )
      },
    })
  }

  return (
    <div class="w-full flex-1">
      <For each={sources()}>
        {(_source, index) => (
          <div class="row justify-between">
            <p class="text-sm">
              数据源
              {index() + 1}
            </p>
            <div class="row">
              <Button size="small" onClick={() => handelEditSource(index())}>
                编辑
              </Button>
              <Button size="small" type="danger" onClick={() => removeSource(index())}>
                删除
              </Button>
            </div>
          </div>
        )}
      </For>

      <Button onClick={handelAddSource} size="small">添加数据源</Button>
    </div>
  )
}

function DataSourceForm(props: {
  source: DataSource
  onSave: (source: DataSource) => void
}) {
  const {
    errorModal,
  } = useModal()
  const [source, setSource] = createStore({ ...props.source })
  const { data: sensors } = useRequest(client().client.getConnectedClients, {}, {
    onError(err) {
      errorModal(err.message)
    },
  })
  const [availableMetrics, setAvailableMetrics] = createSignal<string[]>([])
  createEffect(async () => {
    console.log(source)
    const actSource = JSON.parse(JSON.stringify(source)) as DataSource
    actSource.labels.__name__ = ''
    // 获取离散数据
    actSource.timeRange.type = 'last15min'
    const allData = await fetchDataByDataSources([actSource])
    setAvailableMetrics(allData.map(item => item.metric.__name__))
  })

  function handleSave() {
    props.onSave(source)
  }

  return (
    <div>
      <Form labelAlign="left" labelWidth="120px">
        <FormItem label="数据源类型">
          <Select
            value={source.type}
            options={[
              { value: 'default', label: '默认' },
            ]}
            onChange={v => setSource('type', v as any)}
          />
        </FormItem>

        <FormItem label="传感器">
          <Select
            value={source.labels.sensor_id || ''}
            onChange={v => setSource('labels', { ...source.labels, sensor_id: v })}
            options={sensors()?.map(sensor => ({ value: sensor.id, label: sensor.name })) || []}
            disabled={sensors()?.length === 0}
          />
        </FormItem>

        <FormItem label="数据列">
          <Select
            value={source.labels.__name__ || ''}
            onChange={v => setSource('labels', { ...source.labels, __name__: v })}
            options={[
              { value: '', label: '全部' },
              ...availableMetrics().map(metric => ({ value: metric, label: metric })),
            ]}
          />
        </FormItem>

        <FormItem label="时间范围">
          <Select
            value={source.timeRange.type}
            onChange={v => setSource('timeRange', { ...source.timeRange, type: v as any })}
            options={[
              { value: 'latest', label: '最新数据' },
              { value: 'custom', label: '时间范围' },
              ...Object.keys(timeRanges).map(key => ({ value: key, label: timeRangeLabels[key as keyof typeof timeRanges] })),
            ]}
          />
        </FormItem>
      </Form>
      <div class="mt-2">
        <Button onClick={handleSave}>
          确认
        </Button>
      </div>
    </div>
  )
}
