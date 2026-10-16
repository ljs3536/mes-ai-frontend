// 사원 등록. 관리자가 사원번호, 이름, 권한을 넣고 비밀번호를 바꾼다.
import { ActionForm } from "@/components/ActionForm";
import { Field, PageHeader, Panel, inputClass } from "@/components/ui";
import { roleLabel } from "@/lib/domain";
import { createEmployee, updateEmployee } from "@/lib/actions";
import { getOperators } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const operators = await getOperators();

  return (
    <>
      <PageHeader
        title="사원"
        description="한 회사의 사원을 등록합니다. 관리자는 이력과 센서·AI를 보고, 작업자는 현장 화면을 사용합니다."
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
            <Field label="권한">
              <select className={inputClass} name="role" defaultValue="OPERATOR">
                <option value="OPERATOR">작업자</option>
                <option value="ADMIN">관리자</option>
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
                <th>권한</th>
                <th>변경</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((op) => (
                <tr key={op.id}>
                  <td className="font-mono text-xs">{op.employeeNo}</td>
                  <td>{op.name}</td>
                  <td>{roleLabel[op.role] ?? op.role}</td>
                  <td>
                    <ActionForm
                      action={updateEmployee}
                      submitLabel="저장"
                      variant="secondary"
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input type="hidden" name="operatorId" value={op.id} />
                      <input className={`${inputClass} w-28 py-1.5 text-xs`} name="name" defaultValue={op.name} required />
                      <select className={`${inputClass} w-28 py-1.5 text-xs`} name="role" defaultValue={op.role}>
                        <option value="OPERATOR">작업자</option>
                        <option value="ADMIN">관리자</option>
                      </select>
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
