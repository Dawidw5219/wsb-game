export interface VictimStatus {
  entityId: string;
  status: "ACTIVE" | "TERMINATED";
  terminatedAt?: Date;
  lastPing: Date;
}
