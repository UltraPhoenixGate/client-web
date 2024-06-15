import { For, type JSX, type ParentProps, Show } from 'solid-js'

interface TableColumn<D> {
  key: keyof D
  title: string
  align?: 'left' | 'center' | 'right'
  render?: (value: D[keyof D], data: D) => JSX.Element
}

export function Table<D>(props: ParentProps<{
  class?: string
  thClass?: string
  tdClass?: string
  data: D[]
  loading?: boolean
  columns: TableColumn<D>[]
}>) {
  return (
    <table class={`w-full table-auto border-collapse ${props.class}`}>
      <thead>
        <tr class="bg-fill2">
          <For each={props.columns}>
            {column => (
              <th
                classList={{
                  'text-left': column.align === 'left',
                  'text-center': column.align === 'center',
                  'text-right': column.align === 'right',
                }}
                class={`px-4 py-2 text-left text-sm text-text2 font-semibold ${props.thClass}`}
              >
                {column.title}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <Show when={props.loading}>
          <tr>
            <td colSpan={props.columns.length} class="py-4 text-center">
              加载中...
            </td>
          </tr>
        </Show>
        <Show when={!props.loading && props.data.length === 0}>
          <tr>
            <td colSpan={props.columns.length} class="py-4 text-center">
              暂无数据
            </td>
          </tr>
        </Show>
        <For each={props.data}>
          {row => (
            <tr>
              <For each={props.columns}>
                {column => (
                  <td
                    classList={{
                      'text-left': column.align === 'left',
                      'text-center': column.align === 'center',
                      'text-right': column.align === 'right',
                    }}
                    class={`border px-4 py-2 ${props.tdClass}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] as string}
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}
