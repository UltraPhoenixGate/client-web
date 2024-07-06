import { createEffect, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import Button from '@/components/Button'
import { Input } from '@/components/Input'
import { useClient } from '@/context/ClientContext'
import { useConfig } from '@/context/ConfigContext'
import { useModal } from '@/utils/modalManager'
import { useRequest } from '@/hooks/useRequest'

export default function Home() {
  const {
    setConfig,
  } = useConfig()
  const {
    errorModal,
  } = useModal()

  const navigate = useNavigate()

  let input!: HTMLInputElement

  const { client } = useClient()
  const [password, setPassword] = createSignal('')

  function unlock() {
    if (!input.checkValidity()) {
      input.reportValidity()
      return
    }
    client().client.loginLocalClient({
      systemPassword: password(),
    }).then((res) => {
      console.log(res)
      setConfig('token', res.token)
      navigate('/dashboard')
    }).catch((err) => {
      errorModal(err.message)
    })
  }

  const {
    data: isLocalClientExist,
  } = useRequest(client().client.isLocalClientExist, {})

  createEffect(() => {
    if (isLocalClientExist() && !isLocalClientExist()!.exist)
      navigate('/setup')
  })

  return (

    <div class="mx-auto h-full w-full center">
      <div class="centerCol">
        <i class="i-fluent:shield-lock-20-regular text-120px text-text1"></i>
        <h1 class="mt-4 text-28px">
          需要验证
        </h1>
        <p class="mt-2 text-text2">
          请输入密码以解锁
        </p>
        <div class="mt-8">
          <Input
            onInput={setPassword}
            type="password"
            class="w-300px"
            placeholder="请输入密码"
            required
            ref={input}
          />
        </div>

        <div class="mt-8 pb-20vh">
          <Button
            onClick={unlock}
            icon="i-fluent:unlock-20-regular"
            size="large"
            type="primary"
          >
            解锁
          </Button>
        </div>
      </div>
    </div>
  )
}
