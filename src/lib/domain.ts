export const lotStatusLabel: Record<string, string> = {
  RAW: "원자재",
  WIP: "가공중(WIP)",
  PROCESSED: "가공완료",
  HOLD: "품질대기",
  IN_STOCK: "완제품",
  SHIPPED: "출하완료",
  SCRAPPED: "폐기",
};

export const woStatusLabel: Record<string, string> = {
  PLANNED: "대기",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  HOLD: "일시정지",
  CANCELLED: "취소",
};

export const machineStatusLabel: Record<string, string> = {
  IDLE: "대기",
  RUN: "가동",
  STOP: "정지",
  WARNING: "경고",
};

export const sensorLabel: Record<string, string> = {
  SPINDLE_RPM: "주축 RPM",
  SPINDLE_TEMP: "주축 온도",
  VIBRATION: "진동",
  SPINDLE_LOAD: "주축 부하",
  OPERATING_HOURS: "누적 가동",
};

export const roleLabel: Record<string, string> = {
  ADMIN: "관리자",
  MATERIAL: "자재",
  PLANNER: "생산관리",
  OPERATOR: "작업자",
  QUALITY: "품질",
};
