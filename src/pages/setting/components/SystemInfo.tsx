import { Show } from 'solid-js'
import { useClient } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'
import { useModal } from '@/utils/modalManager'
import { Card } from '@/components/Card'

export function SystemInfo() {
  const { client } = useClient()
  const { errorModal } = useModal()
  const {
    data: systemInfo,
  } = useRequest(client.system.getSystemInfo, {}, {
    onError(err) {
      errorModal(err.message)
    },
  })

  return (
    <div>
      <h1 class="mb-4 text-2xl font-bold">系统信息</h1>
      <Show when={systemInfo() !== undefined}>
        <div class="grid grid-cols-3 gap-4">
          <InfoItem label="系统版本" value={systemInfo()!.version} />
          <InfoItem label="系统负载" value={systemInfo()!.load} />
          <InfoItem label="系统运行时间" value={`${Math.floor(systemInfo()!.uptime / 3600)} 小时`} />
          <InfoItem label="内存占用" value={`${formatBytes(systemInfo()!.memory.used)} / ${formatBytes(systemInfo()!.memory.total)}`} />
          <InfoItem label="存储占用" value={`${formatBytes(systemInfo()!.disk.used)} / ${formatBytes(systemInfo()!.disk.total)}`} />
        </div>
      </Show>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string | number
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <Card>
      <div class="text-gray-500">{label}</div>
      <div class="text-lg font-semibold">{value}</div>
    </Card>
  )
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}
