import { Badge, Empty, PageHeader, Panel, formatTime, inputClass } from "@/components/ui";
import { getTrace } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function TraceabilityPage({
  searchParams,
}: PageProps<"/traceability">) {
  const params = await searchParams;
  const lotNo = typeof params.lot === "string" ? params.lot : "";
  const lot = lotNo ? await getTrace(lotNo) : null;

  return (
    <>
      <PageHeader
        title="이력 추적"
        description="LOT 번호로 입고-가공-품질-출하 타임라인을 조회합니다."
      />
      <main className="space-y-6 p-8">
        <Panel>
          <form className="flex max-w-xl gap-3" action="/traceability">
            <input
              className={inputClass}
              name="lot"
              defaultValue={lotNo}
              placeholder="예: RAW-20260728-001"
            />
            <button
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-zinc-100 hover:bg-white/15"
              type="submit"
            >
              조회
            </button>
          </form>
        </Panel>
        {!lotNo ? (
          <Empty>LOT 번호를 입력하세요. 시나리오 샘플: RAW-20260728-001</Empty>
        ) : !lot ? (
          <Empty>해당 LOT를 찾을 수 없습니다.</Empty>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <Panel title="LOT 요약">
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-zinc-500">LOT</dt>
                  <dd className="font-mono">{lot.lotNo}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">품목</dt>
                  <dd>
                    {lot.materialName} · {lot.quantity}ea
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">상태</dt>
                  <dd className="mt-1">
                    <Badge value={lot.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">위치</dt>
                  <dd>{lot.location}</dd>
                </div>
              </dl>
            </Panel>
            <Panel title="타임라인">
              <ol className="space-y-4">
                {lot.events.map((event) => (
                  <li key={event.id} className="border-l border-amber-500/40 pl-4">
                    <p className="text-xs text-zinc-500">
                      {formatTime(event.createdAt)} · {event.type}
                    </p>
                    <p className="mt-1 text-sm text-zinc-200">{event.message}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        )}
      </main>
    </>
  );
}
