import { A, useLocation } from '@solidjs/router'
import { For } from 'solid-js'

interface IMenuItem {
  name: string
  url: string
}

const menus: IMenuItem[] = [
  {
    name: '概览',
    url: '/dashboard',
  },
  {
    name: '设备',
    url: '/client',
  },
  {
    name: '警报',
    url: '/alert',
  },
  {
    name: '监控',
    url: '/camera',
  },
  {
    name: '设置',
    url: '/setting',
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
        class="rounded-md px-4 py-2 text-text2 hover:bg-gray-300 hover:text-text1"
        classList={{
          'text-text1! bg-gray-200': props.active,
        }}
      >
        {props.menu.name}
      </li>
    </A>
  )
}
