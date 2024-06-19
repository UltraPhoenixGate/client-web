import { splitProps } from 'solid-js'

interface InputProps {
  type?: string
  value?: string
  placeholder?: string
  class?: string
  onInput?: (val: string) => void
  required?: boolean
  [key: string]: any
}

export function Input(props: InputProps) {
  const baseClasses = 'border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 sm:text-sm focus:outline-none focus:ring-indigo-500'
  const [local, others] = splitProps(props, ['type', 'value', 'placeholder', 'class', 'onInput'])
  const classes = `${baseClasses} ${props.class || ''}`
  return (
    <input
      type={local.type || 'text'}
      value={local.value}
      placeholder={local.placeholder}
      onInput={e => local.onInput?.(e.currentTarget.value)}
      class={classes}
      {...others}
    />
  )
}
