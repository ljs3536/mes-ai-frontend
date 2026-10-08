import { ActionForm } from "@/components/ActionForm";
import { Badge, Empty, Field, PageHeader, Panel, inputClass } from "@/components/ui";
import { receiveMaterial } from "@/lib/actions";
import { getLots } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  const lots = await getLots();

  return (
    <>
      <PageHeader
        title="자재 입고"
        description="원자재 입고 시 RAW-YYYYMMDD-NNN 형태의 LOT를 발행하고 자재창고에 등록합니다."
      />
      <main className="grid gap-6 p-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel title="입고 등록">
          <ActionForm action={receiveMaterial} submitLabel="LOT 발행">
            <Field label="원자재 품목">
              <input
                className={inputClass}
                name="materialName"
                placeholder="예: 특수 강재"
                required
              />
            </Field>
            <Field label="수량">
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
        <Panel title="LOT 목록">
          {lots.length === 0 ? (
            <Empty>입고된 LOT가 없습니다.</Empty>
          ) : (
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
                {lots.map((lot) => (
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
          )}
        </Panel>
      </main>
    </>
  );
}
