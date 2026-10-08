// 작업지시. 생성, 작업자 시작, 예정 상태 취소를 한다. 취소는 삭제 대신 사유를 이력에 남긴다.
import { ActionForm } from "@/components/ActionForm";
import { AutoRefresh } from "@/components/AutoRefresh";
import { Badge, Empty, Field, PageHeader, Panel, Progress, inputClass } from "@/components/ui";
import { cancelWorkOrder, createWorkOrder, startWork } from "@/lib/actions";
import { getLots, getMachines, getOperators, getWorkOrders } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function WorkOrdersPage() {
  const [orders, rawLots, machines, operators] = await Promise.all([
    getWorkOrders(),
    getLots(["RAW"]),
    getMachines(),
    getOperators(),
  ]);
  const planned = orders.filter((wo) => wo.status === "PLANNED");

  return (
    <>
      <AutoRefresh intervalMs={3000} />
      <PageHeader
        title="작업지시"
        description="관리자가 설비와 제품을 지정하고, 작업자가 본인 ID를 선택해 작업을 시작하면 LOT가 WIP로 전환됩니다."
      />
      <main className="space-y-6 p-8">
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="작업지시 발행">
            <ActionForm action={createWorkOrder} submitLabel="작업지시 발행">
              <Field label="원자재 LOT">
                <select className={inputClass} name="lotId" required>
                  <option value="">선택</option>
                  {rawLots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.lotNo} · {lot.materialName} ({lot.quantity})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="설비">
                <select className={inputClass} name="machineId" required>
                  {machines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="제품명">
                <input
                  className={inputClass}
                  name="productName"
                  defaultValue="A-제품"
                  required
                />
              </Field>
              <Field label="지시 수량">
                <input
                  className={inputClass}
                  name="quantity"
                  type="number"
                  min={1}
                  defaultValue={100}
                  required
                />
              </Field>
            </ActionForm>
          </Panel>
          <Panel title="작업 시작">
            {planned.length === 0 ? (
              <Empty>시작할 대기 작업지시가 없습니다.</Empty>
            ) : (
              <ActionForm action={startWork} submitLabel="작업 시작 (WIP)">
                <Field label="작업지시">
                  <select className={inputClass} name="workOrderId" required>
                    {planned.map((wo) => (
                      <option key={wo.id} value={wo.id}>
                        {wo.woNo} · {wo.productName} / {wo.machine.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="작업자">
                  <select className={inputClass} name="operatorId" required>
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.name} ({op.employeeNo})
                      </option>
                    ))}
                  </select>
                </Field>
              </ActionForm>
            )}
          </Panel>
        </div>
        <Panel title="작업지시 목록">
          {orders.length === 0 ? (
            <Empty>작업지시가 없습니다.</Empty>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>지시번호</th>
                  <th>제품</th>
                  <th>설비</th>
                  <th>LOT</th>
                  <th>진행</th>
                  <th>작업자</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((wo) => (
                  <tr key={wo.id}>
                    <td className="font-mono text-xs">{wo.woNo}</td>
                    <td>{wo.productName}</td>
                    <td>{wo.machine.name}</td>
                    <td className="font-mono text-xs">{wo.lot.lotNo}</td>
                    <td className="w-48">
                      <Progress value={wo.producedQty} max={wo.quantity} />
                    </td>
                    <td>{wo.operator?.name ?? "-"}</td>
                    <td>
                      <Badge kind="wo" value={wo.status} />
                    </td>
                    <td className="w-72">
                      {wo.status === "PLANNED" ? (
                        <ActionForm
                          action={cancelWorkOrder}
                          submitLabel="취소"
                          variant="danger"
                          className="flex flex-wrap items-center gap-2"
                        >
                          <input type="hidden" name="workOrderId" value={wo.id} />
                          <input
                            className={`${inputClass} w-40! py-1.5! text-xs`}
                            name="reason"
                            placeholder="취소 사유"
                            required
                          />
                        </ActionForm>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </main>
    </>
  );
}
