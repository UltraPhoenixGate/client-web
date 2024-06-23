export interface DataPanelConfig {
  source: DataSource[] | DataSource
  render: RenderConfig
  refreshInterval?: number // 数据刷新间隔（秒）
}

export interface DataSource {
  type: 'byDevice' | 'byLabels'
  labels: Record<string, string>
  timeRange: TimeRange
  maxDataPoints?: number
}

export type TimeRange =
  | { type: 'custom', start: number, end: number }
  | { type: 'latest' }
  | { type: keyof typeof timeRanges }

export const timeRanges = {
  last5min: () => [Date.now() - 5 * 60 * 1000, Date.now()],
  last15min: () => [Date.now() - 15 * 60 * 1000, Date.now()],
  last30min: () => [Date.now() - 30 * 60 * 1000, Date.now()],
  last1hour: () => [Date.now() - 60 * 60 * 1000, Date.now()],
  last3hours: () => [Date.now() - 3 * 60 * 60 * 1000, Date.now()],
  last6hours: () => [Date.now() - 6 * 60 * 60 * 1000, Date.now()],
  last12hours: () => [Date.now() - 12 * 60 * 60 * 1000, Date.now()],
  today: () => [new Date().setHours(0, 0, 0, 0), Date.now()],
  last24hours: () => [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
  yesterday: () => [Date.now() - 48 * 60 * 60 * 1000, Date.now()],
  last3days: () => [Date.now() - 3 * 24 * 60 * 60 * 1000, Date.now()],
  last5days: () => [Date.now() - 5 * 24 * 60 * 60 * 1000, Date.now()],
  last7days: () => [Date.now() - 7 * 24 * 60 * 60 * 1000, Date.now()],
  thisWeek: () => [new Date().setHours(0, 0, 0, 0), Date.now()],
  lastWeek: () => [Date.now() - 7 * 24 * 60 * 60 * 1000, Date.now()],
  thisMonth: () => [new Date().setDate(1), Date.now()],
  lastMonth: () => [Date.now() - 30 * 24 * 60 * 60 * 1000, Date.now()],
  thisYear: () => [new Date().setMonth(0, 1), Date.now()],
  lastYear: () => [Date.now() - 365 * 24 * 60 * 60 * 1000, Date.now()],
}

export interface RenderConfig {
  title?: string
  description?: string
  type: 'line' | 'bar' | 'pie' | 'card'
  /**
   * 面板大小，1-12 默认 3
   */
  size?: number
  /**
   * 数据格式化配置
   */
  format?: Intl.NumberFormatOptions
  unit?: string // 数据单位，例如：`°C`, `m/s`
  options?: ChartOptions // 特定图表类型的额外配置
}

export interface ChartOptions {
  smooth?: boolean // 针对折线图
  stack?: boolean // 针对柱状图
  legendPosition?: 'top' | 'bottom' | 'left' | 'right' // 针对饼图等
}
