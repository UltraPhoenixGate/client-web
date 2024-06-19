import { createContext, useContext } from 'solid-js'
import type { JSX } from 'solid-js'

interface FormProps {
  children: JSX.Element | JSX.Element[]
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
      <form ref={props.ref} class="space-y-2" onSubmit={props.onSubmit}>
        {props.children}
      </form>
    </FormContext.Provider>
  )
}

interface FormItemProps {
  label: string
  children: JSX.Element
  labelWidth?: string
  labelAlign?: 'left' | 'top'
}

export function FormItem(props: FormItemProps) {
  const context = useContext(FormContext)

  const labelWidth = props.labelWidth || context.labelWidth || 'auto'
  const labelAlign = props.labelAlign || context.labelAlign || 'top'

  return (
    <div
      classList={{
        'centerRow': labelAlign === 'left',
        'flex-col': labelAlign === 'top',
      }}
      class="flex"
    >
      <label
        style={{ width: labelWidth }}
        class="mr-3 text-sm text-gray-700 font-medium"
      >
        {props.label}
      </label>
      {props.children}
    </div>
  )
}
