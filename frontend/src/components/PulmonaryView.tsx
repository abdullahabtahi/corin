import React from 'react'
import { 
  Wind, 
  Droplets, 
  Activity, 
  ArrowRight, 
  AlertTriangle,
  CheckCircle2,
  Calendar
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'

export const PulmonaryView: React.FC = () => {
  const { patient, setCurrentWorkspace } = useClinical()
  const lungs = patient.organ_telemetry.lungs

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 select-none bg-[#EAEFF5]/60">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <Wind className="w-5 h-5 text-blue-600" />
            Pulmonary Bed & Fluid Dynamics Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thoracic Congestion & Splanchnic Volume Shifts • Ambulatory Orthopnea & PEF Monitoring
          </p>
        </div>

        {/* Patient Status Chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1 bg-white/90 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-800 shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-400/30" />
            <span>{patient.name}</span>
            <span className="text-slate-500 tabular-nums">({patient.age}yo M • {patient.nyha_class})</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tile 1: Orthopnea */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Orthopnea Burden</span>
            <Wind className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700 tabular-nums">{lungs.orthopnea_pillows}</span>
            <span className="text-xs font-semibold text-rose-700">Pillows (New Onset)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            +1 Pillow surge over last 48h
          </p>
        </div>

        {/* Tile 2: PEF */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Peak Expiratory Flow</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{lungs.pef_l_min}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 tabular-nums">
              -{lungs.pef_baseline_drop_pct}% Baseline
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Baseline: 420 L/min • Pulmonary edema restriction
          </p>
        </div>

        {/* Tile 3: Splanchnic Congestion */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Splanchnic Fluid Shift</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700 tabular-nums">{lungs.splanchnic_congestion_score}</span>
            <span className="text-xs text-slate-500 font-medium">/ 100 Index</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Subclinical intravascular translocation
          </p>
        </div>

        {/* Tile 4: O2 Saturation */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Resting O2 Saturation</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 tabular-nums">{lungs.o2_saturation_pct}%</span>
            <span className="text-xs text-emerald-600 font-medium">Room Air</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Adequate gas exchange without supplemental O2
          </p>
        </div>
      </div>

      {/* Main Grid: Longitudinal Fluid Analysis & Clinical Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: Volume Overload Trajectory */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  14-Day Thoracic Congestion & Weight Surge
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Exponentially Weighted Moving Average (alpha=0.28) tracking subclinical fluid accumulation
                </p>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 tabular-nums">
                +3.6 lbs / 48h (+2.41σ)
              </span>
            </div>

            <div className="p-4 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-white/70 rounded-lg border border-slate-200/60">
                  <span className="text-[11px] text-slate-400">Baseline Dry Weight</span>
                  <div className="text-base font-bold text-slate-800 tabular-nums mt-0.5">181.0 lbs</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Euvolemic Target</span>
                </div>

                <div className="p-2.5 bg-white/70 rounded-lg border border-slate-200/60">
                  <span className="text-[11px] text-slate-400">Current Scaled Weight</span>
                  <div className="text-base font-bold text-rose-700 tabular-nums mt-0.5">184.6 lbs</div>
                  <span className="text-[10px] text-rose-600 font-semibold">+3.6 lbs Congestion</span>
                </div>

                <div className="p-2.5 bg-white/70 rounded-lg border border-slate-200/60">
                  <span className="text-[11px] text-slate-400">EWMA Z-Score</span>
                  <div className="text-base font-bold text-rose-700 tabular-nums mt-0.5">+2.41σ</div>
                  <span className="text-[10px] text-rose-600 font-semibold">Anomaly Threshold &gt; 1.96σ</span>
                </div>
              </div>

              <div className="p-3 bg-white/80 rounded-lg border border-slate-200/60 text-xs text-slate-700 flex flex-col gap-1.5">
                <div className="font-bold flex items-center gap-1.5 text-slate-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Clinical Splanchnic Decompensation Cascade
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Subclinical sympathetic vasoconstriction has displaced splanchnic venous capacitance into the central pulmonary circulation. The resulting increase in left ventricular end-diastolic pressure (LVEDP) drives nocturnal alveolar transudation, manifesting as new-onset 2-pillow orthopnea.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Decongestive Action & Workstation Handoff */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Targeted Decongestion Strategy
            </h2>

            <div className="p-3.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-2 text-xs">
              <div className="font-bold text-slate-900">ACC/AHA Loop Escalation Protocol</div>
              <p className="text-[11px] text-slate-600">
                Temporary 72-hour doubling of oral Furosemide (Lasix) from 40mg to 80mg daily to induce rapid natriuresis and return Arthur to his 181.0 lbs dry weight corridor.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Class I, LOE B
                </span>
                <span className="text-[10px] text-slate-500">
                  Coupled with STAT Day 3 BMP draw
                </span>
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

