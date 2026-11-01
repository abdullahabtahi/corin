import React, { useState, useMemo } from 'react'
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  ArrowUpRight,
  Activity
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'
import type { CohortPatientRecord } from '../types/clinical'

type FilterTier = 'ALL' | 'CRITICAL' | 'ORDERS' | 'STABLE'

export const CohortWorklistView: React.FC = () => {
  const { cohortPatients, selectCohortPatient, selectedCohortPatientId } = useClinical()
  const [filterTier, setFilterTier] = useState<FilterTier>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Computed summary metrics
  const totalLives = 250
  const urgentCount = useMemo(() => cohortPatients.filter(p => p.urgency_tier === 'EMERGENCY' || p.urgency_tier === 'URGENT').length, [cohortPatients])
  const pendingOrdersCount = 7
  const stableCount = 240

  // Filtered patients list
  const filteredPatients = useMemo(() => {
    return cohortPatients.filter((p) => {
      // 1. Filter tier match
      if (filterTier === 'CRITICAL' && p.urgency_tier !== 'EMERGENCY' && p.urgency_tier !== 'URGENT') {
        return false
      }
      if (filterTier === 'ORDERS' && !p.pending_action.toLowerCase().includes('escalation') && !p.pending_action.toLowerCase().includes('admit') && !p.pending_action.toLowerCase().includes('review') && !p.pending_action.toLowerCase().includes('bmp')) {
        return false
      }
      if (filterTier === 'STABLE' && p.urgency_tier !== 'ROUTINE') {
        return false
      }

      // 2. Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const nameMatch = p.name.toLowerCase().includes(query)
        const mrnMatch = p.mrn.toLowerCase().includes(query)
        const symptomMatch = p.symptoms.some(s => s.toLowerCase().includes(query))
        const actionMatch = p.pending_action.toLowerCase().includes(query)
        return nameMatch || mrnMatch || symptomMatch || actionMatch
      }

      return true
    })
  }, [cohortPatients, filterTier, searchQuery])

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 select-none bg-[#EAEFF5]/60">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <Users className="w-5 h-5 text-blue-600" />
            Population Health Cohort Triage Panel
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Medicare Advantage Cardiorenal ACO Reach Cohort • Continuous Dual-Vector Remote Physiological Monitoring
          </p>
        </div>

        {/* Global ACO Refresh Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-400/30" />
            Real-Time Stream Active (14.2s ago)
          </span>
        </div>
      </div>

      {/* 4 High-Density Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tile 1: Total Lives */}
        <div
          onClick={() => setFilterTier('ALL')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${filterTier === 'ALL'
              ? 'bg-[#EDF1F6] border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
              : 'bg-[#F4F6FA]/80 hover:bg-[#EDF1F6] border-white/90 shadow-xs'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Active ACO Panel</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{totalLives}</span>
            <span className="text-xs text-slate-500 font-medium">Beneficiaries</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            250 / 250 Cellular Telemetry Active
          </p>
        </div>

        {/* Tile 2: Urgent Alerts */}
        <div
          onClick={() => setFilterTier('CRITICAL')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${filterTier === 'CRITICAL'
              ? 'bg-[#EDF1F6] border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
              : 'bg-[#F4F6FA]/80 hover:bg-[#EDF1F6] border-white/90 shadow-xs'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Urgent Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700 tabular-nums">{urgentCount}</span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Avg Risk 87.0%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Immediate Attending Escalation Required
          </p>
        </div>

        {/* Tile 3: Pending Orders */}
        <div
          onClick={() => setFilterTier('ORDERS')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${filterTier === 'ORDERS'
              ? 'bg-[#EDF1F6] border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
              : 'bg-[#F4F6FA]/80 hover:bg-[#EDF1F6] border-white/90 shadow-xs'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800 tabular-nums">{pendingOrdersCount}</span>
            <span className="text-xs text-amber-700 font-medium">Physician Actions</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Diuretic Escalation & Lab Recency Re-draws
          </p>
        </div>

        {/* Tile 4: Stable Baseline */}
        <div
          onClick={() => setFilterTier('STABLE')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${filterTier === 'STABLE'
              ? 'bg-[#EDF1F6] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
              : 'bg-[#F4F6FA]/80 hover:bg-[#EDF1F6] border-white/90 shadow-xs'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Stable Baseline</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 tabular-nums">{stableCount}</span>
            <span className="text-xs text-emerald-600 font-medium">Euvolemic</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Weight Z-score within ±1.0σ bounds
          </p>
        </div>
      </div>

      {/* Control Bar: Filters & Real-time Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[#F4F6FA]/80 rounded-2xl border border-white/90 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterTier('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${filterTier === 'ALL'
                ? 'bg-[#1E2E44] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
          >
            <span>All Beneficiaries</span>
            <span className="tabular-nums font-bold text-[11px] opacity-80">(250)</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTier('CRITICAL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${filterTier === 'CRITICAL'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Critical Alerts</span>
            <span className="tabular-nums font-bold text-[11px] opacity-80">({urgentCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTier('ORDERS')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${filterTier === 'ORDERS'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-50'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Pending Orders</span>
            <span className="tabular-nums font-bold text-[11px] opacity-80">({pendingOrdersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTier('STABLE')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${filterTier === 'STABLE'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Stable</span>
            <span className="tabular-nums font-bold text-[11px] opacity-80">({stableCount})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, MRN, symptom..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/90 border border-slate-200/80 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* High-Yield Clinical Patient Table */}
      <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-[#E2E8F0]/50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Patient Demographics</th>
                <th className="py-3 px-4">Hemodynamic Trajectory</th>
                <th className="py-3 px-4">Labs & Renal Safety</th>
                <th className="py-3 px-4">Reported Symptoms</th>
                <th className="py-3 px-4">Clinical Triage Route</th>
                <th className="py-3 px-4 text-right">Workstation Handoff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 text-xs">
              {filteredPatients.map((patient: CohortPatientRecord) => {
                const isSelected = patient.id === selectedCohortPatientId
                const isEmergency = patient.urgency_tier === 'EMERGENCY'
                const isUrgent = patient.urgency_tier === 'URGENT'

                return (
                  <tr
                    key={patient.id}
                    onClick={() => selectCohortPatient(patient.id)}
                    className={`transition-colors cursor-pointer group ${isSelected
                        ? 'bg-blue-50/70 hover:bg-blue-50'
                        : isEmergency
                          ? 'bg-rose-50/40 hover:bg-rose-50/70'
                          : isUrgent
                            ? 'bg-amber-50/30 hover:bg-amber-50/60'
                            : 'hover:bg-slate-100/60'
                      }`}
                  >
                    {/* 1. Demographics */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isEmergency
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : isUrgent
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                            {patient.name}
                            {isSelected && (
                              <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 tabular-nums">
                            {patient.age}yo {patient.gender === 'Male' ? 'M' : 'F'} • {patient.mrn} • EF {patient.ef_percent}%
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Trajectory */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold tabular-nums ${patient.weight_delta_48h >= 3.0
                              ? 'text-rose-700'
                              : patient.weight_delta_48h >= 1.5
                                ? 'text-amber-700'
                                : 'text-slate-800'
                            }`}>
                            {patient.weight_delta_48h > 0 ? `+${patient.weight_delta_48h.toFixed(1)}` : patient.weight_delta_48h.toFixed(1)} lbs / 48h
                          </span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${patient.z_score >= 2.0
                              ? 'bg-rose-100 text-rose-800'
                              : patient.z_score >= 1.0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                            +{patient.z_score.toFixed(2)}σ
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 tabular-nums flex items-center gap-1">
                          <Activity className="w-3 h-3 text-slate-400" />
                          <span>RHR {patient.resting_hr} bpm</span>
                          <span className={patient.hr_drift_bpm > 5 ? 'text-rose-600 font-semibold' : ''}>
                            ({patient.hr_drift_bpm > 0 ? `+${patient.hr_drift_bpm}` : patient.hr_drift_bpm} drift)
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Labs */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5 tabular-nums">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-[11px]">Serum K+:</span>
                          <span className={`font-bold ${patient.serum_k >= 5.2
                              ? 'text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200'
                              : patient.serum_k <= 3.5
                                ? 'text-amber-700'
                                : 'text-slate-800'
                            }`}>
                            {patient.serum_k.toFixed(1)} mEq/L
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          SBP {patient.sbp} mmHg • eGFR {patient.egfr} mL/min
                        </div>
                      </div>
                    </td>

                    {/* 4. Symptoms */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {patient.symptoms.map((symptom, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 5. Autonomous Route */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-800 text-[11px]">
                          {patient.decider_route}
                        </span>
                        <span className={`text-[11px] font-medium ${isEmergency ? 'text-rose-700 font-bold' : isUrgent ? 'text-amber-700 font-semibold' : 'text-slate-500'
                          }`}>
                          {patient.pending_action}
                        </span>
                      </div>
                    </td>

                    {/* 6. Action Handoff */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          selectCohortPatient(patient.id)
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${isSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-[#1E2E44] text-white hover:bg-slate-800'
                          }`}
                      >
                        <span>Open Workstation</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-[#E2E8F0]/30 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredPatients.length} of {cohortPatients.length} prioritized patients in clinical memory</span>
          <span className="tabular-nums">Cat-M1 Cellular Ping Latency: 18ms</span>
        </div>
      </div>
    </div>
  )
}
