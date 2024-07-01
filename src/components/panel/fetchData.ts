import type { MetricsResultItem, QueryRangeParams } from 'ultraphx-js-sdk'
import { type DataSource, timeRanges } from './types'
import { client } from '@/context/ClientContext'

export async function fetchDataByDataSources(sources: DataSource[]): Promise<MetricsResultItem[]> {
  const data = await Promise.all(sources.map((source_1) => {
    const metricsQl = buildMetricsQL(source_1)
    return fetchMetricsData(metricsQl)
  }))
  return data.flat()
}

export interface SensorDataItem {
  time: number
  value: number
}

function buildMetricsQL(source: DataSource): QueryRangeParams | string {
  let promQL = `{`
  for (const [key, value] of Object.entries(source.labels)) {
    // 忽略空值
    if (!value)
      continue
    promQL += `${key}="${value}",`
  }
  // remove the last comma
  promQL = promQL.slice(0, -1)
  promQL += `}`

  if (source.timeRange.type === 'latest')
    return promQL

  const [start, end] = (() => {
    if (source.timeRange.type === 'custom')
      return [source.timeRange.start, source.timeRange.end]
    return timeRanges[source.timeRange.type]()
  })()
  // 最大数据点
  const maxDataPoints = 60
  // 间隔
  const step = Math.floor((end - start) / maxDataPoints / 1000)

  return {
    query: promQL,
    start,
    end,
    step,
  }
}

async function fetchMetricsData(query: string | QueryRangeParams): Promise<MetricsResultItem[]> {
  if (typeof query === 'string') {
    const data = await client.data.query(query)
    return data.result
  }
  else {
    const data = await client.data.queryRange(query)
    return data.result
  }
}
