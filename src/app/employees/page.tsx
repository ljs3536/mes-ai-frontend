// 사원 등록. 관리자가 직무를 정하고, 작업자에게는 담당 설비를 연결한다.
import { ActionForm } from "@/components/ActionForm";
import { Field, PageHeader, Panel, inputClass } from "@/components/ui";
import { createEmployee, updateEmployee } from "@/lib/actions";
import { roleLabel } from "@/lib/domain";
import { getMachines, getOperators } from "@/lib/api";
import type { Machine } from "@/lib/types";

export const dynamic = "force-dynamic";

const ROLES = ["MATERIAL", "PLANNER", "OPERATOR", "QUALITY", "ADMIN"] as const;

function RoleFields({ machines, role, machineId }: { machines: Machine[]; role?: string; machineId?: number | null }) {
  return (
    <>
      <select className={`${inputClass} w-28 py-1.5 text-xs`} name="role" defaultValue={role ?? "OPERATOR"}>
        {ROLES.map((value) => (
          <option key={value} value={value}>
            {roleLabel[value]}
          </option>
        ))}
      </select>
      <select className={`${inputClass} w-36 py-1.5 text-xs`} name="machineId" defaultValue={machineId ?? ""}>
        <option value="">설비 없음</option>
        {machines.map((machine) => (
          <option key={machine.id} value={machine.id}>
            {machine.name}
          </option>
        ))}
      </select>
    </>
  );
}

export default async function EmployeesPage() {
  const [operators, machines] = await Promise.all([getOperators(), getMachines()]);
  const machineName = new Map(machines.map((machine) => [machine.id, machine.name]));

  return (
    <>
      <PageHeader
        title="사원"
        description="직무를 정하면 그 직무의 화면만 열립니다. 작업자는 담당 설비 하나를 배정합니다."
      />
      <main className="grid gap-6 p-8 xl:grid-cols-[360px_1fr]">
        <Panel title="사원 등록">
          <ActionForm action={createEmployee} submitLabel="등록">
            <Field label="사원번호">
              <input className={inputClass} name="employeeNo" required />
            </Field>
            <Field label="이름">
              <input className={inputClass} name="name" required />
            </Field>
            <Field label="직무">
              <select className={inputClass} name="role" defaultValue="OPERATOR">
                {ROLES.map((value) => (
                  <option key={value} value={value}>
                    {roleLabel[value]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="담당 설비">
              <select className={inputClass} name="machineId" defaultValue="">
                <option value="">작업자만 선택</option>
                {machines.map((machine) => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="비밀번호">
              <input className={inputClass} name="password" type="password" minLength={4} required />
            </Field>
          </ActionForm>
        </Panel>
        <Panel title="등록된 사원">
          <table>
            <thead>
              <tr>
                <th>사원번호</th>
                <th>이름</th>
                <th>직무</th>
                <th>설비</th>
                <th>변경</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((op) => (
                <tr key={op.id}>
                  <td className="font-mono text-xs">{op.employeeNo}</td>
                  <td>{op.name}</td>
                  <td>{roleLabel[op.role] ?? op.role}</td>
                  <td>{op.machineId ? machineName.get(op.machineId) ?? "-" : "-"}</td>
                  <td>
                    <ActionForm
                      action={updateEmployee}
                      submitLabel="저장"
                      variant="secondary"
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input type="hidden" name="operatorId" value={op.id} />
                      <input className={`${inputClass} w-28 py-1.5 text-xs`} name="name" defaultValue={op.name} required />
                      <RoleFields machines={machines} role={op.role} machineId={op.machineId} />
                      <input
                        className={`${inputClass} w-32 py-1.5 text-xs`}
                        name="password"
                        type="password"
                        placeholder="비밀번호 변경"
                      />
                    </ActionForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </main>
    </>
  );
}
