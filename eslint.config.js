import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['src-tauri/**/*', 'src-tauri'],
  unocss: true,
  rules: {
    'no-console': 'off',
  },
})
