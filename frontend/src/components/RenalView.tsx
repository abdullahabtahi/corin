import React from 'react'
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  FileCheck2,
  Clock
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'

export const RenalView: React.FC = () => {
  const { patient, cdssVerdict, setCurrentWorkspace } = useClinical()
  const kidneys = patient.organ_telemetry.kidneys

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 select-none bg-[#EAEFF5]/60">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Renal Function & CDSS Safety Lab
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cardiorenal Metabolic Safety Invariant Engine • CKD Stage 3a Surveillance & STAT BMP Tracking
          </p>
        </div>

        {/* Patient Status Chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1 bg-white/90 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-800 shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{patient.name}</span>
            <span className="text-slate-500 tabular-nums">({patient.age}yo M • eGFR 54 mL/min)</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tile 1: Serum K+ */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Serum Potassium (K+)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{kidneys.potassium_mEq_L.toFixed(1)}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal Pass
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            0.6 mEq/L buffer below 5.2 Cliff
          </p>
        </div>

        {/* Tile 2: eGFR */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Estimated GFR</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{kidneys.egfr_mL_min}</span>
            <span className="text-xs font-semibold text-slate-600">mL/min/1.73m²</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            CKD Stage 3a • Invariant Boundary ≥ 30
          </p>
        </div>

        {/* Tile 3: Creatinine */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Serum Creatinine</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{kidneys.creatinine_mg_dL}</span>
            <span className="text-xs text-slate-500 font-medium">mg/dL</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Baseline: 1.38 mg/dL (Zero acute injury)
          </p>
        </div>

        {/* Tile 4: BUN */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Blood Urea Nitrogen</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{kidneys.bun_mg_dL}</span>
            <span className="text-xs text-slate-500 font-medium">mg/dL</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            BUN/Cr Ratio: 19.7 (Euvolemic buffer)
          </p>
        </div>
      </div>

      {/* Main Grid: 4 CDSS Safety Invariants & STAT BMP Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: Invariants Execution Engine */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Deterministic CDSS Safety Invariant Engine
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Microsecond clinical boundaries evaluated before any order transmission
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 tabular-nums">
                Verified in {cdssVerdict.evaluation_time_ms}ms
              </span>
            </div>

            {/* Invariant Cards List */}
            <div className="flex flex-col gap-2.5">
              <div className="p-3 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">1. Serum Potassium Boundary Check</div>
                  <div className="text-[11px] text-slate-500">Value: {kidneys.potassium_mEq_L.toFixed(1)} mEq/L (Safe window: 3.5 – 5.1 mEq/L)</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  CLEARED
                </span>
              </div>

              <div className="p-3 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">2. Systolic Perfusion Shock Check</div>
                  <div className="text-[11px] text-slate-500">Value: {patient.trajectory.blood_pressure_sys} mmHg (Perfusion barrier: ≥ 95 mmHg)</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  CLEARED
                </span>
              </div>

              <div className="p-3 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">3. Renal Filtration Failure Check</div>
                  <div className="text-[11px] text-slate-500">Value: {kidneys.egfr_mL_min} mL/min (Contraindication cliff: &lt; 30 mL/min)</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  CLEARED
                </span>
              </div>

              <div className="p-3 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">4. BMP Specimen Recency Check</div>
                  <div className="text-[11px] text-slate-500">Specimen Age: 7 Days (Stale Lab Boundary: &gt; 14 Days)</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  CLEARED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: STAT BMP ServiceRequest */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              HL7 FHIR ServiceRequest (#serv-29401)
            </h2>

            <div className="p-3.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">STAT Day 3 Basic Metabolic Panel</span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  PRE-AUTHORIZED
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Automated home phlebotomy / Quest Diagnostics fast-track draw scheduled for Day 3 of Furosemide titration. Re-checks Serum K+, BUN, and Creatinine before resuming baseline 40mg regimen.
              </p>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                LOINC: 24362-6 • Quest Code: 10231
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-200/80 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setCurrentWorkspace('workstation')}
                className="w-full py-2.5 px-4 bg-[#1E2E44] hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Open in Cardiorenal Twin Workstation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

