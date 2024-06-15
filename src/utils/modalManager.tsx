import { render } from 'solid-js/web'
import type { JSX } from 'solid-js'
import { Show, createSignal } from 'solid-js'
import type { ModalProps } from '@/components/modal'
import Modal from '@/components/modal'

interface ShowModalOptions extends ModalProps {
  customModal?: (props: ModalProps) => JSX.Element
}

let modalsContainer: HTMLElement | null = null

function ensureModalsContainer() {
  if (!modalsContainer) {
    modalsContainer = document.createElement('div')
    document.body.appendChild(modalsContainer)
  }
}

export function getModalsContainer() {
  ensureModalsContainer()
  return modalsContainer!
}

export function openModal(options: ShowModalOptions) {
  ensureModalsContainer()

  const div = document.createElement('div')
  modalsContainer!.appendChild(div)

  const [isOpen, setIsOpen] = createSignal(true)

  const closeModal = () => {
    setIsOpen(false)
    options.onClose?.()
    setTimeout(() => {
      div.remove()
    }, 300) // Ensure the modal close animation completes
  }
  const ModalImpl = options.customModal || Modal
  render(
    () => (
      <Show when={isOpen()}>
        <ModalImpl title={options.title} content={options.content} onClose={closeModal} />
      </Show>
    ),
    div,
  )

  return {
    close: closeModal,
  }
}
