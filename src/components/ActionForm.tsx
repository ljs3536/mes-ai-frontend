"use client";

import { btnClass } from "@/components/ui";
import type { ActionState } from "@/lib/actions";
import { useActionState } from "react";

export function ActionForm({
  action,
  children,
  submitLabel,
  className = "space-y-4",
  variant = "primary",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children?: React.ReactNode;
  submitLabel: string;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form className={className} action={formAction}>
      {children}
      <button
        className={
          variant === "primary"
            ? btnClass
            : variant === "danger"
              ? "shrink-0 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
              : "rounded-lg bg-white/10 px-4 py-2 text-sm text-zinc-100 hover:bg-white/15 disabled:opacity-50"
        }
        disabled={pending}
        type="submit"
      >
        {pending ? "처리 중…" : submitLabel}
      </button>
      {state ? (
        <p aria-live="polite" className={`text-sm ${state.ok ? "text-emerald-400" : "text-rose-400"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
