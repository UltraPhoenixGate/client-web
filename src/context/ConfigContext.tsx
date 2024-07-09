import { createContext, createEffect, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

const defaultConfig = {
  backendUrl: 'http://127.0.0.1:8080/api',
  token: '',
}

type AppConfig = typeof defaultConfig

function readConfig(): AppConfig {
  const config = localStorage.getItem('config')
  if (config)
    return JSON.parse(config)
  return defaultConfig
}

const [config, setConfig] = createStore(readConfig())

function useConfigState() {
  createEffect(() => {
    localStorage.setItem('config', JSON.stringify(config))
  })

  return { config, setConfig }
}

export const ConfigContext = createContext<ReturnType<typeof useConfigState>>()

export function ConfigProvider(props: { children: any }) {
  const value = useConfigState()
  return <ConfigContext.Provider value={value} children={props.children} />
}

export function useConfig() {
  return useContext(ConfigContext)!
}

export {
  config,
  setConfig,
}
