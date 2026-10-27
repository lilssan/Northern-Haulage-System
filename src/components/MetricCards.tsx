import React from 'react';
import { Truck, Clock, Scale, TrendingUp, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Waybill } from '../types/logistics';

interface MetricCardsProps {
  waybills: Waybill[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ waybills }) => {
  const activeTrucks = waybills.filter(w => w.status === 'ACTIVE_TRANSIT').length;
  const totalTonnageInTransit = waybills
    .filter(w => w.status === 'ACTIVE_TRANSIT' || w.status === 'WEIGHBRIDGE_CLEARED')
    .reduce((acc, curr) => acc + curr.cargoWeightMT, 0);

  const delayedCount = waybills.filter(w => w.status === 'DELAYED').length;
  const clearedCount = waybills.filter(w => w.status === 'WEIGHBRIDGE_CLEARED' || w.status === 'INSPECTION_APPROVED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Active Fleet In Transit */}
      <div className="bg-white border border-[#E2E8F0] border-l-[3px] border-l-[#0B192C] rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="micro-label text-[#64748B]">ACTIVE CORRIDOR FLEET</span>
          <div className="p-1.5 rounded bg-slate-100 text-[#0B192C]">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl font-bold tracking-tight text-[#0B192C] tnum">
            {activeTrucks * 18 + 76} Units
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span className="tnum font-medium text-slate-700">
            {Math.round(totalTonnageInTransit * 22 + 3950).toLocaleString()} MT on Road
          </span>
          <span className="flex items-center text-emerald-700 font-semibold tnum">
            <ArrowUpRight className="w-3.5 h-3.5" /> +6.4% utilization
          </span>
        </div>
      </div>

      {/* Metric 2: Transit Velocity & Average Time */}
      <div className="bg-white border border-[#E2E8F0] border-l-[3px] border-l-[#FF7A00] rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="micro-label text-[#64748B]">24H TRANSIT: ABUJA-KADUNA-KANO</span>
          <div className="p-1.5 rounded bg-amber-50 text-[#FF7A00]">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl font-bold tracking-tight text-[#0B192C] tnum">
            9h 15m
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            -45m vs target
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>Corridor speed index</span>
          <span className="tnum font-medium text-slate-700">58.4 km/h fleet avg</span>
        </div>
      </div>

      {/* Metric 3: Axle Load & Weighbridge Compliance */}
      <div className="bg-white border border-[#E2E8F0] border-l-[3px] border-l-[#0B192C] rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="micro-label text-[#64748B]">WEIGHBRIDGE & AXLE COMPLIANCE</span>
          <div className="p-1.5 rounded bg-emerald-50 text-emerald-700">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl font-bold tracking-tight text-[#0B192C] tnum">
            99.4%
          </span>
          <span className="text-xs text-slate-500 font-medium">ECOWAS 11.5T</span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span className="flex items-center gap-1 text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <strong className="tnum">242</strong> scales logged today
          </span>
          <span className="text-amber-700 font-medium tnum">
            {delayedCount} queue hold
          </span>
        </div>
      </div>

      {/* Metric 4: Revenue & Freight Billed MTD */}
      <div className="bg-white border border-[#E2E8F0] border-l-[3px] border-l-[#FF7A00] rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="micro-label text-[#64748B]">FREIGHT BILLED (MTD)</span>
          <div className="p-1.5 rounded bg-sky-50 text-sky-800">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl font-bold tracking-tight text-[#0B192C] tnum">
            ₦842.6M
          </span>
          <span className="text-xs font-semibold text-slate-500 tnum">
            $548.2K USD
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>Institutional billing</span>
          <span className="text-emerald-700 font-semibold tnum">94.2% collected</span>
        </div>
      </div>
    </div>
  );
};
