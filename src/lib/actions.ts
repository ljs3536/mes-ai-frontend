"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "./api";
import { ROLE_HOME } from "./roles";
import { SESSION_COOKIE } from "./session";

export type ActionState = { ok: boolean; message: string } | null;

async function run(
  path: string,
  body: Record<string, unknown> | undefined,
  success: (data: Record<string, string>) => string,
  method = "POST",
): Promise<ActionState> {
  try {
    const data = await api<Record<string, string>>(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    revalidatePath("/", "layout");
    return { ok: true, message: success(data) };
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message };
    throw e;
  }
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const num = (fd: FormData, key: string) => Number(fd.get(key));

export async function login(_: ActionState, fd: FormData) {
  try {
    const data = await api<{ token: string; operator: { role: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ employeeNo: str(fd, "employeeNo"), password: str(fd, "password") }),
    });
    (await cookies()).set(SESSION_COOKIE, data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    redirect(ROLE_HOME[data.operator.role] ?? "/");
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message };
    throw e;
  }
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

export async function createEmployee(_: ActionState, fd: FormData) {
  return run(
    "/operators",
    {
      employeeNo: str(fd, "employeeNo"),
      name: str(fd, "name"),
      role: str(fd, "role"),
      password: str(fd, "password"),
      machineId: str(fd, "machineId") ? num(fd, "machineId") : null,
    },
    (op) => `${op.name} 사원을 등록했습니다.`,
  );
}

export async function updateEmployee(_: ActionState, fd: FormData) {
  const password = str(fd, "password");
  return run(
    `/operators/${num(fd, "operatorId")}`,
    {
      name: str(fd, "name"),
      role: str(fd, "role"),
      password: password || null,
      machineId: str(fd, "machineId") ? num(fd, "machineId") : null,
    },
    (op) => `${op.name} 사원 정보를 바꿨습니다.`,
    "PATCH",
  );
}

export async function receiveMaterial(_: ActionState, fd: FormData) {
  return run(
    "/lots",
    { materialName: str(fd, "materialName"), quantity: num(fd, "quantity") },
    (lot) => `LOT ${lot.lotNo} 발행 완료`,
  );
}

export async function createWorkOrder(_: ActionState, fd: FormData) {
  return run(
    "/work-orders",
    {
      lotId: num(fd, "lotId"),
      machineId: num(fd, "machineId"),
      productName: str(fd, "productName"),
      quantity: num(fd, "quantity"),
    },
    (wo) => `작업지시 ${wo.woNo} 발행 완료`,
  );
}

export async function startWork(_: ActionState, fd: FormData) {
  return run(`/work-orders/${num(fd, "workOrderId")}/start`, undefined, (wo) => `${wo.woNo} 작업 시작`);
}

export async function cancelWorkOrder(_: ActionState, fd: FormData) {
  return run(
    `/work-orders/${num(fd, "workOrderId")}/cancel`,
    { reason: str(fd, "reason") },
    (wo) => `${wo.woNo} 취소됨`,
  );
}

export async function holdMachine(_: ActionState, fd: FormData) {
  return run(`/machines/${num(fd, "machineId")}/hold`, undefined, (m) => `${m.name} 정지 · 가공 일시정지`);
}

export async function resumeMachine(_: ActionState, fd: FormData) {
  return run(`/machines/${num(fd, "machineId")}/resume`, undefined, (m) => `${m.name} 가공 재개`);
}

export async function inspectLot(_: ActionState, fd: FormData) {
  const readings: { specId: number; value: number }[] = [];
  for (const [key, raw] of fd.entries()) {
    const match = /^spec-(\d+)-\d+$/.exec(key);
    const text = String(raw).trim();
    if (!match || !text) continue;
    readings.push({ specId: Number(match[1]), value: Number(text) });
  }
  return run(
    `/lots/${num(fd, "lotId")}/inspections`,
    {
      readings,
      disposition: str(fd, "disposition") || null,
      note: str(fd, "note") || null,
    },
    (lot) => `${lot.lotNo} 판정 반영 (${lot.status}, ${lot.quantity}ea)`,
  );
}

export async function createInspectionSpec(_: ActionState, fd: FormData) {
  return run(
    "/inspection-specs",
    {
      materialName: str(fd, "materialName"),
      name: str(fd, "name"),
      unit: str(fd, "unit"),
      lowerLimit: Number(str(fd, "lowerLimit")),
      upperLimit: Number(str(fd, "upperLimit")),
    },
    (spec) => `${spec.materialName} ${spec.name} 기준을 등록했습니다.`,
  );
}

export async function deleteInspectionSpec(_: ActionState, fd: FormData) {
  return run(`/inspection-specs/${num(fd, "specId")}`, undefined, () => "검사 기준을 지웠습니다.", "DELETE");
}

export async function shipLot(_: ActionState, fd: FormData) {
  return run(`/lots/${num(fd, "lotId")}/ship`, undefined, (s) => `출하 ${s.shipNo} 완료`);
}
