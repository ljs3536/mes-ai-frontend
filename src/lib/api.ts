import type {
  Dashboard,
  LotSummary,
  LotTrace,
  MachineDetail,
  Operator,
  WorkOrder,
} from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    ...init,
    cache: "no-store",
    headers: { "content-type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? "입력값을 확인하세요."
          : `API 오류 (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}

function statusQuery(statuses?: string[]) {
  if (!statuses?.length) return "";
  return "?" + new URLSearchParams(statuses.map((s) => ["status", s])).toString();
}

export const getDashboard = () => api<Dashboard>("/dashboard");
export const getOperators = () => api<Operator[]>("/operators");
export const getMachines = () => api<MachineDetail[]>("/machines");
export const getLots = (statuses?: string[]) =>
  api<LotSummary[]>(`/lots${statusQuery(statuses)}`);
export const getWorkOrders = (statuses?: string[]) =>
  api<WorkOrder[]>(`/work-orders${statusQuery(statuses)}`);

export async function getTrace(lotNo: string) {
  try {
    return await api<LotTrace>(`/lots/${encodeURIComponent(lotNo)}/trace`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
