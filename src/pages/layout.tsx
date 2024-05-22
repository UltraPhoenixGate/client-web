import type { RouteSectionProps } from '@solidjs/router'
import { Menu } from '@/components/menu'
import { Header } from '@/components/header'

export function BaseLayout(props: RouteSectionProps) {
  return (
    <div class="h-full w-full col">
      <Header />
      <main class="h-full row flex-1">
        <Menu />
        <div class="flex-1">
          {props.children}
        </div>
      </main>
    </div>
  )
}
