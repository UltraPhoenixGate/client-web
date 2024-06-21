import { Match, Show, Switch, createEffect, createSignal } from 'solid-js'
import type { SensorDataItem } from './fetchData'
import { fetchDataByDataSource, praseMetricsResult } from './fetchData'
import type { DataPanelConfig } from './types'

export interface DataPanelProps {
  config: DataPanelConfig
}

export function DataPanel(props: DataPanelProps) {
  const [data, setData] = createSignal<SensorDataItem[]>([])

  createEffect(() => {
    fetchDataByDataSource(props.config.source).then((data) => {
      setData(praseMetricsResult(data))
    })

    if (props.config.refreshInterval) {
      const timer = setInterval(() => {
        fetchDataByDataSource(props.config.source).then((data) => {
          setData(praseMetricsResult(data))
        })
      }, props.config.refreshInterval * 1000)

      return () => clearInterval(timer)
    }
  })

  return (
    <div>
      <Switch>
        <Match when={props.config.render.type === 'card'}>
          <DataPanelCard data={data()} config={props.config} />
        </Match>
      </Switch>
    </div>
  )
}

function DataPanelCard(props: {
  data: SensorDataItem[]
  config: DataPanelConfig
}) {
  return (
    <div class="rounded bg-gray-100 p-4">
      <h2 class="text-xl font-bold">{props.config.title}</h2>
      <p class="text-gray-500">{props.config.description}</p>
      <Show when={props.data.length === 0}>
        <div class="text-gray-500">加载中...</div>
      </Show>
      <Show when={props.data.length > 0}>
        <div class="text-xl font-bold">{props.data[0].value}</div>
      </Show>
    </div>
  )
}
