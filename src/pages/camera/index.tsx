import { Button } from '@/components/button'
import { openModal } from '@/utils/modalManager'

export default function Home() {
  function testModal() {
    openModal({
      title: '测试',
      content: (
        <div class="">
          <p>这是一个测试弹窗</p>
        </div>
      ),

    })
  }
  return (
    <div class="">
      <Button onClick={testModal}>
        测试
      </Button>
    </div>
  )
}
