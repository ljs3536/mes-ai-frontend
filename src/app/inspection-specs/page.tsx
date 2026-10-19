// 검사 기준. 관리자가 품목마다 항목 이름, 단위, 하한, 상한을 등록한다.
import { ActionForm } from "@/components/ActionForm";
import { Empty, Field, PageHeader, Panel, inputClass } from "@/components/ui";
import { createInspectionSpec, deleteInspectionSpec } from "@/lib/actions";
import { getInspectionSpecs } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function InspectionSpecsPage() {
  const specs = await getInspectionSpecs();

  return (
    <>
      <PageHeader
        title="검사 기준"
        description="품목별 검사 항목과 공차입니다. 품질 화면은 이 기준과 실측값을 비교해 불량 수량을 정합니다."
      />
      <main className="grid gap-6 p-8 xl:grid-cols-[360px_1fr]">
        <Panel title="기준 등록">
          <ActionForm action={createInspectionSpec} submitLabel="등록">
            <Field label="품목">
              <input className={inputClass} name="materialName" required />
            </Field>
            <Field label="항목">
              <input className={inputClass} name="name" placeholder="외경" required />
            </Field>
            <Field label="단위">
              <input className={inputClass} name="unit" placeholder="mm" required />
            </Field>
            <Field label="하한">
              <input className={inputClass} name="lowerLimit" type="number" step="any" required />
            </Field>
            <Field label="상한">
              <input className={inputClass} name="upperLimit" type="number" step="any" required />
            </Field>
          </ActionForm>
        </Panel>
        <Panel title="등록된 기준">
          {specs.length === 0 ? (
            <Empty>검사 기준이 없습니다.</Empty>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>품목</th>
                  <th>항목</th>
                  <th>공차</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.id}>
                    <td>{spec.materialName}</td>
                    <td>{spec.name}</td>
                    <td className="font-mono text-xs">
                      {spec.lowerLimit}–{spec.upperLimit} {spec.unit}
                    </td>
                    <td>
                      <ActionForm action={deleteInspectionSpec} submitLabel="삭제" variant="danger">
                        <input type="hidden" name="specId" value={spec.id} />
                      </ActionForm>
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
