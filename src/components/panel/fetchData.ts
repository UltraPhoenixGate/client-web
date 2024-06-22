import type { DataSource } from './types'

const isDev = true

export function fetchDataByDataSource(source: DataSource): Promise<MetricsResultItem[]> {
  // 1. 构造 MetricsQL
  const metricsQl = buildMetricsQL(source)
  if (isDev) {
    // 模拟数据请求
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          status: 'success',
          data: {
            resultType: 'vector',
            result: [
              {
                metric: { __name__: 'http_requests_total', job: 'api-server', instance: 'localhost:8080' },
                value: [1609459200.000, '1027'],
              },
              {
                metric: { __name__: 'http_requests_total', job: 'api-server', instance: 'localhost:8081' },
                value: [1609459200.000, '2421'],
              },
            ],
          },
        }
        resolve(mockResponse.data.result)
      }, 1000) // 模拟网络延迟
    })
  }
  // 2. 发送请求
  return fetchMetricsData(metricsQl)
}

export interface MetricsResultItem {
  metric: Record<string, string>
  value: (number | string)[]
}

export interface SensorDataItem {
  time: number
  value: number
}

export function praseMetricsResult(result: MetricsResultItem[]): SensorDataItem[] {
  return result.map(item => ({
    time: item.value[0] as number,
    value: Number(item.value[1]),
  }))
}

function buildMetricsQL(source: DataSource): string {
  let baseQuery = ''

  if (source.type === 'byDevice')
    baseQuery = `sum(rate(device_metric{${source.labels.join(',')}}[1m]))`
  else if (source.type === 'byLabels')
    baseQuery = `sum(rate(label_metric{${source.labels.join(',')}}[1m]))`

  switch (source.timeRange.type) {
    case 'custom':
      return `${baseQuery} and time >= ${source.timeRange.start} and time <= ${source.timeRange.end}`
    case 'latest':
      return `${baseQuery}`
    case 'today':
    { const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
      return `${baseQuery} and time >= ${todayStart}` }
    case 'yesterday':
    { const yesterdayStart = new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0)
      const yesterdayEnd = new Date(new Date().setDate(new Date().getDate() - 1)).setHours(23, 59, 59, 999)
      return `${baseQuery} and time >= ${yesterdayStart} and time <= ${yesterdayEnd}` }
    case 'last7days':
    { const last7daysStart = new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0)
      return `${baseQuery} and time >= ${last7daysStart}` }
    case 'last30days':
    { const last30daysStart = new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0)
      return `${baseQuery} and time >= ${last30daysStart}` }
    default:
      return baseQuery
  }
}

async function fetchMetricsData(query: string) {
  const response = await fetch(`http://<victoria-metrics-url>/api/v1/query?query=${encodeURIComponent(query)}`)

  if (!response.ok)
    throw new Error(`Failed to fetch data: ${response.statusText}`)

  const data = await response.json()

  return data.data.result
}
