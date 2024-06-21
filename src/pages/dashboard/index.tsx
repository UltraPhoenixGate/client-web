import { DataPanel } from '@/components/panel/DataPanel'
import type { DataPanelConfig } from '@/components/panel/types'

export default function Home() {
  return (
    <div class="p-4">
      <DataList />
    </div>
  )
}

const panels: DataPanelConfig[] = [
  {
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      title: '总体设备数',
      type: 'card',
    },
    refreshInterval: 5,
  },
  {
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      title: '当前温度',
      type: 'card',
      unit: '°C',
      format: {
        unit: 'celsius',
      },
    },
    refreshInterval: 5,
  },
  {
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      title: '当前湿度',
      type: 'card',
      unit: '%',
    },
    refreshInterval: 5,
  },
  {
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      title: '当前风速',
      type: 'card',
      unit: 'm/s',
    },
    refreshInterval: 5,
  },
  {
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      title: '历史温度',
      type: 'line',
      unit: '%',
    },
    refreshInterval: 5,
  },

  {
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      title: '历史湿度',
      type: 'bar',
      unit: '%',
    },
    refreshInterval: 5,
  },
]

function DataList() {
  return (
    <div class="grid grid-cols-4 gap-4">
      {panels.map(panel => (
        <DataPanel config={panel} />
      ))}
    </div>
  )
}
