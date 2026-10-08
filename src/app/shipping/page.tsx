// 출하. 합격 LOT를 출하하고 출하 기록을 남긴다.
import { ActionForm } from "@/components/ActionForm";
import { Badge, Empty, Field, PageHeader, Panel, inputClass } from "@/components/ui";
import { shipLot } from "@/lib/actions";
import { getLots } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  const lots = await getLots(["IN_STOCK", "SHIPPED"]);
  const stock = lots.filter((lot) => lot.status === "IN_STOCK");

  return (
    <>
      <PageHeader
        title="출하"
        description="완제품 LOT를 출하 처리하고 자재-공정-출하 이력을 남깁니다."
      />
      <main className="grid gap-6 p-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel title="출하 처리">
          {stock.length === 0 ? (
            <Empty>출하 가능한 완제품이 없습니다.</Empty>
          ) : (
            <ActionForm action={shipLot} submitLabel="출하 확정">
              <Field label="완제품 LOT">
                <select className={inputClass} name="lotId" required>
                  {stock.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.lotNo} · {lot.materialName}
                    </option>
                  ))}
                </select>
              </Field>
            </ActionForm>
          )}
        </Panel>
        <Panel title="완제품 / 출하 이력">
          {lots.length === 0 ? (
            <Empty>이력이 없습니다.</Empty>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>LOT</th>
                  <th>품목</th>
                  <th>수량</th>
                  <th>상태</th>
                  <th>출하번호</th>
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
                    <td className="font-mono text-xs">
                      {lot.latestShipment?.shipNo ?? "-"}
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
