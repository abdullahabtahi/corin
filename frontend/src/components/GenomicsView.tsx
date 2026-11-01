import React from 'react'
import { 
  Dna, 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2,
  FileCode2
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'

export const GenomicsView: React.FC = () => {
  const { patient, setCurrentWorkspace } = useClinical()
  const genomics = patient.organ_telemetry.genomics

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 select-none bg-[#EAEFF5]/60">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <Dna className="w-5 h-5 text-blue-600" />
            Pharmacogenomics & Precision Dosing Lab
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cytochrome P450 Metabolic Profiling • Endothelial Vascular Loci & Personalized Pharmacotherapy
          </p>
        </div>

        {/* Patient Demographics Chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1 bg-white/90 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-800 shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{patient.name}</span>
            <span className="text-slate-500 font-mono text-[11px]">(CYP2C9 *1/*3)</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tile 1: CYP2C9 */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>CYP2C9 Genotype</span>
            <Dna className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{genomics.cyp2c9}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              IM Phenotype
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ~50% clearance reduction for oral loop diuretics
          </p>
        </div>

        {/* Tile 2: VKORC1 */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>VKORC1 Sensitivity</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{genomics.vkorc1}</span>
            <span className="text-xs font-semibold text-slate-600">High Sensitivity</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Enhanced vitamin K oxidoreductase inhibition
          </p>
        </div>

        {/* Tile 3: PHACTR1 */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>PHACTR1 Locus</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{genomics.phactr1}</span>
            <span className="text-xs text-slate-500 font-medium">CAD Risk Locus</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Endothelial EDN1 upregulation marker
          </p>
        </div>

        {/* Tile 4: Phenotype */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Loop Phenotype</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-black text-slate-900">{genomics.loop_clearance_phenotype}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Intact proximal tubule organic anion transport
          </p>
        </div>
      </div>

      {/* Main Grid: Precision Guidance & Clinical References */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: Pharmacotherapy Adjustments */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-blue-600" />
                  Personalized Dosing Recommendations (CPIC Guidelines)
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Clinical Pharmacogenetics Implementation Consortium Class 1A recommendations
                </p>
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Level 1A Evidence
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Loop Diuretic Titration (Furosemide 80mg)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                    Monitor Delayed Peak
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Because Arthur possesses the <code>*1/*3</code> intermediate metabolizer allele, hepatic oxidation of Furosemide is reduced by approximately 45-50%. Diuretic onset is slightly delayed (90m vs 60m), but overall natriuretic effect is preserved. Short-course 72h pulse is well-tolerated.
                </p>
              </div>

              <div className="p-3.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Beta-Blocker Optimization (Carvedilol 25mg BID)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Target Maintained
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Carvedilol clearance proceeds via CYP2D6. Arthur exhibits normal CYP2D6 extensive metabolizer status, permitting full target dose titration without excessive bradycardia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Workstation Handoff */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Dna className="w-4 h-4 text-blue-600" />
              Genomic Action Summary
            </h2>
            <div className="p-3.5 bg-[#F4F6FA]/80 rounded-xl border border-white/80 text-xs text-slate-700 leading-relaxed">
              Arthur's genetic variants indicate high safety for the planned 80mg Furosemide escalation, with no hepatic contraindications. Return to the cardiorenal digital twin workstation to monitor real-time hemodynamics.
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

