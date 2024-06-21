import { A, useLocation } from '@solidjs/router'
import { For } from 'solid-js'

interface IMenuItem {
  name: string
  url: string
  icon?: string
}

const menus: IMenuItem[] = [
  {
    name: '概览',
    url: '/dashboard',
    icon: 'i-fluent:home-24-regular',
  },
  {
    name: '设备',
    url: '/client',
    icon: 'i-fluent:device-eq-24-regular',
  },
  {
    name: '警报',
    url: '/alert',
    icon: 'i-fluent:alert-24-regular',
  },
  {
    name: '监控',
    url: '/camera',
    icon: 'i-fluent:video-24-regular',
  },
  {
    name: '设置',
    url: '/setting',
    icon: 'i-fluent:settings-24-regular',
  },
]

export function Menu() {
  const location = useLocation()
  return (
    <div class="h-full w-52 shrink-0 border-r bg-fill2 p-4">
      <ul class="col gap-3">
        <For each={menus}>
          {menu => (
            <MenuItem
              menu={menu}
              active={location.pathname === menu.url}
            />
          )}
        </For>
      </ul>
    </div>
  )
}

function MenuItem(props: {
  menu: IMenuItem
  active: boolean
}) {
  return (
    <A href={props.menu.url}>
      <li
        class="flex px-4 py-2 text-base text-text2 hover:bg-gray-300 hover:text-text1"
        classList={{
          'text-text1! bg-gray-200': props.active,
        }}
      >
        <i class={`text-1.5em mr-3 ${props.menu.icon}`} />
        <span>{props.menu.name}</span>
      </li>
    </A>
  )
}
