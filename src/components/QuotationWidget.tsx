import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Truck, 
  Package, 
  Layers, 
  ArrowRight, 
  FileCheck, 
  BadgePercent, 
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { CargoCategory, EscortLevel, Waybill } from '../types/logistics';
import { CORRIDOR_HUBS } from '../data/mockData';

interface QuotationWidgetProps {
  onBookFreight?: (newWaybill: Waybill) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const CARGO_CARDS: {
  category: CargoCategory;
  title: string;
  subtitle: string;
  icon: any;
  defaultTonnage: number;
  recommendedTrailer: string;
}[] = [
  {
    category: 'DRY_BULK',
    title: 'Dry Bulk Cargo',
    subtitle: 'Cement, Grain, Fertilizer, Gypsum',
    icon: Layers,
    defaultTonnage: 35,
    recommendedTrailer: 'Pneumatic Pressure Silo / High-Side Tipper'
  },
  {
    category: 'CONTAINERIZED',
    title: 'Containerized Intermodal',
    subtitle: '20ft Standard & 40ft High Cube',
    icon: Package,
    defaultTonnage: 28,
    recommendedTrailer: 'Tri-Axle Skeletal Twist-Lock Chassis'
  },
  {
    category: 'HEAVY_MACHINERY',
    title: 'Heavy Machinery & Project',
    subtitle: 'Excavators, Cranes, Transformers',
    icon: Truck,
    defaultTonnage: 48,
    recommendedTrailer: 'Goldhofer Multi-Axle Low-Bed Carrier'
  },
  {
    category: 'FMCG_DISTRIBUTION',
    title: 'FMCG & Palletized Freight',
    subtitle: 'Packaged Food, Beverages, Pharmaceuticals',
    icon: Package,
    defaultTonnage: 30,
    recommendedTrailer: 'Enclosed Curtainsider / Refrigerated Box'
  }
];

export const QuotationWidget: React.FC<QuotationWidgetProps> = ({
  onBookFreight,
  onClose,
  isModal = false
}) => {
  const [originHubId, setOriginHubId] = useState('hub-abj');
  const [destHubId, setDestHubId] = useState('hub-kan');
  const [cargoCategory, setCargoCategory] = useState<CargoCategory>('DRY_BULK');
  const [cargoDescription, setCargoDescription] = useState('Industrial Portland Cement (Bulk Powder)');
  const [shipperName, setShipperName] = useState('Dangote Industries / BUA Procurement');
  const [consigneeName, setConsigneeName] = useState('Kano Metro Construction Logistics Base');
  const [tonnage, setTonnage] = useState<number>(35);
  const [requiresEscort, setRequiresEscort] = useState<boolean>(false);
  const [isRefrigerated, setIsRefrigerated] = useState<boolean>(false);
  const [isHazmat, setIsHazmat] = useState<boolean>(false);
  const [isPriority, setIsPriority] = useState<boolean>(false);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<string | null>(null);

  const originHub = CORRIDOR_HUBS.find(h => h.id === originHubId) || CORRIDOR_HUBS[0];
  const destHub = CORRIDOR_HUBS.find(h => h.id === destHubId) || CORRIDOR_HUBS[1];

  // Dynamic distance calculation based on hubs
  const calculatedDistanceKm = useMemo(() => {
    if (originHubId === destHubId) return 60;
    // Approximated real highway distances between Nigerian economic hubs
    const key = `${originHubId}-${destHubId}`;
    const reverseKey = `${destHubId}-${originHubId}`;
    const distanceMap: Record<string, number> = {
      'hub-abj-hub-kan': 438,
      'hub-lag-hub-abj': 760,
      'hub-lag-hub-kan': 990,
      'hub-kan-hub-sok': 420,
      'hub-abj-hub-kad': 188,
      'hub-kad-hub-kan': 250,
      'hub-jos-hub-kan': 310,
      'hub-onn-hub-jos': 680,
      'hub-kan-hub-mai': 585,
      'hub-sok-hub-abj': 510
    };
    return distanceMap[key] || distanceMap[reverseKey] || 450;
  }, [originHubId, destHubId]);

  // Pricing formula conforming to Nigerian bulk haulage metrics
  const quoteCalculation = useMemo(() => {
    const ratePerKmPerMT = cargoCategory === 'HEAVY_MACHINERY' ? 240 : 155;
    const baseFreight = Math.round(calculatedDistanceKm * tonnage * ratePerKmPerMT);
    
    // Fuel index surcharge (approx 22% of base)
    const fuelSurcharge = Math.round(baseFreight * 0.22);
    
    // Road & Bridge Toll (Tafa, Ogere, Benue Bridge, etc.)
    const corridorToll = Math.round((calculatedDistanceKm / 100) * 45000);
    
    // Escort fee
    const escortFee = requiresEscort ? 650000 : 0;
    
    // Refrigeration surcharge
    const reeferFee = isRefrigerated ? 350000 : 0;
    
    // Priority dispatch (direct non-stop dual driver crew)
    const priorityFee = isPriority ? 400000 : 0;
    
    // Institutional Goods in Transit (GIT) Insurance (0.4% valuation)
    const insurance = Math.round(baseFreight * 0.04);
    
    const totalNgn = baseFreight + fuelSurcharge + corridorToll + escortFee + reeferFee + priorityFee + insurance;
    const totalUsd = Math.round(totalNgn / 1540); // Standard FX translation

    const estimatedHours = Math.round((calculatedDistanceKm / 52) * 10) / 10;

    return {
      baseFreight,
      fuelSurcharge,
      corridorToll,
      escortFee,
      reeferFee,
      priorityFee,
      insurance,
      totalNgn,
      totalUsd,
      estimatedHours
    };
  }, [calculatedDistanceKm, tonnage, cargoCategory, requiresEscort, isRefrigerated, isPriority]);

  const activeCargoCard = CARGO_CARDS.find(c => c.category === cargoCategory)!;

  const handleCreateBooking = () => {
    const waybillNum = `NHS-WB-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const etaDate = new Date(now.getTime() + quoteCalculation.estimatedHours * 3600 * 1000);

    const newWaybill: Waybill = {
      id: waybillNum,
      shipper: shipperName || 'BUA Cement / Dangote Freight',
      consignee: consigneeName || 'Kano Bompai Distribution',
      origin: `${originHub.name}, ${originHub.city}`,
      originState: originHub.state,
      destination: `${destHub.name}, ${destHub.city}`,
      destinationState: destHub.state,
      corridorCode: calculatedDistanceKm > 600 ? 'COR-A1' : 'COR-A2',
      cargoCategory,
      cargoDescription: cargoDescription || `${activeCargoCard.title} (${tonnage} MT)`,
      cargoWeightMT: tonnage,
      tareWeightMT: 15.5,
      grossWeightMT: Math.round((tonnage + 15.5) * 10) / 10,
      maxAxleLoadTons: 11.4,
      truckReg: `NHS-${Math.floor(100 + Math.random() * 900)}-TRK`,
      truckModel: cargoCategory === 'HEAVY_MACHINERY' ? 'Mercedes-Benz Arocs 8x4 Heavy' : 'MAN TGX 33.540 6x4',
      trailerType: activeCargoCard.recommendedTrailer,
      driverName: 'Malam Ibrahim Gwandu',
      driverPhone: '+234 803 552 1900',
      driverLicense: 'FRSC-DRV-KAD-7741',
      rfidSealId: `NHS-RFID-${Math.floor(10000 + Math.random() * 89999)}`,
      status: 'SCHEDULED_DISPATCH',
      escortLevel: requiresEscort ? 'ARMED_SECURITY_DETAIL' : 'NONE',
      dispatchTimestamp: now.toISOString(),
      estimatedArrival: etaDate.toISOString(),
      currentLocationName: `${originHub.city} Departure Staging Bay`,
      gpsCoordinates: { lat: originHub.lat, lng: originHub.lng },
      speedKmh: 0,
      fuelLevelPercent: 100,
      costNgn: quoteCalculation.totalNgn,
      costUsd: quoteCalculation.totalUsd,
      checkpointLogs: [
        {
          checkpointName: `${originHub.city} Terminal Gate`,
          timestamp: 'Staged for Dispatch',
          status: 'CLEARED',
          operatorNotes: 'Official electronic waybill issued. Telematics active.'
        }
      ],
      priority: isPriority ? 'CRITICAL_HAUL' : 'STANDARD_FREIGHT'
    };

    if (onBookFreight) {
      onBookFreight(newWaybill);
    }
    setBookingSuccessNotice(`Waybill ${waybillNum} generated successfully! Added to active manifest.`);
    setTimeout(() => {
      setBookingSuccessNotice(null);
      if (onClose) onClose();
    }, 2800);
  };

  return (
    <div className={`bg-white border border-[#CBD5E1] rounded-lg shadow-md relative overflow-hidden ${isModal ? 'max-w-4xl mx-auto' : ''}`}>
      {/* 4px Secondary Safety Amber Top Accent Strip as explicitly specified */}
      <div className="h-1 bg-[#FF7A00] w-full"></div>

      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] bg-slate-50/50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#0B192C] text-white">
              <Calculator className="w-4 h-4 text-[#FF7A00]" />
            </span>
            <h2 className="text-lg font-bold text-[#0B192C] tracking-tight">
              Interactive Freight Quotation & Booking Engine
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Transparent corridor rates, axle compliance verification, and instant waybill reservation.
          </p>
        </div>

        {isModal && onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
          >
            ✕ Close
          </button>
        )}
      </div>

      {bookingSuccessNotice && (
        <div className="m-5 p-3.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{bookingSuccessNotice}</span>
        </div>
      )}

      <div className="p-5 space-y-6">
        {/* Step 1: Cargo Classification Radio-Cards */}
        <div>
          <label className="block micro-label text-[#64748B] mb-2.5">
            1. SELECT FREIGHT CLASSIFICATION
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CARGO_CARDS.map(card => {
              const isSelected = cargoCategory === card.category;
              const Icon = card.icon;
              return (
                <button
                  type="button"
                  key={card.category}
                  onClick={() => {
                    setCargoCategory(card.category);
                    setTonnage(card.defaultTonnage);
                  }}
                  className={`text-left p-3.5 rounded border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0B192C] bg-[#eff4ff] shadow-xs ring-1 ring-[#0B192C]'
                      : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded ${isSelected ? 'bg-[#0B192C] text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#0B192C] bg-[#0B192C]' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 text-[13px]">{card.title}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">{card.subtitle}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                    Default {card.defaultTonnage} MT
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Route Corridor Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block micro-label text-[#64748B] mb-1.5">
              ORIGIN FREIGHT TERMINAL
            </label>
            <div className="relative">
              <select
                value={originHubId}
                onChange={(e) => setOriginHubId(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2.5 text-xs text-[#0B192C] font-medium focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
              >
                {CORRIDOR_HUBS.map(hub => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.city}, {hub.state})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <span className={`w-2 h-2 rounded-full ${
                  originHub.clearance === 'OPTIMAL' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  {originHub.clearance}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Weighbridge pre-check active at origin
            </p>
          </div>

          <div>
            <label className="block micro-label text-[#64748B] mb-1.5">
              DESTINATION DISCHARGE TERMINAL
            </label>
            <div className="relative">
              <select
                value={destHubId}
                onChange={(e) => setDestHubId(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2.5 text-xs text-[#0B192C] font-medium focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
              >
                {CORRIDOR_HUBS.map(hub => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.city}, {hub.state})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <span className={`w-2 h-2 rounded-full ${
                  destHub.clearance === 'OPTIMAL' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  {destHub.clearance}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-sky-600" />
              Transit distance: <strong className="tnum text-slate-700">{calculatedDistanceKm} km</strong> (~{quoteCalculation.estimatedHours} hrs)
            </p>
          </div>
        </div>

        {/* Step 3: Shipper & Consignment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block micro-label text-[#64748B] mb-1">
              CONSIGNOR / SHIPPER
            </label>
            <input
              type="text"
              value={shipperName}
              onChange={(e) => setShipperName(e.target.value)}
              placeholder="e.g. Dangote Cement Plc, BUA Sugar..."
              className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-xs text-[#0B192C] focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
            />
          </div>

          <div>
            <label className="block micro-label text-[#64748B] mb-1">
              CONSIGNEE / RECEIVING CLIENT
            </label>
            <input
              type="text"
              value={consigneeName}
              onChange={(e) => setConsigneeName(e.target.value)}
              placeholder="e.g. Kano Central Grain Silos, FCDA Works..."
              className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-xs text-[#0B192C] focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
            />
          </div>
        </div>

        {/* Step 4: Tonnage & Operational Specs */}
        <div className="bg-slate-50 p-4 rounded border border-[#E2E8F0]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="micro-label text-[#64748B]">CARGO PAYLOAD WEIGHT</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#0B192C] tnum">{tonnage} MT</span>
                <span className="text-xs text-slate-500">
                  (Gross Vehicle Mass: ~{(tonnage + 15.5).toFixed(1)} MT)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Preset:</span>
              {[25, 35, 42, 50].map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setTonnage(val)}
                  className={`px-2 py-1 rounded text-xs font-semibold tnum ${
                    tonnage === val
                      ? 'bg-[#0B192C] text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {val}T
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            min={10}
            max={60}
            step={1}
            value={tonnage}
            onChange={(e) => setTonnage(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B192C]"
          />

          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono tnum">
            <span>10 MT (Light Feeder)</span>
            <span>35 MT (Standard Tri-Axle)</span>
            <span>50 MT (ECOWAS Legal Limit)</span>
            <span className="text-amber-700 font-semibold">60 MT (Heavy Escort Permit)</span>
          </div>

          {/* Value Added Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={requiresEscort}
                onChange={(e) => setRequiresEscort(e.target.checked)}
                className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
              />
              <span className="font-medium text-slate-800">Armed Convoy Escort</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
                className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
              />
              <span className="font-medium text-slate-800">Priority Non-Stop Transit</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRefrigerated}
                onChange={(e) => setIsRefrigerated(e.target.checked)}
                className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
              />
              <span className="font-medium text-slate-800">Reefer / Cold-Chain</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isHazmat}
                onChange={(e) => setIsHazmat(e.target.checked)}
                className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
              />
              <span className="font-medium text-slate-800">Dangerous Goods / Hazmat</span>
            </label>
          </div>
        </div>

        {/* Step 5: Rate Calculation & Breakdown */}
        <div className="bg-[#eff4ff] border border-[#dce9ff] rounded p-4 text-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#dce9ff] pb-2">
            <span className="micro-label text-slate-700">RATE BREAKDOWN & COST AUDIT</span>
            <span className="text-[11px] text-[#0B192C] font-medium">
              Corridor Tariff: <strong>{originHub.city} ➔ {destHub.city}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <div>
              <div className="text-[10px] text-slate-600">Base Freight</div>
              <div className="font-bold text-slate-900 tnum">₦{quoteCalculation.baseFreight.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-600">Fuel Surcharge (22%)</div>
              <div className="font-bold text-slate-900 tnum">₦{quoteCalculation.fuelSurcharge.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-600">Corridor Toll & Axle</div>
              <div className="font-bold text-slate-900 tnum">₦{quoteCalculation.corridorToll.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-600">Security Escort</div>
              <div className="font-bold text-slate-900 tnum">₦{quoteCalculation.escortFee.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-600">GIT Insurance (0.4%)</div>
              <div className="font-bold text-slate-900 tnum">₦{quoteCalculation.insurance.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-600">Est. Lead Time</div>
              <div className="font-bold text-emerald-700 tnum">{quoteCalculation.estimatedHours} Hours</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="micro-label text-slate-500">TOTAL ESTIMATED FREIGHT RATE (INCL. TAX & CHARGES)</span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-[#0B192C] tnum tracking-tight">
                  ₦{quoteCalculation.totalNgn.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-slate-600 tnum">
                  / ${quoteCalculation.totalUsd.toLocaleString()} USD
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreateBooking}
                className="bg-[#FF7A00] hover:bg-[#E65C00] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50"
              >
                <FileCheck className="w-4 h-4" />
                <span>Book Freight & Issue Waybill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
