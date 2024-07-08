import type { AlertRule } from 'ultraphx-js-sdk'
import { RuleEditor } from './AddRule'
import Button from '@/components/Button'
import { client, useClient } from '@/context/ClientContext'
import { useRequest } from '@/hooks/useRequest'
import { useModal } from '@/utils/modalManager'
import { Card } from '@/components/Card'

export function AlertRules() {
  const { client } = useClient()
  const { openModal, closeModal } = useModal()
  const { data: rules, refresh } = useRequest(client().alert.getAlertRules, {})

  function handelAddRule() {
    const modalId = openModal({
      title: '新建规则',
      content: () => {
        return (
          <RuleEditor onSuccess={() => {
            closeModal(modalId)
            refresh()
          }}
          />
        )
      },
    })
  }

  return (
    <div>
      <div class="centerRow justify-between">
        <h1 class="title">
          警报规则
        </h1>
        <Button
          onClick={handelAddRule}
          type="primary"
          icon="i-fluent:add-square-24-regular"
        >
          新建规则
        </Button>
      </div>
      <div class="grid grid-cols-2 mt-4">
        {rules()?.rules?.map(rule => (
          <RuleItem
            onChange={() => {
              refresh()
            }}
            rule={rule}
          />
        ))}
      </div>
    </div>
  )
}

function RuleItem(props: {
  rule: AlertRule
  onChange: () => void
}) {
  const { openModal, closeModal, confirmModal } = useModal()
  function handelEditRule() {
    const modalId = openModal({
      title: '编辑规则',
      content: () => {
        return (
          <RuleEditor
            rule={props.rule}
            onSuccess={() => {
              closeModal(modalId)
              props.onChange()
            }}
          />
        )
      },
    })
  }

  function handleDeleteRule() {
    confirmModal({
      title: '确认删除此规则？',
      content: '删除后不可恢复',
      onOk: async () => {
        await client().alert.deleteAlertRule(props.rule.name)
        props.onChange()
      },
    })
  }

  return (
    <Card>
      <div class="mb-1 flex items-center justify-between">
        <span class="truncate font-medium">{props.rule.name}</span>
        <span class="truncate font-semibold">
          级别：
          {props.rule.level}
        </span>
        <div class="row">
          <Button onClick={handelEditRule} size="small">
            编辑
          </Button>
          <Button onClick={handleDeleteRule} size="small" type="danger">
            删除
          </Button>
        </div>
      </div>
    </Card>
  )
}
