import { createEffect, on, splitProps } from 'solid-js'

export interface SelectProps {
  value?: string
  class?: string
  onChange?: (val: string) => void
  options: { value: string, label: string }[]
  placeholder?: string
  disabled?: boolean
  children?: any
  required?: boolean
  [key: string]: any
}

export function Select(props: SelectProps) {
  const baseClasses = 'flex-1 border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 sm:text-sm focus:outline-none focus:ring-indigo-500'
  const [local, others] = splitProps(props, ['value', 'class', 'onChange', 'options', 'disabled', 'placeholder', 'required'])
  const classes = `${baseClasses} ${local.class || ''}`
  let select!: HTMLSelectElement

  // options 变化时，重新设置 value
  createEffect(on(() => local.options, () => {
    if (local.options && select)
      select.value = local.value || ''
  }))

  return (
    <select
      ref={select}
      value={local.value}
      onInput={e => local.onChange?.(e.currentTarget.value)}
      class={classes}
      disabled={local.disabled}
      required={local.required}
      {...others}
    >
      {/* <option value="" disabled>{local.placeholder || '请选择'}</option> */}
      {local.options?.map(option => (
        <option value={option.value}>{option.label}</option>
      ))}
      {props.children}
    </select>
  )
}
