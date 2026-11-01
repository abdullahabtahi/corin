import React from 'react'
import {
  FileText,
  Pill,
  Users,
  Activity,
  Heart,
  Wind,
  ShieldCheck,
  Dna,
  Bell,
  User
} from 'lucide-react'
import type { ClinicalWorkspace } from '../types/clinical'
import { useClinical } from '../context/ClinicalContext'
import { ScenarioSelector } from './ScenarioSelector'

const WORKSPACE_META: Record<ClinicalWorkspace, { title: string; subtitle: string; icon: React.ReactNode }> = {
  workstation: {
    title: 'Cardiorenal Digital Twin',
    subtitle: 'Acute Decompensation Workstation • 82 bpm Twin',
    icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
  },
  cohort: {
    title: 'Population Cohort Triage',
    subtitle: 'Medicare Advantage ACO Reach • 250 Beneficiaries',
    icon: <Users className="w-3.5 h-3.5 text-blue-600" />
  },
  pulmonary: {
    title: 'Pulmonary Bed & Fluid Congestion',
    subtitle: 'Thoracic Fluid Index & 2-Pillow Orthopnea',
    icon: <Wind className="w-3.5 h-3.5 text-blue-600" />
  },
  renal: {
    title: 'Renal Safety & Lab Ledger',
    subtitle: 'Cardiorenal Invariants & eGFR Monitoring',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
  },
  genomics: {
    title: 'Pharmacogenomics & Precision Dosing',
    subtitle: 'CYP2C9 *1/*3 • VKORC1 • PHACTR1 rs934197',
    icon: <Dna className="w-3.5 h-3.5 text-blue-600" />
  },
  pharmacy: {
    title: 'GDMT Regimen & Prescribing Engine',
    subtitle: 'ACC/AHA Quadruple Pharmacotherapy Cockpit',
    icon: <Pill className="w-3.5 h-3.5 text-amber-600" />
  },
  telemetry: {
    title: 'Clinical Agent Execution & Telemetry',
    subtitle: 'Amazon Nova Micro Decider (4ms) • Cat-M1 Ingestion',
    icon: <Activity className="w-3.5 h-3.5 text-blue-600" />
  }
}

export const HeaderNav: React.FC = () => {
  const {
    currentWorkspace,
    setCurrentWorkspace,
    activeDrawer,
    setActiveDrawer,
    patient
  } = useClinical()

  const currentMeta = WORKSPACE_META[currentWorkspace] || WORKSPACE_META.workstation

  return (
    <header className="w-full flex items-center justify-between px-6 py-2.5 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 select-none shrink-0 z-30">
      {/* 1. Left: ClyHealth Brand Mark */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentWorkspace('workstation')}
          className="relative w-8 h-8 flex items-center justify-center cursor-pointer group focus-visible:outline-none"
          title="Return to Patient Workstation"
        >
          {/* ClyHealth Clinical Device Emblem */}
          <div className="w-8 h-8 rounded-xl bg-[#1E293B] border border-slate-700/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        </button>
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-[19px] tracking-tight text-[#0F172A]">ClyHealth</span>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
            Cardiorenal Twin
          </span>
        </div>
      </div>

      {/* 2. Center: Active Workspace Location Context & Benchmark Scenario Switcher */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#EFF3F8]/90 rounded-full border border-slate-200/70 shadow-2xs">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-2xs">
            {currentMeta.icon}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-bold text-slate-900">{currentMeta.title}</span>
            <span className="text-[11px] text-slate-500 hidden xl:inline font-medium">
              • {currentMeta.subtitle}
            </span>
          </div>
        </div>

        {/* Benchmark Scenario Selector Dropdown */}
        <ScenarioSelector />
      </div>

      {/* 3. Right: Patient Demographics & Action Triggers */}
      <div className="flex items-center gap-3">
        {/* Patient Status Chip (Contextual across all workspaces) */}
        <button
          type="button"
          onClick={() => setCurrentWorkspace('workstation')}
          title="Active Focused Patient • Click to View Workstation"
          className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100/90 hover:bg-slate-200/80 rounded-full border border-slate-200/80 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-400/30" />
          <span className="text-[12px] font-semibold text-slate-800">{patient.name}</span>
          <span className="text-[11px] text-slate-500 font-medium tabular">({patient.age}yo M • EF 32%)</span>
        </button>

        {/* 45s SBAR Drawer Trigger */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === 'sbar' ? 'none' : 'sbar')}
            title="Open Clinical SBAR Drawer"
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${activeDrawer === 'sbar'
                ? 'bg-[#1E2E44] text-white border-transparent shadow-xs'
                : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-2xs'
              }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>45s SBAR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawer('sbar')}
            title="Clinical Notifications (1 Action Required)"
            className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
          </button>

          <button
            type="button"
            title="Clinician Account"
            className="w-8 h-8 rounded-full bg-[#1E2E44] text-white flex items-center justify-center font-bold text-[12px] ml-1 shadow-2xs cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}