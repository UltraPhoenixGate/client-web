import { defineConfig, presetIcons, presetUno } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  presets: [
    // 基础预设（Tailwind）
    presetUno(),
    // css 图标预设
    presetIcons({
      prefix: 'i-',
      collections: {
        // 引入 ./public/icons 目录下的所有 svg 图标
        // 使用方式：<i class="i-custom:filename"></i>
        custom: FileSystemIconLoader('./public/icons'),
      },
    }),
  ],
  transformers: [],
  theme: {
    // 定义主题
    colors: {
      brand: '#51E8E8',
    },
  },
  shortcuts: {
    center: 'flex items-center justify-center',
    hover: 'transition hover:bg-opacity-80',
    row: 'flex flex-row',
    col: 'flex flex-col',
    centerRow: 'row items-center',
    centerCol: 'col items-center',
  },
})
