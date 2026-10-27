/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { CorridorTicker } from './components/CorridorTicker';
import { WaybillTable } from './components/WaybillTable';
import { QuotationWidget } from './components/QuotationWidget';
import { CorridorRadarMap } from './components/CorridorRadarMap';
import { FleetManagement } from './components/FleetManagement';
import { WeighbridgeAudit } from './components/WeighbridgeAudit';
import { WaybillDetailModal } from './components/WaybillDetailModal';
import { PrintableWaybill } from './components/PrintableWaybill';
import { NewShipmentModal } from './components/NewShipmentModal';
import { INITIAL_WAYBILLS } from './data/mockData';
import { Waybill, WaybillStatus } from './types/logistics';
import { Shield, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [waybills, setWaybills] = useState<Waybill[]>(INITIAL_WAYBILLS);
  const [activeTab, setActiveTab] = useState<'manifest' | 'corridor-map' | 'quote' | 'fleet' | 'weighbridge'>('manifest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [inspectedWaybill, setInspectedWaybill] = useState<Waybill | null>(null);
  const [printingWaybill, setPrintingWaybill] = useState<Waybill | null>(null);
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleBookFreight = (newWaybill: Waybill) => {
    setWaybills(prev => [newWaybill, ...prev]);
    showToast(`Waybill ${newWaybill.id} dispatched! Cargo logged on Corridor.`);
    setInspectedWaybill(newWaybill);
  };

  const handleUpdateStatus = (waybillId: string, newStatus: WaybillStatus) => {
    setWaybills(prev => prev.map(wb => {
      if (wb.id === waybillId) {
        return { ...wb, status: newStatus };
      }
      return wb;
    }));
    if (inspectedWaybill && inspectedWaybill.id === waybillId) {
      setInspectedWaybill(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Waybill ${waybillId} status updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleAddCheckpointLog = (waybillId: string, checkpointName: string, notes: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WAT';
    setWaybills(prev => prev.map(wb => {
      if (wb.id === waybillId) {
        return {
          ...wb,
          checkpointLogs: [
            ...wb.checkpointLogs,
            { checkpointName, timestamp: nowStr, status: 'CLEARED', operatorNotes: notes }
          ]
        };
      }
      return wb;
    }));
    if (inspectedWaybill && inspectedWaybill.id === waybillId) {
      setInspectedWaybill(prev => prev ? {
        ...prev,
        checkpointLogs: [
          ...prev.checkpointLogs,
          { checkpointName, timestamp: nowStr, status: 'CLEARED', operatorNotes: notes }
        ]
      } : null);
    }
    showToast(`Checkpoint log added for ${waybillId}: ${checkpointName}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B192C] flex flex-col font-sans selection:bg-[#FF7A00] selection:text-white">
      {/* Enterprise Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewShipment={() => setShowNewShipmentModal(true)}
        onOpenQuote={() => setActiveTab('quote')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalWaybillsCount={waybills.length}
      />

      {/* Live Corridor Alert Ticker */}
      <CorridorTicker />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B192C] text-white px-4 py-3 rounded-lg shadow-xl border border-[#FF7A00] flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 px-4 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* KPI Metric Cards */}
        <MetricCards waybills={waybills} />

        {/* Tab 1: Freight Manifest Table */}
        {activeTab === 'manifest' && (
          <div className="space-y-6">
            <WaybillTable
              waybills={waybills}
              onSelectWaybill={(wb) => setInspectedWaybill(wb)}
              onPrintWaybill={(wb) => setPrintingWaybill(wb)}
              onUpdateStatus={handleUpdateStatus}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        )}

        {/* Tab 2: Corridor Telematics Radar & Map */}
        {activeTab === 'corridor-map' && (
          <CorridorRadarMap
            waybills={waybills}
            onSelectWaybill={(wb) => setInspectedWaybill(wb)}
          />
        )}

        {/* Tab 3: Interactive Quotation & Booking Widget */}
        {activeTab === 'quote' && (
          <div className="max-w-4xl mx-auto">
            <QuotationWidget
              onBookFreight={handleBookFreight}
            />
          </div>
        )}

        {/* Tab 4: Fleet Asset Readiness & TPMS */}
        {activeTab === 'fleet' && (
          <FleetManagement />
        )}

        {/* Tab 5: Weighbridge & Axle Audit */}
        {activeTab === 'weighbridge' && (
          <WeighbridgeAudit waybills={waybills} />
        )}
      </main>

      {/* Footer Governance Statement */}
      <footer className="no-print mt-auto border-t border-[#E2E8F0] bg-white py-4 px-4 lg:px-8 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="font-bold text-[#0B192C]">NORTHERN HAULAGE SYSTEMS PLC</div>
            <span className="text-slate-300">•</span>
            <div>RC 1892044 • FRSC RTSSS Certified Logistics Carrier</div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Corridors: Lagos–Abuja–Kaduna–Kano–Maiduguri</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">All 14 Weighbridges Synchronized</span>
          </div>
        </div>
      </footer>

      {/* Waybill Detail Modal (Chain of Custody & RFID) */}
      {inspectedWaybill && (
        <WaybillDetailModal
          waybill={inspectedWaybill}
          onClose={() => setInspectedWaybill(null)}
          onPrint={() => setPrintingWaybill(inspectedWaybill)}
          onUpdateStatus={handleUpdateStatus}
          onAddCheckpointLog={handleAddCheckpointLog}
        />
      )}

      {/* Printable Consignment Note Document */}
      {printingWaybill && (
        <PrintableWaybill
          waybill={printingWaybill}
          onClose={() => setPrintingWaybill(null)}
        />
      )}

      {/* New Freight Dispatch Modal */}
      {showNewShipmentModal && (
        <NewShipmentModal
          onClose={() => setShowNewShipmentModal(false)}
          onSubmit={handleBookFreight}
        />
      )}
    </div>
  );
}
