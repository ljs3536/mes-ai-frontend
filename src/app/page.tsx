import { Badge, PageHeader, Panel } from "@/components/ui";
import { getDashboard } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PIPELINE = [
  { key: "raw", href: "/materials", label: "자재 입고" },
  { key: "wip", href: "/shop-floor", label: "가공" },
  { key: "hold", href: "/quality", label: "품질/HOLD" },
  { key: "stock", href: "/shipping", label: "완제품" },
  { key: "shipped", href: "/shipping", label: "출하" },
] as const;

export default async function HomePage() {
  const data = await getDashboard();

  return (
    <>
      <PageHeader
        title="공장 운영 현황"
        description="고압 밸브 · 정밀 배관 · 센서 하우징 가공 라인의 입고부터 출하까지"
      />
      <main className="space-y-6 p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {PIPELINE.map((step, index) => (
            <Link key={step.key} href={step.href}>
              <Panel className="hover:border-amber-500/30">
                <p className="text-xs text-zinc-500">
                  {index + 1}. {step.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-50">
                  {data.counts[step.key]}
                </p>
                <p className="mt-1 text-xs text-zinc-500">LOT</p>
              </Panel>
            </Link>
          ))}
        </div>

        <Panel title="엔드투엔드 흐름">
          <p className="text-sm leading-7 text-zinc-400">
            [자재 입고/LOT 발행] → [작업지시] → [Machine A/B 가공] → [품질 판정] →
            [출하 및 이력]
            <span className="mt-2 block text-zinc-500">
              2단계: 센서 모니터링 · AI 이상 감지 시 설비 STOP / LOT HOLD
            </span>
          </p>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="설비">
            <table>
              <thead>
                <tr>
                  <th>설비</th>
                  <th>상태</th>
                  <th>유형</th>
                </tr>
              </thead>
              <tbody>
                {data.machines.map((machine) => (
                  <tr key={machine.id}>
                    <td>{machine.name}</td>
                    <td>
                      <Badge value={machine.status} />
                    </td>
                    <td>{machine.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <Panel title="알림">
            {data.alerts.length === 0 ? (
              <p className="text-sm text-zinc-500">열린 알림이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {data.alerts.map((alert) => (
                  <li key={alert.id} className="rounded-lg bg-white/4 px-3 py-2">
                    <p className="text-sm text-zinc-200">{alert.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{alert.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="최근 LOT">
          <table>
            <thead>
              <tr>
                <th>LOT</th>
                <th>품목</th>
                <th>수량</th>
                <th>상태</th>
                <th>위치</th>
              </tr>
            </thead>
            <tbody>
              {data.recentLots.map((lot) => (
                <tr key={lot.id}>
                  <td className="font-mono text-xs">
                    <Link className="text-amber-300 hover:underline" href={`/traceability?lot=${lot.lotNo}`}>
                      {lot.lotNo}
                    </Link>
                  </td>
                  <td>{lot.materialName}</td>
                  <td>{lot.quantity}</td>
                  <td>
                    <Badge value={lot.status} />
                  </td>
                  <td>{lot.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </main>
    </>
  );
}
