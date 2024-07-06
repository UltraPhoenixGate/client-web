import { useNavigate } from '@solidjs/router'
import { createSignal } from 'solid-js'
import { Step } from './Step'
import Button from '@/components/Button'
import { Form, FormItem } from '@/components/Form'
import { Input } from '@/components/Input'
import { useClient } from '@/context/ClientContext'
import { useModal } from '@/utils/modalManager'

export function Step2() {
  const { client } = useClient()
  const { errorModal } = useModal()
  const [password, setPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(false)
  const navigate = useNavigate()
  let form!: HTMLFormElement

  function handelSetPassword() {
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    if (password() !== confirmPassword()) {
      errorModal('两次输入的密码不一致')
      return
    }

    setIsLoading(true)
    client().client.setupLocalClient({
      systemPassword: password(),
    }).then(() => {
      navigate('/setup/3')
    }).catch((e) => {
      errorModal(`设置密码失败${e.message}`)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <Step title="设置系统密码">
      <div class="mt-2vh centerCol">
        <i class="i-fluent:panel-left-header-key-24-regular text-80px text-text2"></i>
        <p class="text-center text-text2">
          设置设备密码，以保障设备安全
        </p>
      </div>
      <Form ref={form} class="mt-6vh col gap-2">
        <FormItem label="设备密码" labelAlign="left">
          <Input
            name="password"
            type="password"
            placeholder="请输入设备密码"
            required
            onInput={setPassword}
          />
        </FormItem>

        <FormItem label="确认密码" labelAlign="left">
          <Input
            name="confirmPassword"
            type="password"
            placeholder="请再次输入设备密码"
            required
            onInput={setConfirmPassword}
          />
        </FormItem>
      </Form>

      <Button
        onClick={handelSetPassword}
        class="mt-8vh"
        size="large"
        type="primary"
        loading={isLoading()}
      >
        确认设置
      </Button>
    </Step>
  )
}
