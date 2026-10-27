import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ChevronRight, 
  Printer, 
  Eye, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  ArrowUpDown, 
  Download, 
  Truck, 
  MapPin, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Waybill, WaybillStatus, CargoCategory } from '../types/logistics';

interface WaybillTableProps {
  waybills: Waybill[];
  onSelectWaybill: (waybill: Waybill) => void;
  onPrintWaybill: (waybill: Waybill) => void;
  onUpdateStatus: (waybillId: string, newStatus: WaybillStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const WaybillTable: React.FC<WaybillTableProps> = ({
  waybills,
  onSelectWaybill,
  onPrintWaybill,
  onUpdateStatus,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCorridor, setSelectedCorridor] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [density, setDensity] = useState<'dense' | 'standard'>('standard');
  const [sortField, setSortField] = useState<keyof Waybill>('dispatchTimestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter logic
  const filteredWaybills = useMemo(() => {
    return waybills.filter(wb => {
      const matchesSearch = 
        wb.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.shipper.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.consignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.truckReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.cargoDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.destination.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCorridor = selectedCorridor === 'ALL' || wb.corridorCode === selectedCorridor;
      const matchesStatus = selectedStatus === 'ALL' || wb.status === selectedStatus;
      const matchesCategory = selectedCategory === 'ALL' || wb.cargoCategory === selectedCategory;

      return matchesSearch && matchesCorridor && matchesStatus && matchesCategory;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [waybills, searchQuery, selectedCorridor, selectedStatus, selectedCategory, sortField, sortAsc]);

  const handleSort = (field: keyof Waybill) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getStatusBadge = (status: WaybillStatus) => {
    switch (status) {
      case 'ACTIVE_TRANSIT':
        return (
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-pulse"></span>
            ACTIVE TRANSIT
          </span>
        );
      case 'WEIGHBRIDGE_CLEARED':
        return (
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#047857]" />
            WEIGHBRIDGE CLEARED
          </span>
        );
      case 'INSPECTION_APPROVED':
        return (
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#047857]" />
            INSPECTION APPROVED
          </span>
        );
      case 'DELAYED':
        return (
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#B91C1C]" />
            BOTTLENECK DELAY
          </span>
        );
      case 'SCHEDULED_DISPATCH':
        return (
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#0369A1]" />
            STAGED DISPATCH
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-slate-500" />
            DISCHARGED / DELIVERED
          </span>
        );
      default:
        return null;
    }
  };

  const exportToCSV = () => {
    const headers = ['Waybill ID', 'Shipper', 'Consignee', 'Origin', 'Destination', 'Cargo', 'Weight MT', 'Truck Reg', 'Driver', 'Status', 'Rate NGN'];
    const rows = filteredWaybills.map(wb => [
      wb.id,
      `"${wb.shipper}"`,
      `"${wb.consignee}"`,
      `"${wb.origin}"`,
      `"${wb.destination}"`,
      `"${wb.cargoDescription}"`,
      wb.cargoWeightMT,
      wb.truckReg,
      `"${wb.driverName}"`,
      wb.status,
      wb.costNgn
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Northern_Haulage_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
      {/* Control & Filter Strip */}
      <div className="p-4 border-b border-[#E2E8F0] bg-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Corridor filter */}
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0B192C]"
          >
            <option value="ALL">All Corridors (14)</option>
            <option value="COR-A2">COR-A2: Abuja-Kaduna-Kano</option>
            <option value="COR-A1">COR-A1: Lagos-Ilorin-Abuja</option>
            <option value="COR-B1">COR-B1: Kano-Katsina-Maradi</option>
            <option value="COR-B2">COR-B2: Kano-Potiskum-Maiduguri</option>
            <option value="COR-C1">COR-C1: Onne-Jos Industrial</option>
            <option value="COR-D1">COR-D1: Sokoto-Gusau-Zaria</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0B192C]"
          >
            <option value="ALL">All Operational Statuses</option>
            <option value="ACTIVE_TRANSIT">Active Transit</option>
            <option value="WEIGHBRIDGE_CLEARED">Weighbridge Cleared</option>
            <option value="INSPECTION_APPROVED">Inspection Approved</option>
            <option value="DELAYED">Delayed / Queue</option>
            <option value="SCHEDULED_DISPATCH">Staged for Dispatch</option>
            <option value="DELIVERED">Delivered / Discharged</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0B192C]"
          >
            <option value="ALL">All Cargo Types</option>
            <option value="DRY_BULK">Dry Bulk (Cement/Grain)</option>
            <option value="CONTAINERIZED">Containerized</option>
            <option value="HEAVY_MACHINERY">Heavy Machinery</option>
            <option value="FMCG_DISTRIBUTION">FMCG & Palletized</option>
          </select>

          {(selectedCorridor !== 'ALL' || selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedCorridor('ALL');
                setSelectedStatus('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-slate-600 hover:text-red-700 flex items-center gap-1 px-2 py-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        {/* View density and export */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="flex items-center border border-[#CBD5E1] rounded overflow-hidden text-xs bg-white">
            <button
              onClick={() => setDensity('standard')}
              className={`px-2.5 py-1 font-medium ${density === 'standard' ? 'bg-[#0B192C] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Standard
            </button>
            <button
              onClick={() => setDensity('dense')}
              className={`px-2.5 py-1 font-medium ${density === 'dense' ? 'bg-[#0B192C] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Dense
            </button>
          </div>

          <button
            onClick={exportToCSV}
            className="border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#0B192C] text-xs font-semibold px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Manifest (CSV)</span>
          </button>
        </div>
      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b-2 border-[#E2E8F0] text-[11px] font-semibold text-[#475569] uppercase tracking-wider select-none">
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  <span>WAYBILL ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('shipper')}>
                <div className="flex items-center gap-1">
                  <span>SHIPPER & CONSIGNEE</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">ROUTE CORRIDOR</th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('cargoWeightMT')}>
                <div className="flex items-center gap-1">
                  <span>CARGO & TONNAGE</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">ASSET & DRIVER</th>
              <th className="py-2.5 px-3">STATUS & COMPLIANCE</th>
              <th className="py-2.5 px-3">TELEMETRY & ETA</th>
              <th className="py-2.5 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-xs text-slate-800">
            {filteredWaybills.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-700">No waybills found matching filters</p>
                  <p className="text-xs text-slate-400">Try adjusting your corridor or status search query</p>
                </td>
              </tr>
            ) : (
              filteredWaybills.map((wb) => {
                const isDense = density === 'dense';
                return (
                  <tr 
                    key={wb.id} 
                    className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                    onClick={() => onSelectWaybill(wb)}
                  >
                    {/* Waybill ID & Priority */}
                    <td className={`${isDense ? 'py-2' : 'py-3.5'} px-3 whitespace-nowrap`}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0B192C] tnum tracking-tight group-hover:text-[#FF7A00] transition-colors">
                          {wb.id}
                        </span>
                        {wb.priority === 'CRITICAL_HAUL' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" title="Critical Priority"></span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        RFID: {wb.rfidSealId}
                      </div>
                    </td>

                    {/* Shipper & Consignee */}
                    <td className={`${isDense ? 'py-2' : 'py-3.5'} px-3`}>
                      <div className="font-semibold text-slate-900 leading-tight max-w-[200px] truncate">
                        {wb.shipper}
                      </div>
                      <div className="text-[11px] text-[#64748B] max-w-[200px] truncate mt-0.5">
                        ➔ {wb.consignee}
                      </div>
                    </td>

                    {/* Route Corridor */}
                    <td className={`${isDense ? 'py-2' : 'py-3.5'} px-3`}>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                          {wb.corridorCode}
                        </span>
                        <span className="font-medium text-slate-800 text-[11px] truncate max-w-[160px]">
                          {wb.originState} ➔ {wb.destinationState}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[190px] mt-0.5">
                        {wb.currentLocationName}
                      </div>
                    </td>

                    {/* Cargo & Weight */}
                    <td className={`${isDense ? 'py-2' : 'py-3.5'} px-3 whitespace-nowrap`}>
                      <div className="font-bold text-slate-900 tnum">
                        {wb.cargoWeightMT.toFixed(1)} MT
                      </div>
                      <div className="text-[11px] text-[#64748B] truncate max-w-[160px]">
                        {wb.cargoDescription}
                      </div>
                    </td>

                    {/* Asset & Driver */}
                    <td className={`${isDense ? 'py-2' : 'py-3.5'} px-3 whitespace-nowrap`}>
                      <div className="font-mono font-medium text-slate-900">
                        {wb.truckReg}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1">
                        <span>{wb.driverName}</span>
                      </div>
                    </td>

                    {/* Status & Compliance Badge */}
                    <td className={`${isDense ? 'py-2' : 'py-3.5'} px-3 whitespace-nowrap`}>
                      <div className="flex flex-col gap-1 items-start">
                        {getStatusBadge(wb.status)}
                        {wb.escortLevel === 'ARMED_SECURITY_DETAIL' && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 uppercase">
                            Armed Escort Detail
                          </span>
                        )}
                        {wb.escortLevel === 'CONVOY_ESCORT' && (
                          <span className="text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                            Convoy Group
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Telemetry & ETA */}
                    <td className={`${isDense ? 'py-2' : 'py-3.5'} px-3 whitespace-nowrap`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-800 tnum">
                          {wb.speedKmh > 0 ? `${wb.speedKmh} km/h` : 'Stationary'}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-600 tnum">
                          Fuel {wb.fuelLevelPercent}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 tnum">
                        ETA: {new Date(wb.estimatedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WAT
                      </div>
                    </td>

                    {/* Actions */}
                    <td 
                      className={`${isDense ? 'py-2' : 'py-3.5'} px-3 text-right whitespace-nowrap`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectWaybill(wb)}
                          title="Inspect Waybill & Checkpoint Logs"
                          className="p-1.5 text-slate-600 hover:text-[#0B192C] hover:bg-slate-100 rounded border border-transparent hover:border-slate-300 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onPrintWaybill(wb)}
                          title="Print Official Consignment Note"
                          className="p-1.5 text-slate-600 hover:text-[#FF7A00] hover:bg-amber-50 rounded border border-transparent hover:border-amber-200 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {wb.status === 'ACTIVE_TRANSIT' && (
                          <button
                            onClick={() => onUpdateStatus(wb.id, 'WEIGHBRIDGE_CLEARED')}
                            title="Log Weighbridge Clearance"
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded border border-transparent hover:border-emerald-200 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>Showing <strong className="text-slate-800 tnum">{filteredWaybills.length}</strong> of <strong className="text-slate-800 tnum">{waybills.length}</strong> Consignments</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline font-mono tnum text-slate-600">
            Total Mass: {Math.round(filteredWaybills.reduce((a, b) => a + b.cargoWeightMT, 0))} MT
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span>Click any row to open the complete Chain of Custody & RFID inspection sheet</span>
        </div>
      </div>
    </div>
  );
};
