import React, { useState } from 'react'
import { 
  ArrowRight, 
  Droplets, 
  FlaskConical, 
  Shield, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  SendHorizontal,
  Compass
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'

interface CareActionItem {
  id: string
  title: string
  rationale: string
  concernsCount: number
  category: 'protocol' | 'gdmt' | 'lifestyle'
  iconType: 'drop' | 'flask' | 'shield'
}

const CARE_ACTIONS: CareActionItem[] = [
  // 1. Action Plan (3 Core Clinical Interventions)
  {
    id: 'a1',
    title: 'Temporary Furosemide (Lasix) Escalation',
    rationale: 'Temporary dose doubling to 80mg PO daily for 72 hours. Rapidly resolves subclinical interstitial fluid stasis; return to 40mg baseline on Day 4.',
    concernsCount: 12,
    category: 'protocol',
    iconType: 'drop'
  },
  {
    id: 'a2',
    title: 'STAT Safety BMP Lab Verification',
    rationale: 'Mandatory surveillance draw on morning of Day 3: evaluates Serum Potassium (K+), BUN, and Serum Creatinine before returning to baseline.',
    concernsCount: 17,
    category: 'protocol',
    iconType: 'flask'
  },
  {
    id: 'a3',
    title: 'Fluid & Sodium Dietary Protocol',
    rationale: "Enforces <2,000 mL/day fluid restriction and <2,000 mg/day sodium adherence via Arthur's conversational Care Companion SMS channel.",
    concernsCount: 8,
    category: 'protocol',
    iconType: 'shield'
  },

  // 2. GDMT Regimen (4 Foundation Pharmacotherapies)
  {
    id: 'g1',
    title: 'Maintain Carvedilol (Coreg) 25mg BID',
    rationale: 'Guideline-directed neurohormonal beta blockade maintained at 25mg twice daily; surveillance for resting pulse bradycardia.',
    concernsCount: 14,
    category: 'gdmt',
    iconType: 'shield'
  },
  {
    id: 'g2',
    title: 'Continue Empagliflozin (Jardiance) 10mg',
    rationale: 'Sustains cardiorenal protection and gentle osmotic diuresis without exacerbating electrolyte depletion.',
    concernsCount: 11,
    category: 'gdmt',
    iconType: 'drop'
  },
  {
    id: 'g3',
    title: 'Continue Lisinopril 10mg PO Daily',
    rationale: 'Reduces left ventricular afterload. Serum creatinine and potassium monitored closely during loop escalation.',
    concernsCount: 9,
    category: 'gdmt',
    iconType: 'flask'
  }
]

export const CareStrategyGrid: React.FC = () => {
  const { 
    setActiveDrawer, 
    cdssVerdict, 
    orderStatus, 
    orderLifecycle,
    executeGuideAction,
    authorizeOrder, 
    actionIntentToken,
    fhirMedicationRequest,
    fhirServiceRequest 
  } = useClinical()

  const [activeTab, setActiveTab] = useState<'protocol' | 'gdmt' | 'lifestyle'>('protocol')

  const filteredItems = CARE_ACTIONS.filter((item) => item.category === activeTab)

  const renderIcon = (type: 'drop' | 'flask' | 'shield') => {
    switch (type) {
      case 'drop':
        return <Droplets className="w-4 h-4 text-blue-500" />
      case 'flask':
        return <FlaskConical className="w-4 h-4 text-blue-600" />
      case 'shield':
        return <Shield className="w-4 h-4 text-emerald-500" />
    }
  }

  return (
    <div className="w-full section-surface rounded-2xl p-5 select-none flex flex-col justify-between transition-all gap-3.5">
      {/* Header without kickers */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70">
        <h2 className="text-[15px] font-bold text-[#0F172A] tracking-tight">
          Customized Care Strategy
        </h2>

        {/* Segmented Filter Pills */}
        <div className="flex items-center gap-1 bg-[#EFF3F8] p-1 rounded-full border border-slate-200/60 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('protocol')}
            className={`px-3.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'protocol'
                ? 'bg-[#1E2E44] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Action Plan</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full tabular ${
                activeTab === 'protocol' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              3
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gdmt')}
            className={`px-3.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gdmt'
                ? 'bg-[#1E2E44] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>GDMT Regimen</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full tabular ${
                activeTab === 'gdmt' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              4
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lifestyle')}
            className={`px-3.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              activeTab === 'lifestyle'
                ? 'bg-[#1E2E44] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Lifestyle & Vitals</span>
          </button>
        </div>
      </div>

      {/* 3 Action Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveDrawer('sbar')}
            className="tile-surface p-4 rounded-xl flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-7 h-7 rounded-lg bg-[#F4F6FA] flex items-center justify-center border border-white/90 shadow-2xs">
                  {renderIcon(item.iconType)}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              <h3 className="mt-3 text-[13px] font-bold text-[#1E293B] group-hover:text-blue-700 transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                {item.rationale}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
              {item.id === 'a1' && orderStatus === 'committed' ? (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 tabular">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Committed (#medrx-88319)</span>
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full tabular">
                  {item.concernsCount} concerns
                </span>
              )}
              <span className="text-[11px] font-semibold text-blue-600 group-hover:underline flex items-center gap-0.5">
                Details &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
         DECISION 4: ZERO-MODAL PRESCRIBING CEREMONY ACTION
         3-State Morphing 1-Click Order Signature Action embedded inline
         ============================================================ */}
      <div className="w-full liquid-glass-banner rounded-xl p-4 flex flex-col gap-3 shadow-md border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 p-1">
              <img
                src="/assets/supplement_bottle_transparent.png"
                alt="Medication"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>

            <div>
              <h3 className="text-[13.5px] font-bold text-white tracking-tight flex items-center gap-2">
                <span>ACC/AHA 2022 §7.3.1 Loop Diuretic Titration Protocol</span>
                {cdssVerdict.passed ? (
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30 tabular">
                    CDSS Invariant Cleared (1.8ms)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-400/30">
                    CDSS Hard Veto Active
                  </span>
                )}
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/20">
                  {orderLifecycle}
                </span>
              </h3>
              <p className="text-[12px] text-slate-300 leading-snug mt-0.5 text-pretty">
                Escalate Furosemide to 80mg PO x 3d + STAT repeat BMP scheduled. Zero-modal 1-click execution.
              </p>
            </div>
          </div>

          {/* Morphing 1-Click Button & Guide Steering Option */}
          {orderStatus === 'committed' ? (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11.5px] font-semibold flex items-center gap-2 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Signed & Committed (act_corp_94021_loop80)</span>
            </div>
          ) : fhirServiceRequest && orderLifecycle === 'PROPOSAL_PENDING' ? (
            <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11.5px] font-semibold flex items-center gap-2 shrink-0">
              <FlaskConical className="w-4 h-4 text-amber-300" />
              <span>Guide Executed: STAT BMP Requisition Active</span>
            </div>
          ) : cdssVerdict.status === 'GUIDE' && cdssVerdict.guide_action ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => executeGuideAction(cdssVerdict.guide_code || 'ORDER_STAT_BMP')}
                className="px-4 py-2.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
              >
                <Compass className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span>Execute Guide: Order STAT BMP</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!cdssVerdict.passed || orderStatus === 'authorizing'}
              onClick={authorizeOrder}
              className={`px-4 py-2.5 rounded-full text-[12px] font-bold flex items-center gap-2 cursor-pointer shrink-0 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
                !cdssVerdict.passed
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-700/60 cursor-not-allowed'
                  : orderStatus === 'authorizing'
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95 shadow-blue-500/30'
              }`}
            >
              {!cdssVerdict.passed ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Hard CDSS Veto</span>
                </>
              ) : orderStatus === 'authorizing' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing NPI (280ms)...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign & Transmit (1-Click)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Committed Order Audit Footprint inline */}
        {orderStatus === 'committed' && (
          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2 font-mono">
            <span>FHIR MedicationRequest: {fhirMedicationRequest?.id || '#medrx-88319'}</span>
            <span>FHIR ServiceRequest: {fhirServiceRequest?.id || '#serv-29401'}</span>
            <span>Action Token: {actionIntentToken || 'act_corp_94021_loop80'}</span>
            <span className="font-sans text-emerald-300 flex items-center gap-1">
              <SendHorizontal className="w-3 h-3 text-emerald-400" />
              Arthur SMS Notified
            </span>
          </div>
        )}
      </div>
    </div>
  )
}