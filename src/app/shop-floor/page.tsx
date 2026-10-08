import { ActionForm } from "@/components/ActionForm";
import { AutoRefresh } from "@/components/AutoRefresh";
import { Badge, PageHeader, Panel, Progress, formatTime } from "@/components/ui";
import { holdMachine, resumeMachine } from "@/lib/actions";
import { getMachines } from "@/lib/api";
import { sensorLabel } from "@/lib/domain";
import type { SensorValue } from "@/lib/types";

export const dynamic = "force-dynamic";

const WARN: Record<string, number> = { SPINDLE_TEMP: 85, VIBRATION: 4.5 };

function SensorTile({ sensor }: { sensor: SensorValue }) {
  const warn = WARN[sensor.code] !== undefined && sensor.value >= WARN[sensor.code];
  const digits = sensor.code === "SPINDLE_RPM" ? 0 : sensor.code === "VIBRATION" ? 2 : 1;
  return (
    <div className={`rounded-lg px-3 py-2 ${warn ? "bg-rose-500/15" : "bg-white/4"}`}>
      <p className="text-[11px] text-zinc-500">{sensorLabel[sensor.code] ?? sensor.code}</p>
      <p className={`mt-0.5 font-mono text-sm ${warn ? "text-rose-300" : "text-zinc-100"}`}>
        {sensor.value.toFixed(digits)}
        <span className="ml-1 text-[11px] text-zinc-500">{sensor.unit}</span>
      </p>
    </div>
  );
}

export default async function ShopFloorPage() {
  const machines = await getMachines();

  return (
    <>
      <AutoRefresh />
      <PageHeader
        title="가공 라인"
        description="설비 에뮬레이터가 보내오는 진행수량과 센서값을 2초마다 갱신합니다."
      />
      <main className="grid gap-6 p-8 lg:grid-cols-2">
        {machines.map((machine) => {
          const active = machine.activeWorkOrder;
          return (
            <Panel key={machine.id} title={machine.name}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm text-zinc-400">
                  <span
                    className={`size-2 rounded-full ${machine.online ? "bg-emerald-400" : "bg-zinc-600"}`}
                  />
                  {machine.type} · {machine.online ? "통신 정상" : "오프라인"}
                  {machine.lastSeenAt ? (
                    <span className="text-xs text-zinc-600">{formatTime(machine.lastSeenAt)}</span>
                  ) : null}
                </p>
                <Badge value={machine.status} />
              </div>

              {machine.sensors.length > 0 ? (
                <div className="mb-4 grid grid-cols-3 gap-2 xl:grid-cols-5">
                  {machine.sensors.map((sensor) => (
                    <SensorTile key={sensor.code} sensor={sensor} />
                  ))}
                </div>
              ) : null}

              {active ? (
                <div className="space-y-3 rounded-xl bg-white/4 p-4 text-sm">
                  <p>
                    진행 LOT{" "}
                    <span className="font-mono text-amber-300">{active.lot.lotNo}</span>{" "}
                    <Badge value={active.lot.status} />
                  </p>
                  <p className="text-zinc-400">
                    {active.woNo} · {active.productName} · 작업자 {active.operator?.name ?? "-"}
                  </p>
                  <Progress value={active.producedQty} max={active.quantity} />
                  {machine.status === "RUN" ? (
                    <ActionForm action={holdMachine} submitLabel="설비 정지 / LOT HOLD" className="space-y-2 pt-1">
                      <input type="hidden" name="machineId" value={machine.id} />
                    </ActionForm>
                  ) : null}
                </div>
              ) : (
                <p className="rounded-xl bg-white/4 p-4 text-sm text-zinc-500">
                  대기 중. 작업지시에서 시작하면 가동(RUN)으로 바뀌고 에뮬레이터가 가공을 시작합니다.
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
