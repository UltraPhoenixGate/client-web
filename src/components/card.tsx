import type { ParentProps } from 'solid-js'

export function Card(props: ParentProps<{
  class?: string
}>) {
  return (
    <div class={`rounded-lg bg-fill1 p-4 shadow ${props.class}`}>
      {props.children}
    </div>
  )
}
