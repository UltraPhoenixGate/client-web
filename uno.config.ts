import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerAttributifyJsx,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['./src/**/*.{ts,tsx}'],
  },
  presets: [
    // 基础预设（Tailwind）
    presetUno(),
    // css 图标预设
    presetIcons({
      prefix: 'i-',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      // cdn: 'https://esm.sh/',
    }),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
    transformerAttributifyJsx(),
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
    title: 'text-xl text-text1 font-bold',
  },
})
