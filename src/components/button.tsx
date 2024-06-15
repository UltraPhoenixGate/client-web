import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'danger'
  class?: string
  children: JSX.Element
  onClick?: () => void
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['type', 'class', 'children'])

  const baseClasses = 'px-3 py-1.5 rounded focus:outline-none transition-colors text-sm font-medium'
  const typeClasses = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  const disabledClasses = 'disabled:cursor-not-allowed disabled:opacity-50'

  const classes = `${baseClasses} ${typeClasses[local.type || 'secondary'] || ''} ${disabledClasses} ${local.class || ''}`

  return (
    <button
      class={classes}
      {...others}
    >
      {local.children}
    </button>
  )
}

export default Button
