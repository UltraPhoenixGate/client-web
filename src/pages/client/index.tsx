import { Card } from '@/components/card'

export default function Home() {
  return (
    <div class="p-4">
      <h1 class="title">已连接设备</h1>
      <div class="grid grid-cols-3 mt-3">
        <Card>
          <div class="text-lg">设备1</div>
          <div class="text-sm text-text2">设备描述</div>
        </Card>
      </div>
    </div>
  )
}
