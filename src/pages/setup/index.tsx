import { Match, Switch, createEffect, onMount } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { Step1 } from './components/Step1'
import { Step2 } from './components/Step2'
import { Step3 } from './components/Step3'
import { useRequest } from '@/hooks/useRequest'
import { useClient } from '@/context/ClientContext'

export default function Setup() {
  const params = useParams<{
    step: string
  }>()

  const { client } = useClient()
  const navigate = useNavigate()

  const {
    data: isLocalClientExist,
  } = useRequest(client().client.isLocalClientExist, {})

  createEffect(() => {
    if (isLocalClientExist()?.exist)
      navigate('/setup/-1')
  })

  return (
    <Switch>
      <Match when={params.step === '-1'}>
        <Redirect />
      </Match>
      <Match when={params.step === '1'}>
        <Step1 />
      </Match>
      <Match when={params.step === '2'}>
        <Step2 />
      </Match>
      <Match when={params.step === '3'}>
        <Step3 />
      </Match>
    </Switch>
  )
}

function Redirect() {
  const navigate = useNavigate()

  onMount(() => {
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  })

  return (
    <div class="mx-auto h-full w-full center">
      <div class="centerCol">
        <i class="i-fluent:checkmark-20-regular text-120px text-success"></i>
        <h1 class="mt-4 text-28px">
          即将跳转
        </h1>
        <p class="mt-2 text-text2">
          设置完成，正在跳转到仪表盘
        </p>
      </div>
    </div>
  )
}
