export interface DataPanelConfig {
  title?: string
  description?: string
  source: DataSource
  render: RenderConfig
  refreshInterval?: number // 数据刷新间隔（秒）
}

export interface DataSource {
  type: 'byDevice' | 'byLabels'
  labels: string[]
  timeRange: TimeRange
}

export type TimeRange =
  | { type: 'custom', start: number, end: number }
  | { type: 'latest' }
  | { type: 'today' }
  | { type: 'yesterday' }
  | { type: 'last7days' }
  | { type: 'last30days' }

export interface RenderConfig {
  type: 'line' | 'bar' | 'pie' | 'card'
  format?: string // 数据格式化字符串，例如：`0.00`、`0%`
  unit?: string // 数据单位，例如：`°C`, `m/s`
  options?: ChartOptions // 特定图表类型的额外配置
}

export interface ChartOptions {
  smooth?: boolean // 针对折线图
  stack?: boolean // 针对柱状图
  legendPosition?: 'top' | 'bottom' | 'left' | 'right' // 针对饼图等
}
