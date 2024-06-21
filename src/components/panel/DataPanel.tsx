import { Match, Show, Switch, createEffect, createSignal, onMount } from 'solid-js'
import { Chart } from 'chart.js'
import 'chart.js/auto'
import dayjs from 'dayjs'
import type { SensorDataItem } from './fetchData'
import { fetchDataByDataSource, praseMetricsResult } from './fetchData'
import type { DataPanelConfig, RenderConfig } from './types'

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
          <DataPanelCard data={data()} render={props.config.render} />
        </Match>
        <Match when={props.config.render.type === 'line'}>
          <DataPanelLine data={data()} config={props.config} />
        </Match>
        <Match when={props.config.render.type === 'bar'}>
          <DataPanelBar data={data()} config={props.config} />
        </Match>
      </Switch>
    </div>
  )
}

const defaultFormatter = new Intl.NumberFormat('zh-CN')

function DataPanelCard(props: {
  data: SensorDataItem[]
  render: RenderConfig
}) {
  const formatter = props.render.format ? new Intl.NumberFormat('zh-CN', props.render.format) : defaultFormatter
  return (
    <div class="bg-gray-100 p-4">
      <h2 class="text-xl font-bold">{props.render.title}</h2>
      <p class="text-gray-500">{props.render.description}</p>
      <Show when={props.data.length === 0}>
        <div class="text-xl text-text2">加载中...</div>
      </Show>
      <Show when={props.data.length > 0}>
        <div class="text-xl font-bold">
          {formatter.format(props.data[props.data.length - 1].value)}
          {props.render.unit}
        </div>
      </Show>
    </div>
  )
}

function DataPanelLine(props: {
  data: SensorDataItem[]
  config: DataPanelConfig
}) {
  let chart!: HTMLCanvasElement
  let lineChart: Chart

  const chartData = () => {
    return {
      labels: props.data.map(item => dayjs(item.time).format('HH:mm:ss')),
      datasets: [
        {
          label: props.config.render.title,
          data: props.data.map(item => item.value),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    }
  }

  onMount(() => {
    lineChart = new Chart(chart, {
      type: 'line',
      data: chartData(),
      options: {
        responsive: true,
        animation: false,
      },
    })
  })

  createEffect(() => {
    lineChart.data = chartData()
    lineChart.update()
  })

  return (
    <div class="bg-gray-100 p-4">
      <canvas ref={chart} width="400" height="200"></canvas>
    </div>
  )
}

function DataPanelBar(props: {
  data: SensorDataItem[]
  config: DataPanelConfig
}) {
  let chart!: HTMLCanvasElement
  let barChart: Chart

  const chartData = () => {
    return {
      labels: props.data.map(item => dayjs(item.time).format('HH:mm:ss')),
      datasets: [
        {
          label: props.config.render.title,
          data: props.data.map(item => item.value),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    }
  }

  onMount(() => {
    barChart = new Chart(chart, {
      type: 'bar',
      data: chartData(),
      options: {
        responsive: true,
        animation: false,
      },
    })
  })

  createEffect(() => {
    barChart.data = chartData()
    barChart.update()
  })

  return (
    <div class="bg-gray-100 p-4">
      <canvas ref={chart} width="400" height="200"></canvas>
    </div>
  )
}
