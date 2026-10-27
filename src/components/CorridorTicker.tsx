import React from 'react';
import { AlertTriangle, CheckCircle, Radio, Shield, Info } from 'lucide-react';

export const CorridorTicker: React.FC = () => {
  return (
    <div className="bg-[#0E1C2F] text-slate-200 border-y border-[#1E3E62] px-4 py-2 flex items-center gap-3 overflow-hidden text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-[#FF7A00] whitespace-nowrap pr-3 border-r border-[#1E3E62]">
        <Radio className="w-3.5 h-3.5 animate-pulse text-[#FF7A00]" />
        <span className="micro-label">CORRIDOR BULLETIN</span>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-slate-300">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <strong className="text-white">COR-A2 (Abuja–Kaduna–Kano):</strong> Clear transit. Average weighbridge clearance at Tafa is 14 minutes.
        </span>

        <span className="text-slate-600">•</span>

        <span className="inline-flex items-center gap-1.5 text-slate-300">
          <Shield className="w-3 h-3 text-sky-400" />
          <strong className="text-white">COR-B2 (Kano–Maiduguri):</strong> Convoy Escort Bravo departed Potiskum with 16 heavy bulk units under armed security escort.
        </span>

        <span className="text-slate-600">•</span>

        <span className="inline-flex items-center gap-1.5 text-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <strong className="text-white">COR-C1 (Hawans Kibo Escarpment):</strong> Road maintenance on climbing lane, single-file crawl for heavy trailers above 40 MT.
        </span>

        <span className="text-slate-600">•</span>

        <span className="inline-flex items-center gap-1.5 text-slate-300">
          <Info className="w-3 h-3 text-slate-400" />
          <strong className="text-white">COR-D1 (Sokoto–Gusau):</strong> CCNN Kalambaina bulk cement silo departures cleared without demurrage.
        </span>
      </div>
    </div>
  );
};
