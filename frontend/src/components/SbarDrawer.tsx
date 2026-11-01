import React, { useEffect } from 'react'
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck2, 
  Clock, 
  ArrowRight,
  Database,
  Lock,
  SendHorizontal,
  Compass,
  FlaskConical
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'
import { PROVENANCE_CITATIONS } from '../lib/api'

export const SbarDrawer: React.FC = () => {
  const { 
    activeDrawer, 
    setActiveDrawer, 
    patient, 
    cdssVerdict, 
    orderStatus,
    orderLifecycle,
    executeGuideAction,
    actionIntentToken, 
    fhirMedicationRequest,
    fhirServiceRequest,
    authorizeOrder,
    activeCitation,
    setActiveCitation 
  } = useClinical()

  // Keyboard Escape dismissal
  useEffect(() => {
    if (activeDrawer !== 'sbar') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDrawer('none')
        setActiveCitation(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeDrawer, setActiveDrawer, setActiveCitation])

  if (activeDrawer !== 'sbar') return null

  const handleCitationClick = (id: string) => {
    if (activeCitation === id) {
      setActiveCitation(null)
    } else {
      setActiveCitation(id)
    }
  }

  const renderInlineCitationMicroCard = (citationId: string) => {
    if (activeCitation !== citationId) return null
    const citationData = PROVENANCE_CITATIONS[citationId]
    if (!citationData) return null

    return (
      <div className="mt-3 p-3.5 rounded-xl tile-surface border border-blue-300 shadow-sm animate-in slide-in-from-top-1 duration-150">
        <div className="flex items-center justify-between font-bold text-blue-950 pb-1.5 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-mono">
              {citationData.badge}
            </span>
            <span className="text-[12px] font-bold">{citationData.title}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveCitation(null)}
            className="text-slate-400 hover:text-slate-700 text-[11px] cursor-pointer"
          >
            Close &times;
          </button>
        </div>

        <div className="pt-2 text-[11.5px] text-slate-700 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-slate-600 text-[11px]">
            <span>Tier: <strong>{citationData.tier}</strong></span>
            <span className="tabular">{citationData.timestamp}</span>
          </div>
          <p className="text-slate-800 leading-relaxed font-medium bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
            {citationData.snippet}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-blue-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-400/30" />
            <span>Spotlight Active: {citationData.targetOrgan.toUpperCase()} Twin & Dashboard Illuminated</span>
          </div>

          {citationData.rawPacket && (
            <details className="mt-1 text-[11px]">
              <summary className="cursor-pointer text-blue-700 font-semibold hover:underline flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>Inspect Raw Telemetry / Provenance Packet (JSON)</span>
              </summary>
              <pre className="mt-2 p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(citationData.rawPacket, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 lg:bg-slate-900/10 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={() => {
        setActiveDrawer('none')
        setActiveCitation(null)
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="sbar-drawer-title"
        className="w-full max-w-[660px] h-full bg-[#EDF1F6] flex flex-col justify-between border-l border-white/90 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header without kickers */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-[#F4F6FA]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 id="sbar-drawer-title" className="text-[16px] font-bold text-[#0F172A] tracking-tight">
                  45-Second Clinical SBAR Review
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Abridge Provenance Standard
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 border border-slate-300">
                  {orderLifecycle}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Arthur Pendelton (P-94021) • Attending: Dr. Robert Chen, MD (NPI 1948201948)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveDrawer('none')
              setActiveCitation(null)
            }}
            aria-label="Close SBAR Review Drawer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-[#1E293B]">
          {/* SBAR Section: Situation */}
          <div className="p-4 rounded-xl tile-surface border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-blue-800 tracking-tight">
                Situation: Acute Volume Overload
              </h3>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium tabular">
                <Clock className="w-3 h-3" /> Today 08:14 EDT
              </span>
            </div>
            <p className="mt-2 text-[13px] font-medium text-[#0F172A] leading-relaxed">
              71yo male with HFrEF presenting with{' '}
              <strong className="text-rose-700 tabular font-bold">+3.6 lbs acute weight gain</strong>{' '}
              over 48 hours (181.0 &rarr; 184.6 lbs){' '}
              <button
                type="button"
                onClick={() => handleCitationClick('2')}
                aria-expanded={activeCitation === '2'}
                className={`citation-chip mx-0.5 ${activeCitation === '2' ? 'bg-blue-600 text-white' : ''}`}
                title="Inspect IoT Cat-M1 scale telemetry packet"
              >
                [2] DuckDB +3.6 lbs
              </button>{' '}
              and new-onset{' '}
              <span className="font-semibold text-slate-900 underline decoration-rose-400 underline-offset-2">
                2-pillow orthopnea
              </span>{' '}
              <button
                type="button"
                onClick={() => handleCitationClick('5')}
                aria-expanded={activeCitation === '5'}
                className={`citation-chip mx-0.5 ${activeCitation === '5' ? 'bg-blue-600 text-white' : ''}`}
                title="Inspect conversational Twilio SMS quote"
              >
                [5] SMS Transcript
              </button>{' '}
              confirmed via Conversational SMS check-in.
            </p>
            {renderInlineCitationMicroCard('2')}
            {renderInlineCitationMicroCard('5')}
          </div>

          {/* SBAR Section: Background */}
          <div className="p-4 rounded-xl tile-surface border border-slate-200/80 shadow-xs">
            <h3 className="text-[13px] font-bold text-blue-800 tracking-tight">
              Background: Cardiorenal Triad Baseline
            </h3>
            <p className="mt-2 text-[12.5px] text-slate-700 leading-relaxed font-normal">
              Ischemic Cardiomyopathy (NYHA Class III, EF 32%), CAD s/p CABG, CKD Stage 3a (eGFR 54 mL/min). Baseline dry weight: 181.0 lbs. Baseline Serum K+ 4.6 mEq/L{' '}
              <button
                type="button"
                onClick={() => handleCitationClick('4')}
                aria-expanded={activeCitation === '4'}
                className={`citation-chip mx-0.5 ${activeCitation === '4' ? 'bg-blue-600 text-white' : ''}`}
                title="Inspect Quest Diagnostics verified lab baseline"
              >
                [4] Quest BMP Baseline
              </button>
              . Current GDMT regimen: Lisinopril 10mg daily, Carvedilol 25mg BID, Furosemide 40mg daily, Empagliflozin 10mg daily.
            </p>
            {renderInlineCitationMicroCard('4')}
          </div>

          {/* SBAR Section: Assessment with Interactive Citation Chips */}
          <div className="p-4 rounded-xl tile-surface border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-blue-800 tracking-tight">
                Assessment: Early Subclinical Decompensation
              </h3>
              <span className="text-[11px] font-semibold text-slate-600 tabular">
                Risk Score: 87.4%
              </span>
            </div>
            <p className="mt-2 text-[13px] text-slate-800 leading-relaxed">
              Early ambulatory decompensation with cardiorenal venous congestion. Columnar signal processing confirms an anomaly{' '}
              <button
                type="button"
                onClick={() => handleCitationClick('2')}
                aria-expanded={activeCitation === '2'}
                className={`citation-chip mx-0.5 ${activeCitation === '2' ? 'bg-blue-600 text-white' : ''}`}
              >
                [2] Z=+2.41&sigma; (p&lt;0.01)
              </button>
              . Sympathetic autonomic activation is demonstrated by nocturnal resting HR drift +14 bpm (68 &rarr; 82 bpm){' '}
              <button
                type="button"
                onClick={() => handleCitationClick('3')}
                aria-expanded={activeCitation === '3'}
                className={`citation-chip mx-0.5 ${activeCitation === '3' ? 'bg-blue-600 text-white' : ''}`}
              >
                [3] PPG Autonomic Drift
              </button>
              . Hemodynamic perfusion remains intact with SBP 133 mmHg, and Serum K+ is verified at {patient.labs.potassium_mEq_L.toFixed(1)} mEq/L within the safe invariant window.
            </p>
            {renderInlineCitationMicroCard('2')}
            {renderInlineCitationMicroCard('3')}
          </div>

          {/* SBAR Section: Recommendation with ACC/AHA Guideline Citation */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
              <h3 className="text-[13px] font-bold text-blue-900 tracking-tight">
                Recommendation: Guideline-Directed Titration Protocol
              </h3>
              <button
                type="button"
                onClick={() => handleCitationClick('1')}
                aria-expanded={activeCitation === '1'}
                className={`citation-chip ${activeCitation === '1' ? 'bg-blue-600 text-white' : ''}`}
                title="Inspect 2022 ACC/AHA Heart Failure Guidelines"
              >
                [1] ACC/AHA §7.3.1 Class I
              </button>
            </div>
            {renderInlineCitationMicroCard('1')}

            <div className="mt-2.5 space-y-2 text-[12px] font-medium text-blue-950">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  1
                </span>
                <span>
                  <strong>Temporary Diuretic Escalation:</strong> Increase Furosemide (Lasix) from 40mg to{' '}
                  <strong className="text-blue-900 font-extrabold">80mg PO daily x 3 days</strong>; return to 40mg baseline on Day 4.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  2
                </span>
                <span>
                  <strong>STAT Surveillance BMP:</strong> Schedule repeat fasting BMP on Day 3 morning to evaluate Serum K+, BUN, and eGFR stability.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  3
                </span>
                <span>
                  <strong>Dietary Protocol:</strong> Arthur coached via SMS companion on 2,000 mL/day fluid and &lt;2,000 mg Na+ restriction.
                </span>
              </div>
            </div>
          </div>

          {/* CDSS Deterministic Safety Invariant Checklist */}
          <div className="p-4 rounded-xl tile-surface border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${cdssVerdict.passed ? 'text-emerald-600' : 'text-rose-600'}`} />
                <span className="text-[12.5px] font-bold text-[#0F172A]">
                  Deterministic CDSS Safety Checks (Guardian)
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-700 tabular font-mono bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                1.8ms Invariant Check
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-3">
              <div
                className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between ${
                  cdssVerdict.invariants.k_window_check.passed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <span className="font-medium">Serum K+ Safe Window:</span>
                <span className="font-bold tabular">{cdssVerdict.invariants.k_window_check.value}</span>
              </div>

              <div
                className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between ${
                  cdssVerdict.invariants.sbp_check.passed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <span className="font-medium">Systolic BP &ge; 95 mmHg:</span>
                <span className="font-bold tabular">{cdssVerdict.invariants.sbp_check.value}</span>
              </div>

              <div
                className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between ${
                  cdssVerdict.invariants.egfr_check.passed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <span className="font-medium">eGFR Stability (&lt;30% drop):</span>
                <span className="font-bold tabular">{cdssVerdict.invariants.egfr_check.value}</span>
              </div>

              <div
                className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between ${
                  cdssVerdict.invariants.recency_check.passed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <span className="font-medium">Lab Recency (&le;14 Days):</span>
                <span className="font-bold tabular">{cdssVerdict.invariants.recency_check.value}</span>
              </div>
            </div>

            {!cdssVerdict.passed && cdssVerdict.status === 'VETOED' && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-300 rounded-lg flex items-center gap-2 text-rose-800 text-[11.5px] font-bold shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Hard CDSS Veto Active: {cdssVerdict.veto_reason}</span>
              </div>
            )}

            {/* Guide Steering Protocol when labs stale or hypokalemia detected */}
            {cdssVerdict.status === 'GUIDE' && cdssVerdict.guide_action && (
              <div className="mt-3 p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-950 text-[12px] font-bold">
                    <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Clinical Guide Steering Protocol</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-mono">
                    HITL Guidance
                  </span>
                </div>
                <p className="text-[11.5px] text-amber-900 leading-snug font-medium">
                  {cdssVerdict.guide_action}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => executeGuideAction(cdssVerdict.guide_code || 'ORDER_STAT_BMP')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Execute Guide: Order STAT BMP Lab Requisition</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer: 3-State Morphing 1-Click Order Commitment Action */}
        <div 
          className="p-5 border-t border-slate-200/80 bg-[#F4F6FA]/90 backdrop-blur-xl flex flex-col gap-2.5"
          aria-live="polite"
        >
          {orderStatus === 'committed' ? (
            <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-900 flex flex-col gap-2 shadow-xs animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-[13.5px]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Order Signed & Committed to EHR (1-Click)</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 font-bold">
                  Immutable Action Token
                </span>
              </div>

              <div className="text-[11.5px] text-emerald-950 font-medium space-y-1 bg-[#F4F6FA] p-2.5 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span>HL7 FHIR MedicationRequest:</span>
                  <strong className="font-mono">{fhirMedicationRequest?.id || '#medrx-88319'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>HL7 FHIR ServiceRequest (Day 3 BMP):</span>
                  <strong className="font-mono">{fhirServiceRequest?.id || '#serv-29401'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Action Intent Token:</span>
                  <strong className="font-mono text-emerald-700">{actionIntentToken || 'act_corp_94021_loop80'}</strong>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-emerald-100 text-[11px] text-emerald-800">
                  <span>Pharmacy Dispatch: Walgreens #4402</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <SendHorizontal className="w-3 h-3 text-emerald-600" />
                    Arthur SMS Notified
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={!cdssVerdict.passed || orderStatus === 'authorizing'}
              aria-busy={orderStatus === 'authorizing'}
              onClick={authorizeOrder}
              className={`w-full py-3.5 px-5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                !cdssVerdict.passed
                  ? 'bg-rose-100 text-rose-700 cursor-not-allowed border border-rose-300'
                  : orderStatus === 'authorizing'
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-blue-500/25'
              }`}
            >
              {!cdssVerdict.passed ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Hard CDSS Veto: Titration Blocked</span>
                </>
              ) : orderStatus === 'authorizing' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Cryptographically Signing with NPI 1948201948 (280ms)...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign & Transmit Titration Order (1-Click)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-600 px-1 font-medium tabular">
            <span>Attending: Dr. Robert Chen, MD (NPI 1948201948)</span>
            <span>Deterministic CDSS Verification: 1.8ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
