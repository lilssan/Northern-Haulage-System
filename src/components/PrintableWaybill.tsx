import React from 'react';
import { Printer, X, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { Waybill } from '../types/logistics';

interface PrintableWaybillProps {
  waybill: Waybill;
  onClose: () => void;
}

export const PrintableWaybill: React.FC<PrintableWaybillProps> = ({ waybill, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Action bar (hidden in print) */}
        <div className="no-print bg-[#0B192C] text-white p-3.5 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#FF7A00]" />
            <span className="font-bold text-xs">Official Nigerian Consignment Note (Print Preview)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#FF7A00] hover:bg-[#E65C00] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white px-2 py-1 text-xs"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Printable Official Waybill Document */}
        <div id="printable-waybill-section" className="p-8 bg-white text-slate-900 font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#0B192C] text-white font-extrabold flex items-center justify-center text-2xl tracking-tighter rounded">
                NHS
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-[#0B192C]">
                  NORTHERN HAULAGE SYSTEMS PLC
                </h1>
                <p className="text-xs text-slate-700 font-semibold uppercase tracking-wider">
                  Heavy Cargo Logistics • Interstate Corridor Governance • Bulk Freight
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  HQ: Plot 402 Idu Industrial Area, Phase II, Abuja FCT, Nigeria | RC No: 1892044 | TIN: 20491822-0001
                </p>
                <p className="text-[11px] text-slate-600">
                  Tel: +234 9 291 0022 • Operations 24/7 Hotline: 0800-HAULAGE
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="border-2 border-slate-900 p-2.5 rounded bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">CONSIGNMENT NOTE / WAYBILL</span>
                <span className="font-mono text-lg font-black text-[#0B192C] tracking-tight">{waybill.id}</span>
                <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                  DATE: {new Date(waybill.dispatchTimestamp).toLocaleDateString('en-GB')}
                </div>
              </div>
            </div>
          </div>

          {/* Barcode & FRSC Regulation Notice */}
          <div className="flex items-center justify-between bg-slate-100 p-2 rounded text-xs mb-4 border border-slate-200">
            <div className="font-mono text-[11px] text-slate-800">
              BARCODE: |||||| | |||||||| |||| | |||||||||||||||| |||| {waybill.id}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              FRSC Road Transport Safety Standardization Scheme (RTSSS) Certified
            </div>
          </div>

          {/* Consignor & Consignee Columns */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded p-4 mb-4 text-xs">
            <div className="pr-4 border-r border-slate-200">
              <div className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-1">
                CONSIGNOR / SHIPPER (SENDER)
              </div>
              <div className="font-bold text-sm text-[#0B192C]">{waybill.shipper}</div>
              <div className="text-slate-700 mt-1">{waybill.origin}</div>
              <div className="text-slate-600 text-[11px] mt-0.5">State: {waybill.originState}, Nigeria</div>
              <div className="text-slate-600 text-[11px]">Dispatch Hub: {waybill.corridorCode} Terminal Staging</div>
            </div>

            <div className="pl-2">
              <div className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-1">
                CONSIGNEE (RECEIVER / DELIVERY ADDRESS)
              </div>
              <div className="font-bold text-sm text-[#0B192C]">{waybill.consignee}</div>
              <div className="text-slate-700 mt-1">{waybill.destination}</div>
              <div className="text-slate-600 text-[11px] mt-0.5">State: {waybill.destinationState}, Nigeria</div>
              <div className="text-slate-600 text-[11px]">Notice of Arrival: 2 Hours Pre-Discharge Call</div>
            </div>
          </div>

          {/* Haulage Asset & Driver Information */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 border border-slate-300 rounded p-3 mb-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Tractor Reg No.</span>
              <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">{waybill.truckReg}</div>
              <div className="text-[10px] text-slate-600">{waybill.truckModel}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Trailer Spec</span>
              <div className="font-semibold text-slate-900 mt-0.5">{waybill.trailerType}</div>
              <div className="text-[10px] text-slate-600">6x4 Heavy Traction Configuration</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Driver</span>
              <div className="font-bold text-slate-900 mt-0.5">{waybill.driverName}</div>
              <div className="text-[10px] text-slate-600 font-mono">Lic: {waybill.driverLicense}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">RFID Security Seal</span>
              <div className="font-mono font-bold text-emerald-800 text-xs mt-0.5 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 inline-block">
                {waybill.rfidSealId}
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">Geo-fenced Tamper Sensor: OK</div>
            </div>
          </div>

          {/* Consignment Weight & Description Table */}
          <div className="border border-slate-300 rounded overflow-hidden mb-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 text-[11px] uppercase">
                  <th className="p-2.5">Item #</th>
                  <th className="p-2.5">Detailed Description of Goods</th>
                  <th className="p-2.5">Packaging</th>
                  <th className="p-2.5 text-right">Tare Mass</th>
                  <th className="p-2.5 text-right">Net Payload</th>
                  <th className="p-2.5 text-right">Gross Mass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-mono">01</td>
                  <td className="p-2.5 font-medium">
                    {waybill.cargoDescription}
                    <div className="text-[10px] text-slate-500 font-normal">
                      Classification: {waybill.cargoCategory.replace('_', ' ')} • Standard Transit Protocol
                    </div>
                  </td>
                  <td className="p-2.5">Bulk / Industrial Palletized</td>
                  <td className="p-2.5 text-right font-mono tnum">{waybill.tareWeightMT} MT</td>
                  <td className="p-2.5 text-right font-mono font-bold tnum text-slate-900">{waybill.cargoWeightMT} MT</td>
                  <td className="p-2.5 text-right font-mono font-bold tnum text-[#0B192C]">{waybill.grossWeightMT} MT</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Freight Charges & Insurance Notice */}
          <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded p-3 mb-6 text-xs bg-slate-50">
            <div>
              <span className="font-bold text-[11px] uppercase text-slate-600 block mb-1">
                GOODS IN TRANSIT (GIT) CARRIER LIABILITY
              </span>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                Goods covered under NHS Institutional Marine & Land Freight Policy #AXA-GIT-2026-904. Consignee must inspect cargo, container seals, and condition of packaging before countersigning acceptance slip. In case of seal tampering, do not discharge.
              </p>
            </div>

            <div className="text-right">
              <span className="font-bold text-[11px] uppercase text-slate-600 block mb-1">
                TOTAL INVOICED CHARGES
              </span>
              <div className="text-xl font-black text-[#0B192C] font-mono tnum">
                ₦{waybill.costNgn.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-600 font-mono tnum">
                Equivalent: ${waybill.costUsd.toLocaleString()} USD
              </div>
            </div>
          </div>

          {/* Official Signatures & Stamping Blocks */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t-2 border-slate-900 text-xs">
            <div className="border border-slate-300 rounded p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-8">
                CONSIGNOR DISPATCH SIGNATURE
              </span>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-semibold text-slate-800">
                Authorized Dispatch Officer
              </div>
              <div className="text-[10px] text-slate-500">Date: {new Date(waybill.dispatchTimestamp).toLocaleDateString('en-GB')}</div>
            </div>

            <div className="border border-slate-300 rounded p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-8">
                CARRIER DRIVER ACKNOWLEDGEMENT
              </span>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-semibold text-slate-800">
                {waybill.driverName}
              </div>
              <div className="text-[10px] text-slate-500">I confirm receipt of seals in good order</div>
            </div>

            <div className="border-2 border-dashed border-[#FF7A00] rounded p-3 text-center bg-amber-50/50">
              <span className="text-[10px] uppercase font-bold text-amber-900 block mb-8">
                RECEIVER / CONSIGNEE STAMP ON ARRIVAL
              </span>
              <div className="border-t border-amber-400 pt-1 text-[11px] font-semibold text-amber-900">
                Official Receiving Stamp & Date
              </div>
              <div className="text-[10px] text-amber-700">Condition: Intact / Discharged</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
