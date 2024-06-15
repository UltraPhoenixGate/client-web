import { useClient } from '@/context/ClientContext'
import { Table } from '@/components/Table'
import { useRequest } from '@/hooks/useRequest'

export default function Home() {
  return (
    <div class="p-4">
      <AlertRecords />
    </div>
  )
}

function AlertRecords() {
  const { client } = useClient()
  const { data: records, loading } = useRequest(client.alert.getAlertRecords, {})

  return (
    <div>
      <h1 class="title">
        警报记录
      </h1>
      <Table
        data={records() || []}
        loading={loading()}
        class="mt-3"
        columns={[
          {
            key: 'clientID',
            title: '设备名称',
            render(_value, data) {
              return (
                <span>
                  {data.client.name}
                </span>
              )
            },
          },
          {
            key: 'ruleName',
            title: '警报类型',
          },
          {
            key: 'createdAt',
            title: '警报时间',
          },
          {
            key: 'level',
            title: '警报级别',
          },
        ]}
      >
      </Table>
    </div>
  )
}
