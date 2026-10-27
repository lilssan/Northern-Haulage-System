import React, { useState } from 'react';
import { X, Plus, Truck, FileText, CheckCircle2, ShieldCheck, Scale } from 'lucide-react';
import { Waybill, CargoCategory } from '../types/logistics';
import { CORRIDOR_HUBS, FLEET_ASSETS } from '../data/mockData';

interface NewShipmentModalProps {
  onClose: () => void;
  onSubmit: (waybill: Waybill) => void;
}

export const NewShipmentModal: React.FC<NewShipmentModalProps> = ({ onClose, onSubmit }) => {
  const [shipper, setShipper] = useState('');
  const [consignee, setConsignee] = useState('');
  const [originHubId, setOriginHubId] = useState('hub-abj');
  const [destHubId, setDestHubId] = useState('hub-kan');
  const [cargoCategory, setCargoCategory] = useState<CargoCategory>('DRY_BULK');
  const [cargoDescription, setCargoDescription] = useState('');
  const [weightMT, setWeightMT] = useState(35);
  const [truckId, setTruckId] = useState(FLEET_ASSETS[0]?.id || 'FL-01');
  const [escortRequired, setEscortRequired] = useState(false);
  const [priority, setPriority] = useState<'STANDARD_FREIGHT' | 'CRITICAL_HAUL'>('STANDARD_FREIGHT');

  const originHub = CORRIDOR_HUBS.find(h => h.id === originHubId) || CORRIDOR_HUBS[0];
  const destHub = CORRIDOR_HUBS.find(h => h.id === destHubId) || CORRIDOR_HUBS[1];
  const selectedTruck = FLEET_ASSETS.find(t => t.id === truckId) || FLEET_ASSETS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipper || !consignee) return;

    const newId = `NHS-WB-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const eta = new Date(now.getTime() + 10 * 3600 * 1000);

    const newWaybill: Waybill = {
      id: newId,
      shipper,
      consignee,
      origin: `${originHub.name}, ${originHub.city}`,
      originState: originHub.state,
      destination: `${destHub.name}, ${destHub.city}`,
      destinationState: destHub.state,
      corridorCode: 'COR-A2',
      cargoCategory,
      cargoDescription: cargoDescription || `${cargoCategory.replace('_', ' ')} (${weightMT} MT)`,
      cargoWeightMT: Number(weightMT),
      tareWeightMT: 15.5,
      grossWeightMT: Math.round((Number(weightMT) + 15.5) * 10) / 10,
      maxAxleLoadTons: 11.5,
      truckReg: selectedTruck.registration,
      truckModel: selectedTruck.model,
      trailerType: selectedTruck.trailerConfiguration,
      driverName: selectedTruck.driverName,
      driverPhone: selectedTruck.driverPhone,
      driverLicense: `FRSC-DRV-KAD-${Math.floor(1000 + Math.random() * 9000)}`,
      rfidSealId: `NHS-RFID-${Math.floor(10000 + Math.random() * 89999)}`,
      status: 'ACTIVE_TRANSIT',
      escortLevel: escortRequired ? 'ARMED_SECURITY_DETAIL' : 'NONE',
      dispatchTimestamp: now.toISOString(),
      estimatedArrival: eta.toISOString(),
      currentLocationName: `${originHub.city} Departure Weighbridge`,
      gpsCoordinates: { lat: originHub.lat, lng: originHub.lng },
      speedKmh: 45,
      fuelLevelPercent: 95,
      costNgn: Math.round(Number(weightMT) * 440 * 250),
      costUsd: Math.round((Number(weightMT) * 440 * 250) / 1540),
      checkpointLogs: [
        {
          checkpointName: `${originHub.city} Weighbridge Scale`,
          timestamp: 'Just Logged',
          status: 'CLEARED',
          operatorNotes: 'Axle load compliant. Tamper-proof RFID seal attached.'
        }
      ],
      priority
    };

    onSubmit(newWaybill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white border border-[#94A3B8] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-[#FF7A00] w-full"></div>

        <div className="p-4 px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#0B192C] text-white">
              <Plus className="w-4 h-4 text-[#FF7A00]" />
            </span>
            <h2 className="text-base font-bold text-[#0B192C]">
              Log New Freight Dispatch & Waybill
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block micro-label text-slate-600 mb-1">CONSIGNOR / SHIPPER *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dangote Sugar Plc, BUA Cement..."
                value={shipper}
                onChange={(e) => setShipper(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B192C]"
              />
            </div>

            <div>
              <label className="block micro-label text-slate-600 mb-1">CONSIGNEE (RECEIVER) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kano Central Grain Silos..."
                value={consignee}
                onChange={(e) => setConsignee(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B192C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block micro-label text-slate-600 mb-1">ORIGIN HUB</label>
              <select
                value={originHubId}
                onChange={(e) => setOriginHubId(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B192C]"
              >
                {CORRIDOR_HUBS.map(hub => (
                  <option key={hub.id} value={hub.id}>{hub.name} ({hub.city})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block micro-label text-slate-600 mb-1">DESTINATION TERMINAL</label>
              <select
                value={destHubId}
                onChange={(e) => setDestHubId(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B192C]"
              >
                {CORRIDOR_HUBS.map(hub => (
                  <option key={hub.id} value={hub.id}>{hub.name} ({hub.city})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block micro-label text-slate-600 mb-1">CARGO CLASSIFICATION</label>
              <select
                value={cargoCategory}
                onChange={(e) => setCargoCategory(e.target.value as CargoCategory)}
                className="w-full bg-white border border-[#CBD5E1] rounded px-2.5 py-2 text-slate-800"
              >
                <option value="DRY_BULK">Dry Bulk Cargo</option>
                <option value="CONTAINERIZED">Containerized Intermodal</option>
                <option value="HEAVY_MACHINERY">Heavy Machinery</option>
                <option value="FMCG_DISTRIBUTION">FMCG Distribution</option>
              </select>
            </div>

            <div>
              <label className="block micro-label text-slate-600 mb-1">CARGO PAYLOAD (MT)</label>
              <input
                type="number"
                min={5}
                max={60}
                value={weightMT}
                onChange={(e) => setWeightMT(Number(e.target.value))}
                className="w-full bg-white border border-[#CBD5E1] rounded px-2.5 py-2 text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block micro-label text-slate-600 mb-1">ASSIGNED HAULAGE TRUCK</label>
              <select
                value={truckId}
                onChange={(e) => setTruckId(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded px-2.5 py-2 text-slate-800"
              >
                {FLEET_ASSETS.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.registration} — {asset.driverName.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block micro-label text-slate-600 mb-1">CARGO DESCRIPTION & PACKAGING SPEC</label>
            <input
              type="text"
              placeholder="e.g. 700 bags Dangote 50kg Sugar, Shrink-wrapped on Euro Pallets"
              value={cargoDescription}
              onChange={(e) => setCargoDescription(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={escortRequired}
                onChange={(e) => setEscortRequired(e.target.checked)}
                className="rounded text-[#FF7A00] focus:ring-[#FF7A00]"
              />
              <span className="font-semibold text-slate-800">Armed Security Escort Convoy</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={priority === 'CRITICAL_HAUL'}
                onChange={(e) => setPriority(e.target.checked ? 'CRITICAL_HAUL' : 'STANDARD_FREIGHT')}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span className="font-semibold text-red-700">Priority Expedited Transit</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-semibold rounded transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>Issue Waybill & Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
