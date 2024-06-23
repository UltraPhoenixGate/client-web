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
      type: 'byLabels',
      labels: {
        __name__: 'temperature',
        name: '温度传感器',
      },
      timeRange: { type: 'latest' },
    },
    render: {
      title: '当前温度',
      type: 'card',
      unit: '°C',
    },
    refreshInterval: 5,
  },
  {
    source: {
      type: 'byLabels',
      labels: {
        __name__: 'humidity',
        name: '温度传感器',
      },
      timeRange: { type: 'latest' },
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
      type: 'byLabels',
      labels: {
        __name__: 'light',
        name: '亮度传感器',
      },
      timeRange: { type: 'latest' },
    },
    render: {
      title: '光照强度',
      type: 'card',
      unit: 'lux',
    },
    refreshInterval: 5,
  },
  {
    source: {
      type: 'byLabels',
      labels: {
        __name__: 'pm25',
        name: '空气质量传感器',
      },
      timeRange: { type: 'latest' },
    },
    render: {
      title: 'PM2.5',
      type: 'card',
      unit: 'μg/m³',
    },
    refreshInterval: 5,
  },
  {
    source: [{
      type: 'byLabels',
      labels: {
        __name__: 'temperature',
        name: '温度传感器',
      },
      timeRange: { type: 'last5min' },
    }, {
      type: 'byLabels',
      labels: {
        __name__: 'humidity',
        name: '温度传感器',
      },
      timeRange: { type: 'last5min' },
    }],
    render: {
      title: '历史温湿度',
      type: 'line',
      unit: '%',
      size: 6,
    },
    refreshInterval: 5,
  },
  {
    source: [{
      type: 'byLabels',
      labels: {
        name: '空气质量传感器',
      },
      timeRange: { type: 'last5min' },
    }],
    render: {
      title: '空气质量监测',
      type: 'line',
      unit: '%',
      size: 6,
    },
    refreshInterval: 5,
  },

  // {
  //   source: {
  //     type: 'byLabels',
  //     labels: {
  //       __name__: 'humidity',
  //       name: '温度传感器',
  //     },
  //     timeRange: { type: 'last15min' },
  //   },
  //   render: {
  //     title: '历史湿度',
  //     type: 'bar',
  //     unit: '%',
  //   },
  //   refreshInterval: 5,
  // },
]

function DataList() {
  return (
    <div class="grid grid-cols-12 gap-4">
      {panels.map(panel => (
        <DataPanel config={panel} />
      ))}
    </div>
  )
}
