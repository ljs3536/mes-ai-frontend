"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "대시보드" },
  { href: "/materials", label: "자재 입고" },
  { href: "/work-orders", label: "작업지시" },
  { href: "/shop-floor", label: "가공 라인" },
  { href: "/quality", label: "품질 검사" },
  { href: "/shipping", label: "출하" },
  { href: "/traceability", label: "이력 추적" },
  { href: "/monitoring", label: "센서·AI (2단계)" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
          {NAV.map((item) => {
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
        <p className="px-5 py-4 text-[11px] leading-5 text-zinc-600">
          입고 → 작업지시 → 가공 → 품질 → 출하
        </p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
