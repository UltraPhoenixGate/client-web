import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'danger'
  htmlType?: 'button' | 'submit' | 'reset'
  size?: 'small' | 'medium' | 'large'
  class?: string
  children: JSX.Element
  icon?: string
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['type', 'class', 'children', 'size', 'icon', 'htmlType', 'disabled'])

  const baseClasses = 'flex items-center outline-none transition-colors'
  const typeClasses = {
    primary: 'bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-900',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  }
  const sizeClasses = {
    small: 'text-xs px-2 py-1.5',
    medium: 'text-base px-3 py-1.5',
    large: 'text-lg px-4 py-2',
  }
  const disabledClasses = 'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none'

  const classes = `${baseClasses}
  ${typeClasses[local.type || 'secondary'] || ''} 
  ${disabledClasses} ${local.class || ''}
  ${sizeClasses[local.size || 'medium'] || ''}
  ${local.class || ''}
  `.replace(/\s+/g, ' ')

  return (
    <button
      class={classes}
      type={local.htmlType || 'button'}
      disabled={local.disabled || props.loading}
      {...others}
    >
      {props.icon && <i class={`text-1.3em mr-2 ${props.icon}`} />}
      <span>{local.children}</span>

      {props.loading && (
        <i class="i-svg-spinners:180-ring ml-2 text-1.2em" />
      )}
    </button>
  )
}

export default Button
