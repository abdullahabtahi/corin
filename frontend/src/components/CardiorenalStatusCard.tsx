import React from 'react'
import { HeartPulse, ChevronRight, TrendingUp } from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'

export const CardiorenalStatusCard: React.FC = () => {
  const { setActiveDrawer, patient } = useClinical()

  const cardiorenalAge = patient.heart_age_estimate || 78
  const chronoAge = patient.age || 71
  const ageDelta = cardiorenalAge - chronoAge
  const risk = patient.risk_score || 87.4
  const isHighRisk = risk >= 70
  const isModRisk = risk >= 35 && risk < 70

  const riskLabel = isHighRisk ? 'High' : isModRisk ? 'Moderate' : 'Low'
  const riskBadgeStyle = isHighRisk 
    ? 'text-rose-700 bg-rose-50 border-rose-200' 
    : isModRisk 
    ? 'text-amber-700 bg-amber-50 border-amber-200' 
    : 'text-emerald-700 bg-emerald-50 border-emerald-200'

  const riskGradient = isHighRisk 
    ? 'bg-rose-500' 
    : isModRisk 
    ? 'bg-amber-500' 
    : 'bg-emerald-500'

  return (
    <div className="w-full section-surface rounded-2xl p-4 sm:p-5 select-none transition-all">
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center border border-blue-200/60 shadow-2xs">
            <HeartPulse className="w-4 h-4" />
          </div>
          <h2 className="text-[15px] font-bold text-[#0F172A] tracking-tight">Cardiorenal System Status</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-slate-500">Decompensation Risk</span>
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div 
                className={`h-full ${riskGradient} rounded-full transition-all duration-300 ease-out`} 
                style={{ width: `${Math.min(100, Math.max(5, risk))}%` }} 
              />
            </div>
          </div>
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${riskBadgeStyle}`}>
            <TrendingUp className="w-3 h-3" />
            <span className="tabular">{riskLabel} {risk.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Main Metrics Row */}
      <div className="grid grid-cols-12 gap-4 items-center pt-4">
        {/* Left: Accelerated Aging Column Bar Chart */}
        <div className="col-span-2 flex items-center gap-2.5">
          <div className="flex flex-col items-center">
            <div className="flex items-end gap-[3px] h-9">
              <span className="w-1.5 h-3 bg-slate-300 rounded-t-xs" />
              <span className="w-1.5 h-5 bg-slate-300 rounded-t-xs" />
              <span className={`w-1.5 ${ageDelta >= 4 ? 'h-7 bg-rose-300' : 'h-4 bg-slate-300'} rounded-t-xs transition-all`} />
              <span className={`w-1.5 ${ageDelta >= 7 ? 'h-9 bg-rose-500 ring-1 ring-rose-400/40' : ageDelta > 0 ? 'h-6 bg-amber-400' : 'h-3 bg-emerald-400'} rounded-t-xs transition-all`} />
            </div>
            <span className={`text-[11px] font-extrabold mt-1.5 tabular ${ageDelta > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              +{ageDelta} yrs
            </span>
          </div>

          <div className="w-[1px] h-9 bg-slate-200/80 mx-1" />
        </div>

        {/* Cardiorenal Age Metric */}
        <div className="col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${ageDelta > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <span className="text-[11px] font-medium text-slate-500">Cardiorenal age</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[26px] font-extrabold text-[#0F172A] tracking-tight tabular leading-none">{cardiorenalAge}</span>
            <span className="text-[12px] font-medium text-slate-500">yrs</span>
          </div>
        </div>

        {/* Chronological Age Metric */}
        <div className="col-span-2 flex flex-col justify-center border-l border-slate-200/80 pl-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-[11px] font-medium text-slate-500">Chronological age</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[26px] font-extrabold text-[#0F172A] tracking-tight tabular leading-none">{chronoAge}</span>
            <span className="text-[12px] font-medium text-slate-500">yrs</span>
          </div>
        </div>

        {/* Clinical Narrative & SBAR CTA */}
        <div className="col-span-6 flex items-center justify-between pl-4 border-l border-slate-200/80">
          <p className="text-[12px] text-slate-600 leading-snug max-w-[240px]">
            Arthur's cardiorenal system is under{' '}
            <strong className="font-semibold text-slate-900 tabular">
              {ageDelta > 0 ? `${ageDelta} years accelerated strain` : 'stable baseline age alignment'}
            </strong>{' '}
            {patient.trajectory.weight_delta_48h > 0 
              ? `driven by volume overload (+${patient.trajectory.weight_delta_48h.toFixed(1)} lbs).` 
              : 'with compensated fluid balance.'}
          </p>

          <button
            type="button"
            onClick={() => setActiveDrawer('sbar')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E2E44] hover:bg-[#0F172A] text-white text-[12px] font-semibold transition-all shadow-xs cursor-pointer group shrink-0"
          >
            <span>Review 45s SBAR</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
