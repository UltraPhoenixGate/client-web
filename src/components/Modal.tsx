// src/components/Modal.tsx
import type { JSX } from 'solid-js'
import { Show, createSignal } from 'solid-js'
import Button from './Button'

export interface ModalProps {
  title: string
  content: JSX.Element
  onClose?: () => void
}

function Modal(props: ModalProps) {
  const [isVisible, setIsVisible] = createSignal(true)

  const closeModal = () => {
    setIsVisible(false)
    props.onClose?.()
  }

  return (
    <Show when={isVisible()}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="min-w-96 col bg-white p-6 shadow-lg">
          <div class="centerRow justify-between pb-2 text-xl font-semibold">
            <h3>{props.title}</h3>
            <Button class="" onClick={closeModal}>
              <i class="i-fluent:dismiss-16-regular" />
            </Button>
          </div>
          <div class="mt-4">{props.content}</div>
        </div>
      </div>
    </Show>
  )
}

export default Modal
