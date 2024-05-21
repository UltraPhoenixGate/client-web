import { createStore } from 'solid-js/store'

const [config, setConfig] = createStore({
  backendUrl: 'http://localhost:3000',
})

export { config, setConfig }
