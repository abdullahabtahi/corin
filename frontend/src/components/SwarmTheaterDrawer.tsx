import React, { useEffect } from 'react'
import {
  X,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  RotateCcw,
  Zap,
  ArrowDown,
  Play,
  Radio
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'
import { useSwarmStream } from '../hooks/useSwarmStream'

export const SwarmTheaterDrawer: React.FC = () => {
  const {
    activeDrawer,
    setActiveDrawer,
    swarmNodes,
    patient,
    cdssVerdict,
    injectKSpike,
    resetK
  } = useClinical()

  const isVetoed = !cdssVerdict.passed

  const {
    nodes: streamNodes,
    isStreaming,
    isLiveConnected,
    totalLatencyMs,
    startRecordedReplay
  } = useSwarmStream({
    patientId: patient.patient_id,
    autoStart: false,
    isVetoed,
    vetoReason: cdssVerdict.veto_reason
  })

  const displayNodes = isStreaming || isLiveConnected ? streamNodes : swarmNodes

  // Keyboard Escape dismissal
  useEffect(() => {
    if (activeDrawer !== 'theater') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDrawer('none')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeDrawer, setActiveDrawer])

  if (activeDrawer !== 'theater') return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 select-none"
      onClick={() => setActiveDrawer('none')}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="theater-modal-title"
        className="w-full max-w-[620px] h-full bg-[#EDF1F6] flex flex-col justify-between border-l border-white/90 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-[#E2E8F0]/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 id="theater-modal-title" className="text-[15px] font-bold text-[#0F172A] tracking-tight">
                  Clinical Agent Execution Trace
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Strands Agent Mesh
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Asynchronous Bedrock & Local CDSS Invariant Pipeline
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveDrawer('none')}
            aria-label="Close Execution Trace Drawer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Execution DAG Nodes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Pipeline Latency Summary Tile */}
          <div className="p-3.5 rounded-2xl bg-[#F4F6FA] border border-white/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[12px] font-bold text-slate-700">Pipeline Latency</span>
              {isLiveConnected ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                  Live SSE
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                  Recorded Replay
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-bold text-slate-900 font-mono tabular">{totalLatencyMs} ms</span>
              <button
                type="button"
                onClick={startRecordedReplay}
                disabled={isStreaming}
                className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${isStreaming
                    ? 'bg-blue-100 text-blue-800 border border-blue-300 cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
              >
                <Play className={`w-3 h-3 ${isStreaming ? 'animate-spin' : ''}`} />
                <span>{isStreaming ? 'Streaming...' : 'Replay Trace'}</span>
              </button>
            </div>
          </div>

          {/* DAG Nodes */}
          <div className="space-y-3 relative">
            {displayNodes.map((node, idx) => {
              const isNodeVetoed = node.status === 'VETOED'
              const isRunning = node.status === 'RUNNING'
              const isPending = node.status === 'PENDING'
              return (
                <div key={node.id} className="relative">
                  <div
                    className={`p-3.5 rounded-2xl border transition-all ${isNodeVetoed
                        ? 'bg-rose-50 border-rose-200 text-rose-950 shadow-2xs'
                        : isRunning
                          ? 'bg-blue-50/80 border-blue-300 shadow-xs ring-2 ring-blue-500/20'
                          : isPending
                            ? 'bg-slate-100/60 border-slate-200/60 opacity-60 text-slate-400'
                            : 'bg-[#F4F6FA] border-white/90 shadow-2xs hover:shadow-xs text-slate-800'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isNodeVetoed ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : isRunning ? (
                          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin shrink-0" />
                        ) : isPending ? (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span className="font-bold text-[13px] text-slate-900">{node.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {node.model}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-semibold tabular">
                          {node.latency_ms} ms
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-[12px] text-slate-600 leading-relaxed font-sans pl-6">
                      {node.summary}
                    </p>
                  </div>

                  {idx < swarmNodes.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Drawer Footer: Adversarial CDSS Safety Boundary Testing */}
        <div className="p-5 border-t border-slate-200/80 bg-[#E2E8F0]/70 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="text-[12px] font-bold text-slate-800">Adversarial Safety Boundary Testing</span>
            </div>
            <span className="text-[11px] font-mono text-slate-600 font-medium tabular">Current K+: {patient.labs.potassium_mEq_L.toFixed(1)} mEq/L</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => injectKSpike(5.8)}
              disabled={isVetoed}
              className={`py-2.5 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none ${isVetoed
                  ? 'bg-rose-100 text-rose-800 border border-rose-200 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isVetoed ? 'K+ Spike Injected (5.8)' : 'Inject Fatal K+ Spike (5.8)'}</span>
            </button>

            <button
              type="button"
              onClick={resetK}
              disabled={!isVetoed}
              className={`py-2.5 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none ${!isVetoed
                  ? 'bg-slate-200/80 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-[#1E2E44] hover:bg-slate-800 text-white shadow-xs'
                }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Invariant (4.6 mEq/L)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
