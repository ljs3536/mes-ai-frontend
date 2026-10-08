"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** 서버 컴포넌트 데이터를 주기적으로 다시 받아온다. 2단계에서 SSE로 교체 예정. */
export function AutoRefresh({ intervalMs = 2000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
