import { lotStatusLabel, machineStatusLabel, woStatusLabel } from "@/lib/domain";

const TONE: Record<string, string> = {
  RAW: "bg-sky-500/15 text-sky-300",
  WIP: "bg-amber-500/15 text-amber-300",
  HOLD: "bg-rose-500/15 text-rose-300",
  IN_STOCK: "bg-emerald-500/15 text-emerald-300",
  SHIPPED: "bg-zinc-500/20 text-zinc-300",
  PLANNED: "bg-zinc-500/20 text-zinc-300",
  IN_PROGRESS: "bg-amber-500/15 text-amber-300",
  COMPLETED: "bg-emerald-500/15 text-emerald-300",
  IDLE: "bg-zinc-500/20 text-zinc-300",
  RUN: "bg-emerald-500/15 text-emerald-300",
  STOP: "bg-rose-500/15 text-rose-300",
  WARNING: "bg-orange-500/15 text-orange-300",
  PASS: "bg-emerald-500/15 text-emerald-300",
  FAIL: "bg-rose-500/15 text-rose-300",
  PENDING: "bg-amber-500/15 text-amber-300",
};

export function Badge({ value }: { value: string }) {
  const label =
    lotStatusLabel[value] ??
    woStatusLabel[value] ??
    machineStatusLabel[value] ??
    value;
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TONE[value] ?? "bg-white/8 text-zinc-300"}`}
    >
      {label}
    </span>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-white/8 px-8 py-6">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">{title}</h2>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </header>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-white/8 bg-[#12181f] p-5 ${className}`}
    >
      {title ? (
        <h3 className="mb-4 text-sm font-medium text-zinc-300">{title}</h3>
      ) : null}
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#0c1117] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500/50";

export const btnClass =
  "rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-50";

/** API는 공장 현지 시각(Asia/Seoul)을 타임존 없이 내려준다. */
export function formatTime(value: string) {
  return value.replace("T", " ").slice(0, 16);
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-center text-sm text-zinc-500">{children}</p>;
}
