import { batch, createEffect, createSignal } from 'solid-js'

export function useRequest<Parma, Res>(fn: (p: Parma) => Promise<Res>, initialParams: Parma, config?: {
  onError?: (err: Error) => void
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

  return { data, loading, error, refresh, setParams }
}
