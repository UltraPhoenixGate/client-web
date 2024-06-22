// Radio.tsx
import type { Component } from 'solid-js'
import { For, createSignal } from 'solid-js'

interface RadioProps {
  options: { label: string, value: string }[]
  name: string
  class?: string
  selectedValue?: string
  onChange?: (value: string) => void
}

const Radio: Component<RadioProps> = (props) => {
  const [selected, setSelected] = createSignal(props.selectedValue || '')

  const handleChange = (value: string) => {
    setSelected(value)
    props.onChange && props.onChange(value)
  }

  return (
    <div
      class={`row children:mr-2 ${props.class}`}
    >
      <For each={props.options}>
        {option => (
          <label class="flex cursor-pointer items-center space-x-2">
            <input
              type="radio"
              name={props.name}
              value={option.value}
              checked={selected() === option.value}
              onChange={() => handleChange(option.value)}
              class="h-4 w-4 appearance-none border border-border transition checked:bg-gray-800"
            />
            <span class="text-sm text-gray-900 font-medium">{option.label}</span>
          </label>
        )}
      </For>
    </div>
  )
}

export default Radio
