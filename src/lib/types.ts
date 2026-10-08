export type Operator = {
  id: number;
  employeeNo: string;
  name: string;
  role: string;
};

export type Machine = {
  id: number;
  code: string;
  name: string;
  type: string;
  status: string;
};

export type Alert = {
  id: number;
  machineId: number | null;
  severity: string;
  title: string;
  message: string;
  createdAt: string;
};

export type Lot = {
  id: number;
  lotNo: string;
  materialName: string;
  quantity: number;
  status: string;
  location: string;
  createdAt: string;
  updatedAt: string;
};

export type Inspection = {
  id: number;
  result: string;
  note: string | null;
  createdAt: string;
};

export type Shipment = {
  id: number;
  shipNo: string;
  quantity: number;
  createdAt: string;
};

export type TraceEvent = {
  id: number;
  type: string;
  message: string;
  createdAt: string;
};

export type WorkOrder = {
  id: number;
  woNo: string;
  productName: string;
  quantity: number;
  status: string;
  startedAt: string | null;
  createdAt: string;
  machine: Machine;
  lot: Lot;
  operator: Operator | null;
};

export type LotSummary = Lot & {
  latestInspection: Inspection | null;
  latestShipment: Shipment | null;
};

export type LotTrace = Lot & {
  workOrders: WorkOrder[];
  inspections: Inspection[];
  shipments: Shipment[];
  events: TraceEvent[];
};

export type MachineDetail = Machine & {
  activeWorkOrder: WorkOrder | null;
  openAlerts: Alert[];
};

export type Dashboard = {
  counts: Record<"raw" | "wip" | "hold" | "stock" | "shipped" | "running", number>;
  machines: Machine[];
  alerts: Alert[];
  recentLots: Lot[];
};
