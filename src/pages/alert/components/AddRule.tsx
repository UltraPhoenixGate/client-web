import { createStore, produce } from 'solid-js/store'
import type { AlertAction, AlertRule, AlertRuleCondition, AlertRuleConditionOperator, AlertRuleConditionPayloadEvent, AlertRuleConditionPayloadOperator } from 'ultraphx-js-sdk'
import { For, Show, createEffect, createSignal } from 'solid-js'
import { Form, FormItem } from '@/components/Form'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import Button from '@/components/Button'
import { useModal } from '@/utils/modalManager'
import { useRequest } from '@/hooks/useRequest'
import { useClient } from '@/context/ClientContext'
import { fetchDataByDataSources } from '@/components/panel/fetchData'
import type { DataSource } from '@/components/panel/types'

export function RuleEditor(props: {
  rule?: AlertRule
  onSuccess: () => void
}) {
  let form!: HTMLFormElement
  const [rule, setRule] = createStore<AlertRule>(props.rule || {
    type: 'realtime',
    name: '',
    summary: '',
    description: '',
    level: 'warning',
    conditions: [],
    actions: [],
  })
  const { errorModal } = useModal()
  const { client } = useClient()
  const [loading, setLoading] = createSignal(false)

  function handleSave() {
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    if (rule.conditions.length === 0) {
      errorModal('请至少添加一个条件')
      return
    }
    setLoading(true)
    if (props.rule) {
      // Update
      client().alert.updateAlertRule(rule).then(() => {
        props.onSuccess()
      }).catch((err) => {
        errorModal(err.message)
      }).finally(() => {
        setLoading(false)
      })
      return
    }
    client().alert.createAlertRule(rule).then(() => {
      props.onSuccess()
    }).catch((err) => {
      errorModal(err.message)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div class="w-400px centerCol">
      <Form ref={form} class="w-full" labelAlign="left" labelWidth="100px">
        <FormItem label="规则名称">
          <Input
            type="text"
            value={rule.name}
            onInput={v => setRule('name', v)}
            placeholder="请输入规则名称"
            required
          />
        </FormItem>

        <FormItem label="提示信息">
          <Input
            type="text"
            value={rule.summary}
            placeholder="请输入提示信息"
            onInput={v => setRule('summary', v)}
          />
        </FormItem>

        <FormItem label="规则描述">
          <Input
            type="text"
            value={rule.description}
            placeholder="请输入规则描述"
            onInput={v => setRule('description', v)}
          />
        </FormItem>

        <FormItem label="警报级别">
          <Select
            value={rule.level}
            options={[
              { value: 'warning', label: '警告' },
              { value: 'error', label: '错误' },
            ]}
            onChange={v => setRule('level', v)}
          />
        </FormItem>

        <FormItem label="条件列表">
          <ConditionsEditor
            conditions={rule.conditions}
            onChange={v => setRule('conditions', v)}
          />
        </FormItem>

        <FormItem label="警报动作">
          <ActionsEditor
            actions={rule.actions || []}
            onChange={v => setRule('actions', v)}
          />
        </FormItem>

        <Button loading={loading()} type="primary" onClick={handleSave}>
          保存
        </Button>
      </Form>
    </div>
  )
}

function ConditionsEditor(props: {
  conditions: AlertRuleCondition[]
  onChange: (v: AlertRuleCondition[]) => void
}) {
  const { closeModal, openModal } = useModal()
  function handleAddCondition() {
    const modalId = openModal({
      title: '添加条件',
      content: () => {
        return (
          <ConditionItemEditor onSave={(condition) => {
            props.onChange([...props.conditions, condition])
            closeModal(modalId)
          }}
          />
        )
      },
    })
  }

  function handleEditCondition(index: number) {
    const modalId = openModal({
      title: '编辑条件',
      content: () => {
        return (
          <ConditionItemEditor
            condition={props.conditions[index]}
            onSave={(condition) => {
              props.conditions[index] = condition
              props.onChange(props.conditions)
              closeModal(modalId)
            }}
          />
        )
      },
    })
  }

  function handleDeleteCondition(index: number) {
    props.onChange(props.conditions.filter((_, i) => i !== index))
  }

  return (
    <div>
      <For each={props.conditions}>
        {(condition, index) => (
          <div class="">
            <div class="centerRow justify-between">
              <span class="text-wrap text-sm">{getConditionSummary(condition)}</span>
              <div class="ml-4 row flex-shrink-0">
                <Button
                  onClick={() => handleEditCondition(index())}
                  type="secondary"
                  size="small"
                >
                  编辑
                </Button>
                <Button
                  onClick={() => handleDeleteCondition(index())}
                  type="danger"
                  size="small"
                  class="ml-2"
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
        )}
      </For>
      <Button onClick={handleAddCondition} class="mt-2" type="primary" size="small">
        添加条件
      </Button>
    </div>
  )
}

function getConditionSummary(condition: AlertRuleCondition): string {
  const { sensorId, metric, type, payload } = condition
  const shortSensorID = `${sensorId.slice(0, 4)}...${sensorId.slice(-4)}`

  if (type === 'operator') {
    const { operator, value } = payload as AlertRuleConditionPayloadOperator
    const operatorMap: { [key in AlertRuleConditionOperator]: string } = {
      eq: '等于',
      ne: '不等于',
      gt: '大于',
      lt: '小于',
    }
    return `当 ${shortSensorID} 的 ${metric} ${operatorMap[operator]} ${value}`
  }
  else if (type === 'event') {
    const { eventName } = payload as AlertRuleConditionPayloadEvent
    return `当 ${shortSensorID} 的 ${metric} 触发 ${eventName} 事件`
  }
  else {
    return `未知的条件类型: ${type}`
  }
}

function ConditionItemEditor(props: {
  condition?: AlertRuleCondition
  onSave: (v: AlertRuleCondition) => void
}) {
  let form!: HTMLFormElement
  const [condition, setCondition] = createStore<AlertRuleCondition>(props.condition || {
    type: 'operator',
    sensorId: '',
    metric: '',
    payload: {
      operator: 'eq',
      value: 0,
    },
  })
  const { errorModal } = useModal()
  const { client } = useClient()

  const [source, setSource] = createStore<DataSource>({
    type: 'default',
    labels: {
      __name__: condition.metric,
      sensor_id: condition.sensorId,
    },
    timeRange: { type: 'latest' },
  })
  const { data: sensors } = useRequest(client().client.getConnectedClients, {}, {
    onError(err) {
      errorModal(err.message)
    },
  })
  const [availableMetrics, setAvailableMetrics] = createSignal<string[]>([])
  createEffect(async () => {
    console.log(source)
    const actSource = JSON.parse(JSON.stringify(source))
    actSource.labels.__name__ = ''
    const allData = await fetchDataByDataSources([actSource])
    setAvailableMetrics(allData.map(item => item.metric.__name__))
  })

  function handleSave() {
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    props.onSave(condition)
  }

  return (
    <div>
      <Form ref={form}>
        <FormItem label="传感器">
          <Select
            value={source.labels.sensor_id || ''}
            onChange={(v) => {
              setSource('labels', { ...source.labels, sensor_id: v })
              setCondition(produce((state) => {
                state.sensorId = v
              }))
            }}
            options={sensors()?.map(sensor => ({ value: sensor.id, label: sensor.name })) || []}
            disabled={sensors()?.length === 0}
            required
          />
        </FormItem>
        <FormItem label="数据列">
          <Select
            value={source.labels.__name__ || ''}
            onChange={(v) => {
              setSource('labels', { ...source.labels, __name__: v })
              setCondition(produce((state) => {
                state.metric = v
              }))
            }}
            options={[
              ...availableMetrics().map(metric => ({ value: metric, label: metric })),
            ]}
            required
          />
        </FormItem>
        <FormItem label="条件">
          <Select
            options={
              [
                { value: 'eq', label: '等于' },
                { value: 'ne', label: '不等于' },
                { value: 'gt', label: '大于' },
                { value: 'lt', label: '小于' },
              ]
            }
            value={(condition.payload as AlertRuleConditionPayloadOperator).operator}
            onChange={v => setCondition(produce((state) => {
              (state.payload as AlertRuleConditionPayloadOperator).operator = v as AlertRuleConditionOperator
            }))}
            required
          />
        </FormItem>
        <FormItem label="值">
          <Input
            value={(condition.payload as AlertRuleConditionPayloadOperator).value.toString()}
            onInput={v => setCondition(produce((state) => {
              (state.payload as AlertRuleConditionPayloadOperator).value = Number(v)
            }))}
            type="number"
            required
          />
        </FormItem>
      </Form>

      <Button class="mt-4" type="primary" onClick={handleSave}>
        保存
      </Button>
    </div>
  )
}

function ActionsEditor(props: {
  actions: AlertAction[]
  onChange: (v: AlertAction[]) => void
}) {
  const { closeModal, openModal } = useModal()
  function handleAddAction() {
    const modalId = openModal({
      title: '添加动作',
      content: () => {
        return (
          <ActionItemEditor onSave={(action) => {
            props.onChange([...props.actions, action])
            closeModal(modalId)
          }}
          />
        )
      },
    })
  }

  function handleEditAction(index: number) {
    const modalId = openModal({
      title: '编辑动作',
      content: () => {
        return (
          <ActionItemEditor
            action={props.actions[index]}
            onSave={(action) => {
              props.actions[index] = action
              props.onChange(props.actions)
              closeModal(modalId)
            }}
          />
        )
      },
    })
  }

  function handleDeleteAction(index: number) {
    props.onChange(props.actions.filter((_, i) => i !== index))
  }

  return (
    <div>
      <For each={props.actions}>
        {(action, index) => (
          <div class="">
            <div class="centerRow justify-between">
              <span class="text-wrap text-sm">{getActionSummary(action)}</span>
              <div class="ml-4 row flex-shrink-0">
                <Button
                  onClick={() => handleEditAction(index())}
                  type="secondary"
                  size="small"
                >
                  编辑
                </Button>
                <Button
                  onClick={() => handleDeleteAction(index())}
                  type="danger"
                  size="small"
                  class="ml-2"
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
        )}
      </For>
      <Button onClick={handleAddAction} class="mt-2" type="primary" size="small">
        添加动作
      </Button>
    </div>
  )
}

function getActionSummary(action: AlertAction): string {
  const { type, payload } = action
  if (type === 'email') {
    return `发送邮件到 ${payload.to}`
  }
  if (type === 'sms') {
    return `发送短信到 ${payload.to}`
  }
  if (type === 'webhook') {
    return `执行 Webhook： ${payload.url}`
  }
  return `未知的动作类型: ${type}`
}

function ActionItemEditor(props: {
  action?: AlertAction
  onSave: (v: AlertAction) => void
}) {
  let form!: HTMLFormElement
  const [action, setAction] = createStore<AlertAction>(props.action || {
    type: 'email',
    payload: {
      to: '',
    },
  })

  function handleSave() {
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    props.onSave(action)
  }
  return (
    <div>
      <Form ref={form}>
        <FormItem label="动作类型">
          <Select
            options={[
              { value: 'email', label: '发送邮件' },
              { value: 'sms', label: '发送短信' },
              { value: 'webhook', label: '执行 Webhook' },
            ]}
            required
            value={action.type}
            onChange={v => setAction('type', v)}
          />
        </FormItem>
        <Show when={action.type === 'email' || action.type === 'sms'}>
          <FormItem label="接收">
            <Input
              value={action.payload.to}
              onInput={v => setAction('payload', { ...action.payload, to: v })}
              required
              placeholder={action.type === 'email' ? '请输入邮箱地址' : '请输入手机号码'}
            />
          </FormItem>
        </Show>
        <Show when={action.type === 'webhook'}>
          <FormItem label="Webhook 地址">
            <Input
              value={(action.payload as any).url}
              onInput={v => setAction('payload', { ...action.payload, url: v })}
              placeholder="请输入 Webhook 地址"
              required
            />
          </FormItem>
        </Show>

        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
      </Form>
    </div>
  )
}
