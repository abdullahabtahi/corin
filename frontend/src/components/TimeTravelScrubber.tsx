import React, { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Calendar
} from 'lucide-react'

import { useClinical } from '../context/ClinicalContext'
import { TIMELINE_14D_DETAILS, getTimelineDayInfo } from '../lib/timeline'

export const TimeTravelScrubber: React.FC = () => {
  const { 
    selectedDay, 
    setSelectedDay, 
    isPlayingTimeline, 
    setIsPlayingTimeline, 
    timelineSpeed, 
    setTimelineSpeed,
    patient
  } = useClinical()

  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef<boolean>(false)
  const activeCleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      if (activeCleanupRef.current) {
        activeCleanupRef.current()
        activeCleanupRef.current = null
      }
    }
  }, [])

  const activeInfo = getTimelineDayInfo(selectedDay)
  const hoveredInfo = hoveredDay !== null ? getTimelineDayInfo(hoveredDay) : null

  // Handle click / drag along the scrubber track
  const handleSeek = useCallback((clientX: number) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const relativeX = clientX - rect.left
    const percent = Math.max(0, Math.min(1, relativeX / rect.width))
    const targetDay = Math.max(1, Math.min(14, Math.round(percent * 13) + 1))
    setSelectedDay(targetDay)
  }, [setSelectedDay])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeCleanupRef.current) {
      activeCleanupRef.current()
    }
    isDraggingRef.current = true
    handleSeek(e.clientX)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isDraggingRef.current) {
        handleSeek(moveEvent.clientX)
      }
    }

    const cleanup = () => {
      isDraggingRef.current = false
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', cleanup)
      window.removeEventListener('blur', cleanup)
      activeCleanupRef.current = null
    }

    activeCleanupRef.current = cleanup
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', cleanup)
    window.addEventListener('blur', cleanup)
  }

  // Handle touch events for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleSeek(e.touches[0].clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleSeek(e.touches[0].clientX)
    }
  }

  // Position percentage: Day 1 (0%) to Day 14 (100%)
  const thumbPercent = ((selectedDay - 1) / 13) * 100

  // Severity color calculation for current position
  const getSeverityStyle = (day: number) => {
    if (day >= 12) return { text: 'text-rose-700', bg: 'bg-rose-500', border: 'border-rose-300', badge: 'bg-rose-50 text-rose-800 border-rose-200' }
    if (day >= 8) return { text: 'text-amber-700', bg: 'bg-amber-500', border: 'border-amber-300', badge: 'bg-amber-50 text-amber-800 border-amber-200' }
    return { text: 'text-blue-700', bg: 'bg-blue-500', border: 'border-blue-300', badge: 'bg-blue-50 text-blue-800 border-blue-200' }
  }

  const activeStyle = getSeverityStyle(selectedDay)

  return (
    <section 
      aria-label="14-Day Decompensation Time-Travel Scrubber"
      className="w-full section-surface rounded-2xl p-3 sm:p-3.5 shadow-sm select-none border border-slate-200/80 flex flex-col gap-2.5 transition-all"
    >
      {/* Top Controls & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
        {/* Playback Controls Group */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (!isPlayingTimeline && selectedDay >= 14) {
                setSelectedDay(1)
              }
              setIsPlayingTimeline((prev) => !prev)
            }}
            aria-label={isPlayingTimeline ? 'Pause time-travel playback' : 'Play 14-day progression'}
            title={isPlayingTimeline ? 'Pause' : selectedDay >= 14 ? 'Play 14-day trajectory from Day -14' : 'Play 14-day decompensation trajectory'}
            className="w-8 h-8 rounded-full bg-[#1E2E44] hover:bg-[#0F172A] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            {isPlayingTimeline ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Speed Toggle */}
          <div 
            role="group"
            aria-label="Playback speed"
            className="flex items-center bg-[#F4F6FA] p-0.5 rounded-full border border-slate-200/80 text-[11px] font-semibold"
          >
            <button
              type="button"
              onClick={() => setTimelineSpeed(1)}
              aria-pressed={timelineSpeed === 1}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                timelineSpeed === 1 
                  ? 'bg-[#1E2E44] text-white shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1x
            </button>
            <button
              type="button"
              onClick={() => setTimelineSpeed(2)}
              aria-pressed={timelineSpeed === 2}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                timelineSpeed === 2 
                  ? 'bg-[#1E2E44] text-white shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2x
            </button>
          </div>

          {/* Jump Buttons */}
          <button
            type="button"
            onClick={() => setSelectedDay(1)}
            aria-label="Jump to Baseline (Day -14)"
            title="Reset to Day -14 Dry Baseline"
            className="px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-700 bg-[#F4F6FA] hover:bg-[#F8FAFD] border border-slate-200/70 transition-all cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="tabular">Day -14</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDay(8)}
            aria-label="Jump to Drift (Day -7)"
            title="Jump to Day -7 Sympathetic Drift Onset"
            className="px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-700 bg-[#F4F6FA] hover:bg-[#F8FAFD] border border-slate-200/70 transition-all cursor-pointer"
          >
            <span className="tabular">Day -7</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDay(12)}
            aria-label="Jump to Inflection (Day -3)"
            title="Jump to Day -3 Weight Inflection Point"
            className="px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-700 bg-[#F4F6FA] hover:bg-[#F8FAFD] border border-slate-200/70 transition-all cursor-pointer"
          >
            <span className="tabular">Day -3</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDay(14)}
            aria-label="Jump to Today (Day 0)"
            title="Jump to Day 0 (Today / Current Alert)"
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
          >
            <span className="tabular">Day 0 (Today)</span>
          </button>
        </div>

        {/* Current Active Date & Milestone Tag */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F6FA] border border-slate-200/80 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-[#0F172A] tabular">{activeInfo.date}</span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-700 tabular">{activeInfo.label}</span>
          </div>

          {activeInfo.milestone && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${activeStyle.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${activeStyle.bg}`} />
              <span>{activeInfo.milestone}</span>
            </span>
          )}
        </div>

        {/* Synchronized Telemetry Metrics */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-700 tabular">
          <div className="flex items-center gap-1">
            <span className="text-slate-600">Weight:</span>
            <strong className="font-bold text-[#0F172A]">{patient.trajectory.current_weight_lbs.toFixed(1)} lbs</strong>
            <span className={`text-[11px] font-semibold ${patient.trajectory.weight_delta_48h >= 3.0 ? 'text-rose-700' : 'text-slate-600'}`}>
              ({patient.trajectory.weight_delta_48h >= 0 ? `+${patient.trajectory.weight_delta_48h.toFixed(1)}` : patient.trajectory.weight_delta_48h.toFixed(1)})
            </span>
          </div>

          <div className="w-[1px] h-3 bg-slate-300" />

          <div className="flex items-center gap-1">
            <span className="text-slate-600">Resting HR:</span>
            <strong className={`font-bold ${patient.trajectory.resting_hr_bpm >= 80 ? 'text-rose-700' : 'text-slate-800'}`}>
              {patient.trajectory.resting_hr_bpm} bpm
            </strong>
            {patient.trajectory.hr_drift_bpm > 0 && (
              <span className="text-[12px] text-rose-700 font-semibold">(+{patient.trajectory.hr_drift_bpm})</span>
            )}
          </div>

          <div className="w-[1px] h-3 bg-slate-300" />

          <div className="hidden md:flex items-center gap-1">
            <span className="text-slate-600">Orthopnea:</span>
            <strong className={patient.symptoms.pillows_count >= 2 ? 'font-bold text-rose-700' : 'text-slate-800 font-semibold'}>
              {patient.symptoms.pillows_count} {patient.symptoms.pillows_count === 1 ? 'Pillow' : 'Pillows'}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Scrubber Track & Slotted Day Markers */}
      <div className="relative pt-3 pb-2 px-1">
        {/* Track Bar Container */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="relative w-full h-3 rounded-full cursor-pointer touch-none bg-slate-200/90 shadow-inner overflow-visible"
        >
          {/* Physiological Progression Gradient Fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-[width] duration-150 ease-out"
            style={{
              width: `${thumbPercent}%`,
              background: 'linear-gradient(90deg, #38BDF8 0%, #60A5FA 45%, #F59E0B 75%, #EF4444 100%)'
            }}
          />

          {/* 14 Discrete Day Tick Marks */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-0.5">
            {TIMELINE_14D_DETAILS.map((pt) => {
              const isPassed = pt.day <= selectedDay
              const isMilestone = Boolean(pt.milestone)
              return (
                <div
                  key={pt.day}
                  className="relative flex flex-col items-center"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      pt.day === selectedDay
                        ? 'w-2 h-2 bg-white ring-2 ring-blue-600'
                        : isMilestone
                        ? 'w-1.5 h-1.5 bg-slate-700'
                        : isPassed
                        ? 'bg-white/80'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* Draggable Specular Scrubber Handle (Thumb) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#1E2E44] shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-20"
            style={{ left: `${thumbPercent}%` }}
            role="slider"
            aria-valuemin={1}
            aria-valuemax={14}
            aria-valuenow={selectedDay}
            aria-valuetext={`${activeInfo.label} (${activeInfo.date}): ${patient.trajectory.current_weight_lbs} lbs, ${patient.trajectory.resting_hr_bpm} bpm`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                setSelectedDay((d) => Math.min(14, d + 1))
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                setSelectedDay((d) => Math.max(1, d - 1))
              }
            }}
          >
            <span className={`w-2 h-2 rounded-full ${activeStyle.bg}`} />
          </div>
        </div>

        {/* Day Labels and Milestone Anchors */}
        <div className="flex justify-between items-start mt-2 px-0.5 text-[11px] text-slate-600 font-sans tabular">
          {TIMELINE_14D_DETAILS.map((pt) => {
            const isSelected = pt.day === selectedDay

            return (
              <button
                key={pt.day}
                type="button"
                onClick={() => setSelectedDay(pt.day)}
                onMouseEnter={() => setHoveredDay(pt.day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`flex flex-col items-center text-center transition-colors cursor-pointer group focus-visible:outline-none ${
                  isSelected ? 'font-bold text-[#0F172A]' : 'hover:text-slate-900'
                }`}
              >
                <span className={isSelected ? 'text-blue-700 font-extrabold' : ''}>
                  {pt.relativeDay === 0 ? 'Day 0' : `-${Math.abs(pt.relativeDay)}d`}
                </span>
                <span className="text-[11px] text-slate-500 group-hover:text-slate-700 font-medium">
                  {pt.date.split(' ')[1]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Hover Micro Tooltip */}
        {hoveredInfo && hoveredDay !== null && hoveredDay !== selectedDay && (
          <div 
            className="absolute -top-12 z-30 transform -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#1E293B] text-white text-[11px] shadow-lg border border-white/20 pointer-events-none whitespace-nowrap animate-in fade-in duration-150"
            style={{ left: `${((hoveredDay - 1) / 13) * 100}%` }}
          >
            <span className="font-bold">{hoveredInfo.label} ({hoveredInfo.date}): </span>
            <span className="tabular">{hoveredInfo.raw_weight_lbs} lbs • {hoveredInfo.resting_hr_bpm} bpm</span>
            {hoveredInfo.milestone && (
              <span className="ml-1 text-amber-300 font-semibold">• {hoveredInfo.milestone}</span>
            )}
          </div>
        )}

      </div>

      {/* Clinical Context Footnote */}
      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5 line-clamp-1">
          <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-sans font-medium text-slate-800">
            {activeInfo.clinical_note}
          </span>
        </div>

        <span className="text-[11px] font-mono text-slate-600 shrink-0 ml-2">
          EWMA &alpha;=0.28 (60fps dynamic morph)
        </span>
      </div>
    </section>
  )
}
