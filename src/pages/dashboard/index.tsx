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
    title: '总体设备数',
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      type: 'card',
    },
    refreshInterval: 5,
  },
  {
    title: '当前温度',
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      type: 'card',
      unit: '°C',
    },
    refreshInterval: 5,
  },
  {
    title: '当前湿度',
    source: {
      type: 'byDevice',
      labels: ['cpu_usage'],
      timeRange: { type: 'last7days' },
    },
    render: {
      type: 'card',
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
