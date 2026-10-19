export const ROLE_HOME: Record<string, string> = {
  ADMIN: "/",
  MATERIAL: "/materials",
  PLANNER: "/work-orders",
  OPERATOR: "/shop-floor",
  QUALITY: "/quality",
};

export const NAV = [
  { href: "/", label: "대시보드", roles: ["ADMIN"] },
  { href: "/materials", label: "자재 입고", roles: ["MATERIAL"] },
  { href: "/work-orders", label: "작업지시", roles: ["PLANNER"] },
  { href: "/shop-floor", label: "내 설비", roles: ["OPERATOR"] },
  { href: "/quality", label: "품질 검사", roles: ["QUALITY"] },
  { href: "/shipping", label: "출하", roles: ["MATERIAL"] },
  { href: "/employees", label: "사원", roles: ["ADMIN"] },
  { href: "/traceability", label: "이력 추적", roles: ["ADMIN"] },
  { href: "/monitoring", label: "센서·AI", roles: ["ADMIN"] },
];

export function roleCanOpen(role: string, pathname: string) {
  return NAV.some((item) => {
    if (!item.roles.includes(role)) return false;
    return item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
}
