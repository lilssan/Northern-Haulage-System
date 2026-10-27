import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Scale, 
  Clock, 
  FileText, 
  Lock, 
  UserCheck, 
  Plus, 
  Phone
} from 'lucide-react';
import { Waybill, WaybillStatus } from '../types/logistics';

interface WaybillDetailModalProps {
  waybill: Waybill;
  onClose: () => void;
  onPrint: () => void;
  onUpdateStatus: (waybillId: string, status: WaybillStatus) => void;
  onAddCheckpointLog: (waybillId: string, checkpointName: string, notes: string) => void;
}

export const WaybillDetailModal: React.FC<WaybillDetailModalProps> = ({
  waybill,
  onClose,
  onPrint,
  onUpdateStatus,
  onAddCheckpointLog
}) => {
  const [showAddLog, setShowAddLog] = useState(false);
  const [newCheckpointName, setNewCheckpointName] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckpointName.trim()) return;
    onAddCheckpointLog(waybill.id, newCheckpointName, newNotes);
    setNewCheckpointName('');
    setNewNotes('');
    setShowAddLog(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white border border-[#94A3B8] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#0B192C] via-[#FF7A00] to-[#0B192C] w-full"></div>

        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E8F0] bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-extrabold text-[#0B192C] bg-white px-2.5 py-0.5 rounded border border-[#CBD5E1] shadow-xs">
                {waybill.id}
              </span>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">
                {waybill.status.replace('_', ' ')}
              </span>
              {waybill.priority === 'CRITICAL_HAUL' && (
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  CRITICAL EXPEDITED
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-1.5 tracking-tight">
              {waybill.shipper}
            </h2>
            <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
              <span>{waybill.origin}</span>
              <span>➔</span>
              <strong className="text-slate-800">{waybill.destination}</strong>
              <span className="font-mono text-slate-500">({waybill.corridorCode})</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>Print Official Waybill</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: Security Seals & Chain of Custody */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="micro-label text-slate-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> RFID ELECTRONIC SEAL
              </span>
              <div className="font-mono font-bold text-slate-900 text-sm mt-1">
                {waybill.rfidSealId}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Seal Intact & Geo-fenced
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="micro-label text-slate-500 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#FF7A00]" /> ASSIGNED DRIVER
              </span>
              <div className="font-semibold text-slate-900 text-sm mt-1">
                {waybill.driverName}
              </div>
              <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                License: {waybill.driverLicense}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {waybill.driverPhone}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="micro-label text-slate-500 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#0B192C]" /> HAULAGE PRIME MOVER
              </span>
              <div className="font-mono font-bold text-slate-900 text-sm mt-1">
                {waybill.truckReg}
              </div>
              <div className="text-[11px] text-slate-700 font-medium mt-0.5">
                {waybill.truckModel}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Trailer: {waybill.trailerType}
              </div>
            </div>
          </div>

          {/* Section 2: Weight Verification & Financials */}
          <div className="bg-white border border-[#CBD5E1] rounded-lg p-4">
            <h3 className="micro-label text-[#64748B] mb-3">
              CARGO MANIFEST & WEIGHBRIDGE SLIP DATA
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pb-4 border-b border-slate-200">
              <div>
                <span className="text-slate-500 text-[11px]">Cargo Description</span>
                <div className="font-semibold text-slate-900 mt-0.5">{waybill.cargoDescription}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Class: {waybill.cargoCategory}</div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Certified Net Weight</span>
                <div className="font-bold text-slate-900 text-sm tnum mt-0.5">{waybill.cargoWeightMT} MT</div>
                <div className="text-[10px] text-slate-500">Tare: {waybill.tareWeightMT} MT</div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Total Gross Mass</span>
                <div className="font-bold text-slate-900 text-sm tnum mt-0.5">{waybill.grossWeightMT} MT</div>
                <div className="text-[10px] text-emerald-700 font-medium">Within 50.0T ECOWAS Limit</div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Billed Freight Cost</span>
                <div className="font-bold text-[#0B192C] text-sm tnum mt-0.5">
                  ₦{waybill.costNgn.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-600 font-medium tnum">
                  ${waybill.costUsd.toLocaleString()} USD
                </div>
              </div>
            </div>

            {/* Current Telemetry */}
            <div className="pt-3 flex flex-wrap items-center justify-between text-xs text-slate-700">
              <div>
                Current Position: <strong className="text-slate-900">{waybill.currentLocationName}</strong>
              </div>
              <div className="font-mono text-[11px] text-slate-500">
                GPS: {waybill.gpsCoordinates.lat.toFixed(4)}°N, {waybill.gpsCoordinates.lng.toFixed(4)}°E • Velocity: {waybill.speedKmh} km/h
              </div>
            </div>
          </div>

          {/* Section 3: Checkpoint Verification Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="micro-label text-[#64748B]">
                TRANSIT CHECKPOINTS & WEIGHBRIDGE AUDIT LOGS
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLog(!showAddLog)}
                className="text-xs text-[#0B192C] font-semibold flex items-center gap-1 hover:text-[#FF7A00]"
              >
                <Plus className="w-3.5 h-3.5" /> Log New Checkpoint
              </button>
            </div>

            {showAddLog && (
              <form onSubmit={handleAddLogSubmit} className="mb-4 p-3 bg-slate-50 border border-slate-300 rounded text-xs space-y-2">
                <div className="font-semibold text-slate-800">Record Intermediate Inspection Log</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Checkpoint Name (e.g. Tafa Weighbridge Scale 2)"
                    value={newCheckpointName}
                    onChange={(e) => setNewCheckpointName(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Inspector / Officer Notes (Tare/Gross confirmed, seal intact)"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddLog(false)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#0B192C] text-white font-semibold rounded hover:bg-[#1E3E62]"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {waybill.checkpointLogs.map((log, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-slate-50 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">{log.checkpointName}</div>
                      {log.operatorNotes && (
                        <div className="text-[11px] text-slate-600 mt-0.5">{log.operatorNotes}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-medium text-slate-500 tnum text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Operational Status Toggles */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-medium">Quick Status Update:</span>
              <button
                onClick={() => onUpdateStatus(waybill.id, 'ACTIVE_TRANSIT')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  waybill.status === 'ACTIVE_TRANSIT'
                    ? 'bg-[#FF7A00] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Active Transit
              </button>
              <button
                onClick={() => onUpdateStatus(waybill.id, 'WEIGHBRIDGE_CLEARED')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  waybill.status === 'WEIGHBRIDGE_CLEARED'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Weighbridge Cleared
              </button>
              <button
                onClick={() => onUpdateStatus(waybill.id, 'DELIVERED')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  waybill.status === 'DELIVERED'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mark Delivered
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
