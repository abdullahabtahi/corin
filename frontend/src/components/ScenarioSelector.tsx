import React, { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  FlaskConical,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Shield,
  Activity,
  Zap
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'
import { BENCHMARK_SCENARIOS } from '../lib/scenarios'

export const ScenarioSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { activeScenarioId, setActiveScenario } = useClinical()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const activeScenario = BENCHMARK_SCENARIOS.find((s) => s.id === activeScenarioId) || BENCHMARK_SCENARIOS[0]

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener('mousedown', handleOutsideClick)
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'A':
        return <Zap className="w-3.5 h-3.5 text-blue-600" />
      case 'B':
        return <Activity className="w-3.5 h-3.5 text-amber-600" />
      case 'C':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      case 'D':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
      case 'E':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
      case 'F':
        return <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
      case 'G':
        return <Radio className="w-3.5 h-3.5 text-amber-600" />
      case 'H':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
      case 'I':
        return <Shield className="w-3.5 h-3.5 text-blue-600" />
      default:
        return <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
    }
  }

  const getScenarioBadgeClass = (color: string) => {
    switch (color) {
      case 'rose':
        return 'bg-rose-50 text-rose-800 border-rose-200'
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200'
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200'
      case 'indigo':
        return 'bg-blue-50 text-blue-800 border-blue-200'
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }

  return (
    <div ref={menuRef} className="relative inline-block text-left select-none">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Switch Benchmark Clinical Scenario (A through I)"
        className={`flex items-center gap-2 rounded-full border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${compact
            ? 'px-2.5 py-1 text-[11px] bg-[#F4F6FA]/95 border-slate-200/80 shadow-2xs hover:bg-slate-100 text-slate-800'
            : 'px-3 py-1.5 text-[11.5px] bg-[#EFF3F8]/90 hover:bg-[#E6ECF4] border-slate-200/80 shadow-2xs text-slate-900 font-semibold'
          }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-white shadow-2xs flex items-center justify-center">
            {getScenarioIcon(activeScenario.id)}
          </span>
          <span className="font-bold tabular text-slate-900">
            Scenario {activeScenario.code}:
          </span>
          <span className="text-slate-600 font-medium truncate max-w-[130px] sm:max-w-[190px]">
            {activeScenario.title.split(':')[1]?.trim() || activeScenario.category}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-[340px] sm:w-[380px] max-h-[460px] overflow-y-auto rounded-2xl bg-[#EDF1F6] border border-white/90 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-200/70 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              <span className="text-[12px] font-bold text-slate-900">
                Benchmark Clinical Scenarios
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide bg-[#F4F6FA] px-2 py-0.5 rounded-full border border-slate-200 tabular">
              9 Test Fixtures
            </span>
          </div>

          <div className="space-y-1">
            {BENCHMARK_SCENARIOS.map((sc) => {
              const isSelected = sc.id === activeScenarioId
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setActiveScenario(sc.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${isSelected
                      ? 'bg-blue-50/90 border-blue-300 shadow-xs'
                      : 'bg-[#F4F6FA] hover:bg-[#F8FAFD] border-slate-200/60'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white shadow-2xs flex items-center justify-center">
                        {getScenarioIcon(sc.id)}
                      </span>
                      <span className="text-[12px] font-bold text-slate-900 tabular">
                        {sc.title}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getScenarioBadgeClass(sc.badgeColor)}`}>
                      {sc.category}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-slate-700 line-clamp-2 pl-7 font-normal">
                    {sc.description}
                  </p>

                  <div className="mt-0.5 pl-7 flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                    <span className="font-semibold text-slate-800">Expected:</span>
                    <span className="truncate">{sc.expectedOutcome}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
