// 품질 검사. 가공완료 수량을 합격과 불량으로 나누고, 불량은 재가공 또는 폐기로 남긴다.
import { ActionForm } from "@/components/ActionForm";
import { Badge, Empty, Field, PageHeader, Panel, inputClass } from "@/components/ui";
import { inspectLot } from "@/lib/actions";
import { getLots } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function QualityPage() {
  const lots = await getLots(["PROCESSED"]);

  return (
    <>
      <PageHeader
        title="품질 검사"
        description="가공완료 LOT의 합격 수량과 불량 수량을 나눕니다. 둘의 합은 생산 수량과 같아야 합니다. 불량은 재가공 또는 폐기이고, 설비는 멈추지 않습니다."
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
                      {lot.lotNo} · {lot.materialName} · {lot.quantity}ea
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="합격 수량">
                <input className={inputClass} name="goodQty" type="number" min={0} required />
              </Field>
              <Field label="불량 수량">
                <input className={inputClass} name="defectQty" type="number" min={0} required />
              </Field>
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
        <Panel title="가공완료">
          {lots.length === 0 ? (
            <Empty>대상이 없습니다.</Empty>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>LOT</th>
                  <th>품목</th>
                  <th>수량</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id}>
                    <td className="font-mono text-xs">{lot.lotNo}</td>
                    <td>{lot.materialName}</td>
                    <td>{lot.quantity}</td>
                    <td>
                      <Badge value={lot.status} />
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
