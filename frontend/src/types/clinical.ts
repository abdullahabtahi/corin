export interface TelemetryDataPoint {
  day: number
  date: string
  raw_weight_lbs: number
  ewma_weight_lbs: number // Exponentially Weighted Moving Average (alpha = 0.28)
  resting_hr_bpm: number
  z_score: number
  corridor_upper_lbs: number // +1.96 sigma confidence envelope
  corridor_lower_lbs: number // -1.96 sigma confidence envelope
}

export interface BiometricTrajectory {
  current_weight_lbs: number
  baseline_dry_weight_lbs: number
  weight_delta_48h: number
  weight_delta_7d: number
  z_score: number
  resting_hr_bpm: number
  baseline_resting_hr: number
  hr_drift_bpm: number
  blood_pressure_sys: number
  blood_pressure_dia: number
  is_telemetry_anomaly: boolean
  telemetry_history: TelemetryDataPoint[]
}

export interface ClinicalLabs {
  potassium_mEq_L: number
  potassium_status: 'optimal' | 'suboptimal' | 'critical'
  creatinine_mg_dL: number
  egfr_mL_min: number
  egfr_status: 'optimal' | 'suboptimal' | 'critical'
  bun_mg_dL: number
  last_lab_date: string
  last_lab_days?: number
  is_lab_stale: boolean
}

export interface CardioTelemetry {
  resting_hr: number
  hr_drift: number
  ef_percent: number
  sbp: number
  dbp: number
  cardiorenal_age: number
  accelerated_age_delta: number
}

export interface LungsTelemetry {
  orthopnea_pillows: number
  pef_l_min: number
  pef_baseline_drop_pct: number
  o2_saturation_pct: number
  splanchnic_congestion_score: number
}

export interface KidneysTelemetry {
  potassium_mEq_L: number
  egfr_mL_min: number
  creatinine_mg_dL: number
  bun_mg_dL: number
  safety_window_passed: boolean
}

export interface GenomicsTelemetry {
  cyp2c9: string
  vkorc1: string
  phactr1: string
  loop_clearance_phenotype: string
}

export interface ActiveMedication {
  name: string
  dose_mg: number
  frequency: string
  rxnorm_code: string
  drug_class: 'loop_diuretic' | 'mra' | 'acei_arb_arni' | 'beta_blocker' | 'sglt2i' | 'supplement'
  description: string
}

export interface SymptomSurvey {
  orthopnea_present: boolean
  pillows_count: number
  bendopnea_present: boolean
  fatigue_level: string
  reported_text: string
}

export interface PatientClinicalSnapshot {
  patient_id: string
  name: string
  age: number
  gender: string
  mrn?: string
  nyha_class: string
  heart_age_estimate: number
  risk_score: number
  urgency_tier: 'ROUTINE' | 'MONITOR' | 'URGENT' | 'EMERGENCY'
  trajectory: BiometricTrajectory
  labs: ClinicalLabs
  medications: ActiveMedication[]
  symptoms: SymptomSurvey
  organ_telemetry: {
    cardio: CardioTelemetry
    lungs: LungsTelemetry
    kidneys: KidneysTelemetry
    genomics: GenomicsTelemetry
  }
}

export interface FhirMedicationRequest {
  resourceType: 'MedicationRequest'
  id: string // '#medrx-88319'
  status: 'active' | 'completed' | 'cancelled'
  intent: 'order'
  medicationCodeableConcept: {
    coding: Array<{ system: string; code: string; display: string }>
    text: string
  }
  subject: { reference: string; display: string }
  authoredOn: string
  requester: { reference: string; display: string; npi: string }
  dosageInstruction: Array<{
    text: string
    timing: { repeat: { frequency: number; period: number; periodUnit: string } }
    doseAndRate: Array<{ doseQuantity: { value: number; unit: string } }>
  }>
  dispenseRequest?: {
    validityPeriod?: { start: string; end: string }
    numberOfRepeatsAllowed: number
    quantity?: { value: number; unit: string }
  }
}

export interface FhirServiceRequest {
  resourceType: 'ServiceRequest'
  id: string // '#serv-29401'
  status: 'active'
  intent: 'order'
  code: {
    coding: Array<{ system: string; code: string; display: string }>
    text: string
  }
  subject: { reference: string; display: string }
  occurrenceDateTime: string
}

export interface ProvenanceCitation {
  id: string // '1' | '2' | '3' | '4' | '5'
  badge: string
  title: string
  source: string
  tier: 'Clinical Guideline' | 'IoT Scale Telemetry (DuckDB)' | 'Autonomic Sensor (PPG)' | 'EHR Laboratory Observation' | 'Patient Voice (Twilio SMS)'
  grounding: string
  snippet: string
  timestamp: string
  targetOrgan: 'cardio' | 'lungs' | 'kidneys' | 'genomics' | 'metabolic'
  highlightCard: 'cardio' | 'volume' | 'safety'
  rawPacket?: Record<string, unknown>
}

export interface CdssSafetyVerdict {
  passed: boolean
  evaluation_time_ms: number
  veto_reason: string | null
  guide_action?: string | null
  guide_code?: 'ORDER_STAT_BMP' | 'HOLD_MRA' | 'HYPOTENSION_ALERT' | 'NEPHROLOGY_CONSULT' | null
  status?: 'PASSED' | 'VETOED' | 'GUIDE'
  invariants: {
    k_window_check: { name: string; value: string; passed: boolean }
    sbp_check: { name: string; value: string; passed: boolean }
    egfr_check: { name: string; value: string; passed: boolean }
    recency_check: { name: string; value: string; passed: boolean }
  }
  action_intent_token?: string
  fhir_medication_request?: FhirMedicationRequest
  fhir_service_request?: FhirServiceRequest
}

export type CdssVerdict = CdssSafetyVerdict

export interface PatientSnapshot extends PatientClinicalSnapshot {
  snapshot_hash?: string
  quarantined?: boolean
  quarantine_reason?: string
  red_flag_emergency?: boolean
}

export interface CdssEvaluationRequest {
  patient_id: string
  potassium_mEq_L: number
  systolic_bp_mmHg?: number
  egfr_mL_min?: number
  last_lab_days?: number
  proposed_medication?: string
  proposed_dose_mg?: number
}

export interface SmsMessagePayload {
  patient_id: string
  text: string
  sender?: 'patient' | 'agent'
}

export interface FhirBundle {
  resourceType: 'Bundle'
  id?: string
  type: 'collection' | 'transaction' | 'batch' | 'searchset'
  total?: number
  entry: Array<{
    fullUrl?: string
    resource: FhirMedicationRequest | FhirServiceRequest | Record<string, unknown>
  }>
}

export type OrderLifecycleState = 
  | 'PROPOSAL_PENDING' 
  | 'GUARDIAN_VERIFIED' 
  | 'AWAITING_SIGNATURE' 
  | 'COMMITTED_TO_EHR' 
  | 'VETOED_SAFETY_CLIFF'

export interface ExtractedSymptom {
  id: string
  entity: string
  category: 'respiratory' | 'volume' | 'autonomic' | 'vital' | 'red_flag'
  confidence: number
  span: string
}

export interface ClinicalScenario {
  id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'
  code: string
  title: string
  category: string
  badgeColor: string
  description: string
  expectedOutcome: string
  patientSnapshot: PatientClinicalSnapshot
  initialSmsThread: SmsMessage[]
  quarantined?: boolean
  quarantineReason?: string
  redFlagBypass?: boolean
  promptInjectionShielded?: boolean
}

export interface SmsMessage {
  id: string
  sender: 'agent' | 'patient'
  text: string
  timestamp: string
  isDrUpdate?: boolean
  extractedSymptoms?: ExtractedSymptom[]
}

export interface SwarmTraceNode {
  id: string
  name: string
  model: string
  latency_ms: number
  status: 'COMPLETE' | 'RUNNING' | 'VETOED' | 'PENDING'
  summary: string
}

export type AnatomicalLayer = 'full' | 'vascular' | 'pulmonary' | 'renal'

export interface TimelineDayInfo {
  day: number
  relativeDay: number // e.g. -14 to 0
  label: string // e.g. 'Day -14', 'Day -7', 'Day -3', 'Day 0'
  date: string // e.g. 'Oct 18'
  raw_weight_lbs: number
  ewma_weight_lbs: number
  resting_hr_bpm: number
  z_score: number
  weight_delta_lbs: number
  hr_drift_bpm: number
  orthopnea_pillows: number
  cardiorenal_age: number
  risk_score: number
  urgency_tier: 'ROUTINE' | 'MONITOR' | 'URGENT'
  milestone?: string
  clinical_note: string
}

export interface CaliperProbe {
  metric: 'potassium' | 'weight' | 'hr' | null
  value: number | null
}

export type ClinicalWorkspace = 
  | 'workstation' 
  | 'cohort' 
  | 'pulmonary' 
  | 'renal' 
  | 'genomics' 
  | 'pharmacy' 
  | 'telemetry'

export interface CohortPatientRecord {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female'
  mrn: string
  nyha_class: string
  ef_percent: number
  ckd_stage: string
  risk_score: number
  urgency_tier: 'EMERGENCY' | 'URGENT' | 'MONITOR' | 'ROUTINE'
  weight_delta_48h: number
  z_score: number
  hr_drift_bpm: number
  resting_hr: number
  serum_k: number
  sbp: number
  egfr: number
  symptoms: string[]
  decider_route: string
  pending_action: string
  last_reading_time: string
}

export interface GdmtPillar {
  id: string
  name: string
  drug_class: 'acei_arb_arni' | 'beta_blocker' | 'mra' | 'sglt2i' | 'loop_diuretic'
  current_drug: string
  current_dose: string
  target_dose: string
  optimization_pct: number
  status: 'OPTIMAL' | 'SUBOPTIMAL' | 'HELD_SAFETY' | 'TITRATING'
  clinical_rationale: string
  guideline_citation: string
}


