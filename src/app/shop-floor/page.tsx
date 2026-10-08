import { ActionForm } from "@/components/ActionForm";
import { Badge, PageHeader, Panel } from "@/components/ui";
import { holdMachine, resumeMachine } from "@/lib/actions";
import { getMachines } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ShopFloorPage() {
  const machines = await getMachines();

  return (
    <>
      <PageHeader
        title="가공 라인"
        description="Machine A / Machine B CNC 라인. 실시간 센서 차트는 2단계에서 연결합니다."
      />
      <main className="grid gap-6 p-8 lg:grid-cols-2">
        {machines.map((machine) => {
          const active = machine.activeWorkOrder;
          return (
            <Panel key={machine.id} title={machine.name}>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-zinc-400">{machine.type}</p>
                <Badge value={machine.status} />
              </div>
              {active ? (
                <div className="space-y-2 rounded-xl bg-white/4 p-4 text-sm">
                  <p>
                    진행 LOT{" "}
                    <span className="font-mono text-amber-300">{active.lot.lotNo}</span>{" "}
                    <Badge value={active.lot.status} />
                  </p>
                  <p className="text-zinc-400">
                    {active.woNo} · 작업자 {active.operator?.name ?? "-"} · 수량 {active.quantity}
                  </p>
                  {machine.status === "RUN" ? (
                    <ActionForm action={holdMachine} submitLabel="설비 정지 / LOT HOLD" className="space-y-2 pt-2">
                      <input type="hidden" name="machineId" value={machine.id} />
                    </ActionForm>
                  ) : null}
                </div>
              ) : (
                <p className="rounded-xl bg-white/4 p-4 text-sm text-zinc-500">
                  대기 중. 작업지시에서 시작하면 가동(RUN)으로 바뀝니다.
                </p>
              )}
              {machine.status === "STOP" ? (
                <ActionForm
                  action={resumeMachine}
                  submitLabel="점검 완료 (대기 복귀)"
                  variant="secondary"
                  className="mt-4 space-y-2"
                >
                  <input type="hidden" name="machineId" value={machine.id} />
                </ActionForm>
              ) : null}
              {machine.openAlerts[0] ? (
                <p className="mt-4 text-xs text-amber-400/90">{machine.openAlerts[0].title}</p>
              ) : null}
            </Panel>
          );
        })}
      </main>
    </>
  );
}
