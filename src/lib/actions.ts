"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "./api";

export type ActionState = { ok: boolean; message: string } | null;

async function run(
  path: string,
  body: Record<string, unknown> | undefined,
  success: (data: Record<string, string>) => string,
): Promise<ActionState> {
  try {
    const data = await api<Record<string, string>>(path, {
      method: "POST",
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
  return run(
    `/work-orders/${num(fd, "workOrderId")}/start`,
    { operatorId: num(fd, "operatorId") },
    (wo) => `${wo.woNo} 작업 시작`,
  );
}

export async function holdMachine(_: ActionState, fd: FormData) {
  return run(`/machines/${num(fd, "machineId")}/hold`, undefined, (m) => `${m.name} 정지 · LOT HOLD`);
}

export async function resumeMachine(_: ActionState, fd: FormData) {
  return run(`/machines/${num(fd, "machineId")}/resume`, undefined, (m) => `${m.name} 대기 복귀`);
}

export async function inspectLot(_: ActionState, fd: FormData) {
  return run(
    `/lots/${num(fd, "lotId")}/inspections`,
    { result: str(fd, "result"), note: str(fd, "note") || null },
    (lot) => `${lot.lotNo} 판정 반영 (${lot.status})`,
  );
}

export async function shipLot(_: ActionState, fd: FormData) {
  return run(`/lots/${num(fd, "lotId")}/ship`, undefined, (s) => `출하 ${s.shipNo} 완료`);
}
