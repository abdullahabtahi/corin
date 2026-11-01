import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react'
import type { 
  PatientSnapshot, 
  CdssSafetyVerdict, 
  SmsMessage, 
  SwarmTraceNode,
  FhirMedicationRequest,
  FhirServiceRequest,
  AnatomicalLayer,
  CaliperProbe,
  ClinicalWorkspace,
  CohortPatientRecord,
  ClinicalScenario,
  OrderLifecycleState,
  ExtractedSymptom
} from '../types/clinical'
import { 
  INITIAL_SMS_THREAD, 
  INITIAL_SWARM_TRACE, 
  PROVENANCE_CITATIONS,
  COHORT_250_BENEFICIARIES,
  CorinAPI 
} from '../lib/api'
import { 
  getScenarioById, 
  extractSymptomsFromText 
} from '../lib/scenarios'
import { getInterpolatedPatientForDay } from '../lib/timeline'

export type ActiveDrawer = 'none' | 'sbar' | 'sms' | 'theater'
export type ActiveOrgan = 'cardio' | 'lungs' | 'kidneys' | 'genomics' | 'metabolic'
export type SpotlightCard = 'cardio' | 'volume' | 'safety' | null
export type { AnatomicalLayer, CaliperProbe, ClinicalScenario, OrderLifecycleState, ExtractedSymptom, PatientSnapshot, ClinicalWorkspace }


interface ClinicalContextType {
  patient: PatientSnapshot
  cdssVerdict: CdssSafetyVerdict
  activeOrgan: ActiveOrgan
  setActiveOrgan: (organ: ActiveOrgan) => void
  activeDrawer: ActiveDrawer
  setActiveDrawer: (drawer: ActiveDrawer) => void
  orderStatus: 'idle' | 'authorizing' | 'committed'
  orderLifecycle: OrderLifecycleState
  setOrderLifecycle: (state: OrderLifecycleState) => void
  executeGuideAction: (guideCode?: string) => Promise<void>
  actionIntentToken: string | null
  fhirMedicationRequest: FhirMedicationRequest | null
  fhirServiceRequest: FhirServiceRequest | null
  orderError: string | null
  smsMessages: SmsMessage[]
  swarmNodes: SwarmTraceNode[]
  sendSmsMessage: (text: string) => void
  authorizeOrder: () => Promise<void>
  injectKSpike: (kValue?: number) => void
  resetK: () => void
  activeCitation: string | null
  setActiveCitation: (cit: string | null) => void
  spotlightedCard: SpotlightCard
  setSpotlightedCard: (card: SpotlightCard) => void
  expandedTelemetry: boolean
  setExpandedTelemetry: (expanded: boolean | ((prev: boolean) => boolean)) => void

  // Benchmark Clinical Scenario A-I Switcher
  activeScenarioId: string
  activeScenario: ClinicalScenario
  setActiveScenario: (scenarioId: string) => void

  // Interactive Workstation Features
  selectedDay: number
  setSelectedDay: (day: number | ((prev: number) => number)) => void
  isPlayingTimeline: boolean
  setIsPlayingTimeline: (playing: boolean | ((prev: boolean) => boolean)) => void
  timelineSpeed: 1 | 2
  setTimelineSpeed: (speed: 1 | 2) => void
  activeAnatomicalLayer: AnatomicalLayer
  setActiveAnatomicalLayer: (layer: AnatomicalLayer) => void
  caliperProbe: CaliperProbe
  setCaliperProbe: (probe: CaliperProbe | ((prev: CaliperProbe) => CaliperProbe)) => void
  resetCaliperProbe: () => void

  // Multi-Workspace Clinical Navigation
  currentWorkspace: ClinicalWorkspace
  setCurrentWorkspace: (workspace: ClinicalWorkspace) => void
  cohortPatients: CohortPatientRecord[]
  selectedCohortPatientId: string
  selectCohortPatient: (patientId: string) => void
}

const ClinicalContext = createContext<ClinicalContextType | undefined>(undefined)

export const ClinicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState<number>(14)
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false)
  const [timelineSpeed, setTimelineSpeed] = useState<1 | 2>(1)
  const [activeAnatomicalLayer, setActiveAnatomicalLayer] = useState<AnatomicalLayer>('full')
  const [caliperProbe, setCaliperProbe] = useState<CaliperProbe>({ metric: null, value: null })
  const [kOverride, setKOverride] = useState<number | undefined>(undefined)

  // Benchmark Clinical Scenario A-I Switcher
  const [activeScenarioId, setActiveScenarioId] = useState<string>('A')
  const activeScenario = useMemo(() => getScenarioById(activeScenarioId), [activeScenarioId])

  const [activeOrgan, setActiveOrgan] = useState<ActiveOrgan>('cardio')
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>('none')
  const [orderStatusInternal, setOrderStatusInternal] = useState<'idle' | 'authorizing' | 'committed'>('idle')
  const [orderLifecycleState, setOrderLifecycleState] = useState<OrderLifecycleState | null>(null)
  const [actionIntentToken, setActionIntentToken] = useState<string | null>(null)
  const [fhirMedicationRequest, setFhirMedicationRequest] = useState<FhirMedicationRequest | null>(null)
  const [fhirServiceRequest, setFhirServiceRequest] = useState<FhirServiceRequest | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>(INITIAL_SMS_THREAD)
  const [activeCitation, setActiveCitationState] = useState<string | null>(null)
  const [spotlightedCard, setSpotlightedCard] = useState<SpotlightCard>(null)
  const [expandedTelemetry, setExpandedTelemetry] = useState<boolean>(false)

  // Multi-Workspace Clinical Navigation
  const [currentWorkspace, setCurrentWorkspace] = useState<ClinicalWorkspace>('workstation')
  const [cohortPatients] = useState<CohortPatientRecord[]>(COHORT_250_BENEFICIARIES)
  const [selectedCohortPatientId, setSelectedCohortPatientId] = useState<string>('P-94021')

  const selectCohortPatient = useCallback((patientId: string) => {
    setSelectedCohortPatientId(patientId)
    setCurrentWorkspace('workstation')
    setCaliperProbe({ metric: null, value: null })
    setActiveDrawer('none')
    setSelectedDay(14)
    setIsPlayingTimeline(false)

    // Map archetype cohort members to corresponding clinical scenarios
    const scenarioMap: Record<string, string> = {
      'P-94021': 'A',
      'P-33890': 'B',
      'P-44911': 'C',
      'P-77312': 'E',
      'P-66504': 'F',
      'P-55423': 'G',
      'P-88219': 'H'
    }
    const targetScenarioId = scenarioMap[patientId] || 'A'
    setActiveScenarioId(targetScenarioId)
    const sc = getScenarioById(targetScenarioId)
    setSmsMessages(sc.initialSmsThread)
    setKOverride(undefined)
    setOrderError(null)
    setActionIntentToken(null)
    setFhirMedicationRequest(null)
    setFhirServiceRequest(null)
    setOrderLifecycleState(null)
    setOrderStatusInternal('idle')
  }, [])

  const setActiveScenario = useCallback((scenarioId: string) => {
    setActiveScenarioId(scenarioId)
    setSelectedCohortPatientId('P-94021')
    const sc = getScenarioById(scenarioId)
    setSmsMessages(sc.initialSmsThread)
    setCaliperProbe({ metric: null, value: null })
    setKOverride(undefined)
    setOrderError(null)
    setActionIntentToken(null)
    setFhirMedicationRequest(null)
    setFhirServiceRequest(null)
    setSelectedDay(14)
    setIsPlayingTimeline(false)
    setOrderLifecycleState(null)
    setOrderStatusInternal('idle')
  }, [])

  // Timeline auto-advance playback loop
  useEffect(() => {
    if (!isPlayingTimeline) return
    const intervalMs = timelineSpeed === 2 ? 650 : 1200
    const timer = setInterval(() => {
      setSelectedDay((prev) => {
        if (prev >= 14) {
          setIsPlayingTimeline(false)
          return 14
        }
        return prev + 1
      })
    }, intervalMs)
    return () => clearInterval(timer)
  }, [isPlayingTimeline, timelineSpeed])

  // Interpolate patient state based on selectedDay, activeScenario, probe, or kOverride
  const patient = useMemo(() => {
    const baseSnapshot = activeScenario.patientSnapshot
    const interpolated = getInterpolatedPatientForDay(selectedDay, baseSnapshot, caliperProbe, kOverride)
    
    // If a non-Arthur cohort patient is selected, overlay their demographic identifiers
    const cohortPatient = selectedCohortPatientId !== 'P-94021'
      ? COHORT_250_BENEFICIARIES.find((p) => p.id === selectedCohortPatientId)
      : null

    return {
      ...interpolated,
      patient_id: cohortPatient ? cohortPatient.id : interpolated.patient_id,
      name: cohortPatient ? cohortPatient.name : interpolated.name,
      age: cohortPatient ? cohortPatient.age : interpolated.age,
      gender: cohortPatient ? cohortPatient.gender : interpolated.gender,
      mrn: cohortPatient ? cohortPatient.mrn : (interpolated.mrn ?? 'MRN-94021'),
      nyha_class: cohortPatient ? cohortPatient.nyha_class : interpolated.nyha_class,
      quarantined: activeScenario.quarantined,
      quarantine_reason: activeScenario.quarantineReason,
      red_flag_emergency: activeScenario.redFlagBypass
    }
  }, [selectedDay, activeScenario, caliperProbe, kOverride, selectedCohortPatientId])

  // Mutable refs to prevent TOCTOU concurrency race conditions during async authorization
  const authSessionRef = useRef<number | null>(null)
  const patientRef = useRef<PatientSnapshot>(patient)

  useEffect(() => {
    patientRef.current = patient
  }, [patient])

  // Compute CDSS verdict deterministically whenever patient labs or trajectory change
  const cdssVerdict = useMemo(() => {
    return CorinAPI.evaluateCdss(
      patient.labs.potassium_mEq_L, 
      patient.trajectory.blood_pressure_sys,
      patient.labs.egfr_mL_min,
      patient.labs.last_lab_days ?? (patient.labs.is_lab_stale ? 18 : 7)
    )
  }, [patient.labs.potassium_mEq_L, patient.trajectory.blood_pressure_sys, patient.labs.egfr_mL_min, patient.labs.last_lab_days, patient.labs.is_lab_stale])

  // Prescribing 5-State Machine
  const orderLifecycle: OrderLifecycleState = useMemo(() => {
    if (orderLifecycleState) return orderLifecycleState
    if (!cdssVerdict.passed) return 'VETOED_SAFETY_CLIFF'
    if (orderStatusInternal === 'committed') return 'COMMITTED_TO_EHR'
    if (orderStatusInternal === 'authorizing') return 'AWAITING_SIGNATURE'
    return 'GUARDIAN_VERIFIED'
  }, [orderLifecycleState, cdssVerdict.passed, orderStatusInternal])

  // Backwards-compatible 3-state orderStatus
  const orderStatus: 'idle' | 'authorizing' | 'committed' = useMemo(() => {
    if (orderLifecycle === 'COMMITTED_TO_EHR') return 'committed'
    if (orderLifecycle === 'AWAITING_SIGNATURE') return 'authorizing'
    return 'idle'
  }, [orderLifecycle])

  const setOrderLifecycle = useCallback((state: OrderLifecycleState) => {
    setOrderLifecycleState(state)
    if (state === 'COMMITTED_TO_EHR') setOrderStatusInternal('committed')
    else if (state === 'AWAITING_SIGNATURE') setOrderStatusInternal('authorizing')
    else setOrderStatusInternal('idle')
  }, [])

  // Execute Guide Steering Action (e.g. STAT BMP Re-draw)
  const executeGuideAction = useCallback(async (guideCode?: string) => {
    const code = guideCode || cdssVerdict.guide_code || 'ORDER_STAT_BMP'
    if (code === 'ORDER_STAT_BMP') {
      const bmpReq: FhirServiceRequest = {
        resourceType: 'ServiceRequest',
        id: `#serv-stat-bmp-${Date.now().toString().slice(-5)}`,
        status: 'active',
        intent: 'order',
        code: {
          coding: [{ system: 'http://loinc.org', code: '24323-8', display: 'STAT Basic Metabolic Panel (BMP)' }],
          text: 'STAT BMP Re-draw (Serum K+, BUN, Creatinine, eGFR)'
        },
        subject: { reference: `Patient/${patient.patient_id}`, display: patient.name },
        occurrenceDateTime: new Date().toISOString()
      }
      setFhirServiceRequest(bmpReq)
      const guideSms: SmsMessage = {
        id: `m_guide_${Date.now()}`,
        sender: 'agent',
        text: `Clinical Guide Action executed: STAT BMP lab requisition submitted to mobile phlebotomy. Diuretic escalation held pending potassium verification.`,
        timestamp: 'Just now',
        isDrUpdate: true
      }
      setSmsMessages((prev) => [...prev, guideSms])
      setOrderLifecycleState('PROPOSAL_PENDING')
      setOrderError(null)
    } else {
      setOrderLifecycleState('PROPOSAL_PENDING')
      setOrderError(null)
    }
  }, [cdssVerdict.guide_code, patient.patient_id, patient.name])

  // Swarm nodes dynamic state based on CDSS verdict
  const swarmNodes = useMemo(() => {
    return INITIAL_SWARM_TRACE.map((node) => {
      if (node.id === 'guardian') {
        if (!cdssVerdict.passed) {
          return {
            ...node,
            status: 'VETOED' as const,
            summary: `Deterministic check: K+ = ${patient.labs.potassium_mEq_L.toFixed(1)} mEq/L. Hard Veto Triggered: ${cdssVerdict.veto_reason}`
          }
        }
        return {
          ...node,
          status: 'COMPLETE' as const,
          summary: `Deterministic check: K+ = ${patient.labs.potassium_mEq_L.toFixed(1)} (<5.2), SBP = ${patient.trajectory.blood_pressure_sys} (>=95). Hard veto = FALSE. Invariants pass in 1.8ms.`
        }
      }
      return node
    })
  }, [cdssVerdict, patient.labs.potassium_mEq_L, patient.trajectory.blood_pressure_sys])

  // Interactive Citation handler with bidirectional spotlight coupling
  const setActiveCitation = useCallback((cit: string | null) => {
    setActiveCitationState(cit)
    if (!cit) {
      setSpotlightedCard(null)
      return
    }
    const citationData = PROVENANCE_CITATIONS[cit]
    if (citationData) {
      setSpotlightedCard(citationData.highlightCard)
      setActiveOrgan(citationData.targetOrgan)
    }
  }, [])

  const sendSmsMessage = useCallback((text: string) => {
    const extracted = extractSymptomsFromText(text)
    const userMsg: SmsMessage = {
      id: `m_${Date.now()}`,
      sender: 'patient',
      text,
      timestamp: 'Just now',
      extractedSymptoms: extracted
    }
    setSmsMessages((prev) => [...prev, userMsg])

    // Autonomous AI Agent response simulation matching Nova Micro
    setTimeout(() => {
      let replyText = "Thank you for the update, Arthur. Dr. Chen's care protocol has been updated. Please continue resting and note any change in breathing."
      const lower = text.toLowerCase()
      if (lower.includes('chest pain') || lower.includes('crushing') || lower.includes('pressure in my chest')) {
        replyText = "EMERGENCY ALERT: Arthur, call 911 immediately or proceed to the nearest emergency department. An urgent alert has been dispatched to Dr. Chen."
      } else if (lower.includes('double') || lower.includes('lasix') || lower.includes('doctor said')) {
        replyText = "Arthur, for your safety, all medication adjustments must be validated against verified laboratory values and signed by Dr. Robert Chen through our secure EHR portal. Your care team has been notified."
      } else if (lower.includes('pillow') || lower.includes('breathless') || lower.includes('lying flat')) {
        replyText = "Thank you for noting that, Arthur. Orthopnea can indicate pulmonary fluid shift. Dr. Chen's team has received your report and is evaluating your diuresis regimen."
      } else if (lower.includes('ankle') || lower.includes('swollen')) {
        replyText = "Thank you for noting the swelling, Arthur. Keep your legs elevated when resting, and we will monitor your weight and fluid markers closely."
      }

      const agentReply: SmsMessage = {
        id: `m_${Date.now() + 1}`,
        sender: 'agent',
        text: replyText,
        timestamp: 'Just now'
      }
      setSmsMessages((prev) => [...prev, agentReply])
    }, 450)
  }, [])

  const authorizeOrder = useCallback(async () => {
    // 1. Initial pre-flight deterministic check
    const currentPatient = patientRef.current
    const preCheck = CorinAPI.evaluateCdss(
      currentPatient.labs.potassium_mEq_L,
      currentPatient.trajectory.blood_pressure_sys,
      currentPatient.labs.egfr_mL_min,
      currentPatient.labs.last_lab_days ?? (currentPatient.labs.is_lab_stale ? 18 : 7)
    )

    if (!preCheck.passed) {
      setOrderError(preCheck.veto_reason || 'CDSS safety invariant violation')
      setOrderLifecycleState('VETOED_SAFETY_CLIFF')
      return
    }

    const sessionId = Date.now()
    authSessionRef.current = sessionId

    setOrderStatusInternal('authorizing')
    setOrderLifecycleState('AWAITING_SIGNATURE')
    setIsPlayingTimeline(false)
    setOrderError(null)

    // Simulating realistic 280ms cryptographic authorization pipeline
    await new Promise((res) => setTimeout(res, 280))

    // 2. Concurrency check: If another event (e.g. fatal K+ spike) aborted this session, halt
    if (authSessionRef.current !== sessionId) {
      return
    }

    // 3. Post-delay Deterministic Check: Re-verify against latest patient state IMMEDIATELY before commit
    const latestPatient = patientRef.current
    const postCheck = CorinAPI.evaluateCdss(
      latestPatient.labs.potassium_mEq_L,
      latestPatient.trajectory.blood_pressure_sys,
      latestPatient.labs.egfr_mL_min,
      latestPatient.labs.last_lab_days ?? (latestPatient.labs.is_lab_stale ? 18 : 7)
    )

    if (!postCheck.passed) {
      setOrderStatusInternal('idle')
      setOrderLifecycleState('VETOED_SAFETY_CLIFF')
      setOrderError(postCheck.veto_reason || 'CDSS hard veto triggered during signing ceremony')
      return
    }

    try {
      const result = await CorinAPI.authorizeOrder(latestPatient.patient_id)
      setActionIntentToken(result.action_intent_token)
      setFhirMedicationRequest(result.medication_request)
      setFhirServiceRequest(result.service_request)
      setOrderStatusInternal('committed')
      setOrderLifecycleState('COMMITTED_TO_EHR')

      // Append confirmation to SMS simulator
      const confirmMsg: SmsMessage = {
        id: `m_${Date.now()}`,
        sender: 'agent',
        text: `Update from Dr. Robert Chen: Your Lasix dose has been temporarily adjusted to 80mg daily for the next 3 days to relieve fluid build-up. We scheduled your repeat blood check for Tuesday morning.`,
        timestamp: 'Just now',
        isDrUpdate: true
      }
      setSmsMessages((prev) => [...prev, confirmMsg])
    } catch {
      setOrderError('Failed to commit clinical order')
      setOrderStatusInternal('idle')
      setOrderLifecycleState('PROPOSAL_PENDING')
    }
  }, [])

  const injectKSpike = useCallback((kValue = 5.8) => {
    // Invalidate any ongoing asynchronous authorization session immediately
    authSessionRef.current = null
    setKOverride(kValue)
    setOrderStatusInternal('idle')
    setOrderLifecycleState('VETOED_SAFETY_CLIFF')
    setOrderError(`Serum K+ >= 5.2 mEq/L (Hyperkalemia Contraindication Cliff: ${kValue.toFixed(1)} mEq/L)`)
    setActionIntentToken(null)
    setFhirMedicationRequest(null)
    setFhirServiceRequest(null)
  }, [])

  const resetK = useCallback(() => {
    authSessionRef.current = null
    setKOverride(undefined)
    setCaliperProbe({ metric: null, value: null })
    setOrderError(null)
    setOrderLifecycleState(null)
    setOrderStatusInternal('idle')
  }, [])

  const resetCaliperProbe = useCallback(() => {
    setCaliperProbe({ metric: null, value: null })
  }, [])

  return (
    <ClinicalContext.Provider
      value={{
        patient,
        cdssVerdict,
        activeOrgan,
        setActiveOrgan,
        activeDrawer,
        setActiveDrawer,
        orderStatus,
        orderLifecycle,
        setOrderLifecycle,
        executeGuideAction,
        actionIntentToken,
        fhirMedicationRequest,
        fhirServiceRequest,
        orderError,
        smsMessages,
        swarmNodes,
        sendSmsMessage,
        authorizeOrder,
        injectKSpike,
        resetK,
        activeCitation,
        setActiveCitation,
        spotlightedCard,
        setSpotlightedCard,
        expandedTelemetry,
        setExpandedTelemetry,

        // Benchmark Clinical Scenario A-I Switcher
        activeScenarioId,
        activeScenario,
        setActiveScenario,

        // Workstation Interactive Controls
        selectedDay,
        setSelectedDay,
        isPlayingTimeline,
        setIsPlayingTimeline,
        timelineSpeed,
        setTimelineSpeed,
        activeAnatomicalLayer,
        setActiveAnatomicalLayer,
        caliperProbe,
        setCaliperProbe,
        resetCaliperProbe,

        // Multi-Workspace Clinical Navigation
        currentWorkspace,
        setCurrentWorkspace,
        cohortPatients,
        selectedCohortPatientId,
        selectCohortPatient
      }}
    >
      {children}
    </ClinicalContext.Provider>
  )
}

export const useClinical = () => {
  const context = useContext(ClinicalContext)
  if (!context) {
    throw new Error('useClinical must be used within a ClinicalProvider')
  }
  return context
}
