import { v7 as uuid } from 'uuid'
import Button from '@/components/Button'
import { DataPanel } from '@/components/panel/DataPanel'
import type { DataPanelConfig } from '@/components/panel/types'
import { usePanel } from '@/context/PanelContext'
import { useModal } from '@/utils/modalManager'
import { DataPanelEditor } from '@/components/panel/PanelEditor'

export default function Home() {
  return (
    <div class="p-4">

      <DataList />
    </div>
  )
}

// const panels: DataPanelConfig[] = [
//   {
//     source: {
//       type: 'byLabels',
//       labels: {
//         __name__: 'temperature',
//         name: '温度传感器',
//       },
//       timeRange: { type: 'latest' },
//     },
//     render: {
//       title: '当前温度',
//       type: 'card',
//       unit: '°C',
//     },
//     refreshInterval: 5,
//   },
//   {
//     source: {
//       type: 'byLabels',
//       labels: {
//         __name__: 'humidity',
//         name: '温度传感器',
//       },
//       timeRange: { type: 'latest' },
//     },
//     render: {
//       title: '当前湿度',
//       type: 'card',
//       unit: '%',
//     },
//     refreshInterval: 5,
//   },
//   {
//     source: {
//       type: 'byLabels',
//       labels: {
//         __name__: 'light',
//         name: '亮度传感器',
//       },
//       timeRange: { type: 'latest' },
//     },
//     render: {
//       title: '光照强度',
//       type: 'card',
//       unit: 'lux',
//     },
//     refreshInterval: 5,
//   },
//   {
//     source: {
//       type: 'byLabels',
//       labels: {
//         __name__: 'pm25',
//         name: '空气质量传感器',
//       },
//       timeRange: { type: 'latest' },
//     },
//     render: {
//       title: 'PM2.5',
//       type: 'card',
//       unit: 'μg/m³',
//     },
//     refreshInterval: 5,
//   },
//   {
//     source: [{
//       type: 'byLabels',
//       labels: {
//         __name__: 'temperature',
//         name: '温度传感器',
//       },
//       timeRange: { type: 'last5min' },
//     }, {
//       type: 'byLabels',
//       labels: {
//         __name__: 'humidity',
//         name: '温度传感器',
//       },
//       timeRange: { type: 'last5min' },
//     }],
//     render: {
//       title: '历史温湿度',
//       type: 'line',
//       unit: '%',
//       size: 6,
//     },
//     refreshInterval: 5,
//   },
//   {
//     source: [{
//       type: 'byLabels',
//       labels: {
//         name: '空气质量传感器',
//       },
//       timeRange: { type: 'last5min' },
//     }],
//     render: {
//       title: '空气质量监测',
//       type: 'line',
//       unit: '%',
//       size: 6,
//     },
//     refreshInterval: 5,
//   },

//   // {
//   //   source: {
//   //     type: 'byLabels',
//   //     labels: {
//   //       __name__: 'humidity',
//   //       name: '温度传感器',
//   //     },
//   //     timeRange: { type: 'last15min' },
//   //   },
//   //   render: {
//   //     title: '历史湿度',
//   //     type: 'bar',
//   //     unit: '%',
//   //   },
//   //   refreshInterval: 5,
//   // },
// ]

function getEmptyPanels() {
  const panel: DataPanelConfig = {
    uuid: uuid(),
    source: [],
    render: {
      type: 'card',
      size: 3,
    },
    refreshInterval: 5,
  }
  return panel
}

function DataList() {
  const { panels, addPanel } = usePanel()
  const { openModal, closeModal } = useModal()
  function handelAddPanel() {
    const panel = getEmptyPanels()
    const modalId = openModal({
      title: '新增面板',
      content: () => {
        return (
          <DataPanelEditor
            initialConfig={panel}
            onSave={(newPanel) => {
              addPanel(newPanel)
              closeModal(modalId)
            }}
          />
        )
      },
    })
  }

  return (
    <div>
      <div class="centerRow justify-between">
        <h1 class="title">数据面板</h1>
        <div class="row">
          <Button
            type="primary"
            icon="i-fluent:add-square-24-regular mr-2"
            onClick={handelAddPanel}
          >
            新增面板
          </Button>
        </div>
      </div>
      <div class="grid grid-cols-12 mt-4 gap-4">
        {panels.map(panel => (
          <DataPanel config={panel} />
        ))}
      </div>
    </div>
  )
}
