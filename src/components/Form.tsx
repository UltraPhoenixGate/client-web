import { createContext, useContext } from 'solid-js'
import type { JSX } from 'solid-js'

interface FormProps {
  children: JSX.Element | JSX.Element[]
  class?: string
  onSubmit?: (event: Event) => void
  labelWidth?: string
  labelAlign?: 'left' | 'top'
  ref?: any
}

interface FormContextProps {
  labelWidth?: string
  labelAlign?: 'left' | 'top'
}

const FormContext = createContext<FormContextProps>({})

export function Form(props: FormProps) {
  return (
    <FormContext.Provider value={{ labelWidth: props.labelWidth, labelAlign: props.labelAlign }}>
      <form ref={props.ref} class={`${props.class} space-y-2`} onSubmit={props.onSubmit}>
        {props.children}
      </form>
    </FormContext.Provider>
  )
}

interface FormItemProps {
  label: string
  description?: string
  children: JSX.Element
  class?: string
  labelWidth?: string
  labelAlign?: 'left' | 'top'
}

export function FormItem(props: FormItemProps) {
  const context = useContext(FormContext)

  const labelWidth = props.labelWidth || context.labelWidth || 'auto'
  const labelAlign = props.labelAlign || context.labelAlign || 'top'

  return (
    <div
      class={[
        'flex',
        labelAlign === 'left' ? 'centerRow' : 'flex-col',
        props.class,
      ].join(' ')}
    >
      <label
        style={{ width: labelWidth }}
        class="mb-1 mr-3 text-sm text-gray-700 font-medium"
      >
        {props.label}
      </label>
      <div class="col flex-1">
        {props.children}
        {props.description && (
          <p class="mt-1 text-xs text-gray-500">{props.description}</p>
        )}
      </div>
    </div>
  )
}
