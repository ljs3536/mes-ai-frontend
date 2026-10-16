// 사원 로그인. 관리자와 작업자는 같은 화면에서 권한만 다르다.
import { ActionForm } from "@/components/ActionForm";
import { Field, inputClass } from "@/components/ui";
import { login } from "@/lib/actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-sm rounded-2xl border border-white/8 bg-[#12181f] p-6">
        <p className="text-[11px] tracking-[0.18em] text-amber-400/80 uppercase">Factory MES</p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-50">사원 로그인</h1>
        <p className="mt-2 text-sm text-zinc-400">
          처음 비밀번호는 관리자 admin1234, 작업자 work1234 입니다. 로그인 후 관리자가 바꿀 수 있습니다.
        </p>
        <div className="mt-5">
          <ActionForm action={login} submitLabel="로그인">
            <Field label="사원번호">
              <input className={inputClass} name="employeeNo" autoComplete="username" required />
            </Field>
            <Field label="비밀번호">
              <input className={inputClass} name="password" type="password" autoComplete="current-password" required />
            </Field>
          </ActionForm>
        </div>
      </section>
    </main>
  );
}
