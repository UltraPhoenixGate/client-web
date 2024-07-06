import { Match, Switch } from 'solid-js'
import { useParams } from '@solidjs/router'
import { Step1 } from './components/Step1'
import { Step2 } from './components/Step2'
import { Step3 } from './components/Step3'

export default function Setup() {
  const params = useParams<{
    step: string
  }>()

  return (
    <Switch>
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
