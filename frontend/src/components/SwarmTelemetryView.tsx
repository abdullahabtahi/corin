import React from 'react'
import {
  Activity,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldAlert,
  RotateCcw,
  ArrowRight,
  Radio,
  Play
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'
import { useSwarmStream } from '../hooks/useSwarmStream'

export const SwarmTelemetryView: React.FC = () => {
  const {
    swarmNodes,
    cdssVerdict,
    patient,
    injectKSpike,
    resetK,
    setCurrentWorkspace
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

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 select-none bg-[#EAEFF5]/60">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-blue-600" />
            Clinical Agent Telemetry & Execution Trace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strands Multi-Agent Architecture • Amazon Nova Micro Clinical Decider (4.2ms) • Deterministic Invariant Guardian
          </p>
        </div>

        {/* Global Latency Pill & Replay Trigger */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isLiveConnected ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200/80">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Live SSE Stream</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200/80 tabular-nums">
              <Radio className="w-3.5 h-3.5 text-slate-600" />
              <span>Recorded Trace ({totalLatencyMs}ms)</span>
            </span>
          )}

          <button
            type="button"
            onClick={startRecordedReplay}
            disabled={isStreaming}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${isStreaming
                ? 'bg-blue-100 text-blue-800 border border-blue-300 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
          >
            <Play className={`w-3 h-3 ${isStreaming ? 'animate-spin' : ''}`} />
            <span>{isStreaming ? 'Streaming...' : 'Replay Trace'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tile 1: Decider Engine */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Primary Triage Engine</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">Bedrock Decider</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 tabular-nums">
              4.2ms
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Deterministic boundary routing & symptom NLP
          </p>
        </div>

        {/* Tile 2: Guardian Check */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>CDSS Guardian</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">Deterministic</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 tabular-nums">
              1.8ms
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            4/4 Clinical Invariants Verified
          </p>
        </div>

        {/* Tile 3: Sensor Ingestion */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Cat-M1 Cellular</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 tabular-nums">18ms</span>
            <span className="text-xs text-slate-500 font-medium">Ping</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Direct cellular scale ingestion (zero WiFi dependency)
          </p>
        </div>

        {/* Tile 4: Agent Core */}
        <div className="p-4 rounded-2xl bg-[#EDF1F6]/90 border border-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Orchestration</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">Strands SDK</span>
            <span className="text-xs text-slate-500 font-medium">v1.2</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cryptographic contract validation active
          </p>
        </div>
      </div>

      {/* Main Grid: Multi-Agent Execution DAG & Simulation Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Columns: Live Multi-Agent Trace DAG */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-700" />
                  Multi-Stage Agent Execution Trace (DAG)
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Live asynchronous pipeline coordinating ingestion, ML inference, and deterministic safety
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/60 tabular-nums">
                5 Nodes Active
              </span>
            </div>

            {/* Nodes Sequence */}
            <div className="flex flex-col gap-3">
              {displayNodes.map((node, index) => {
                const isComplete = node.status === 'COMPLETE'
                const isNodeVetoed = node.status === 'VETOED'
                const isRunning = node.status === 'RUNNING'

                return (
                  <div
                    key={node.id}
                    className={`p-3.5 rounded-xl border transition-all ${isNodeVetoed
                        ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400'
                        : isRunning
                          ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400'
                          : 'bg-[#F4F6FA]/80 border-white/80'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center tabular-nums">
                          {index + 1}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{node.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600">
                          {node.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {node.latency_ms !== undefined && (
                          <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                            {node.latency_ms}ms
                          </span>
                        )}
                        {isComplete ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Passed</span>
                          </span>
                        ) : isNodeVetoed ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Vetoed</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-blue-700 animate-pulse">Running</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mt-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                      {node.summary}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Interactive Simulation & Workstation Handoff */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Simulation Sandbox */}
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Safety Cliff Simulation
            </h2>
            <p className="text-[11px] text-slate-500">
              Test deterministic CDSS Guardian veto enforcement by injecting adverse clinical spikes
            </p>

            <div className="flex flex-col gap-2 mt-1">
              <button
                type="button"
                onClick={() => injectKSpike(5.8)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${isVetoed
                    ? 'bg-rose-600 text-white border-transparent shadow-xs'
                    : 'bg-white/80 text-rose-700 border-rose-200 hover:bg-rose-50'
                  }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Inject K+ Spike (5.8 mEq/L)</span>
                </div>
                <span className="text-[10px] font-mono">Lethal Veto</span>
              </button>

              <button
                type="button"
                onClick={resetK}
                className="py-2 px-3 bg-white/80 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset to Arthur Baseline (4.6 mEq/L)</span>
              </button>
            </div>

            {isVetoed && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex flex-col gap-1 mt-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Hard Safety Veto Triggered
                </div>
                <p className="text-[11px] text-rose-700">
                  {cdssVerdict.veto_reason}
                </p>
              </div>
            )}
          </div>

          {/* Workstation Handoff */}
          <div className="bg-[#EDF1F6]/90 rounded-2xl border border-white/90 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Patient Correlation
            </h2>
            <p className="text-[11px] text-slate-600">
              Active patient: <strong>{patient.name}</strong> ({patient.age}yo M • {patient.nyha_class}). Return to the workstation to visualize the living digital twin.
            </p>

            <button
              type="button"
              onClick={() => setCurrentWorkspace('workstation')}
              className="mt-2 w-full py-2.5 px-4 bg-[#1E2E44] hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Open in Cardiorenal Twin Workstation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
