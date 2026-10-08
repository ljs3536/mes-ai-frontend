import { ActionForm } from "@/components/ActionForm";
import { Badge, Empty, Field, PageHeader, Panel, inputClass } from "@/components/ui";
import { inspectLot } from "@/lib/actions";
import { getLots } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function QualityPage() {
  const lots = await getLots(["PROCESSED", "HOLD", "WIP"]);

  return (
    <>
      <PageHeader
        title="품질 검사"
        description="설비 가공이 끝난 LOT(가공완료)를 판정합니다. 합격은 완제품 창고(IN_STOCK), 불합격/보류는 검사대기(HOLD)로 격리합니다."
      />
      <main className="grid gap-6 p-8 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Panel title="판정">
          {lots.length === 0 ? (
            <Empty>검사 대상 LOT가 없습니다.</Empty>
          ) : (
            <ActionForm action={inspectLot} submitLabel="품질 판정 반영">
              <Field label="LOT">
                <select className={inputClass} name="lotId" required>
                  {lots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.lotNo} · {lot.materialName} ({lot.status})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="판정">
                <select className={inputClass} name="result" required>
                  <option value="PASS">합격 (완제품)</option>
                  <option value="FAIL">불합격 (HOLD)</option>
                </select>
              </Field>
              <Field label="메모">
                <input className={inputClass} name="note" placeholder="치수/외관 메모" />
              </Field>
            </ActionForm>
          )}
        </Panel>
        <Panel title="가공완료 / 검사대기 / 가공중">
          {lots.length === 0 ? (
            <Empty>대상이 없습니다.</Empty>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>LOT</th>
                  <th>품목</th>
                  <th>상태</th>
                  <th>최근 판정</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id}>
                    <td className="font-mono text-xs">{lot.lotNo}</td>
                    <td>{lot.materialName}</td>
                    <td>
                      <Badge value={lot.status} />
                    </td>
                    <td>
                      {lot.latestInspection ? (
                        <Badge value={lot.latestInspection.result} />
                      ) : (
                        "-"
                      )}
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
