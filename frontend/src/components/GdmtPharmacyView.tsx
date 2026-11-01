import React from 'react'
import { 
  Pill, 
  ShieldCheck, 
  Dna, 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight, 
  Activity
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'
import { GDMT_PILLARS_DATA } from '../lib/api'

export const GdmtPharmacyView: React.FC = () => {
  const { 
    patient, 
    orderStatus, 
    actionIntentToken, 
    setCurrentWorkspace 
  } = useClinical()

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 select-none bg-[#EAEFF5]/60">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <Pill className="w-5 h-5 text-amber-600" />
            GDMT Regimen & Prescribing Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ACC/AHA Quadruple Pharmacotherapy Cockpit • Pharmacogenomics & Deterministic DDI Invariants
          </p>
        </div>

        {/* Patient Demographics Chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1 bg-white/90 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-800 shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{patient.name}</span>
            <span className="text-slate-500 tabular-nums">({patient.age}yo M • {patient.nyha_class})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: ACC/AHA Quadruple Therapy Pillars */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  ACC/AHA Quadruple Therapy Pillars
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Guideline-Directed Medical Therapy target dose attainment for HFrEF (EF ≤ 40%)
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/60 tabular-nums">
                Overall: 65% Target Dose
              </span>
            </div>

            {/* Pillar List */}
            <div className="flex flex-col gap-3">
              {GDMT_PILLARS_DATA.map((pillar) => {
                const isOptimal = pillar.status === 'OPTIMAL'
                const isHeld = pillar.status === 'HELD_SAFETY'
                const isTitrating = pillar.status === 'TITRATING'

                return (
                  <div 
                    key={pillar.id}
                    className="p-3.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 shadow-2xs flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{pillar.name}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isOptimal 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isHeld 
                              ? 'bg-rose-100 text-rose-800' 
                              : isTitrating 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                          {pillar.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-700 tabular-nums">
                        {pillar.optimization_pct}% Target
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOptimal 
                            ? 'bg-emerald-500' 
                            : isHeld 
                              ? 'bg-rose-400' 
                              : isTitrating 
                                ? 'bg-amber-500' 
                                : 'bg-blue-500'
                        }`}
                        style={{ width: `${pillar.optimization_pct}%` }}
                      />
                    </div>

                    {/* Current vs Target Dosing */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/50">
                      <div>
                        <span className="text-slate-500">Current Regimen:</span>
                        <div className="font-semibold text-slate-800">{pillar.current_drug} • {pillar.current_dose}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Target Dose:</span>
                        <div className="font-semibold text-slate-700">{pillar.target_dose}</div>
                      </div>
                    </div>

                    {/* Clinical Rationale & Citation */}
                    <div className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-200/50 flex flex-col gap-1">
                      <div><strong className="text-slate-700">Rationale:</strong> {pillar.clinical_rationale}</div>
                      <div className="text-[11px] text-slate-500 italic">Ref: {pillar.guideline_citation}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: PGx & FHIR Order Ledger */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Card 1: Pharmacogenomics (PGx) Profile */}
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Dna className="w-4 h-4 text-blue-600" />
              Pharmacogenomic Profile (PGx)
            </h2>
            <p className="text-[11px] text-slate-500">
              Genetic variants modulating drug clearance and vascular tone
            </p>

            <div className="flex flex-col gap-2.5 mt-1">
              {/* CYP2C9 */}
              <div className="p-3 bg-[#F4F6FA]/80 rounded-xl border border-white/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">CYP2C9 *1/*3</span>
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Intermediate Metabolizer
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-700 mt-1">
                  ~50% clearance reduction for loop diuretics & oral anticoagulants. Requires extended monitoring for peak diuretic response.
                </p>
              </div>

              {/* VKORC1 */}
              <div className="p-3 bg-[#F4F6FA]/80 rounded-xl border border-white/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">VKORC1 -1639G&gt;A</span>
                  <span className="text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                    High Sensitivity
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-700 mt-1">
                  Enhanced vitamin K epoxide reductase inhibition sensitivity.
                </p>
              </div>

              {/* PHACTR1 */}
              <div className="p-3 bg-[#F4F6FA]/80 rounded-xl border border-white/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">PHACTR1 rs934197</span>
                  <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Risk Allele A/G
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-700 mt-1">
                  Endothelial EDN1 upregulation marker. Increased peripheral resistance vulnerability.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Deterministic Safety Invariants Matrix */}
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              CDSS Invariant Safety Matrix
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-1">
                <span className="text-[11px] text-slate-600 font-medium">Serum K+ Buffer</span>
                <span className="font-bold text-slate-900 tabular-nums">{patient.labs.potassium_mEq_L.toFixed(1)} mEq/L</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Boundary &lt; 5.2 mEq/L</span>
              </div>

              <div className="p-2.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-1">
                <span className="text-[11px] text-slate-600 font-medium">Perfusion SBP</span>
                <span className="font-bold text-slate-900 tabular-nums">{patient.trajectory.blood_pressure_sys} mmHg</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Boundary ≥ 95 mmHg</span>
              </div>

              <div className="p-2.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-1">
                <span className="text-[11px] text-slate-600 font-medium">Renal eGFR</span>
                <span className="font-bold text-slate-900 tabular-nums">{patient.labs.egfr_mL_min} mL/min</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Boundary ≥ 30 mL/min</span>
              </div>

              <div className="p-2.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-1">
                <span className="text-[11px] text-slate-600 font-medium">Lab Recency</span>
                <span className="font-bold text-slate-900 tabular-nums">7 Days</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Boundary ≤ 14 Days</span>
              </div>
            </div>
          </div>

          {/* Card 3: Active FHIR MedicationRequest (#medrx-88319) Audit Ledger */}
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                FHIR R4 MedicationRequest
              </h2>
              <span className="text-[11px] font-mono text-slate-600">#medrx-88319</span>
            </div>

            <div className="p-3 bg-[#F4F6FA]/90 rounded-xl border border-white/80 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <div>
                  <div className="font-bold text-slate-900">Furosemide 80mg Oral Tablet</div>
                  <div className="text-[11px] text-slate-600">RxNorm: 315971 • Take 1 tab daily x 3 days</div>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  orderStatus === 'committed' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {orderStatus === 'committed' ? 'AUTHORIZED' : 'PENDING SIGNATURE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                <div>
                  <span className="text-slate-500">Requester:</span>
                  <div className="font-semibold text-slate-800">Dr. Robert Chen, MD</div>
                  <div className="text-[11px] text-slate-500">NPI: 1982049182</div>
                </div>
                <div>
                  <span className="text-slate-500">Safety Check:</span>
                  <div className="font-semibold text-emerald-700">Passed (1.8ms)</div>
                  <div className="text-[11px] text-slate-500">Deterministic Guardian</div>
                </div>
              </div>

              {/* Action Intent Token / Signature Status */}
              {actionIntentToken ? (
                <div className="mt-1 p-2 bg-emerald-50 rounded-lg border border-emerald-200/80 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Cryptographic Intent Token Generated
                  </div>
                  <span className="font-mono text-[11px] text-emerald-900 break-all select-all">
                    {actionIntentToken}
                  </span>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Awaiting clinician digital signature in workstation
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentWorkspace('workstation')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1E2E44] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Go to Workstation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
