export type WaybillStatus = 
  | 'ACTIVE_TRANSIT'
  | 'WEIGHBRIDGE_CLEARED'
  | 'INSPECTION_APPROVED'
  | 'DELAYED'
  | 'SCHEDULED_DISPATCH'
  | 'DELIVERED';

export type CargoCategory = 
  | 'DRY_BULK'
  | 'CONTAINERIZED'
  | 'HEAVY_MACHINERY'
  | 'FMCG_DISTRIBUTION';

export type EscortLevel = 'NONE' | 'CONVOY_ESCORT' | 'ARMED_SECURITY_DETAIL';

export interface CheckpointLog {
  checkpointName: string;
  timestamp: string;
  status: 'CLEARED' | 'FLAGGED' | 'IN_QUEUE';
  operatorNotes?: string;
  officerId?: string;
}

export interface Waybill {
  id: string; // e.g. NHS-WB-9042
  shipper: string;
  consignee: string;
  origin: string;
  originState: string;
  destination: string;
  destinationState: string;
  corridorCode: string; // e.g. COR-A2
  cargoCategory: CargoCategory;
  cargoDescription: string;
  cargoWeightMT: number;
  tareWeightMT: number;
  grossWeightMT: number;
  maxAxleLoadTons: number;
  truckReg: string;
  truckModel: string;
  trailerType: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  rfidSealId: string;
  status: WaybillStatus;
  escortLevel: EscortLevel;
  dispatchTimestamp: string;
  estimatedArrival: string;
  currentLocationName: string;
  gpsCoordinates: { lat: number; lng: number };
  speedKmh: number;
  fuelLevelPercent: number;
  costNgn: number;
  costUsd: number;
  checkpointLogs: CheckpointLog[];
  priority: 'CRITICAL_HAUL' | 'STANDARD_FREIGHT' | 'BULK_SCHEDULED';
  delayReason?: string;
}

export interface Corridor {
  id: string;
  code: string;
  name: string;
  originHub: string;
  destHub: string;
  distanceKm: number;
  nominalTransitHours: number;
  currentAvgTransitHours: number;
  activeTruckCount: number;
  clearanceStatus: 'OPTIMAL' | 'MODERATE_DELAY' | 'RESTRICTED';
  weighbridgeCount: number;
  checkpoints: string[];
  alertNotice?: string;
}

export interface FleetAsset {
  id: string;
  registration: string;
  chassisNumber: string;
  model: string;
  year: number;
  horsePower: number;
  trailerConfiguration: string;
  maxTonnage: number;
  currentWaybillId?: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  status: 'EN_ROUTE' | 'AT_TERMINAL' | 'INSPECTION' | 'MAINTENANCE_BAY';
  fuelPercent: number;
  tirePressurePsi: number;
  speedLimitLockKmh: number;
  currentSpeedKmh: number;
  lastOdometerKm: number;
  nextServiceKm: number;
  currentHub: string;
}

export interface QuoteCalculationInput {
  origin: string;
  destination: string;
  cargoCategory: CargoCategory;
  weightMT: number;
  containerCount?: number;
  requiresEscort: boolean;
  priorityDispatch: boolean;
  refrigerated: boolean;
  hazmatDeclared: boolean;
}

export interface QuoteResult {
  baseFreightNgn: number;
  fuelSurchargeNgn: number;
  corridorTollNgn: number;
  escortFeeNgn: number;
  insuranceNgn: number;
  totalNgn: number;
  totalUsd: number;
  distanceKm: number;
  estimatedHours: number;
  corridorClearance: 'OPTIMAL' | 'MODERATE_DELAY' | 'RESTRICTED';
  recommendedTrailer: string;
}
