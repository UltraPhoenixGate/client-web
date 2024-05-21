import { defineConfig, presetIcons, presetUno } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import transformerDirectives from '@unocss/transformer-directives'

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
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    // 定义主题
    colors: {
      text1: '#171717',
      text2: '#6b7280',
      fill1: '#ffffff',
      fill2: '#f3f4f6',
      sidebar: '#f3f4f6',
      border: '#d1d5db',
      accent: '#3b82f6',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#ef4444',
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
