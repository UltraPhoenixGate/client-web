import type { ParentProps } from 'solid-js'
import { createContext, createEffect, createSignal, useContext } from 'solid-js'
import { createSdkClient } from 'ultraphx-js-sdk'
import { config, useConfig } from './ConfigContext'

export type ClientStatus = 'connected' | 'disconnected' | 'connecting'
const [client, _setClient] = createSignal<ReturnType<typeof createSdkClient>>(
  createSdkClient({
    baseUrl: config.backendUrl,
    token: config.token,
  }),
)

function useClientState() {
  const { config } = useConfig()

  createEffect(() => {
    client().setToken(config.token)
    client().setBaseUrl(config.backendUrl)
  })

  const [status, setStatus] = createSignal<ClientStatus>('connecting')
  client().ws.onConnect(() => setStatus('connected'))
  client().ws.onDisconnect(() => setStatus('disconnected'))
  client().ws.onError(() => setStatus('disconnected'))
  return {
    status,
    client,
  }
}

const ClientContext = createContext<ReturnType<typeof useClientState>>()

export function ClientProvider(props: ParentProps) {
  const value = useClientState()
  return <ClientContext.Provider value={value} children={props.children} />
}

export function useClient() {
  return useContext(ClientContext)!
}

export {
  client,
}
