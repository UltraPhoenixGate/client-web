import type { ParentProps } from 'solid-js'
import { createContext, createSignal, useContext } from 'solid-js'
import { createSdkClient } from 'ultraphx-js-sdk'
import { config } from '@/store'

export type ClientStatus = 'connected' | 'disconnected' | 'connecting'

function useClientState() {
  const [status, setStatus] = createSignal<ClientStatus>('connecting')
  const client = createSdkClient({
    baseUrl: config.backendUrl,
    token: config.token,
  })

  client.ws.onConnect(() => setStatus('connected'))
  client.ws.onDisconnect(() => setStatus('disconnected'))
  client.ws.onError(() => setStatus('disconnected'))

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
