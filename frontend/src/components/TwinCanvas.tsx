import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
  Activity,
  X,
  Plus,
  Minus,
  Maximize2,
  Heart,
  Wind,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  ShieldAlert,
  AlertOctagon
} from 'lucide-react'

import { useClinical, type AnatomicalLayer } from '../context/ClinicalContext'
import { getCardiacCycleDurationMs } from '../lib/timeline'
import { TimeTravelScrubber } from './TimeTravelScrubber'
import { ScenarioSelector } from './ScenarioSelector'

export const TwinCanvas: React.FC = () => {
  const {
    setActiveDrawer,
    setActiveOrgan,
    activeOrgan,
    activeCitation,
    setSpotlightedCard,
    patient,
    activeScenarioId,
    cdssVerdict,
    activeAnatomicalLayer,
    setActiveAnatomicalLayer
  } = useClinical()

  const [insightDismissed, setInsightDismissed] = useState(false)
  const [userZoomOffset, setUserZoomOffset] = useState(0)
  const [twinModel, setTwinModel] = useState<'full' | 'cardiorenal'>('full')

  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })
  const isAnimating = useRef(false)
  const rafId = useRef<number | null>(null)

  // Current resting heart rate and dynamic cycle duration
  const currentHr = patient.trajectory.resting_hr_bpm || 82
  const cardiacCycleMs = getCardiacCycleDurationMs(currentHr)
  const cardiacCycleSec = (cardiacCycleMs / 1000).toFixed(3)

  // Camera Zoom & Center based on activeOrgan & activeAnatomicalLayer
  const camera = useMemo(() => {
    if (activeAnatomicalLayer === 'vascular' || activeOrgan === 'cardio') {
      return {
        scale: 1.15 + userZoomOffset,
        translateY: '-2%',
        focusName: 'Cardiovascular Thoracic Plane'
      }
    }
    if (activeAnatomicalLayer === 'pulmonary' || activeOrgan === 'lungs') {
      return {
        scale: 1.20 + userZoomOffset,
        translateY: '-4%',
        focusName: 'Pulmonary Interstitial Window'
      }
    }
    if (activeAnatomicalLayer === 'renal' || activeOrgan === 'kidneys') {
      return {
        scale: 1.22 + userZoomOffset,
        translateY: '5%',
        focusName: 'Retroperitoneal Renal Bed'
      }
    }
    if (activeOrgan === 'genomics') {
      return {
        scale: 1.05 + userZoomOffset,
        translateY: '0%',
        focusName: 'Pharmacogenomic Whole-Body Twin'
      }
    }
    if (activeOrgan === 'metabolic') {
      return {
        scale: 1.10 + userZoomOffset,
        translateY: '1%',
        focusName: 'Metabolic & GDMT Axis'
      }
    }
    return {
      scale: 1.0 + userZoomOffset,
      translateY: '0%',
      focusName: 'Integrated Synthesis Stage'
    }
  }, [activeAnatomicalLayer, activeOrgan, userZoomOffset])

  const updateStageTransform = useCallback(() => {
    if (stageRef.current) {
      stageRef.current.style.transform = `perspective(1100px) rotateX(${currentRotation.current.x.toFixed(2)}deg) rotateY(${currentRotation.current.y.toFixed(2)}deg) scale(${camera.scale}) translateY(${camera.translateY})`
    }
  }, [camera.scale, camera.translateY])

  useEffect(() => {
    updateStageTransform()
  }, [updateStageTransform])

  const startSpringLoop = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true

    const loop = () => {
      const dx = targetRotation.current.x - currentRotation.current.x
      const dy = targetRotation.current.y - currentRotation.current.y

      if (Math.abs(dx) > 0.005 || Math.abs(dy) > 0.005) {
        currentRotation.current.x += dx * 0.12
        currentRotation.current.y += dy * 0.12
        updateStageTransform()
        rafId.current = requestAnimationFrame(loop)
      } else {
        currentRotation.current.x = targetRotation.current.x
        currentRotation.current.y = targetRotation.current.y
        updateStageTransform()
        isAnimating.current = false
      }
    }

    rafId.current = requestAnimationFrame(loop)
  }, [updateStageTransform])

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1

    targetRotation.current = {
      x: -normY * 4.0,
      y: normX * 4.0
    }
    startSpringLoop()
  }, [startSpringLoop])

  const handleMouseLeave = useCallback(() => {
    targetRotation.current = { x: 0, y: 0 }
    startSpringLoop()
  }, [startSpringLoop])

  const handleLayerSelect = (layer: AnatomicalLayer) => {
    setActiveAnatomicalLayer(layer)
    if (layer === 'vascular') {
      setActiveOrgan('cardio')
      setSpotlightedCard('cardio')
    } else if (layer === 'pulmonary') {
      setActiveOrgan('lungs')
      setSpotlightedCard('volume')
    } else if (layer === 'renal') {
      setActiveOrgan('kidneys')
      setSpotlightedCard('safety')
    } else {
      setSpotlightedCard(null)
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex-1 w-full h-full flex flex-col justify-between overflow-hidden bg-transparent select-none p-3 sm:p-4"
      aria-label="Arthur Pendelton Living Bio-Rhythmic Cardiorenal Twin"
      style={{
        ['--heart-cycle' as string]: `${cardiacCycleSec}s`
      }}
    >
      {/* ============================================================
         TOP BAR: PERSPECTIVE SELECTOR & ANATOMICAL LAYER PILLS
         ============================================================ */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-2">
        {/* Layer Inspection Selector Pills */}
        <div
          role="group"
          aria-label="Anatomical Layer Inspection"
          className="flex items-center gap-1 liquid-glass-pill p-1 rounded-full shadow-xs"
        >
          <button
            type="button"
            onClick={() => handleLayerSelect('full')}
            aria-pressed={activeAnatomicalLayer === 'full'}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${activeAnatomicalLayer === 'full'
                ? 'liquid-glass-pill-active'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Full Synthesis
          </button>

          <button
            type="button"
            onClick={() => handleLayerSelect('vascular')}
            aria-pressed={activeAnatomicalLayer === 'vascular'}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:outline-none ${activeAnatomicalLayer === 'vascular'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Heart className="w-3 h-3 text-rose-400" />
            <span>Vascular Congestion</span>
          </button>

          <button
            type="button"
            onClick={() => handleLayerSelect('pulmonary')}
            aria-pressed={activeAnatomicalLayer === 'pulmonary'}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:outline-none ${activeAnatomicalLayer === 'pulmonary'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Wind className="w-3 h-3 text-amber-300" />
            <span>Pulmonary Stasis</span>
          </button>

          <button
            type="button"
            onClick={() => handleLayerSelect('renal')}
            aria-pressed={activeAnatomicalLayer === 'renal'}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${activeAnatomicalLayer === 'renal'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>Renal Invariants</span>
          </button>
        </div>

        {/* Right Status Badges: Resting HR Pulse & Viewport Zoom */}
        <div className="flex items-center gap-2">
          {/* Bio-Rhythmic Cardiac Pulse Badge */}
          <div
            title={`Arthur's Resting Heart Rate: ${currentHr} bpm (${cardiacCycleMs}ms cardiac cycle)`}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F6FA]/90 border border-slate-200/80 shadow-2xs text-[11px] font-semibold text-slate-700 tabular"
          >
            <span className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute w-full h-full rounded-full bg-rose-500 animate-ping opacity-75" />
              <span className="w-2 h-2 rounded-full bg-rose-600" />
            </span>
            <span className="font-bold text-slate-900">{currentHr} bpm</span>
            <span className="text-slate-600 font-normal">({cardiacCycleMs}ms)</span>
          </div>

          {/* Benchmark Scenario Quick Selector */}
          <div className="hidden sm:block">
            <ScenarioSelector compact />
          </div>

          {/* Perspective Model Toggle */}
          <div
            role="group"
            aria-label="Model perspective"
            className="flex items-center gap-0.5 liquid-glass-pill p-0.5 rounded-full text-[11px] font-semibold"
          >
            <button
              type="button"
              onClick={() => setTwinModel('full')}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${twinModel === 'full' ? 'bg-[#1E2E44] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Full Body
            </button>
            <button
              type="button"
              onClick={() => setTwinModel('cardiorenal')}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${twinModel === 'cardiorenal' ? 'bg-[#1E2E44] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Torso Focus
            </button>
          </div>

          {/* Viewport Zoom Controls */}
          <div
            role="group"
            aria-label="Twin viewport zoom"
            className="flex items-center liquid-glass-pill p-0.5 rounded-full shadow-2xs"
          >
            <button
              type="button"
              onClick={() => setUserZoomOffset((z) => Math.min(z + 0.15, 0.45))}
              aria-label="Zoom in digital twin"
              title="Zoom In"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 hover:bg-[#F4F6FA] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setUserZoomOffset((z) => Math.max(z - 0.15, -0.25))}
              aria-label="Zoom out digital twin"
              title="Zoom Out"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 hover:bg-[#F4F6FA] transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setUserZoomOffset(0)}
              aria-label="Reset zoom"
              title="Reset Zoom"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 hover:bg-[#F4F6FA] transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Pandera Quarantine DLQ Alert Overlay */}
      {patient.quarantined && (
        <div className="z-30 mx-auto w-[94%] max-w-[460px] my-1 p-3 rounded-2xl bg-rose-950/85 backdrop-blur-md border border-rose-500/50 text-rose-100 shadow-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white tracking-tight">
                Pandera Data Contract Quarantine Active
              </span>
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-rose-900 text-rose-200 border border-rose-700/60 font-mono">
                DLQ #94021-D
              </span>
            </div>
            <p className="text-[11px] text-rose-200/90 mt-1 leading-snug">
              {patient.quarantine_reason || 'Cellular sensor artifact (+45.0 lbs) isolated to Dead-Letter Queue. Zero agent state pollution.'}
            </p>
          </div>
        </div>
      )}

      {/* Emergency 911 Red-Flag Alert Overlay */}
      {patient.red_flag_emergency && (
        <div className="z-30 mx-auto w-[94%] max-w-[460px] my-1 p-3 rounded-2xl bg-red-950/90 backdrop-blur-md border border-red-500 text-red-100 shadow-2xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white tracking-tight">
                Emergency 911 Red-Flag Bypass
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-800 text-white font-mono">
                CRITICAL TRIAGE
              </span>
            </div>
            <p className="text-[11px] text-red-200 mt-1 leading-snug">
              Patient reported acute crushing chest pain. System 1 decider bypassed agent mesh for immediate 911 dispatch.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
         CENTER LIVING BIO-RHYTHMIC 2.5D PARALLAX TWIN STAGE
         ============================================================ */}
      <div className="relative flex-1 w-full min-h-[280px] flex items-center justify-center overflow-hidden my-1">
        {/* Soft Studio Pedestal Shadow */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-80 h-8 rounded-[100%] pointer-events-none opacity-35 blur-[8px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.3) 0%, rgba(100, 116, 139, 0.35) 45%, transparent 75%)'
          }}
        />

        {/* 2.5D Damped Parallax Stage */}
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center twin-canvas"
          style={{
            transform: `perspective(1100px) rotateX(0deg) rotateY(0deg) scale(${camera.scale}) translateY(${camera.translateY})`
          }}
        >
          <div className="relative w-full max-w-[480px] h-[92%] flex items-center justify-center p-2">
            {/* Base Anatomical Transparent Model */}
            <img
              src={twinModel === 'full' ? '/assets/full_body_twin_transparent.png' : '/assets/cardiorenal_twin_transparent.png'}
              alt="Arthur Pendelton 3D Cardiorenal Digital Twin"
              className={`w-full h-full object-contain filter drop-shadow-[0_20px_45px_rgba(30,58,138,0.20)] select-none pointer-events-none transition-all duration-300 ${activeAnatomicalLayer === 'vascular'
                  ? 'brightness-95 contrast-105'
                  : activeAnatomicalLayer === 'pulmonary'
                    ? 'brightness-90 sepia-[0.15]'
                    : activeAnatomicalLayer === 'renal'
                      ? 'brightness-95 hue-rotate-15'
                      : 'brightness-100'
                }`}
            />

            {/* ============================================================
               DYNAMIC SVG LIVING BIO-RHYTHMIC SHADER OVERLAY
               Synchronized 82 bpm cardiac pulsation, aortic vascular flow,
               pulmonary transudation haze, and renal filtration flux
               ============================================================ */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 500 700"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Glowing SVG Filters */}
                <filter id="cardiacPulseGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="pulmonaryMoisture" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="renalFilterGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Vascular Blood Flow Gradient */}
                <linearGradient id="aorticFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#FB7185" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.95" />
                </linearGradient>

                {/* Pulmonary Fluid Transudation Gradient */}
                <radialGradient id="lungFluidHaze" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 1. PULMONARY FLUID STASIS LAYER */}
              <g
                className={`transition-opacity duration-300 ${activeAnatomicalLayer === 'pulmonary'
                    ? 'opacity-100'
                    : activeAnatomicalLayer === 'full'
                      ? 'opacity-70'
                      : 'opacity-20'
                  }`}
              >
                {/* Right Lung Infiltration Field */}
                <ellipse
                  cx="205"
                  cy="245"
                  rx="38"
                  ry="55"
                  fill="url(#lungFluidHaze)"
                  filter="url(#pulmonaryMoisture)"
                  className="pulmonary-transudation-active"
                />

                {/* Left Lung Infiltration Field */}
                <ellipse
                  cx="295"
                  cy="245"
                  rx="38"
                  ry="55"
                  fill="url(#lungFluidHaze)"
                  filter="url(#pulmonaryMoisture)"
                  className="pulmonary-transudation-active"
                />

                {/* Alveolar Interstitial Stasis Droplets / Rings */}
                {patient.symptoms.pillows_count >= 1 && (
                  <g stroke="#F59E0B" strokeWidth="1.2" fill="none" opacity="0.75">
                    <circle cx="198" cy="255" r="9" strokeDasharray="3 2" className="animate-ping" style={{ animationDuration: '3.6s' }} />
                    <circle cx="302" cy="255" r="9" strokeDasharray="3 2" className="animate-ping" style={{ animationDuration: '3.6s' }} />
                  </g>
                )}
              </g>

              {/* 2. VASCULAR CONGESTION & CARDIAC SILHOUETTE LAYER */}
              <g
                className={`transition-opacity duration-300 ${activeAnatomicalLayer === 'vascular'
                    ? 'opacity-100'
                    : activeAnatomicalLayer === 'full'
                      ? 'opacity-85'
                      : 'opacity-25'
                  }`}
              >
                {/* Aortic Arch & Thoracic Aorta Arterial Tree */}
                <path
                  d="M 250 205 C 238 185, 268 185, 255 235 L 253 340"
                  fill="none"
                  stroke="url(#aorticFlowGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6 3"
                  className="vascular-flow-active"
                />

                {/* Superior & Inferior Vena Cava (Venous Congestion) */}
                <path
                  d="M 262 195 L 262 335"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                  opacity="0.8"
                  className="vascular-flow-active"
                />

                {/* Cardiac Silhouette Pulsating Synchronized to Resting HR */}
                <g
                  transform="translate(250, 248)"
                  className="cardiac-bio-pulse"
                >
                  {/* Left Ventricular Halo Glow */}
                  <ellipse
                    cx="-2"
                    cy="2"
                    rx="26"
                    ry="28"
                    fill={currentHr >= 80 ? 'rgba(244, 63, 94, 0.45)' : 'rgba(56, 189, 248, 0.35)'}
                    filter="url(#cardiacPulseGlow)"
                  />
                  {/* Ventricular Bed Core */}
                  <path
                    d="M 0 -12 C 12 -24, 28 -8, 0 20 C -28 -8, -12 -24, 0 -12 Z"
                    fill={currentHr >= 80 ? '#F43F5E' : '#38BDF8'}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    opacity="0.92"
                  />
                </g>

                {/* Pulmonary Arteries & Veins radiating to lung hilum */}
                <path
                  d="M 235 240 Q 210 235 195 245"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="vascular-flow-active"
                />
                <path
                  d="M 265 240 Q 290 235 305 245"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="vascular-flow-active"
                />
              </g>

              {/* 3. RENAL INVARIANTS & GLOMERULAR FILTRATION LAYER */}
              <g
                className={`transition-opacity duration-300 ${activeAnatomicalLayer === 'renal'
                    ? 'opacity-100'
                    : activeAnatomicalLayer === 'full'
                      ? 'opacity-80'
                      : 'opacity-25'
                  }`}
              >
                {/* Left Kidney Silhouette & Filtration Envelope */}
                <g transform="translate(222, 345)">
                  <path
                    d="M 0 -14 C 10 -12, 14 0, 8 14 C 4 20, -6 18, -8 10 C -12 0, -8 -12, 0 -14 Z"
                    fill="rgba(16, 185, 129, 0.4)"
                    stroke="#10B981"
                    strokeWidth="1.8"
                    filter="url(#renalFilterGlow)"
                    className="renal-flux-active"
                  />
                  {/* Renal Artery Branch */}
                  <path
                    d="M 31 -5 L 10 -2"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                    className="vascular-flow-active"
                  />
                </g>

                {/* Right Kidney Silhouette & Filtration Envelope */}
                <g transform="translate(278, 345)">
                  <path
                    d="M 0 -14 C -10 -12, -14 0, -8 14 C -4 20, 6 18, 8 10 C 12 0, 8 -12, 0 -14 Z"
                    fill="rgba(16, 185, 129, 0.4)"
                    stroke="#10B981"
                    strokeWidth="1.8"
                    filter="url(#renalFilterGlow)"
                    className="renal-flux-active"
                  />
                  {/* Renal Artery Branch */}
                  <path
                    d="M -25 -5 L -8 -2"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                    className="vascular-flow-active"
                  />
                </g>
              </g>
            </svg>

            {/* ============================================================
               INTERACTIVE TACTILE CALLOUT CHIPS (HOTSPOTS)
               Coupled to active layers and timeline day values
               ============================================================ */}

            {/* 1. Heart / Cardiac Strain Hotspot */}
            <button
              type="button"
              aria-label={`Inspect Cardiac Strain: HR ${patient.trajectory.resting_hr_bpm} bpm (+${patient.trajectory.hr_drift_bpm} drift), open SBAR review`}
              onMouseEnter={() => setSpotlightedCard('cardio')}
              onMouseLeave={() => setSpotlightedCard(null)}
              className={`absolute z-20 group ${twinModel === 'full'
                  ? 'top-[27%] left-[50.5%]'
                  : 'top-[36%] left-[51%]'
                } -translate-x-1/2 -translate-y-1/2 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none rounded-full cursor-pointer text-left transition-transform`}
              onClick={() => {
                setActiveOrgan('cardio')
                setActiveDrawer('sbar')
              }}
            >
              <div className="relative flex items-center justify-center">
                {(activeOrgan === 'cardio' || activeAnatomicalLayer === 'vascular' || activeCitation === '1' || activeCitation === '3') && (
                  <span className="absolute w-9 h-9 rounded-full bg-rose-500/35 hemodynamic-ping" />
                )}
                <span className="w-6 h-6 rounded-full bg-rose-500/25 flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-400/60 shadow-sm" />
                </span>
              </div>

              {/* Liquid Glass Floating Callout Pill */}
              <div className={`absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-1.5 liquid-glass-dark px-3 py-1.5 rounded-full shadow-xl text-[11px] whitespace-nowrap transition-all group-hover:scale-105 ${activeOrgan === 'cardio' || activeAnatomicalLayer === 'vascular' || activeCitation === '3'
                  ? 'border-rose-400 ring-2 ring-rose-400/40'
                  : 'group-hover:border-rose-400/40'
                }`}>
                <span className="w-2.5 h-[1.5px] bg-rose-400 absolute -left-2.5 top-1/2 -translate-y-1/2" />
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
                <span className="font-bold text-white">Cardiac Strain:</span>
                <span className="text-rose-300 font-medium tabular">
                  HR {patient.trajectory.resting_hr_bpm} bpm (+{patient.trajectory.hr_drift_bpm} drift)
                </span>
              </div>
            </button>

            {/* 2. Lungs / Pulmonary Fluid Stasis Hotspot */}
            <button
              type="button"
              aria-label={`Inspect Pulmonary Stasis: ${patient.symptoms.pillows_count}-Pillow Orthopnea, open SMS conversation`}
              onMouseEnter={() => setSpotlightedCard('volume')}
              onMouseLeave={() => setSpotlightedCard(null)}
              className={`absolute z-20 group ${twinModel === 'full'
                  ? 'top-[25%] left-[43.5%]'
                  : 'top-[33%] left-[41%]'
                } -translate-x-1/2 -translate-y-1/2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-full cursor-pointer text-left transition-transform`}
              onClick={() => {
                setActiveOrgan('lungs')
                setActiveDrawer('sms')
              }}
            >
              <div className="relative flex items-center justify-center">
                {(activeOrgan === 'lungs' || activeAnatomicalLayer === 'pulmonary' || activeCitation === '2' || activeCitation === '5') && (
                  <span className="absolute w-9 h-9 rounded-full bg-blue-500/35 hemodynamic-ping" />
                )}
                <span className="w-5 h-5 rounded-full bg-blue-500/25 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-400/60 shadow-sm" />
                </span>
              </div>

              {/* Liquid Glass Floating Callout Pill */}
              <div className={`absolute right-7 top-1/2 -translate-y-1/2 flex items-center gap-1.5 liquid-glass-dark px-3 py-1.5 rounded-full shadow-xl text-[11px] whitespace-nowrap transition-all group-hover:scale-105 ${activeOrgan === 'lungs' || activeAnatomicalLayer === 'pulmonary' || activeCitation === '2'
                  ? 'border-blue-400 ring-2 ring-blue-400/40'
                  : 'group-hover:border-blue-400/40'
                }`}>
                <span className="w-2.5 h-[1.5px] bg-blue-400 absolute -right-2.5 top-1/2 -translate-y-1/2" />
                <Wind className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-bold text-white">Pulmonary Stasis:</span>
                <span className="text-blue-300 font-medium">
                  {patient.symptoms.pillows_count}-Pillow Orthopnea
                </span>
              </div>
            </button>

            {/* 3. Kidneys / Cardiorenal Invariant Hotspot */}
            <button
              type="button"
              aria-label={`Inspect Renal Invariant: eGFR ${patient.labs.egfr_mL_min}, K+ ${patient.labs.potassium_mEq_L.toFixed(1)} mEq/L, open CDSS Safety Engine`}
              onMouseEnter={() => setSpotlightedCard('safety')}
              onMouseLeave={() => setSpotlightedCard(null)}
              className={`absolute z-20 group ${twinModel === 'full'
                  ? 'top-[42%] left-[51%]'
                  : 'top-[48%] left-[53%]'
                } -translate-x-1/2 -translate-y-1/2 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded-full cursor-pointer text-left transition-transform`}
              onClick={() => {
                setActiveOrgan('kidneys')
                setActiveDrawer('theater')
              }}
            >
              <div className="relative flex items-center justify-center">
                {(activeOrgan === 'kidneys' || activeAnatomicalLayer === 'renal' || activeCitation === '4') && (
                  <span className="absolute w-9 h-9 rounded-full bg-emerald-500/35 hemodynamic-ping" />
                )}
                <span className="w-5 h-5 rounded-full bg-emerald-500/25 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/60 shadow-sm" />
                </span>
              </div>

              {/* Liquid Glass Floating Callout Pill */}
              <div className={`absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-1.5 liquid-glass-dark px-3 py-1.5 rounded-full shadow-xl text-[11px] whitespace-nowrap transition-all group-hover:scale-105 ${activeOrgan === 'kidneys' || activeAnatomicalLayer === 'renal' || activeCitation === '4'
                  ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                  : 'group-hover:border-emerald-400/40'
                }`}>
                <span className="w-2.5 h-[1.5px] bg-emerald-400 absolute -left-2.5 top-1/2 -translate-y-1/2" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Renal Invariant:</span>
                <span className="text-emerald-300 font-medium tabular">
                  eGFR {patient.labs.egfr_mL_min} • K+ {patient.labs.potassium_mEq_L.toFixed(1)} mEq/L
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Floating Quick Clinical Findings Chip (Lower Left - Away from Organ Pins) */}
        {!insightDismissed && (
          <div className="absolute bottom-3 left-3 z-20 w-[275px] liquid-glass-dark p-3 rounded-2xl shadow-xl border border-white/20 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-blue-500/25 text-blue-300 flex items-center justify-center border border-blue-400/40">
                  <Activity className="w-3 h-3 text-blue-300" />
                </div>
                <span className="font-bold text-[12.5px] leading-tight text-white">
                  <span>Hemodynamic Finding</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInsightDismissed(true)}
                aria-label="Dismiss insight card"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded-md focus-visible:ring-1 focus-visible:ring-blue-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <p className="mt-1.5 text-[11px] text-slate-200 leading-snug">
              {patient.quarantined ? (
                'Cellular sensor artifact (+45.0 lbs) isolated to Pandera DLQ. Diuretic escalation blocked.'
              ) : patient.red_flag_emergency ? (
                'Emergency 911 red-flag detected. System 1 decider bypassed agent mesh for immediate 911 triage.'
              ) : activeScenarioId === 'B' ? (
                'Splanchnic fluid shift: autonomic drift (+11 bpm) and 2-pillow orthopnea detected despite flat scale (+0.2 lbs).'
              ) : activeScenarioId === 'C' ? (
                'Transient dietary sodium spike (+2.4 lbs) with steady RHR (68 bpm). Watchful waiting; no titration needed.'
              ) : activeScenarioId === 'I' ? (
                'Adversarial prompt injection isolated to conversational thread; CDSS prescribing safeguards remain intact.'
              ) : !cdssVerdict.passed ? (
                cdssVerdict.status === 'GUIDE'
                  ? `${cdssVerdict.guide_action}`
                  : `Hard CDSS Veto: ${cdssVerdict.veto_reason}`
              ) : (
                <>Subclinical fluid accumulation (<span className="tabular font-semibold">+{patient.trajectory.weight_delta_48h.toFixed(1)} lbs</span>) detected. ACC/AHA titration protocol indicated.</>
              )}
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveDrawer('sbar')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <span>45s SBAR</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setActiveDrawer('sms')}
                className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-medium text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3 h-3 text-blue-300" />
                <span>{patient.name.split(' ')[0]} SMS</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
         BOTTOM DOCKED 14-DAY TIME-TRAVEL SCRUBBER DECK
         ============================================================ */}
      <div className="z-20 w-full pt-1">
        <TimeTravelScrubber />
      </div>
    </div>
  )
}
