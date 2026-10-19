// 품질 검사. 품목 기준에 실측값을 넣고, 공차 밖 개수를 재가공 또는 폐기로 보낸다.
import { ActionForm } from "@/components/ActionForm";
import { Badge, Empty, Field, PageHeader, Panel, inputClass } from "@/components/ui";
import { inspectLot } from "@/lib/actions";
import { getInspectionSpecs, getLots } from "@/lib/api";
import type { InspectionSpec, LotSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

function LotInspection({ lot, specs }: { lot: LotSummary; specs: InspectionSpec[] }) {
  const mine = specs.filter((spec) => spec.materialName === lot.materialName);
  return (
    <Panel title={`${lot.lotNo} · ${lot.materialName} · ${lot.quantity}ea`}>
      {mine.length === 0 ? (
        <Empty>이 품목의 검사 기준이 없습니다. 관리자에게 기준 등록을 요청하세요.</Empty>
      ) : (
        <ActionForm action={inspectLot} submitLabel="품질 판정 반영">
          <input type="hidden" name="lotId" value={lot.id} />
          {mine.map((spec) => (
            <Field key={spec.id} label={`${spec.name} (${spec.lowerLimit}–${spec.upperLimit} ${spec.unit})`}>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((slot) => (
                  <input
                    key={slot}
                    className={inputClass}
                    name={`spec-${spec.id}-${slot}`}
                    type="number"
                    step="any"
                    placeholder={`실측 ${slot}`}
                    required={slot === 1}
                  />
                ))}
              </div>
            </Field>
          ))}
          <Field label="불량 처리">
            <select className={inputClass} name="disposition" defaultValue="">
              <option value="">불량 없음</option>
              <option value="REWORK">재가공</option>
              <option value="SCRAP">폐기</option>
            </select>
          </Field>
          <Field label="메모">
            <input className={inputClass} name="note" placeholder="치수/외관 메모" />
          </Field>
        </ActionForm>
      )}
    </Panel>
  );
}

export default async function QualityPage() {
  const [lots, specs] = await Promise.all([getLots(["PROCESSED"]), getInspectionSpecs()]);

  return (
    <>
      <PageHeader
        title="품질 검사"
        description="항목마다 실측값을 넣습니다. 공차 밖인 실측 수가 불량 수량이고, 그 수량은 재가공 또는 폐기입니다. 첫 칸은 필수이고 나머지는 더 잰 값입니다."
      />
      <main className="grid gap-6 p-8">
        {lots.length === 0 ? (
          <Empty>검사 대상 LOT가 없습니다.</Empty>
        ) : (
          lots.map((lot) => (
            <div key={lot.id} className="space-y-2">
              <Badge value={lot.status} />
              <LotInspection lot={lot} specs={specs} />
            </div>
          ))
        )}
      </main>
    </>
  );
}
