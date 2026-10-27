import React, { useState } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Wrench, 
  Gauge, 
  Fuel, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Search,
  Filter,
  Activity
} from 'lucide-react';
import { FleetAsset } from '../types/logistics';
import { FLEET_ASSETS } from '../data/mockData';

interface FleetManagementProps {
  onAssignTruck?: (truckId: string) => void;
}

export const FleetManagement: React.FC<FleetManagementProps> = ({ onAssignTruck }) => {
  const [fleetList, setFleetList] = useState<FleetAsset[]>(FLEET_ASSETS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAssets = fleetList.filter(asset => {
    const matchesSearch = 
      asset.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.currentHub.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = fleetList.filter(a => a.status === 'EN_ROUTE').length;
  const terminalCount = fleetList.filter(a => a.status === 'AT_TERMINAL').length;
  const maintenanceCount = fleetList.filter(a => a.status === 'MAINTENANCE_BAY').length;

  return (
    <div className="space-y-6">
      {/* Top Asset Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] border-l-[3px] border-l-[#0B192C] rounded-lg p-4 shadow-xs">
          <span className="micro-label text-slate-500">PRIME MOVERS TOTAL</span>
          <div className="text-2xl font-bold text-[#0B192C] mt-1 tnum">{fleetList.length} Units</div>
          <div className="text-xs text-slate-600 mt-0.5">Heavy Euro-5 & Euro-6 Multi-Axle</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] border-l-[3px] border-l-[#FF7A00] rounded-lg p-4 shadow-xs">
          <span className="micro-label text-slate-500">EN-ROUTE HIGHWAY DISPATCH</span>
          <div className="text-2xl font-bold text-amber-700 mt-1 tnum">{activeCount} Trucks</div>
          <div className="text-xs text-slate-600 mt-0.5">Strict 65 km/h GPS Speed Lock Active</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] border-l-[3px] border-l-emerald-600 rounded-lg p-4 shadow-xs">
          <span className="micro-label text-slate-500">TERMINAL READY FOR LOADING</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tnum">{terminalCount} Staged</div>
          <div className="text-xs text-slate-600 mt-0.5">Idu Depot & Bompai Yard</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] border-l-[3px] border-l-slate-400 rounded-lg p-4 shadow-xs">
          <span className="micro-label text-slate-500">MAINTENANCE & TIRE BAY</span>
          <div className="text-2xl font-bold text-slate-700 mt-1 tnum">{maintenanceCount} Bay Service</div>
          <div className="text-xs text-slate-600 mt-0.5">Scheduled Oil & Brake Inspection</div>
        </div>
      </div>

      {/* Fleet List Header & Search */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#0B192C] tracking-tight">
              Heavy Haulage Prime Movers & Telematics Roster
            </h2>
            <p className="text-xs text-[#64748B]">
              Real-time TPMS tire telemetry, fuel containment, and driver certifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search truck, driver, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-[#CBD5E1] rounded px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B192C]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0B192C]"
            >
              <option value="ALL">All Fleet Status</option>
              <option value="EN_ROUTE">En Route (Highway)</option>
              <option value="AT_TERMINAL">At Terminal (Ready)</option>
              <option value="MAINTENANCE_BAY">Maintenance Bay</option>
            </select>
          </div>
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map(asset => (
            <div 
              key={asset.id} 
              className="border border-[#CBD5E1] rounded-lg p-4 bg-white hover:border-[#0B192C] transition-colors relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#0B192C]">
                      {asset.registration}
                    </span>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">
                      {asset.model}
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    asset.status === 'EN_ROUTE' 
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : asset.status === 'AT_TERMINAL'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}>
                    {asset.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] text-[#64748B] mb-3">
                  Trailer: <strong className="text-slate-800">{asset.trailerConfiguration}</strong> (Max {asset.maxTonnage} MT)
                </div>

                {/* Telemetry Gauge Strip */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs mb-3">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase flex items-center justify-center gap-1">
                      <Fuel className="w-3 h-3 text-slate-400" /> Fuel
                    </div>
                    <div className="font-bold text-slate-900 tnum mt-0.5">{asset.fuelPercent}%</div>
                  </div>

                  <div>
                    <div className="text-[9px] text-slate-500 uppercase flex items-center justify-center gap-1">
                      <Gauge className="w-3 h-3 text-slate-400" /> TPMS
                    </div>
                    <div className="font-bold text-emerald-700 tnum mt-0.5">{asset.tirePressurePsi} PSI</div>
                  </div>

                  <div>
                    <div className="text-[9px] text-slate-500 uppercase flex items-center justify-center gap-1">
                      <Activity className="w-3 h-3 text-slate-400" /> Speed Lock
                    </div>
                    <div className="font-bold text-slate-900 tnum mt-0.5">{asset.speedLimitLockKmh} km/h</div>
                  </div>
                </div>

                {/* Driver information */}
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Certified Driver:</span>
                    <span className="font-semibold text-slate-900">{asset.driverName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-mono text-slate-700">{asset.driverPhone}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Current Base:</span>
                    <span className="text-slate-800">{asset.currentHub}</span>
                  </div>
                </div>
              </div>

              {/* Preventive Maintenance Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200 text-[10px]">
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>Service Due in: {asset.nextServiceKm - asset.lastOdometerKm} km</span>
                  <span className="font-mono">{asset.lastOdometerKm.toLocaleString()} km</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0B192C] h-full rounded-full"
                    style={{ width: `${Math.min(100, (asset.lastOdometerKm / asset.nextServiceKm) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
