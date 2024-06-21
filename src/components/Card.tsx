import type { ParentProps } from 'solid-js'

export function Card(props: ParentProps<{
  class?: string
}>) {
  return (
    <div
      class={`bg-fill2 border p-4 ${props.class}`}
    >
      {props.children}
    </div>
  )
}
