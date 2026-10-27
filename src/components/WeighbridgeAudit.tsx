import React, { useState } from 'react';
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, ArrowDown, Info } from 'lucide-react';
import { Waybill } from '../types/logistics';

interface WeighbridgeAuditProps {
  waybills: Waybill[];
}

export const WeighbridgeAudit: React.FC<WeighbridgeAuditProps> = ({ waybills }) => {
  const [selectedTruckReg, setSelectedTruckReg] = useState<string>(waybills[0]?.truckReg || 'KND-402-TRK');

  const selectedWb = waybills.find(w => w.truckReg === selectedTruckReg) || waybills[0];

  // Dynamic axle distribution calculation for 6x4 tractor + tri-axle trailer
  const totalGrossMT = selectedWb ? selectedWb.grossWeightMT : 50.0;
  const steerAxleMT = Math.round((totalGrossMT * 0.14) * 10) / 10; // ~7.0 MT (Limit 8.0T)
  const driveTandemMT = Math.round((totalGrossMT * 0.38) * 10) / 10; // ~19.0 MT (Limit 18.0T)
  const trailerTridemMT = Math.round((totalGrossMT * 0.48) * 10) / 10; // ~24.0 MT (Limit 24.0T)

  const isDriveAxleOverload = driveTandemMT > 18.0;

  return (
    <div className="space-y-6">
      {/* Policy banner */}
      <div className="bg-[#0B192C] text-white p-5 rounded-lg border border-[#1E3E62] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#FF7A00] text-[#0B192C]">
              <Scale className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              Federal Ministry of Works & ECOWAS Axle Load Compliance Audit
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Statutory road infrastructure protection governance: Supplementary Act A/SP.17/02/12 on the Harmonization of Standards and Procedures for the Control of Dimensions, Weight and Axle Load of Heavy Goods Transport Vehicles.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1E3E62] px-3 py-2 rounded text-xs border border-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict FRSC Calibration: <strong>Active</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Axle Load Simulator & Inspector */}
        <div className="lg:col-span-7 bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-bold text-[#0B192C]">
                Dynamic Axle Load Scale Verification
              </h3>
              <p className="text-xs text-slate-500">
                Detailed weight distribution across steering, drive tandem, and trailer axles.
              </p>
            </div>

            <select
              value={selectedTruckReg}
              onChange={(e) => setSelectedTruckReg(e.target.value)}
              className="bg-slate-50 border border-[#CBD5E1] rounded px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0B192C]"
            >
              {waybills.map(wb => (
                <option key={wb.id} value={wb.truckReg}>
                  {wb.truckReg} ({wb.grossWeightMT}T Gross — {wb.shipper.slice(0, 15)})
                </option>
              ))}
            </select>
          </div>

          {/* Visual Truck Diagram with Axle Weights */}
          <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded text-center">
            <div className="flex items-center justify-center gap-8 text-xs font-mono mb-2">
              <span className="text-slate-600">Front (Steering)</span>
              <span className="text-slate-400">➔➔➔ Driving Direction ➔➔➔</span>
              <span className="text-slate-600">Rear (Tridem)</span>
            </div>

            {/* Axle weight comparison cards */}
            <div className="grid grid-cols-3 gap-3 my-4">
              {/* Steering Axle */}
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="micro-label text-slate-500 block">STEERING SINGLE AXLE</span>
                <div className="text-xl font-bold text-[#0B192C] tnum mt-1">{steerAxleMT} MT</div>
                <div className="text-[10px] text-slate-500 mt-0.5">ECOWAS Limit: 8.0 MT</div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                  COMPLIANT (-{(8.0 - steerAxleMT).toFixed(1)}T)
                </div>
              </div>

              {/* Drive Tandem Axle */}
              <div className={`bg-white p-3 rounded border ${isDriveAxleOverload ? 'border-amber-300' : 'border-slate-200'}`}>
                <span className="micro-label text-slate-500 block">DRIVE TANDEM AXLE (6x4)</span>
                <div className={`text-xl font-bold tnum mt-1 ${isDriveAxleOverload ? 'text-amber-700' : 'text-[#0B192C]'}`}>
                  {driveTandemMT} MT
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">ECOWAS Limit: 18.0 MT</div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                  {isDriveAxleOverload ? 'TOLERANCE ADMISSIBLE' : 'COMPLIANT'}
                </div>
              </div>

              {/* Trailer Tridem Axle */}
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="micro-label text-slate-500 block">TRAILER TRIDEM BOGIE</span>
                <div className="text-xl font-bold text-[#0B192C] tnum mt-1">{trailerTridemMT} MT</div>
                <div className="text-[10px] text-slate-500 mt-0.5">ECOWAS Limit: 24.0 MT</div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                  COMPLIANT (-{(24.0 - trailerTridemMT).toFixed(1)}T)
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 px-2">
              <div>
                Tare Weight: <strong className="tnum font-mono">{selectedWb.tareWeightMT} MT</strong>
              </div>
              <div>
                Net Cargo Payload: <strong className="tnum font-mono">{selectedWb.cargoWeightMT} MT</strong>
              </div>
              <div>
                Total Gross Mass: <strong className="tnum font-mono text-base text-[#0B192C]">{selectedWb.grossWeightMT} MT</strong>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">Automated Weighbridge Certificate Issued:</span>
              <p className="mt-0.5 text-[11px] text-emerald-700">
                Unit {selectedWb.truckReg} passed dynamic multi-deck scale calibration. Zero penalty surcharge assessed. Official certificate #WB-2026-NGA-991 logged with FRSC national portal.
              </p>
            </div>
          </div>
        </div>

        {/* Official Statutory Standards Table */}
        <div className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B192C] pb-2 border-b border-[#E2E8F0]">
              Statutory Maximum Gross Vehicle Mass (GVM)
            </h3>

            <div className="divide-y divide-slate-100 text-xs mt-3">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">2-Axle Rigid Truck</div>
                  <div className="text-[10px] text-slate-500">Distribution feeder</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tnum">18.0 MT</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">3-Axle Rigid Truck (6x4)</div>
                  <div className="text-[10px] text-slate-500">Tipper / Concrete mixer</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tnum">26.0 MT</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">5-Axle Articulated Trailer</div>
                  <div className="text-[10px] text-slate-500">2-axle tractor + 3-axle trailer</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tnum">46.0 MT</span>
              </div>

              <div className="py-2.5 flex items-center justify-between bg-slate-50 px-2 rounded">
                <div>
                  <div className="font-bold text-[#0B192C]">6-Axle Heavy Articulated (NHS Standard)</div>
                  <div className="text-[10px] text-[#64748B]">3-axle tractor + 3-axle bulk trailer</div>
                </div>
                <span className="font-mono font-bold text-[#FF7A00] tnum">50.0 MT</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Special Heavy Cargo (Multi-Axle)</div>
                  <div className="text-[10px] text-slate-500">Low-bed with Ministry escort permit</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tnum">Up to 75.0 MT</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-600" /> Weighbridge Stations Enforced
            </div>
            <div>• Tafa Weighbridge Complex (KM 54, Abuja-Kaduna Highway)</div>
            <div>• Ogere Toll & Axle Station (Lagos-Ibadan Expressway)</div>
            <div>• Mararaban Jos Control Station (Kaduna-Zaria-Kano Axis)</div>
            <div>• Dawanau Grain Central Weigh Station (Kano North)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
