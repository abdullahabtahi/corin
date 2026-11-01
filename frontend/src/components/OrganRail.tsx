import React from 'react'
import {
  Heart,
  Wind,
  ShieldCheck,
  Dna,
  Pill,
  Activity,
  RotateCcw,
  Users
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'
import type { ClinicalWorkspace } from '../types/clinical'

export const OrganRail: React.FC = () => {
  const {
    currentWorkspace,
    setCurrentWorkspace,
    setActiveCitation
  } = useClinical()

  const navigateTo = (workspace: ClinicalWorkspace) => {
    setCurrentWorkspace(workspace)
    setActiveCitation(null)
  }

  return (
    <aside
      className="w-16 flex flex-col items-center py-5 bg-white/70 backdrop-blur-xl border-r border-slate-200/80 shadow-[4px_0_20px_-2px_rgba(15,23,42,0.02)] shrink-0 z-20 select-none"
      aria-label="Clinical workspace navigation rail"
    >
      <div className="flex flex-col items-center gap-3 w-full">
        {/* 1. Population Cohort Triage */}
        <button
          type="button"
          onClick={() => navigateTo('cohort')}
          aria-pressed={currentWorkspace === 'cohort'}
          aria-label="Population Cohort Triage Panel (250 Beneficiaries)"
          title="Population Cohort Triage Panel (250 Beneficiaries)"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${currentWorkspace === 'cohort'
              ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-white/20'
              : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 shadow-2xs'
            }`}
        >
          <Users className={`w-5 h-5 ${currentWorkspace === 'cohort' ? 'text-blue-300' : ''}`} />
          {currentWorkspace === 'cohort' && (
            <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-blue-500 border border-white" />
          )}
        </button>

        <div className="w-6 h-[1px] bg-slate-200/80 my-0.5" />

        {/* 2. Cardiorenal Twin Workstation */}
        <button
          type="button"
          onClick={() => navigateTo('workstation')}
          aria-pressed={currentWorkspace === 'workstation'}
          aria-label="Cardiorenal Digital Twin Workstation (Living 82 bpm Twin)"
          title="Cardiorenal Digital Twin Workstation (Living 82 bpm Twin)"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${currentWorkspace === 'workstation'
              ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-white/20'
              : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/80'
            }`}
        >
          <Heart className={`w-5 h-5 ${currentWorkspace === 'workstation' ? 'fill-current text-rose-400' : ''}`} />
          {currentWorkspace === 'workstation' && (
            <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-rose-500 border border-white" />
          )}
        </button>

        {/* 3. Pulmonary Bed & Congestion Page */}
        <button
          type="button"
          onClick={() => navigateTo('pulmonary')}
          aria-pressed={currentWorkspace === 'pulmonary'}
          aria-label="Pulmonary Bed & Fluid Congestion Center"
          title="Pulmonary Bed & Fluid Congestion Center"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${currentWorkspace === 'pulmonary'
              ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-white/20'
              : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/80'
            }`}
        >
          <Wind className={`w-5 h-5 ${currentWorkspace === 'pulmonary' ? 'text-blue-300' : ''}`} />
          {currentWorkspace === 'pulmonary' && (
            <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-blue-400 border border-white" />
          )}
        </button>

        {/* 4. Renal Function & CDSS Safety Lab Page */}
        <button
          type="button"
          onClick={() => navigateTo('renal')}
          aria-pressed={currentWorkspace === 'renal'}
          aria-label="Renal Function & CDSS Safety Invariants Lab"
          title="Renal Function & CDSS Safety Invariants Lab"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${currentWorkspace === 'renal'
              ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-white/20'
              : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/80'
            }`}
        >
          <ShieldCheck className={`w-5 h-5 ${currentWorkspace === 'renal' ? 'text-emerald-400' : ''}`} />
          {currentWorkspace === 'renal' && (
            <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
          )}
        </button>

        {/* 5. Pharmacogenomics & Precision Dosing Page */}
        <button
          type="button"
          onClick={() => navigateTo('genomics')}
          aria-pressed={currentWorkspace === 'genomics'}
          aria-label="Pharmacogenomics & Precision Dosing (CYP2C9, VKORC1, PHACTR1)"
          title="Pharmacogenomics & Precision Dosing (CYP2C9, VKORC1, PHACTR1)"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${currentWorkspace === 'genomics'
              ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-white/20'
              : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/80'
            }`}
        >
          <Dna className={`w-5 h-5 ${currentWorkspace === 'genomics' ? 'text-blue-300' : ''}`} />
          {currentWorkspace === 'genomics' && (
            <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-blue-500 border border-white" />
          )}
        </button>

        {/* 6. GDMT Prescriptions & Pharmacy Cockpit */}
        <button
          type="button"
          onClick={() => navigateTo('pharmacy')}
          aria-pressed={currentWorkspace === 'pharmacy'}
          aria-label="Guideline-Directed Medical Therapy & Prescriptions"
          title="Guideline-Directed Medical Therapy & Prescriptions"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${currentWorkspace === 'pharmacy'
              ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-white/20'
              : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/80'
            }`}
        >
          <Pill className={`w-5 h-5 ${currentWorkspace === 'pharmacy' ? 'text-amber-300' : ''}`} />
          {currentWorkspace === 'pharmacy' && (
            <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-amber-400 border border-white" />
          )}
        </button>

        {/* 7. Clinical Agent Telemetry & Execution Trace */}
        <button
          type="button"
          onClick={() => navigateTo('telemetry')}
          aria-pressed={currentWorkspace === 'telemetry'}
          aria-label="Clinical Agent Telemetry & Execution Trace"
          title="Clinical Agent Telemetry & Execution Trace"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${currentWorkspace === 'telemetry'
              ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-white/20'
              : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/80'
            }`}
        >
          <Activity className={`w-5 h-5 ${currentWorkspace === 'telemetry' ? 'text-blue-300' : ''}`} />
          {currentWorkspace === 'telemetry' && (
            <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-blue-500 border border-white" />
          )}
        </button>
      </div>

      {/* Bottom Viewport Tools */}
      <div className="mt-auto flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => navigateTo('workstation')}
          aria-label="Reset Viewport to Workstation"
          title="Reset Viewport to Workstation"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div
          className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs"
          title="Deterministic CDSS Safety Engine Active (1.8ms)"
          aria-label="Deterministic CDSS Safety Engine Active (1.8ms)"
        >
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>
    </aside>
  )
}
