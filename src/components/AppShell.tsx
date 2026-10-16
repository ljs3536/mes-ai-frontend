"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions";
import { roleLabel } from "@/lib/domain";
import type { Operator } from "@/lib/types";

// 화면 메뉴. 이력과 센서·AI, 사원 등록은 관리자만 본다.
const NAV = [
  { href: "/", label: "대시보드" },
  { href: "/materials", label: "자재 입고" },
  { href: "/work-orders", label: "작업지시" },
  { href: "/shop-floor", label: "가공 라인" },
  { href: "/quality", label: "품질 검사" },
  { href: "/shipping", label: "출하" },
  { href: "/employees", label: "사원", admin: true },
  { href: "/traceability", label: "이력 추적", admin: true },
  { href: "/monitoring", label: "센서·AI", admin: true },
];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Operator | null;
}) {
  const pathname = usePathname();
  if (!user) return <>{children}</>;
  const items = NAV.filter((item) => !item.admin || user.role === "ADMIN");

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-white/8 bg-[#080c10]">
        <div className="border-b border-white/8 px-5 py-5">
          <p className="text-[11px] tracking-[0.18em] text-amber-400/80 uppercase">
            Factory MES
          </p>
          <h1 className="mt-1 text-lg font-semibold text-zinc-50">정밀가공 공장</h1>
          <p className="mt-1 text-xs text-zinc-500">Next.js · FastAPI · MariaDB</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {items.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-amber-500/15 text-amber-200"
                    : "text-zinc-400 hover:bg-white/4 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/8 px-5 py-4">
          <p className="text-sm text-zinc-200">{user.name}</p>
          <p className="text-[11px] text-zinc-500">{roleLabel[user.role] ?? user.role}</p>
          <form action={logout} className="mt-2">
            <button className="text-[11px] text-zinc-500 hover:text-zinc-300" type="submit">
              로그아웃
            </button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
