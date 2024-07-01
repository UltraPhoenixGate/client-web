export interface DataPanelConfig {
  uuid: string
  source: DataSource[]
  render: RenderConfig
  refreshInterval?: number // 数据刷新间隔（秒）
}

export interface DataSource {
  type: 'default'
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

export const timeRangeLabels: Record<keyof typeof timeRanges, string> = {
  last5min: '最近5分钟',
  last15min: '最近15分钟',
  last30min: '最近30分钟',
  last1hour: '最近1小时',
  last3hours: '最近3小时',
  last6hours: '最近6小时',
  last12hours: '最近12小时',
  today: '今天',
  last24hours: '最近24小时',
  yesterday: '昨天',
  last3days: '最近3天',
  last5days: '最近5天',
  last7days: '最近7天',
  thisWeek: '本周',
  lastWeek: '上周',
  thisMonth: '本月',
  lastMonth: '上月',
  thisYear: '今年',
  lastYear: '去年',
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
