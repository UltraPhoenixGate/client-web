import type { JSX, ParentComponent } from 'solid-js'
import { For, createContext, createEffect, createSignal, onCleanup, useContext } from 'solid-js'
import Modal from '@/components/Modal'
import type { ModalProps } from '@/components/Modal'
import Button from '@/components/Button'

export interface ShowModalOptions {
  id?: string
  customModal?: (props: ModalProps) => JSX.Element
  content: (() => JSX.Element) | JSX.Element
  title: string
  onClose?: () => void
}

export interface ConfirmModalOptions {
  title: string
  content: (() => JSX.Element) | JSX.Element
  onOk: () => void | Promise<void>
  onCancel?: () => void
}

interface ModalInnerContextType {
  id: string
  closeSelfModal: () => void
}
const ModalInnerContext = createContext<ModalInnerContextType>()

function ModalInnerProvider(props: {
  id: string
  onClose: () => void
  children: JSX.Element
}) {
  return (
    <ModalInnerContext.Provider value={{ id: props.id, closeSelfModal: props.onClose }}>
      {props.children}
    </ModalInnerContext.Provider>
  )
}

interface ModalContextType {
  openModal: (options: ShowModalOptions) => string // 返回 modal 的 id
  closeModal: (id: string) => void
  errorModal: (message: string) => void
  confirmModal: (params: ConfirmModalOptions) => void
  closeAll: () => void
  onModalEmpty: (fn: () => void) => void
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
      title: '出错了',
      content: () => message,
    })
  }

  const closeModal = (id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id))
    const modal = modals().find(modal => modal.id === id)
    modal?.onClose?.()
  }

  const closeAll = () => {
    modals().forEach(modal => modal.onClose?.())
    setModals([])
  }

  const confirmModal = (params: ConfirmModalOptions) => {
    const id = openModal({
      title: params.title,
      content: () => {
        const [isConfirming, setIsConfirming] = createSignal(false)
        return (
          <div>
            {typeof params.content === 'function' ? params.content() : params.content}
            <div class="mt-4 centerRow justify-end">
              <Button
                type="primary"
                class="mr-2"
                loading={isConfirming()}
                onClick={() => {
                  setIsConfirming(true)
                  const result = params.onOk()
                  if (result instanceof Promise) {
                    result.finally(() => {
                      setIsConfirming(false)
                      closeModal(id)
                    })
                  }
                  else {
                    setIsConfirming(false)
                    closeModal(id)
                  }
                }}
              >
                确定
              </Button>
              <Button
                onClick={() => {
                  params.onCancel?.()
                  closeModal(id)
                }}
              >
                取消
              </Button>
            </div>
          </div>
        )
      },

    })
    return id
  }

  const modalEmptyHandlers: (() => void)[] = []

  const onModalEmpty = (fn: () => void) => {
    modalEmptyHandlers.push(fn)

    // 组件销毁时移除 handler
    onCleanup(() => {
      const index = modalEmptyHandlers.indexOf(fn)
      if (index !== -1) {
        modalEmptyHandlers.splice(index, 1)
      }
    })
  }

  createEffect(() => {
    if (modals().length === 0) {
      modalEmptyHandlers.forEach(fn => fn())
    }
  })

  return (
    <ModalContext.Provider value={{ openModal, closeModal, errorModal, confirmModal, closeAll, onModalEmpty }}>
      {props.children}
      <For each={modals()}>
        {(modalProps) => {
          const ModalImpl = modalProps.customModal || Modal
          return (
            <ModalInnerProvider id={modalProps.id!} onClose={() => closeModal(modalProps.id!)}>
              <ModalImpl
                {...modalProps}
                content={typeof modalProps.content === 'function' ? modalProps.content() : modalProps.content}
                onClose={() => closeModal(modalProps.id!)}
              />
            </ModalInnerProvider>
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

export function useModalInner() {
  const context = useContext(ModalInnerContext)
  if (!context)
    throw new Error('useModalInner must be used within a ModalInnerProvider')

  return context
}

export default ModalProvider
