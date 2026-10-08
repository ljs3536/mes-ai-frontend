import { PageHeader, Panel } from "@/components/ui";

export default function MonitoringPage() {
  return (
    <>
      <PageHeader
        title="센서 · AI"
        description="파형 수집과 모델 판정은 분석 서비스에서 처리하고, 이상이면 이 MES가 설비를 정지합니다."
      />
      <main className="grid gap-6 p-8 lg:grid-cols-2">
        <Panel title="분석 화면">
          <a href="http://localhost:3001" className="text-sm text-amber-300 hover:text-amber-200">
            센서 분석 열기 (localhost:3001)
          </a>
          <p className="mt-3 text-xs text-zinc-500">
            진동 파형·스펙트럼, 에뮬레이터 설정, MLflow 모델 학습과 실시간 판정입니다.
          </p>
        </Panel>
        <Panel title="자동 정지">
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>수집기가 파형 블록에서 RMS, 첨도, 1x/2x 성분을 계산합니다.</li>
            <li>분석 백엔드의 운영 모델이 특징값을 받아 이상을 판정합니다.</li>
            <li>연속 3회 이상이면 설비를 STOP하고 LOT를 HOLD로 바꿉니다.</li>
          </ul>
        </Panel>
      </main>
    </>
  );
}
