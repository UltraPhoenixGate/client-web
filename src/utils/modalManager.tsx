import type { JSX, ParentComponent } from 'solid-js'
import { For, createContext, createSignal, useContext } from 'solid-js'
import Modal from '@/components/Modal'
import type { ModalProps } from '@/components/Modal'

interface ShowModalOptions {
  id?: string
  customModal?: (props: ModalProps) => JSX.Element
  content: (() => JSX.Element) | JSX.Element
  title: string
  onClose?: () => void
}

interface ModalContextType {
  openModal: (options: ShowModalOptions) => string // 返回 modal 的 id
  closeModal: (id: string) => void
  errorModal: (message: string) => void
}

const ModalContext = createContext<ModalContextType>()

const ModalProvider: ParentComponent = (props) => {
  const [modals, setModals] = createSignal<ShowModalOptions[]>([])

  const openModal = (options: ShowModalOptions): string => {
    const id = options.id || Math.random().toString(36).substr(2, 9)
    setModals(prev => [...prev, { ...options, id }])
    return id
  }

  const errorModal = (message: string) => {
    openModal({
      title: '错误',
      content: () => message,
    })
  }

  const closeModal = (id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id))
    const modal = modals().find(modal => modal.id === id)
    modal?.onClose?.()
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal, errorModal }}>
      {props.children}
      <For each={modals()}>
        {(modalProps) => {
          const ModalImpl = modalProps.customModal || Modal
          return (
            <ModalImpl
              {...modalProps}
              content={typeof modalProps.content === 'function' ? modalProps.content() : modalProps.content}
              onClose={() => closeModal(modalProps.id!)}
            />
          )
        }}
      </For>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context)
    throw new Error('useModal must be used within a ModalProvider')

  return context
}

export default ModalProvider
