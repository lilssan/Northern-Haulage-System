import React, { useState } from 'react';
import { 
  Radio, 
  MapPin, 
  Truck, 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Scale, 
  Eye, 
  Layers,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import { Waybill, Corridor } from '../types/logistics';
import { TRADE_CORRIDORS, CORRIDOR_HUBS } from '../data/mockData';

interface CorridorRadarMapProps {
  waybills: Waybill[];
  onSelectWaybill: (waybill: Waybill) => void;
}

export const CorridorRadarMap: React.FC<CorridorRadarMapProps> = ({
  waybills,
  onSelectWaybill
}) => {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('cor-1'); // Default COR-A2
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);

  const selectedCorridor = TRADE_CORRIDORS.find(c => c.id === selectedCorridorId) || TRADE_CORRIDORS[0];
  const activeWaybillsForCorridor = waybills.filter(w => w.corridorCode === selectedCorridor.code);
  const selectedTruckWaybill = waybills.find(w => w.id === selectedTruckId) || waybills[0];

  // Map coordinates scaled to fit SVG canvas (approx coordinates translated to 800x520)
  // Nigeria bounding box roughly 3.0E to 14.5E, 4.0N to 14.0N
  const projectX = (lng: number) => {
    return 60 + ((lng - 3.0) / (14.5 - 3.0)) * 680;
  };
  const projectY = (lat: number) => {
    return 480 - ((lat - 4.2) / (14.0 - 4.2)) * 430;
  };

  const MAP_NODES = [
    { id: 'lag', name: 'Lagos (Apapa/Tin Can)', state: 'Lagos', lat: 6.45, lng: 3.40, hub: 'Maritime Gateway' },
    { id: 'ibd', name: 'Ibadan Depot', state: 'Oyo', lat: 7.38, lng: 3.93, hub: 'South-West Transit' },
    { id: 'ilr', name: 'Ilorin Junction', state: 'Kwara', lat: 8.50, lng: 4.55, hub: 'Middle Belt Gateway' },
    { id: 'lkj', name: 'Lokoja Benue Bridge', state: 'Kogi', lat: 7.80, lng: 6.74, hub: 'Confluence Hub' },
    { id: 'abj', name: 'Abuja (Idu ICD / FCT)', state: 'Abuja FCT', lat: 9.06, lng: 7.39, hub: 'Federal Hub' },
    { id: 'min', name: 'Minna Rail Junction', state: 'Niger', lat: 9.61, lng: 6.55, hub: 'Agro Feeder' },
    { id: 'kad', name: 'Kaduna (Kakuri Industrial)', state: 'Kaduna', lat: 10.52, lng: 7.44, hub: 'Industrial Heart' },
    { id: 'zar', name: 'Zaria Interchange', state: 'Kaduna', lat: 11.08, lng: 7.72, hub: 'North Crossroads' },
    { id: 'kan', name: 'Kano (Bompai / Dawanau)', state: 'Kano', lat: 12.00, lng: 8.52, hub: 'Trans-Sahel Mega Hub' },
    { id: 'kat', name: 'Katsina / Jibia Border', state: 'Katsina', lat: 13.00, lng: 7.60, hub: 'Niger Border Post' },
    { id: 'sok', name: 'Sokoto (CCNN Cement)', state: 'Sokoto', lat: 13.06, lng: 5.24, hub: 'Cement & Mineral Basin' },
    { id: 'jos', name: 'Jos Industrial (Bukuru)', state: 'Plateau', lat: 9.90, lng: 8.89, hub: 'Highland Distribution' },
    { id: 'bau', name: 'Bauchi Transit', state: 'Bauchi', lat: 10.31, lng: 9.84, hub: 'North-East Feeder' },
    { id: 'pot', name: 'Potiskum Yard', state: 'Yobe', lat: 11.71, lng: 11.08, hub: 'Convoy Marshalling' },
    { id: 'mai', name: 'Maiduguri Central Depot', state: 'Borno', lat: 11.83, lng: 13.15, hub: 'Lake Chad Basin' },
    { id: 'onn', name: 'Port Harcourt (Onne Port)', state: 'Rivers', lat: 4.75, lng: 7.00, hub: 'Eastern Maritime' },
    { id: 'enu', name: 'Enugu 9th Mile', state: 'Enugu', lat: 6.44, lng: 7.50, hub: 'Eastern Central' },
    { id: 'mak', name: 'Makurdi River Post', state: 'Benue', lat: 7.73, lng: 8.52, hub: 'Food Basket Axis' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Corridor Selector & Telematics Overview */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#0B192C] text-[#FF7A00]">
                <Radio className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-[#0B192C] tracking-tight">
                Northern Trade Corridors Telematics Radar
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                GPS LATENCY: 1.4s
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live monitoring of haulage velocities, FRSC weighbridges, and security escorts along trunk roads.
            </p>
          </div>

          {/* Quick corridor tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {TRADE_CORRIDORS.map(cor => (
              <button
                key={cor.id}
                onClick={() => setSelectedCorridorId(cor.id)}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                  selectedCorridorId === cor.id
                    ? 'bg-[#0B192C] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="font-mono font-bold text-[11px]">{cor.code}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Corridor Banner */}
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="md:col-span-2">
            <span className="micro-label text-slate-500">ACTIVE SELECTED CORRIDOR</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedCorridor.name}</div>
            <div className="text-slate-600 text-[11px] mt-0.5">{selectedCorridor.alertNotice}</div>
          </div>

          <div>
            <span className="micro-label text-slate-500">CORRIDOR METRICS</span>
            <div className="font-semibold text-slate-800 tnum mt-0.5">
              {selectedCorridor.distanceKm} KM • Nominal {selectedCorridor.nominalTransitHours} hrs
            </div>
            <div className="text-[11px] text-emerald-700 font-medium tnum">
              Current Avg: {selectedCorridor.currentAvgTransitHours} hrs
            </div>
          </div>

          <div>
            <span className="micro-label text-slate-500">CLEARANCE STATUS</span>
            <div className="mt-0.5">
              {selectedCorridor.clearanceStatus === 'OPTIMAL' && (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Corridor Optimal
                </span>
              )}
              {selectedCorridor.clearanceStatus === 'MODERATE_DELAY' && (
                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Clock className="w-3.5 h-3.5" /> Moderate Delays
                </span>
              )}
              {selectedCorridor.clearanceStatus === 'RESTRICTED' && (
                <span className="inline-flex items-center gap-1 text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> Armed Escort Only
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {selectedCorridor.activeTruckCount} trucks logged on route
            </div>
          </div>
        </div>
      </div>

      {/* Main Radar Screen Layout (Split View: Map & Telematics Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Map Canvas */}
        <div className="lg:col-span-8 bg-[#0B192C] border border-[#1E3E62] rounded-lg p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E3E62] text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-white tracking-wider font-mono">NIGERIA TRANS-SAHEL GEOSPATIAL RADAR</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span> Trucks in Transit
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span> Weighbridge Station
              </span>
            </div>
          </div>

          {/* SVG Map Display */}
          <div className="relative w-full aspect-[16/10] bg-[#0E1C2F] rounded mt-3 border border-[#1E3E62]/60 overflow-hidden flex items-center justify-center">
            {/* Grid background lines */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6886AE" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <svg viewBox="0 0 800 520" className="w-full h-full">
              {/* Primary Trade Corridor Trunk Highways */}
              
              {/* Corridor A: Lagos -> Ibadan -> Ilorin -> Lokoja -> Abuja -> Kaduna -> Zaria -> Kano */}
              <path
                d={`M ${projectX(3.40)} ${projectY(6.45)} L ${projectX(3.93)} ${projectY(7.38)} L ${projectX(4.55)} ${projectY(8.50)} L ${projectX(7.39)} ${projectY(9.06)} L ${projectX(7.44)} ${projectY(10.52)} L ${projectX(7.72)} ${projectY(11.08)} L ${projectX(8.52)} ${projectY(12.00)}`}
                fill="none"
                stroke={selectedCorridor.code === 'COR-A2' || selectedCorridor.code === 'COR-A1' ? '#FF7A00' : '#334E68'}
                strokeWidth={selectedCorridor.code === 'COR-A2' || selectedCorridor.code === 'COR-A1' ? '4' : '2.5'}
                strokeDasharray={selectedCorridor.code === 'COR-A2' ? 'none' : '4 2'}
                className="transition-all"
              />

              {/* Corridor B: Kano -> Katsina -> Jibia */}
              <path
                d={`M ${projectX(8.52)} ${projectY(12.00)} L ${projectX(7.60)} ${projectY(13.00)}`}
                fill="none"
                stroke={selectedCorridor.code === 'COR-B1' ? '#FF7A00' : '#334E68'}
                strokeWidth={selectedCorridor.code === 'COR-B1' ? '4' : '2.5'}
              />

              {/* Corridor B2: Kano -> Potiskum -> Damaturu -> Maiduguri */}
              <path
                d={`M ${projectX(8.52)} ${projectY(12.00)} L ${projectX(11.08)} ${projectY(11.71)} L ${projectX(13.15)} ${projectY(11.83)}`}
                fill="none"
                stroke={selectedCorridor.code === 'COR-B2' ? '#FF7A00' : '#334E68'}
                strokeWidth={selectedCorridor.code === 'COR-B2' ? '4' : '2.5'}
              />

              {/* Corridor C: Port Harcourt -> Enugu -> Makurdi -> Jos -> Bauchi */}
              <path
                d={`M ${projectX(7.00)} ${projectY(4.75)} L ${projectX(7.50)} ${projectY(6.44)} L ${projectX(8.52)} ${projectY(7.73)} L ${projectX(8.89)} ${projectY(9.90)} L ${projectX(9.84)} ${projectY(10.31)}`}
                fill="none"
                stroke={selectedCorridor.code === 'COR-C1' ? '#FF7A00' : '#334E68'}
                strokeWidth={selectedCorridor.code === 'COR-C1' ? '4' : '2.5'}
              />

              {/* Corridor D: Sokoto -> Gusau -> Zaria */}
              <path
                d={`M ${projectX(5.24)} ${projectY(13.06)} L ${projectX(6.66)} ${projectY(12.17)} L ${projectX(7.72)} ${projectY(11.08)}`}
                fill="none"
                stroke={selectedCorridor.code === 'COR-D1' ? '#FF7A00' : '#334E68'}
                strokeWidth={selectedCorridor.code === 'COR-D1' ? '4' : '2.5'}
              />

              {/* Cross connection Abuja -> Jos */}
              <path
                d={`M ${projectX(7.39)} ${projectY(9.06)} L ${projectX(8.89)} ${projectY(9.90)}`}
                fill="none"
                stroke="#243B53"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* Weighbridge Stations Marked Along Route */}
              {[
                { name: 'Tafa Weighbridge', lat: 9.38, lng: 7.29 },
                { name: 'Jaji Axle Point', lat: 10.82, lng: 7.55 },
                { name: 'Ogere Axle Control', lat: 6.90, lng: 3.70 },
                { name: 'Hawans Kibo', lat: 9.68, lng: 8.74 },
                { name: 'Dawanau Scale', lat: 12.08, lng: 8.48 }
              ].map((scale, idx) => {
                const x = projectX(scale.lng);
                const y = projectY(scale.lat);
                return (
                  <g key={idx} className="cursor-pointer">
                    <rect x={x - 6} y={y - 6} width="12" height="12" fill="#0369A1" stroke="#BAE6FD" strokeWidth="1.5" rx="2" />
                    <text x={x + 9} y={y + 3} fill="#94A3B8" fontSize="9" fontFamily="Inter" fontWeight="500">
                      {scale.name}
                    </text>
                  </g>
                );
              })}

              {/* Regional Hub Nodes */}
              {MAP_NODES.map((node) => {
                const x = projectX(node.lng);
                const y = projectY(node.lat);
                const isSelected = selectedHubId === node.id;
                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedHubId(node.id)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? '#FF7A00' : '#0B192C'}
                      stroke={isSelected ? '#FFFFFF' : '#6886AE'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />
                    <text
                      x={x + 8}
                      y={y + 3}
                      fill={isSelected ? '#FF7A00' : '#F1F5F9'}
                      fontSize="10"
                      fontFamily="Inter"
                      fontWeight={node.id === 'abj' || node.id === 'kan' || node.id === 'kad' ? '700' : '500'}
                    >
                      {node.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Real-time Trucks on Map with pulsing beacons */}
              {waybills.map((wb) => {
                const x = projectX(wb.gpsCoordinates.lng);
                const y = projectY(wb.gpsCoordinates.lat);
                const isSelected = selectedTruckId === wb.id;
                return (
                  <g
                    key={wb.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedTruckId(wb.id)}
                  >
                    {/* Pulsing ring around moving truck */}
                    {wb.status === 'ACTIVE_TRANSIT' && (
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="none"
                        stroke="#FF7A00"
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? '#FFFFFF' : '#FF7A00'}
                      stroke="#0B192C"
                      strokeWidth="1.5"
                    />
                    <rect
                      x={x - 22}
                      y={y - 18}
                      width="44"
                      height="12"
                      fill="#0B192C"
                      stroke="#1E3E62"
                      strokeWidth="1"
                      rx="2"
                    />
                    <text
                      x={x}
                      y={y - 9}
                      fill="#FFFFFF"
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {wb.truckReg.slice(0, 7)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* In-Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-[#0B192C]/90 backdrop-blur-xs border border-[#1E3E62] p-2.5 rounded text-[10px] text-slate-300 space-y-1">
              <div className="font-semibold text-white micro-label">TELEMETRICS KEY</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-0.5 bg-[#FF7A00]"></span> Selected Corridor Line
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span> Moving Heavy Trailer
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#0369A1] rounded-xs"></span> Weighbridge Checkpoint
              </div>
            </div>
          </div>
        </div>

        {/* Selected Truck / Corridor Telematics Inspector Panel */}
        <div className="lg:col-span-4 bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#0B192C] text-[#FF7A00]">
                  <Truck className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-[#0B192C]">Live Unit Telematics</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#0B192C] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {selectedTruckWaybill.truckReg}
              </span>
            </div>

            {/* Quick switcher between trucks */}
            <div className="my-3">
              <label className="block micro-label text-[#64748B] mb-1">SELECT EN-ROUTE UNIT</label>
              <select
                value={selectedTruckWaybill.id}
                onChange={(e) => setSelectedTruckId(e.target.value)}
                className="w-full bg-slate-50 border border-[#CBD5E1] rounded px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0B192C]"
              >
                {waybills.map(wb => (
                  <option key={wb.id} value={wb.id}>
                    {wb.truckReg} — {wb.driverName} ({wb.cargoWeightMT} MT {wb.cargoCategory})
                  </option>
                ))}
              </select>
            </div>

            {/* Telematics stats grid */}
            <div className="space-y-3 mt-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Current Velocity</span>
                  <div className="font-bold text-slate-900 text-sm tnum flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {selectedTruckWaybill.speedKmh > 0 ? `${selectedTruckWaybill.speedKmh} km/h` : 'At Scale (0 km/h)'}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Speed lock: 65 km/h</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Fuel Level</span>
                  <div className="font-bold text-slate-900 text-sm tnum">
                    {selectedTruckWaybill.fuelLevelPercent}%
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full" 
                      style={{ width: `${selectedTruckWaybill.fuelLevelPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Waybill reference */}
              <div className="border border-slate-200 p-3 rounded text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Waybill #</span>
                  <span className="font-mono font-bold text-[#0B192C]">{selectedTruckWaybill.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Shipper</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">{selectedTruckWaybill.shipper}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cargo Mass</span>
                  <span className="font-bold text-slate-900 tnum">{selectedTruckWaybill.cargoWeightMT} MT (Gross {selectedTruckWaybill.grossWeightMT}T)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">RFID Seal</span>
                  <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                    {selectedTruckWaybill.rfidSealId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Driver</span>
                  <span className="font-medium text-slate-800">{selectedTruckWaybill.driverName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Current Zone</span>
                  <span className="text-slate-700 truncate max-w-[160px] text-[11px]">{selectedTruckWaybill.currentLocationName}</span>
                </div>
              </div>

              {/* Checkpoint logs preview */}
              <div className="text-xs">
                <span className="micro-label text-slate-500 block mb-1.5">LATEST CHECKPOINT TRANSIT LOG</span>
                {selectedTruckWaybill.checkpointLogs.slice(-2).map((chk, i) => (
                  <div key={i} className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px] mb-1.5">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{chk.checkpointName}</span>
                      <span className="text-slate-500 font-mono tnum">{chk.timestamp}</span>
                    </div>
                    {chk.operatorNotes && (
                      <div className="text-slate-600 text-[10px] mt-0.5">{chk.operatorNotes}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={() => onSelectWaybill(selectedTruckWaybill)}
              className="w-full bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-semibold py-2 px-3 rounded transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Consignment Audit Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
