import React, { useState, useRef, useCallback } from 'react'
import { 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Wind, 
  Heart, 
  Dna,
  Info,
  RotateCcw
} from 'lucide-react'
import { useClinical } from '../context/ClinicalContext'
import { TELEMETRY_14D_HISTORY, INITIAL_PATIENT_SNAPSHOT } from '../lib/api'
import { getTimelineDayInfo } from '../lib/timeline'

export const BiomarkerCalipers: React.FC = () => {
  const { 
    activeOrgan, 
    setActiveDrawer, 
    spotlightedCard, 
    expandedTelemetry, 
    setExpandedTelemetry,
    patient,
    cdssVerdict,
    selectedDay,
    setSelectedDay,
    caliperProbe,
    setCaliperProbe,
    resetCaliperProbe
  } = useClinical()

  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [hoveredTooltip, setHoveredTooltip] = useState<'cardio' | 'volume' | 'safety' | null>(null)

  const activeDayIndex = (hoveredDay || selectedDay || 14)
  const activeDayData = TELEMETRY_14D_HISTORY.find((d) => d.day === activeDayIndex) || TELEMETRY_14D_HISTORY[13]
  const currentDayInfo = getTimelineDayInfo(selectedDay)

  // Track refs for direct probing
  const trackRef1 = useRef<HTMLDivElement>(null)
  const trackRef2 = useRef<HTMLDivElement>(null)
  const trackRef3 = useRef<HTMLDivElement>(null)
  const isDraggingProbe = useRef<'potassium' | 'weight' | 'hr' | null>(null)

  // Direct Meter Probing & Dragging Handlers
  const updateProbeKFromClientX = useCallback((clientX: number) => {
    if (!trackRef3.current) return
    const rect = trackRef3.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const probedK = Number((3.0 + pct * 3.0).toFixed(1))
    setCaliperProbe({ metric: 'potassium', value: probedK })
  }, [setCaliperProbe])

  const updateProbeWeightFromClientX = useCallback((clientX: number) => {
    if (!trackRef2.current) return
    const rect = trackRef2.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const probedW = Number((pct * 5.0).toFixed(1))
    setCaliperProbe({ metric: 'weight', value: probedW })
  }, [setCaliperProbe])

  const updateProbeHrFromClientX = useCallback((clientX: number) => {
    if (!trackRef1.current) return
    const rect = trackRef1.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const probedHr = Math.round(55 + pct * 50)
    setCaliperProbe({ metric: 'hr', value: probedHr })
  }, [setCaliperProbe])

  const handleStartDragK = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    updateProbeKFromClientX(clientX)
    isDraggingProbe.current = 'potassium'

    const handleMove = (moveEvt: MouseEvent | TouchEvent) => {
      if (isDraggingProbe.current === 'potassium') {
        const x = 'touches' in moveEvt ? moveEvt.touches[0].clientX : moveEvt.clientX
        updateProbeKFromClientX(x)
      }
    }

    const handleEnd = () => {
      isDraggingProbe.current = null
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('touchend', handleEnd)
  }

  const handleStartDragWeight = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    updateProbeWeightFromClientX(clientX)
    isDraggingProbe.current = 'weight'

    const handleMove = (moveEvt: MouseEvent | TouchEvent) => {
      if (isDraggingProbe.current === 'weight') {
        const x = 'touches' in moveEvt ? moveEvt.touches[0].clientX : moveEvt.clientX
        updateProbeWeightFromClientX(x)
      }
    }

    const handleEnd = () => {
      isDraggingProbe.current = null
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('touchend', handleEnd)
  }

  const handleStartDragHr = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    updateProbeHrFromClientX(clientX)
    isDraggingProbe.current = 'hr'

    const handleMove = (moveEvt: MouseEvent | TouchEvent) => {
      if (isDraggingProbe.current === 'hr') {
        const x = 'touches' in moveEvt ? moveEvt.touches[0].clientX : moveEvt.clientX
        updateProbeHrFromClientX(x)
      }
    }

    const handleEnd = () => {
      isDraggingProbe.current = null
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('touchend', handleEnd)
  }

  // Dynamic Tile 1 config based on active organ
  const getOrganTileConfig = () => {
    switch (activeOrgan) {
      case 'lungs':
        return {
          title: 'Pulmonary & Respiratory Bed',
          subtitle: 'Orthopnea & Flow Velocity',
          icon: <Wind className="w-3.5 h-3.5 text-blue-500" />,
          score: patient.symptoms.pillows_count >= 2 ? 44 : 85,
          statusLabel: patient.symptoms.pillows_count >= 2 ? 'Suboptimal' : 'Normal',
          statusColor: patient.symptoms.pillows_count >= 2 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
          dotColor: patient.symptoms.pillows_count >= 2 ? 'bg-amber-500' : 'bg-emerald-500',
          caliperPercent: patient.symptoms.pillows_count >= 2 ? 44 : 80,
          caliperGradient: 'linear-gradient(90deg, #FDE68A 0%, #F59E0B 100%)',
          minLabel: '250 L/min',
          maxLabel: '500 L/min',
          leftDetail: (
            <span>
              PEF: <strong className="text-slate-800 font-semibold tabular">{patient.organ_telemetry.lungs.pef_l_min} L/min</strong>
            </span>
          ),
          rightDetail: (
            <span>
              Orthopnea: <strong className={patient.symptoms.pillows_count >= 2 ? 'text-rose-700 font-semibold' : 'text-slate-800 font-semibold'}>{patient.symptoms.pillows_count} Pillows</strong>
            </span>
          )
        }
      case 'kidneys':
        return {
          title: 'Cardiorenal Filtration & K+',
          subtitle: 'Filtration Gradient & Safety Window',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
          score: 68,
          statusLabel: 'CKD 3a Stable',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          dotColor: 'bg-emerald-500',
          caliperPercent: 60,
          caliperGradient: 'linear-gradient(90deg, #93C5FD 0%, #34D399 50%, #10B981 100%)',
          minLabel: '15 mL/min',
          maxLabel: '90 mL/min',
          leftDetail: (
            <span>
              eGFR: <strong className="text-slate-800 font-semibold tabular">{patient.labs.egfr_mL_min} mL/min</strong>
            </span>
          ),
          rightDetail: (
            <span>
              Creatinine: <strong className="text-slate-800 font-semibold tabular">{patient.labs.creatinine_mg_dL} mg/dL</strong>
            </span>
          )
        }
      case 'genomics':
        return {
          title: 'Pharmacogenomics (CYP2C9)',
          subtitle: 'Loop Diuretic Hepatic Clearance',
          icon: <Dna className="w-3.5 h-3.5 text-blue-600" />,
          score: 72,
          statusLabel: 'Intermediate',
          statusColor: 'text-blue-800 bg-blue-50 border-blue-200',
          dotColor: 'bg-blue-600',
          caliperPercent: 55,
          caliperGradient: 'linear-gradient(90deg, #BFDBFE 0%, #60A5FA 50%, #2563EB 100%)',
          minLabel: 'Poor *3/*3',
          maxLabel: 'Ultra *1/*1',
          leftDetail: (
            <span>
              CYP2C9: <strong className="text-slate-800 font-semibold">*1/*3 Carrier</strong>
            </span>
          ),
          rightDetail: (
            <span>
              VKORC1: <strong className="text-slate-800 font-semibold">A/G Elevated</strong>
            </span>
          )
        }
      case 'metabolic':
        return {
          title: 'GDMT Pharmacotherapy Regimen',
          subtitle: '4-Pillar Neurohormonal Blockade',
          icon: <Heart className="w-3.5 h-3.5 text-blue-600" />,
          score: 82,
          statusLabel: '4 of 4 Pillars Active',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          dotColor: 'bg-emerald-500',
          caliperPercent: 82,
          caliperGradient: 'linear-gradient(90deg, #93C5FD 0%, #60A5FA 50%, #10B981 100%)',
          minLabel: 'Sub-Target',
          maxLabel: 'Optimal GDMT',
          leftDetail: (
            <span>
              Beta+ARNI+SGLT2: <strong className="text-slate-800 font-semibold tabular">On Target</strong>
            </span>
          ),
          rightDetail: (
            <span>
              Loop Titration: <strong className="text-blue-700 font-semibold tabular">80mg PO x 3d</strong>
            </span>
          )
        }
      case 'cardio':
      default: {
        const hr = patient.trajectory.resting_hr_bpm
        const isCritical = hr >= 80
        const cardioScore = Math.max(20, Math.round(85 - ((hr - 68) / 20) * 45))
        const pct = Math.min(Math.max(((hr - 55) / (105 - 55)) * 100, 2), 98)

        return {
          title: 'Cardiovascular Hemodynamics',
          subtitle: 'Ejection Fraction & Sympathetic Tone',
          icon: <Heart className="w-3.5 h-3.5 text-rose-500" />,
          score: cardioScore,
          statusLabel: isCritical ? 'Critical Drift' : hr > 72 ? 'Mild Drift' : 'Baseline Safe',
          statusColor: isCritical ? 'text-rose-700 bg-rose-50 border-rose-200' : hr > 72 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
          dotColor: isCritical ? 'bg-rose-500' : hr > 72 ? 'bg-amber-500' : 'bg-emerald-500',
          caliperPercent: pct,
          caliperGradient: 'linear-gradient(90deg, #34D399 0%, #FBBF24 55%, #FCA5A5 100%)',
          minLabel: '55 bpm (Low)',
          maxLabel: '105 bpm (Peak)',
          leftDetail: (
            <span>
              Resting HR: <strong className={`${isCritical ? 'text-rose-700' : 'text-slate-800'} font-semibold tabular`}>{hr} bpm ({patient.trajectory.hr_drift_bpm >= 0 ? `+${patient.trajectory.hr_drift_bpm}` : patient.trajectory.hr_drift_bpm})</strong>
            </span>
          ),
          rightDetail: (
            <span>
              EF: <strong className="text-slate-800 font-semibold tabular">32%</strong>
            </span>
          )
        }
      }
    }
  }

  const organTile = getOrganTileConfig()

  // Dynamic calculations for Tile 2 (Volume & Congestion)
  const weightDelta48h = patient.trajectory.weight_delta_48h
  const zScore = patient.trajectory.z_score
  const volumeScore = Math.max(10, Math.round(100 - (weightDelta48h / 5.0) * 60 - (zScore >= 2.0 ? 12 : 0)))

  // SVG scaling functions for 14-day Telemetry Trajectory Chart
  const svgWidth = 680
  const svgHeight = 140
  const padLeft = 45
  const padRight = 35
  const chartWidth = svgWidth - padLeft - padRight // 600px

  const getPtX = (dayIndex: number) => padLeft + (dayIndex * chartWidth) / 13
  
  const minW = 179.0
  const maxW = 185.2
  const getPtYWeight = (w: number) => 118 - ((w - minW) / (maxW - minW)) * 100

  const minHR = 60
  const maxHR = 90
  const getPtYHR = (hr: number) => 122 - ((hr - minHR) / (maxHR - minHR)) * 98

  const upperCorridorPoints = TELEMETRY_14D_HISTORY.map((pt, i) => `${getPtX(i)},${getPtYWeight(pt.corridor_upper_lbs)}`).join(' L ')
  const lowerCorridorPoints = [...TELEMETRY_14D_HISTORY].reverse().map((pt, i) => `${getPtX(13 - i)},${getPtYWeight(pt.corridor_lower_lbs)}`).join(' L ')
  const dynamicCorridorPath = `M ${upperCorridorPoints} L ${lowerCorridorPoints} Z`

  const dynamicEwmaPolyline = TELEMETRY_14D_HISTORY.map((pt, i) => `${getPtX(i).toFixed(1)},${getPtYWeight(pt.ewma_weight_lbs).toFixed(1)}`).join(' ')
  const dynamicHrPolyline = TELEMETRY_14D_HISTORY.map((pt, i) => `${getPtX(i).toFixed(1)},${getPtYHR(pt.resting_hr_bpm).toFixed(1)}`).join(' ')

  const actualK = INITIAL_PATIENT_SNAPSHOT.labs.potassium_mEq_L
  const actualKPct = Math.min(Math.max(((actualK - 3.0) / (6.0 - 3.0)) * 100, 2), 98)
  const probedKPct = caliperProbe.metric === 'potassium' && caliperProbe.value !== null 
    ? Math.min(Math.max(((caliperProbe.value - 3.0) / (6.0 - 3.0)) * 100, 2), 98) 
    : null

  const actualWeightDelta = currentDayInfo.weight_delta_lbs
  const actualWeightPct = Math.min(Math.max((actualWeightDelta / 5.0) * 100, 2), 98)
  const probedWeightPct = caliperProbe.metric === 'weight' && caliperProbe.value !== null 
    ? Math.min(Math.max((caliperProbe.value / 5.0) * 100, 2), 98) 
    : null

  const actualHr = currentDayInfo.resting_hr_bpm
  const actualHrPct = Math.min(Math.max(((actualHr - 55) / (105 - 55)) * 100, 2), 98)
  const probedHrPct = caliperProbe.metric === 'hr' && caliperProbe.value !== null 
    ? Math.min(Math.max(((caliperProbe.value - 55) / (105 - 55)) * 100, 2), 98) 
    : null

  return (
    <div className="w-full section-surface rounded-2xl p-4 sm:p-5 select-none transition-all duration-200 flex flex-col gap-3.5">
      {/* Header without kickers */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center border border-blue-200/60 shadow-2xs">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-[15px] font-bold text-[#0F172A] tracking-tight">
            Physiological Range Calipers
          </h2>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/70 px-2.5 py-0.5 rounded-full border border-slate-300/60">
            Coupled to {activeOrgan.charAt(0).toUpperCase() + activeOrgan.slice(1)} Rail
          </span>
        </div>

        <div className="flex items-center gap-2">
          {caliperProbe.metric !== null && (
            <button
              type="button"
              onClick={resetCaliperProbe}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Probe</span>
            </button>
          )}

          {/* Toggle inline trajectory corridor */}
          <button
            type="button"
            onClick={() => setExpandedTelemetry((prev) => !prev)}
            aria-expanded={expandedTelemetry}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              expandedTelemetry
                ? 'bg-[#1E2E44] text-white border-transparent shadow-xs'
                : 'bg-[#F4F6FA] text-slate-700 border-slate-200/80 hover:bg-[#F8FAFD] hover:text-slate-900 shadow-2xs'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>14d Trajectory Corridor</span>
            {expandedTelemetry ? (
              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* 3 Continuous Range Caliper Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Tile 1: Dynamically adapted to Active Organ */}
        <div
          onClick={() => {
            if (activeOrgan === 'cardio' || activeOrgan === 'metabolic') setActiveDrawer('sbar')
            else if (activeOrgan === 'lungs') setActiveDrawer('sms')
            else setActiveDrawer('theater')
          }}
          className={`relative flex flex-col justify-between tile-surface p-4 rounded-xl cursor-pointer group transition-all ${
            spotlightedCard === 'cardio'
              ? 'ring-2 ring-blue-500 shadow-md bg-blue-50/30'
              : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#F4F6FA] flex items-center justify-center shadow-2xs border border-white/90">
                {organTile.icon}
              </div>
              <span className="text-[13px] font-bold text-[#1E293B] tracking-tight">
                {organTile.title}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setHoveredTooltip((prev) => (prev === 'cardio' ? null : 'cardio'))
                }}
                title="Sensor & Calibration Details"
                className="w-5 h-5 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Info className="w-3 h-3" />
              </button>
              <div className="w-5 h-5 rounded-full bg-[#F4F6FA] border border-white shadow-2xs flex items-center justify-center text-slate-500 group-hover:text-slate-800 transition-colors">
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-3">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[22px] font-extrabold text-[#0F172A] tabular leading-none">
                {organTile.score}
              </span>
              <span className="text-[12px] font-medium text-slate-500 tabular">/100</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${organTile.statusColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${organTile.dotColor}`} />
              {organTile.statusLabel}
            </span>
          </div>

          {/* Interactive Continuous Pastel Range Caliper with Direct Probing */}
          <div className="mt-3">
            <div
              ref={trackRef1}
              onMouseDown={handleStartDragHr}
              onTouchStart={handleStartDragHr}
              onMouseEnter={() => setHoveredTooltip('cardio')}
              onMouseLeave={() => setHoveredTooltip(null)}
              title="Click or drag to probe resting HR safety boundary"
              className="w-full h-2 rounded-full relative overflow-visible border border-slate-200/60 shadow-inner cursor-crosshair group/meter touch-none"
              style={{ background: organTile.caliperGradient }}
            >
              {/* Telemetry Needle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#1E2E44] rounded-full shadow-sm ring-1 ring-white"
                style={{ left: `${actualHrPct}%` }}
              />

              {/* Probe Needle if Active */}
              {probedHrPct !== null && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-[4px] h-5 bg-blue-600 rounded-full shadow-sm ring-2 ring-white z-10"
                  style={{ left: `${probedHrPct}%` }}
                />
              )}
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-600 mt-1 tabular">
              <span>{organTile.minLabel}</span>
              {caliperProbe.metric === 'hr' ? (
                <span className="text-blue-700 font-bold">Probe: {caliperProbe.value} bpm</span>
              ) : (
                <span className="text-slate-500">Drag or click to probe</span>
              )}
              <span>{organTile.maxLabel}</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between">
            {organTile.leftDetail}
            {organTile.rightDetail}
          </div>

          {/* Tactile Sensor Accreditation Tooltip Card */}
          {hoveredTooltip === 'cardio' && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute -top-24 left-2 right-2 z-30 p-2.5 rounded-xl bg-[#1E293B] text-white text-[10.5px] shadow-2xl border border-white/20 animate-in fade-in"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Continuous Nocturnal Optical PPG</span>
                <span className="text-emerald-400 font-normal">FDA 510(k) Cleared</span>
              </div>
              <div className="mt-1 text-slate-300 space-y-0.5">
                <div>Sensor: <strong className="text-white">PHA-WEAR-4902</strong> • Epoch: <strong className="text-white">Today 06:15 EDT</strong></div>
                <div>Methodology: <strong className="text-white">Dual-Vector Autonomic Drift Correlation</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Tile 2: Volume & Congestion Velocity (DuckDB Telemetry Corridor) */}
        <div
          onClick={() => setActiveDrawer('sms')}
          className={`relative flex flex-col justify-between tile-surface p-4 rounded-xl cursor-pointer group transition-all ${
            spotlightedCard === 'volume'
              ? 'ring-2 ring-amber-500 shadow-md bg-amber-50/30'
              : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#F4F6FA] flex items-center justify-center shadow-2xs border border-white/90">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-[13px] font-bold text-[#1E293B] tracking-tight">
                Volume & Congestion
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setHoveredTooltip((prev) => (prev === 'volume' ? null : 'volume'))
                }}
                onMouseEnter={() => setHoveredTooltip('volume')}
                onMouseLeave={() => setHoveredTooltip(null)}
                title="Scale & Algorithm Details"
                className="w-5 h-5 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Info className="w-3 h-3" />
              </button>
              <div className="w-5 h-5 rounded-full bg-[#F4F6FA] border border-white shadow-2xs flex items-center justify-center text-slate-500 group-hover:text-slate-800 transition-colors">
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-3">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[22px] font-extrabold text-[#0F172A] tabular leading-none">
                {volumeScore}
              </span>
              <span className="text-[12px] font-medium text-slate-500 tabular">/100</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border text-amber-700 bg-amber-50 border-amber-200 flex items-center gap-1.5 tabular">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {weightDelta48h >= 3.0 ? `Suboptimal (+${weightDelta48h.toFixed(1)} lbs)` : `Normal (+${weightDelta48h.toFixed(1)} lbs)`}
            </span>
          </div>

          {/* Continuous Pastel Range Caliper with Direct Probing */}
          <div className="mt-3">
            <div
              ref={trackRef2}
              onMouseDown={handleStartDragWeight}
              onTouchStart={handleStartDragWeight}
              onMouseEnter={() => setHoveredTooltip('volume')}
              onMouseLeave={() => setHoveredTooltip(null)}
              title="Click or drag to probe 48h weight gain inflection"
              className="w-full h-2 rounded-full relative overflow-visible border border-slate-200/60 shadow-inner cursor-crosshair group/meter touch-none"
              style={{ background: 'linear-gradient(90deg, #FDE68A 0%, #F59E0B 75%, #DC2626 100%)' }}
            >
              {/* Telemetry Needle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#1E2E44] rounded-full shadow-sm ring-1 ring-white"
                style={{ left: `${actualWeightPct}%` }}
              />

              {/* Probe Needle if Active */}
              {probedWeightPct !== null && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-[4px] h-5 bg-amber-600 rounded-full shadow-sm ring-2 ring-white z-10"
                  style={{ left: `${probedWeightPct}%` }}
                />
              )}
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-600 mt-1 tabular">
              <span>0 lbs (Base)</span>
              {caliperProbe.metric === 'weight' ? (
                <span className="text-amber-600 font-bold">Probe: +{caliperProbe.value} lbs</span>
              ) : (
                <span className="text-slate-500">Drag or click to probe</span>
              )}
              <span>+5.0 lbs (Redline)</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              48h Weight: <strong className="text-amber-700 font-semibold tabular">+{weightDelta48h.toFixed(1)} lbs</strong>
            </span>
            <span>
              EWMA Anomaly: <strong className="text-slate-800 font-semibold tabular">+{zScore.toFixed(2)}&sigma;</strong>
            </span>
          </div>

          {/* Tactile Sensor Accreditation Tooltip Card */}
          {hoveredTooltip === 'volume' && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute -top-24 left-2 right-2 z-30 p-2.5 rounded-xl bg-[#1E293B] text-white text-[10.5px] shadow-2xl border border-white/20 animate-in fade-in"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Cat-M1 Cellular Scale Telemetry</span>
                <span className="text-emerald-400 font-normal">FCC & FDA Class II</span>
              </div>
              <div className="mt-1 text-slate-300 space-y-0.5">
                <div>Device: <strong className="text-white">CS-88219</strong> • Received: <strong className="text-white">Today 07:42 EDT</strong></div>
                <div>Pipeline: <strong className="text-white">DuckDB SQL-on-FHIR • EWMA alpha=0.28 (Z=+{zScore.toFixed(2)})</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Tile 3: CDSS Safety Window (Potassium & Hemodynamic Gate) */}
        <div
          onClick={() => setActiveDrawer('theater')}
          className={`relative flex flex-col justify-between tile-surface p-4 rounded-xl cursor-pointer group transition-all ${
            spotlightedCard === 'safety'
              ? 'ring-2 ring-emerald-500 shadow-md bg-emerald-50/30'
              : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#F4F6FA] flex items-center justify-center shadow-2xs border border-white/90">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-[13px] font-bold text-[#1E293B] tracking-tight">
                CDSS Safety Window
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setHoveredTooltip((prev) => (prev === 'safety' ? null : 'safety'))
                }}
                onMouseEnter={() => setHoveredTooltip('safety')}
                onMouseLeave={() => setHoveredTooltip(null)}
                title="Lab & Invariant Details"
                className="w-5 h-5 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Info className="w-3 h-3" />
              </button>
              <div className="w-5 h-5 rounded-full bg-[#F4F6FA] border border-white shadow-2xs flex items-center justify-center text-slate-500 group-hover:text-slate-800 transition-colors">
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-3">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[22px] font-extrabold text-[#0F172A] tabular leading-none">
                {cdssVerdict.passed ? '94' : cdssVerdict.status === 'GUIDE' ? '48' : '18'}
              </span>
              <span className="text-[12px] font-medium text-slate-500 tabular">/100</span>
            </div>
            {cdssVerdict.passed ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border text-emerald-700 bg-emerald-50 border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Optimal Pass (1.8ms)
              </span>
            ) : cdssVerdict.status === 'GUIDE' ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border text-amber-700 bg-amber-50 border-amber-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Guide: STAT BMP
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border text-rose-700 bg-rose-50 border-rose-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Hard Veto Cliff
              </span>
            )}
          </div>

          {/* Continuous Pastel Range Caliper with Direct Probing */}
          <div className="mt-3">
            <div
              ref={trackRef3}
              onMouseDown={handleStartDragK}
              onTouchStart={handleStartDragK}
              onMouseEnter={() => setHoveredTooltip('safety')}
              onMouseLeave={() => setHoveredTooltip(null)}
              title="Click or drag to test hypothetical Serum K+ safety threshold"
              className="w-full h-2 rounded-full relative overflow-visible border border-slate-200/60 shadow-inner cursor-crosshair group/meter touch-none"
              style={{
                background:
                  'linear-gradient(90deg, #F87171 0%, #A7F3D0 18%, #10B981 70%, #F87171 73%, #DC2626 100%)'
              }}
            >
              {/* Telemetry Needle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#1E2E44] rounded-full shadow-sm ring-1 ring-white"
                style={{ left: `${actualKPct}%` }}
              />

              {/* Probe Needle if Active */}
              {probedKPct !== null && (
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-[4px] h-5 ${
                    caliperProbe.value! >= 5.2 || caliperProbe.value! < 3.5 ? 'bg-rose-600' : 'bg-emerald-600'
                  } rounded-full shadow-sm ring-2 ring-white z-10`}
                  style={{ left: `${probedKPct}%` }}
                />
              )}
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-600 mt-1 tabular">
              <span>&lt;3.5 Veto</span>
              {caliperProbe.metric === 'potassium' ? (
                <span className={caliperProbe.value! >= 5.2 || caliperProbe.value! < 3.5 ? 'text-rose-700 font-extrabold' : 'text-emerald-700 font-bold'}>
                  Probe: {caliperProbe.value} mEq/L {caliperProbe.value! >= 5.2 ? '(Veto)' : caliperProbe.value! < 3.5 ? '(Hypo-K)' : '(Pass)'}
                </span>
              ) : (
                <span className="text-slate-500">Drag or click to probe</span>
              )}
              <span className="text-rose-700 font-bold">&ge;5.2 Cliff</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              Serum K+: <strong className={patient.labs.potassium_mEq_L >= 5.2 ? 'text-rose-700 font-semibold tabular' : patient.labs.potassium_mEq_L < 3.5 ? 'text-amber-700 font-semibold tabular' : 'text-emerald-700 font-semibold tabular'}>{patient.labs.potassium_mEq_L.toFixed(1)} mEq/L</strong>
            </span>
            <span>
              {patient.labs.is_lab_stale ? (
                <>Specimen: <strong className="text-amber-700 font-semibold">18d (Stale)</strong></>
              ) : (
                <>Perfusion SBP: <strong className="text-slate-800 font-semibold tabular">{patient.trajectory.blood_pressure_sys} mmHg</strong></>
              )}
            </span>
          </div>

          {/* Tactile Sensor Accreditation Tooltip Card */}
          {hoveredTooltip === 'safety' && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute -top-24 left-2 right-2 z-30 p-2.5 rounded-xl bg-[#1E293B] text-white text-[10.5px] shadow-2xl border border-white/20 animate-in fade-in"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Verified Fasting Serum BMP</span>
                <span className="text-emerald-400 font-normal">CLIA Accredited</span>
              </div>
              <div className="mt-1 text-slate-300 space-y-0.5">
                <div>Lab: <strong className="text-white">Quest Diagnostics (QD-9921)</strong> • LOINC: <strong className="text-white">2823-3</strong></div>
                <div>Invariant Gate: <strong className="text-white">[3.5 - 5.1 mEq/L] Safe Window (Cliff &ge;5.2)</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
         EXPANDABLE INLINE TRAJECTORY CORRIDOR
         14-day smoothed EWMA weight velocity (alpha=0.28), Z-score corridor, and resting HR drift
         ============================================================ */}
      {expandedTelemetry && (
        <div className="mt-2 p-4 rounded-xl tile-surface border border-slate-200/80 shadow-xs flex flex-col gap-3.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#0F172A]">
                14-Day Decompensation Trajectory Corridor
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                EWMA &alpha;=0.28 Smoothing
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>EWMA Weight (lbs)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Resting HR (bpm)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-xs bg-blue-100 border border-blue-300" />
                <span>&plusmn;1.96&sigma; Safe Envelope</span>
              </div>
            </div>
          </div>

          {/* SVG Trajectory Chart with True Mathematical Coordinate Mapping */}
          <div className="relative w-full h-44 bg-[#F4F6FA]/90 rounded-lg p-2 border border-slate-200/60">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.08" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padLeft} y1="20" x2={svgWidth - padRight} y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1={padLeft} y1="56" x2={svgWidth - padRight} y2="56" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1={padLeft} y1={getPtYWeight(181.0)} x2={svgWidth - padRight} y2={getPtYWeight(181.0)} stroke="#CBD5E1" strokeWidth="1" />

              {/* Baseline Reference Label */}
              <text x={padLeft + 5} y={getPtYWeight(181.0) - 4} fill="#64748B" fontSize="9" fontFamily="monospace" className="tabular">
                Baseline Dry Weight 181.0 lbs
              </text>
              <text x={padLeft + 5} y="16" fill="#EF4444" fontSize="9" fontFamily="monospace" className="tabular">
                +3.0 lbs Escalation Threshold (Z &ge; +2.0)
              </text>

              {/* Shaded Confidence Envelope Corridor (Days 1 to 14) */}
              <path d={dynamicCorridorPath} fill="url(#corridorGrad)" />

              {/* Interactive Vertical Crosshair Guide */}
              {(hoveredDay || selectedDay) && (
                <line
                  x1={getPtX((hoveredDay || selectedDay) - 1)}
                  y1="10"
                  x2={getPtX((hoveredDay || selectedDay) - 1)}
                  y2={svgHeight - 15}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}

              {/* 14d Resting Heart Rate Line */}
              <polyline
                fill="none"
                stroke="#F43F5E"
                strokeWidth="1.75"
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={dynamicHrPolyline}
              />

              {/* 14d EWMA Weight Velocity Line */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={dynamicEwmaPolyline}
              />

              {/* Dynamic Interactive Data Points for Weight and Resting HR */}
              {TELEMETRY_14D_HISTORY.map((pt, i) => {
                const cx = getPtX(i)
                const wy = getPtYWeight(pt.ewma_weight_lbs)
                const hry = getPtYHR(pt.resting_hr_bpm)
                const rawY = getPtYWeight(pt.raw_weight_lbs)
                const isSelected = selectedDay === pt.day
                const isHovered = hoveredDay === pt.day || isSelected
                const isAnomaly = pt.z_score >= 2.0

                return (
                  <g 
                    key={pt.day} 
                    className="cursor-pointer" 
                    onClick={() => setSelectedDay(pt.day)}
                    onMouseEnter={() => setHoveredDay(pt.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Raw Scale Weight Tick / Scatter Dot */}
                    <circle
                      cx={cx}
                      cy={rawY}
                      r="2"
                      fill="#94A3B8"
                      opacity="0.85"
                    />

                    {/* Resting HR Dot */}
                    <circle
                      cx={cx}
                      cy={hry}
                      r={isHovered ? 4 : 2.5}
                      fill="#F43F5E"
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />

                    {/* EWMA Anomaly Warning Radar Ring */}
                    {isAnomaly && (
                      <circle cx={cx} cy={wy} r="7" fill="#F43F5E" opacity="0.3" className="animate-ping" />
                    )}

                    {/* EWMA Main Weight Dot */}
                    <circle
                      cx={cx}
                      cy={wy}
                      r={isHovered ? 5.5 : 3.5}
                      fill={isAnomaly ? '#EF4444' : '#2563EB'}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? '2' : '1.5'}
                    />
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Interactive Inspection Point Ribbon */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#F4F6FA] rounded-lg border border-slate-200/80 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A]">{activeDayData.date} Inspection:</span>
              <span className="text-slate-500 tabular">Day {activeDayData.day} of 14</span>
            </div>

            <div className="flex items-center gap-4 tabular">
              <span>
                Raw Scale: <strong className="text-slate-800">{activeDayData.raw_weight_lbs.toFixed(1)} lbs</strong>
              </span>
              <span>
                EWMA Weight: <strong className="text-blue-700">{activeDayData.ewma_weight_lbs.toFixed(2)} lbs</strong>
              </span>
              <span>
                Resting Pulse: <strong className="text-rose-700">{activeDayData.resting_hr_bpm} bpm</strong>
              </span>
              <span>
                Z-Score: <strong className={activeDayData.z_score >= 2.0 ? 'text-rose-700 font-extrabold' : 'text-slate-800'}>
                  {activeDayData.z_score >= 0 ? `+${activeDayData.z_score.toFixed(2)}` : activeDayData.z_score.toFixed(2)}&sigma;
                </strong>
              </span>
              {activeDayData.z_score >= 2.0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                  p &lt; 0.01 Statistical Outlier
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
