import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Radio, 
  Scale, 
  Clock, 
  Search, 
  Plus, 
  Calculator, 
  MapPin, 
  Truck, 
  FileText, 
  Activity,
  Layers,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'manifest' | 'corridor-map' | 'quote' | 'fleet' | 'weighbridge';
  setActiveTab: (tab: 'manifest' | 'corridor-map' | 'quote' | 'fleet' | 'weighbridge') => void;
  onOpenNewShipment: () => void;
  onOpenQuote: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalWaybillsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewShipment,
  onOpenQuote,
  searchQuery,
  setSearchQuery,
  totalWaybillsCount
}) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' | ' +
        now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' WAT'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#0B192C] text-white border-b border-[#1E3E62] sticky top-0 z-40 select-none shadow-md">
      {/* Top Governance & Telematics Utility Strip */}
      <div className="border-b border-[#1E3E62]/60 px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="micro-label text-slate-200 tracking-wider">TELEMATICS: ONLINE</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span className="text-[11px]">14 Northern Corridors Active</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">ECOWAS Axle Load Max: <strong className="text-white tnum">11.5 MT/Axle</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="tnum font-mono text-slate-200">{timeString}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 bg-[#1E3E62]/60 px-2 py-0.5 rounded text-[10px] text-slate-200">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>FRSC & NIS SYNCED</span>
          </div>
        </div>
      </div>

      {/* Main Command & Brand Bar */}
      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-[#FF7A00] to-[#E65C00] flex items-center justify-center shadow-inner border border-amber-400/40 font-bold text-white tracking-tighter text-lg">
            NHS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base lg:text-lg tracking-tight text-white flex items-center gap-2">
                NORTHERN HAULAGE SYSTEMS
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold bg-[#1E3E62] text-amber-300 px-1.5 py-0.5 rounded border border-[#2A5282]">
                ENTERPRISE V4.2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Trans-Sahel Freight Governance & Bulk Corridors Network
            </p>
          </div>
        </div>

        {/* Global Waybill & Asset Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Waybill #, Shipper, Driver, or Reg Plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E3E62]/50 border border-slate-600 rounded text-xs text-white placeholder-slate-400 pl-9 pr-14 py-2 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-colors"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-[#0B192C] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
              ESC
            </kbd>
          </div>
        </div>

        {/* High Impact Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenQuote}
            className="flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#E65C00] text-white text-xs font-semibold px-3 py-2 rounded transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50"
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Instant Quote</span>
          </button>

          <button
            onClick={onOpenNewShipment}
            className="flex items-center gap-1.5 bg-[#1E3E62] hover:bg-[#2A5282] border border-slate-600 text-white text-xs font-semibold px-3 py-2 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Dispatch Freight</span>
          </button>

          {/* User Profile */}
          <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-slate-700">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-semibold text-amber-400">
              FU
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">Alh. Faruk Usman</div>
              <div className="micro-label text-slate-400 text-[10px]">CHIEF DISPATCHER</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="px-4 lg:px-8 bg-[#0E1C2F] border-t border-[#1E3E62]/80 flex items-center justify-between overflow-x-auto">
        <nav className="flex space-x-1 py-1">
          <button
            onClick={() => setActiveTab('manifest')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'manifest'
                ? 'bg-[#1E3E62] text-white border-b-2 border-[#FF7A00]'
                : 'text-slate-300 hover:text-white hover:bg-[#1E3E62]/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Freight Manifest</span>
            <span className="bg-[#0B192C] text-slate-300 text-[10px] px-1.5 py-0.2 rounded font-semibold tnum">
              {totalWaybillsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('corridor-map')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'corridor-map'
                ? 'bg-[#1E3E62] text-white border-b-2 border-[#FF7A00]'
                : 'text-slate-300 hover:text-white hover:bg-[#1E3E62]/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Corridor Telematics Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('quote')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'quote'
                ? 'bg-[#1E3E62] text-white border-b-2 border-[#FF7A00]'
                : 'text-slate-300 hover:text-white hover:bg-[#1E3E62]/40'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span>Rate Calculator & Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'fleet'
                ? 'bg-[#1E3E62] text-white border-b-2 border-[#FF7A00]'
                : 'text-slate-300 hover:text-white hover:bg-[#1E3E62]/40'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Heavy Fleet Readiness & TPMS</span>
          </button>

          <button
            onClick={() => setActiveTab('weighbridge')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'weighbridge'
                ? 'bg-[#1E3E62] text-white border-b-2 border-[#FF7A00]'
                : 'text-slate-300 hover:text-white hover:bg-[#1E3E62]/40'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-violet-400" />
            <span>Weighbridge & Axle Audit</span>
          </button>
        </nav>

        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 pl-4 py-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Optimal Route
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Checkpoint Delay
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Convoy Escort Only
          </span>
        </div>
      </div>
    </header>
  );
};
