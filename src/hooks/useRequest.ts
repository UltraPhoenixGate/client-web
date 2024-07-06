import { batch, createEffect, createSignal, onCleanup } from 'solid-js'

export function useRequest<Parma, Res>(fn: (p: Parma) => Promise<Res>, initialParams: Parma, config?: {
  onError?: (err: Error) => void
  refreshInterval?: number
}) {
  const [data, setData] = createSignal<Res>()
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<Error>()
  const [params, setParams] = createSignal(initialParams)

  function refresh() {
    setLoading(true)
    fn(params()).then((res) => {
      batch(() => {
        setData(() => res)
        setLoading(false)
      })
    }).catch((err) => {
      batch(() => {
        setError(err)
        setLoading(false)
        config?.onError?.(err)
      })
    })
  }

  createEffect(() => {
    params() // 依赖 params 的变化
    refresh()
  })

  if (config?.refreshInterval) {
    createEffect(() => {
      const timer = setInterval(() => {
        refresh()
      }, config.refreshInterval)
      onCleanup(() => {
        clearInterval(timer)
      })
    })
  }

  return { data, loading, error, refresh, setParams }
}
