import { PageHeader, Panel } from "@/components/ui";

export default function MonitoringPage() {
  return (
    <>
      <PageHeader
        title="센서 · AI (2단계 자리)"
        description="Python 설비 에뮬레이터의 진동/온도/가동시간/RPM과 AI 이상 감지를 붙일 화면입니다."
      />
      <main className="grid gap-6 p-8 lg:grid-cols-2">
        <Panel title="실시간 차트 (예정)">
          <div className="flex h-56 items-end gap-1 rounded-xl bg-[#0c1117] px-3 py-4">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-amber-500/25"
                style={{ height: `${20 + ((i * 17) % 70)}%` }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            WebSocket / SSE로 초당 센서 수치를 흘릴 자리입니다.
          </p>
        </Panel>
        <Panel title="AI 자동 대응 (예정)">
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>주축 온도 85℃ 이상 또는 진동 급증 시 Anomaly 감지</li>
            <li>설비 상태 RUN → STOP 자동 전환</li>
            <li>해당 LOT를 검사대기(HOLD)로 격리</li>
            <li>관리자 알림: Machine A 베어링 과열 위험</li>
          </ul>
        </Panel>
      </main>
    </>
  );
}
