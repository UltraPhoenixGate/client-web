import { Match, Show, Switch, createEffect, createSignal, onMount } from 'solid-js'
import { Chart, Colors, Title } from 'chart.js'
import 'chart.js/auto'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import type { MetricsResultItem } from 'ultraphx-js-sdk'
import { Card } from '../Card'
import { fetchDataByDataSource } from './fetchData'
import type { DataPanelConfig, RenderConfig } from './types'

Chart.register(Colors, Title)

export interface DataPanelProps {
  config: DataPanelConfig
}

const gridColSizes: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
}

export function DataPanel(props: DataPanelProps) {
  const [data, setData] = createSignal<MetricsResultItem[]>([])

  createEffect(() => {
    fetchDataByDataSource(props.config.source).then((data) => {
      setData(data)
    })

    if (props.config.refreshInterval) {
      const timer = setInterval(() => {
        fetchDataByDataSource(props.config.source).then((data) => {
          setData(data)
        })
      }, props.config.refreshInterval * 1000)

      return () => clearInterval(timer)
    }
  })

  return (
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
  )
}

const defaultFormatter = new Intl.NumberFormat('zh-CN')

function DataPanelCard(props: {
  data: MetricsResultItem[]
  render: RenderConfig
}) {
  const formatter = props.render.format ? new Intl.NumberFormat('zh-CN', props.render.format) : defaultFormatter
  const colSize = gridColSizes[props.render.size || 3]
  return (
    <Card class={`${colSize}`}>
      <h2 class="text-xl font-bold">{props.render.title}</h2>
      <p class="text-gray-500">{props.render.description}</p>
      <Show when={props.data.length === 0}>
        <div class="text-xl text-text2">加载中...</div>
      </Show>
      <Show when={props.data.length > 0}>
        <div class="text-xl font-bold">
          {formatter.format(Number(props.data[0].value[1]))}
          {props.render.unit}
        </div>
      </Show>
    </Card>
  )
}

function DataPanelLine(props: {
  data: MetricsResultItem[]
  config: DataPanelConfig
}) {
  let chart!: HTMLCanvasElement
  let lineChart: Chart
  const colSize = gridColSizes[props.config.render.size || 3]

  const chartData = () => {
    return {
      // 不再手动生成 labels
      datasets: props.data.map((item) => {
        return {
          label: item.metric.__name__,
          data: item.values.map(value => ({
            id: value[0],
            x: value[0] * 1000,
            y: Number(value[1]),
          })),
          fill: false,
          tension: 0.1,
        }
      }),
    }
  }

  createEffect(() => {
    console.log(props.data)

    if (!props.data.length || !props.data[0].values)
      return

    if (!lineChart) {
      lineChart = new Chart(chart, {
        type: 'line',
        data: chartData(),
        options: {
          responsive: false,
          animation: false,
          scales: {
            x: {
              type: 'time',
              ticks: {
                autoSkip: true,
                maxTicksLimit: 3 * (props.config.render.size || 3),
              },
            },
            y: {
            },
          },
          plugins: {
            title: {
              display: true,
              text: props.config.render.title,
              align: 'start',
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'start',
            },
          },
        },
      })
      return
    }
    lineChart.data = chartData()
    lineChart.update()
  })

  return (
    <Card class={`${colSize}`}>
      <canvas ref={chart} class="h-200px w-full"></canvas>
    </Card>
  )
}
function DataPanelBar(props: {
  data: MetricsResultItem[]
  config: DataPanelConfig
}) {
  let chart!: HTMLCanvasElement
  let barChart: Chart

  const chartData = () => {
    return {
      scales: {
        x: {
          type: 'time',
          time: {
            // unit: 'minute',
            // 最大条数
          },
        },
      },
      datasets: [
        {
          label: props.config.render.title,
          data: props.data.map(item => Number(item.value[1])),
          fill: false,
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
        responsive: false,
        animation: false,
      },
    })
  })

  createEffect(() => {
    barChart.data = chartData()
    barChart.update()
  })

  return (
    <Card>
      <canvas ref={chart} class="h-200px w-full"></canvas>
    </Card>
  )
}
