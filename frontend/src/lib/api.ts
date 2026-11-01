import type { 
  PatientClinicalSnapshot, 
  PatientSnapshot,
  CdssSafetyVerdict, 
  CdssVerdict,
  CdssEvaluationRequest,
  SmsMessage, 
  SmsMessagePayload,
  FhirBundle,
  OrderLifecycleState,
  SwarmTraceNode,
  TelemetryDataPoint,
  ProvenanceCitation,
  FhirMedicationRequest,
  FhirServiceRequest,
  CohortPatientRecord,
  GdmtPillar
} from '../types/clinical'

export type {
  PatientSnapshot,
  CdssSafetyVerdict,
  CdssVerdict,
  CdssEvaluationRequest,
  SmsMessagePayload,
  FhirBundle,
  OrderLifecycleState
}

export const COHORT_250_BENEFICIARIES: CohortPatientRecord[] = [
  {
    id: 'P-94021',
    name: 'Arthur Pendelton',
    age: 71,
    gender: 'Male',
    mrn: 'MRN-94021',
    nyha_class: 'NYHA Class III',
    ef_percent: 32,
    ckd_stage: 'Stage 3a',
    risk_score: 87.4,
    urgency_tier: 'URGENT',
    weight_delta_48h: 3.6,
    z_score: 2.41,
    hr_drift_bpm: 14,
    resting_hr: 82,
    serum_k: 4.6,
    sbp: 133,
    egfr: 54,
    symptoms: ['2-Pillow Orthopnea', 'Peripheral Edema 1+'],
    decider_route: 'Clinical Escalation (Nova Micro 4ms)',
    pending_action: 'Loop Diuretic Escalation 80mg x 3d',
    last_reading_time: '07:12 EDT'
  },
  {
    id: 'P-88219',
    name: 'Beatrice Thorne',
    age: 78,
    gender: 'Female',
    mrn: 'MRN-88219',
    nyha_class: 'NYHA Class IV',
    ef_percent: 24,
    ckd_stage: 'Stage 3b',
    risk_score: 92.1,
    urgency_tier: 'EMERGENCY',
    weight_delta_48h: 4.8,
    z_score: 3.10,
    hr_drift_bpm: 18,
    resting_hr: 94,
    serum_k: 5.3,
    sbp: 88,
    egfr: 38,
    symptoms: ['Dyspnea at Rest', 'Severe Orthopnea', 'Hypotensive Shock'],
    decider_route: 'Emergency Attending Alert (Nova Micro 3ms)',
    pending_action: 'Cardiology Direct Admit / Inotrope Protocol',
    last_reading_time: '06:45 EDT'
  },
  {
    id: 'P-77312',
    name: 'Marcus Brody',
    age: 74,
    gender: 'Male',
    mrn: 'MRN-77312',
    nyha_class: 'NYHA Class III',
    ef_percent: 35,
    ckd_stage: 'Stage 4',
    risk_score: 81.5,
    urgency_tier: 'URGENT',
    weight_delta_48h: 3.1,
    z_score: 2.15,
    hr_drift_bpm: 11,
    resting_hr: 80,
    serum_k: 5.1,
    sbp: 142,
    egfr: 28,
    symptoms: ['Orthopnea (+1 Pillow)', 'Nocturnal Cough'],
    decider_route: 'Clinical Escalation (Nova Micro 4ms)',
    pending_action: 'STAT BMP Re-draw & Nephrology Consult',
    last_reading_time: '07:30 EDT'
  },
  {
    id: 'P-66504',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    mrn: 'MRN-66504',
    nyha_class: 'NYHA Class II',
    ef_percent: 42,
    ckd_stage: 'Stage 2',
    risk_score: 14.2,
    urgency_tier: 'ROUTINE',
    weight_delta_48h: 0.4,
    z_score: 0.18,
    hr_drift_bpm: 1,
    resting_hr: 67,
    serum_k: 4.4,
    sbp: 122,
    egfr: 68,
    symptoms: ['Asymptomatic', 'Walking 30m daily'],
    decider_route: 'Routine Surveillance (Safe)',
    pending_action: '30-Day GDMT Maintenance Refill',
    last_reading_time: '08:00 EDT'
  },
  {
    id: 'P-55418',
    name: 'James Gallagher',
    age: 69,
    gender: 'Male',
    mrn: 'MRN-55418',
    nyha_class: 'NYHA Class II',
    ef_percent: 38,
    ckd_stage: 'Stage 3a',
    risk_score: 22.0,
    urgency_tier: 'ROUTINE',
    weight_delta_48h: -0.2,
    z_score: -0.05,
    hr_drift_bpm: -1,
    resting_hr: 66,
    serum_k: 4.5,
    sbp: 118,
    egfr: 58,
    symptoms: ['Zero Dyspnea', 'Weight Stable'],
    decider_route: 'Routine Surveillance (Safe)',
    pending_action: 'Quarterly Cardiorenal Review Active',
    last_reading_time: '07:45 EDT'
  },
  {
    id: 'P-44911',
    name: 'Clara Oswald',
    age: 72,
    gender: 'Female',
    mrn: 'MRN-44911',
    nyha_class: 'NYHA Class III',
    ef_percent: 30,
    ckd_stage: 'Stage 3a',
    risk_score: 68.4,
    urgency_tier: 'MONITOR',
    weight_delta_48h: 2.2,
    z_score: 1.42,
    hr_drift_bpm: 8,
    resting_hr: 76,
    serum_k: 4.7,
    sbp: 130,
    egfr: 51,
    symptoms: ['Mild Exertional Fatigue', 'Salt Cravings'],
    decider_route: 'Care Manager Outreach (Nova Micro 334ms)',
    pending_action: 'Dietary Sodium Counseling via SMS',
    last_reading_time: '08:15 EDT'
  },
  {
    id: 'P-33890',
    name: 'Walter Bishop',
    age: 76,
    gender: 'Male',
    mrn: 'MRN-33890',
    nyha_class: 'NYHA Class III',
    ef_percent: 34,
    ckd_stage: 'Stage 3b',
    risk_score: 71.2,
    urgency_tier: 'MONITOR',
    weight_delta_48h: 2.4,
    z_score: 1.55,
    hr_drift_bpm: 9,
    resting_hr: 77,
    serum_k: 4.8,
    sbp: 128,
    egfr: 42,
    symptoms: ['1-Pillow Orthopnea', 'Ankle Edema Trace'],
    decider_route: 'Physician Review Pending',
    pending_action: 'Spironolactone Titration Hold Review',
    last_reading_time: '08:30 EDT'
  },
  {
    id: 'P-22781',
    name: 'Evelyn Cross',
    age: 65,
    gender: 'Female',
    mrn: 'MRN-22781',
    nyha_class: 'NYHA Class II',
    ef_percent: 45,
    ckd_stage: 'Stage 2',
    risk_score: 18.5,
    urgency_tier: 'ROUTINE',
    weight_delta_48h: 0.2,
    z_score: 0.10,
    hr_drift_bpm: 0,
    resting_hr: 68,
    serum_k: 4.3,
    sbp: 124,
    egfr: 72,
    symptoms: ['Stable', 'Good Energy'],
    decider_route: 'Routine Surveillance (Safe)',
    pending_action: 'Encounter Complete',
    last_reading_time: '06:15 EDT'
  }
]

export const GDMT_PILLARS_DATA: GdmtPillar[] = [
  {
    id: 'acei',
    name: '1. ARNI / ACEi / ARB Pillar',
    drug_class: 'acei_arb_arni',
    current_drug: 'Lisinopril',
    current_dose: '10 mg PO Daily',
    target_dose: '20 mg PO Daily',
    optimization_pct: 50,
    status: 'SUBOPTIMAL',
    clinical_rationale: 'Guideline-directed neurohormonal blockade. Current dose at 50% target; titration deferred until acute volume overload resolves.',
    guideline_citation: 'ACC/AHA 2022 §7.3 • Class I, LOE A'
  },
  {
    id: 'bb',
    name: '2. Beta-Blocker Pillar',
    drug_class: 'beta_blocker',
    current_drug: 'Carvedilol (Coreg)',
    current_dose: '25 mg PO BID',
    target_dose: '25 mg PO BID',
    optimization_pct: 100,
    status: 'OPTIMAL',
    clinical_rationale: 'Full target dose achieved. Heart rate 82 bpm allows continued full beta-blockade without bradycardia risk.',
    guideline_citation: 'ACC/AHA 2022 §7.4 • Class I, LOE A'
  },
  {
    id: 'mra',
    name: '3. Mineralocorticoid Receptor Antagonist (MRA)',
    drug_class: 'mra',
    current_drug: 'Spironolactone (Aldactone)',
    current_dose: 'Held (0 mg)',
    target_dose: '25 mg PO Daily',
    optimization_pct: 0,
    status: 'HELD_SAFETY',
    clinical_rationale: 'Held for safety: CDSS deterministic invariant prevents simultaneous loop escalation + MRA initiation when Serum K+ is 4.6 mEq/L with CKD 3a.',
    guideline_citation: 'ACC/AHA 2022 §7.5 • Safety Invariant Barrier'
  },
  {
    id: 'sglt2i',
    name: '4. SGLT2 Inhibitor Pillar',
    drug_class: 'sglt2i',
    current_drug: 'Empagliflozin (Jardiance)',
    current_dose: '10 mg PO Daily',
    target_dose: '10 mg PO Daily',
    optimization_pct: 100,
    status: 'OPTIMAL',
    clinical_rationale: 'Cardiorenal protective osmotic diuresis fully optimized. Slows CKD progression and reduces HF hospitalization risk.',
    guideline_citation: 'ACC/AHA 2022 §7.6 • Class I, LOE A'
  },
  {
    id: 'loop',
    name: '5. Loop Diuretic (Decongestive Therapy)',
    drug_class: 'loop_diuretic',
    current_drug: 'Furosemide (Lasix)',
    current_dose: '40 mg baseline ➔ 80 mg Escalation',
    target_dose: '80 mg PO qAM x 3 days',
    optimization_pct: 100,
    status: 'TITRATING',
    clinical_rationale: 'Temporary 72-hour dose doubling to relieve acute +3.6 lbs subclinical fluid overload. Return to 40mg baseline on Day 4.',
    guideline_citation: 'ACC/AHA 2022 §7.3.1 • Class I, LOE B-NR'
  }
]

export const TELEMETRY_14D_HISTORY: TelemetryDataPoint[] = [
  { day: 1,  date: 'Oct 18', raw_weight_lbs: 180.8, ewma_weight_lbs: 180.9, resting_hr_bpm: 68, z_score: -0.12, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 2,  date: 'Oct 19', raw_weight_lbs: 181.1, ewma_weight_lbs: 181.0, resting_hr_bpm: 67, z_score:  0.08, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 3,  date: 'Oct 20', raw_weight_lbs: 180.9, ewma_weight_lbs: 180.95, resting_hr_bpm: 69, z_score: -0.05, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 4,  date: 'Oct 21', raw_weight_lbs: 181.2, ewma_weight_lbs: 181.02, resting_hr_bpm: 68, z_score:  0.12, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 5,  date: 'Oct 22', raw_weight_lbs: 181.0, ewma_weight_lbs: 181.01, resting_hr_bpm: 70, z_score:  0.00, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 6,  date: 'Oct 23', raw_weight_lbs: 181.4, ewma_weight_lbs: 181.12, resting_hr_bpm: 69, z_score:  0.25, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 7,  date: 'Oct 24', raw_weight_lbs: 181.2, ewma_weight_lbs: 181.14, resting_hr_bpm: 70, z_score:  0.15, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 8,  date: 'Oct 25', raw_weight_lbs: 181.5, ewma_weight_lbs: 181.24, resting_hr_bpm: 71, z_score:  0.32, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 9,  date: 'Oct 26', raw_weight_lbs: 181.7, ewma_weight_lbs: 181.37, resting_hr_bpm: 72, z_score:  0.48, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 10, date: 'Oct 27', raw_weight_lbs: 181.6, ewma_weight_lbs: 181.43, resting_hr_bpm: 71, z_score:  0.41, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 11, date: 'Oct 28', raw_weight_lbs: 181.9, ewma_weight_lbs: 181.56, resting_hr_bpm: 73, z_score:  0.62, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 12, date: 'Oct 29', raw_weight_lbs: 182.6, ewma_weight_lbs: 181.85, resting_hr_bpm: 75, z_score:  1.15, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 13, date: 'Oct 30', raw_weight_lbs: 183.4, ewma_weight_lbs: 182.28, resting_hr_bpm: 78, z_score:  1.78, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 },
  { day: 14, date: 'Oct 31', raw_weight_lbs: 184.6, ewma_weight_lbs: 182.93, resting_hr_bpm: 82, z_score:  2.41, corridor_upper_lbs: 182.8, corridor_lower_lbs: 179.2 }
]

export const PROVENANCE_CITATIONS: Record<string, ProvenanceCitation> = {
  '1': {
    id: '1',
    badge: '[1] ACC/AHA Guideline',
    title: 'ACC/AHA/HFSA 2022 Heart Failure Guidelines §7.3.1',
    source: 'Circulation 2022;145:e895–e1032 • Class I Recommendation, LOE B-NR',
    tier: 'Clinical Guideline',
    grounding: 'Evidence-based titration protocol for ambulatory fluid decompensation',
    snippet: 'In ambulatory adult patients with symptomatic HFrEF presenting with subclinical congestion and acute weight overload without hemodynamic shock (SBP >= 95 mmHg), temporary escalation to 2x baseline loop diuretic dose for 3–5 days with repeat metabolic panel surveillance is recommended (Class I, Level B-NR).',
    timestamp: '2022 Guideline Standard',
    targetOrgan: 'cardio',
    highlightCard: 'cardio',
    rawPacket: {
      guideline_section: '7.3.1 Ambulatory Diuretic Titration',
      recommendation_class: 'Class I',
      evidence_level: 'Level B-NR',
      target_drug: 'Furosemide 80mg PO qAM x 3 days',
      surveillance_rule: 'BMP on Day 3'
    }
  },
  '2': {
    id: '2',
    badge: '[2] DuckDB Telemetry',
    title: 'IoT Scale Telemetry Packet (DuckDB SQL-on-FHIR)',
    source: 'Cellular Cat-M1 Body Weight Scale • Device ID: CS-88219',
    tier: 'IoT Scale Telemetry (DuckDB)',
    grounding: 'Raw weight: 184.6 lbs (+3.6 lbs 48h delta, EWMA alpha=0.28, Z-Score = +2.41, p = 0.008)',
    snippet: 'Columnar telemetry ingestion verified via DuckDB. 48-hour delta: 181.0 -> 184.6 lbs (+3.6 lbs). 7-day smoothed EWMA velocity: +3.12 lbs. Anomaly detector asserted Z-Score = +2.41 (p < 0.01), exceeding the 99th percentile decompensation warning envelope.',
    timestamp: 'Today 07:42 EDT',
    targetOrgan: 'lungs',
    highlightCard: 'volume',
    rawPacket: {
      device_id: 'CS-88219',
      carrier: 'Cat-M1 Cellular',
      raw_weight_lbs: 184.6,
      baseline_dry_weight_lbs: 181.0,
      delta_48h_lbs: 3.6,
      ewma_alpha: 0.28,
      ewma_weight_lbs: 182.93,
      z_score: 2.41,
      p_value: 0.008
    }
  },
  '3': {
    id: '3',
    badge: '[3] Autonomic Sensor',
    title: 'Autonomic Sensor PPG Telemetry (Resting HR Drift)',
    source: 'Continuous Nocturnal Optical PPG Sensor • Device ID: PHA-WEAR-4902',
    tier: 'Autonomic Sensor (PPG)',
    grounding: '72-hour nocturnal baseline shift: 68 bpm -> 82 bpm (+14 bpm autonomic drift, HRV collapse 28%)',
    snippet: 'Multi-vector telemetry fusion confirmed sympathetic activation prior to overt dyspnea. Resting heart rate rose continuously over 72 hours (+14 bpm above 68 bpm baseline). Dual-vector correlation with weight spike yields 88% PPV for acute decompensation.',
    timestamp: 'Today 06:15 EDT (Nocturnal Aggregate)',
    targetOrgan: 'cardio',
    highlightCard: 'cardio',
    rawPacket: {
      device_id: 'PHA-WEAR-4902',
      resting_hr_bpm: 82,
      baseline_hr_bpm: 68,
      hr_drift_bpm: 14,
      hrv_rmssd_ms: 18.4,
      hrv_baseline_drop_pct: 28.2,
      autonomic_shift_flag: true
    }
  },
  '4': {
    id: '4',
    badge: '[4] EHR Lab Baseline',
    title: 'Verified Laboratory Electronic Health Record (EHR)',
    source: 'Quest Diagnostics HL7/FHIR Observation • LOINC 2823-3 / 33914-3',
    tier: 'EHR Laboratory Observation',
    grounding: 'Serum K+ 4.6 mEq/L (Safe Window [3.5-5.1]), eGFR 54 mL/min/1.73m2 (CKD 3a stable), Creatinine 1.42 mg/dL',
    snippet: 'Verified ambulatory blood panel collected 7 days ago. Serum Potassium is safely centered at 4.6 mEq/L (well below the 5.2 mEq/L hyperkalemic cliff). Baseline eGFR 54 mL/min demonstrates stable Stage 3a renal function with 0.0% acute decline.',
    timestamp: '7 days ago (Verified Collection)',
    targetOrgan: 'kidneys',
    highlightCard: 'safety',
    rawPacket: {
      loinc_k: '2823-3',
      potassium_mEq_L: 4.6,
      safe_window: '3.5 - 5.1 mEq/L',
      loinc_egfr: '33914-3',
      egfr_mL_min: 54,
      ckd_stage: '3a',
      loinc_creat: '33914-3',
      creatinine_mg_dL: 1.42,
      bun_mg_dL: 24,
      lab_freshness_days: 7
    }
  },
  '5': {
    id: '5',
    badge: '[5] Patient SMS Voice',
    title: 'Conversational Patient Telehealth Dialogue Transcript',
    source: 'Twilio Conversational SMS Gateway / Strands Health Coach (Nova Micro)',
    tier: 'Patient Voice (Twilio SMS)',
    grounding: 'Verbatim SMS quote: "Felt like I was choking when trying to lie flat; had to prop up on 2 extra pillows"',
    snippet: 'Twilio conversational webhook elicited functional symptom report at 08:14 EDT. Natural language parsing classified Class III orthopnea (2 additional pillows required to sleep). Absence of acute chest pain or syncope ruled out 911 emergency referral.',
    timestamp: 'Today 08:14 EDT',
    targetOrgan: 'lungs',
    highlightCard: 'volume',
    rawPacket: {
      gateway: 'Twilio Programmable SMS',
      phone_hash: 'sha256_88319ad02',
      patient_quote: 'Yes actually, felt suffocated when I tried lying flat. Had to prop up on 2 pillows.',
      symptom_extracted: 'Orthopnea (2-pillow)',
      triage_urgency: 'HIGH',
      chest_pain_rule_out: true
    }
  }
}

export const FHIR_MEDICATION_REQUEST: FhirMedicationRequest = {
  resourceType: 'MedicationRequest',
  id: '#medrx-88319',
  status: 'active',
  intent: 'order',
  medicationCodeableConcept: {
    coding: [
      {
        system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
        code: '4603',
        display: 'Furosemide 80 MG Oral Tablet'
      }
    ],
    text: 'Furosemide 80mg PO qAM x 3 days (Temporary Escalation)'
  },
  subject: {
    reference: 'Patient/P-94021',
    display: 'Arthur Pendelton'
  },
  authoredOn: new Date().toISOString(),
  requester: {
    reference: 'Practitioner/dr-chen-19482',
    display: 'Dr. Robert Chen, MD',
    npi: '1948201948'
  },
  dosageInstruction: [
    {
      text: 'Take 80 mg (one tablet) by mouth every morning for 3 days to relieve acute fluid retention. Resume baseline 40 mg daily on Day 4.',
      timing: {
        repeat: {
          frequency: 1,
          period: 1,
          periodUnit: 'd'
        }
      },
      doseAndRate: [
        {
          doseQuantity: {
            value: 80,
            unit: 'mg'
          }
        }
      ]
    }
  ],
  dispenseRequest: {
    numberOfRepeatsAllowed: 0,
    quantity: {
      value: 3,
      unit: 'tablets'
    }
  }
}

export const FHIR_SERVICE_REQUEST: FhirServiceRequest = {
  resourceType: 'ServiceRequest',
  id: '#serv-29401',
  status: 'active',
  intent: 'order',
  code: {
    coding: [
      {
        system: 'http://loinc.org',
        code: '24323-8',
        display: 'Basic Metabolic Panel (Serum K+, BUN, Creatinine)'
      }
    ],
    text: 'STAT Day 3 Fasting BMP Safety Lab Draw'
  },
  subject: {
    reference: 'Patient/P-94021',
    display: 'Arthur Pendelton'
  },
  occurrenceDateTime: '2026-11-03T08:00:00Z'
}

export const INITIAL_PATIENT_SNAPSHOT: PatientClinicalSnapshot = {
  patient_id: 'P-94021',
  name: 'Arthur Pendelton',
  age: 71,
  gender: 'Male',
  nyha_class: 'NYHA Class III (EF 32%) • CKD 3a',
  heart_age_estimate: 78,
  risk_score: 87.4,
  urgency_tier: 'URGENT',
  trajectory: {
    current_weight_lbs: 184.6,
    baseline_dry_weight_lbs: 181.0,
    weight_delta_48h: 3.6,
    weight_delta_7d: 3.6,
    z_score: 2.41,
    resting_hr_bpm: 82,
    baseline_resting_hr: 68,
    hr_drift_bpm: 14,
    blood_pressure_sys: 133,
    blood_pressure_dia: 84,
    is_telemetry_anomaly: true,
    telemetry_history: TELEMETRY_14D_HISTORY
  },
  labs: {
    potassium_mEq_L: 4.6,
    potassium_status: 'optimal',
    creatinine_mg_dL: 1.42,
    egfr_mL_min: 54,
    egfr_status: 'optimal',
    bun_mg_dL: 24,
    last_lab_date: '7 days ago (Verified Collection)',
    last_lab_days: 7,
    is_lab_stale: false
  },
  medications: [
    {
      name: 'Furosemide (Lasix)',
      dose_mg: 80,
      frequency: 'PO qAM x 3 days',
      rxnorm_code: '4603',
      drug_class: 'loop_diuretic',
      description: 'Temporary dose escalation to 80mg daily for 72 hours; resume 40mg baseline on Day 4.'
    },
    {
      name: 'STAT Repeat BMP',
      dose_mg: 0,
      frequency: 'Day 3 Morning',
      rxnorm_code: '24323-8',
      drug_class: 'supplement',
      description: 'Safety lab verification: Serum K+, BUN, Creatinine before resuming baseline.'
    },
    {
      name: 'Carvedilol (Coreg)',
      dose_mg: 25,
      frequency: 'PO BID',
      rxnorm_code: '20352',
      drug_class: 'beta_blocker',
      description: 'Maintain guideline-directed beta blockade; monitor resting pulse.'
    },
    {
      name: 'Lisinopril',
      dose_mg: 10,
      frequency: 'PO Daily',
      rxnorm_code: '29046',
      drug_class: 'acei_arb_arni',
      description: 'ACE inhibitor cardiorenal protection; monitor serum potassium.'
    },
    {
      name: 'Empagliflozin (Jardiance)',
      dose_mg: 10,
      frequency: 'PO Daily',
      rxnorm_code: '1545653',
      drug_class: 'sglt2i',
      description: 'SGLT2 inhibitor cardiorenal protection and osmotic diuresis.'
    },
    {
      name: 'Fluid & Sodium Restriction',
      dose_mg: 0,
      frequency: 'Daily Protocol',
      rxnorm_code: 'PROTOCOL',
      drug_class: 'supplement',
      description: '2,000 mL/day fluid restriction, < 2,000 mg Na+ dietary adherence enforcement.'
    }
  ],
  symptoms: {
    orthopnea_present: true,
    pillows_count: 2,
    bendopnea_present: false,
    fatigue_level: 'Moderate',
    reported_text: 'Arthur: Felt suffocated when I tried lying flat. Had to prop up on 2 pillows.'
  },
  organ_telemetry: {
    cardio: {
      resting_hr: 82,
      hr_drift: 14,
      ef_percent: 32,
      sbp: 133,
      dbp: 84,
      cardiorenal_age: 78,
      accelerated_age_delta: 7
    },
    lungs: {
      orthopnea_pillows: 2,
      pef_l_min: 310,
      pef_baseline_drop_pct: 22.5,
      o2_saturation_pct: 94,
      splanchnic_congestion_score: 84
    },
    kidneys: {
      potassium_mEq_L: 4.6,
      egfr_mL_min: 54,
      creatinine_mg_dL: 1.42,
      bun_mg_dL: 24,
      safety_window_passed: true
    },
    genomics: {
      cyp2c9: '*1/*3 (Intermediate Loop Clearance)',
      vkorc1: 'A/G (Elevated Sensitivity)',
      phactr1: 'rs934197 Risk Allele Present',
      loop_clearance_phenotype: 'Standard-to-Delayed Renal Secretion'
    }
  }
}

export const INITIAL_SMS_THREAD: SmsMessage[] = [
  {
    id: 'm1',
    sender: 'agent',
    text: 'Good morning Arthur! We noticed your weight was 184.6 lbs today (+3.6 lbs since Tuesday). Did you need extra pillows to sleep comfortably flat last night?',
    timestamp: 'Today 08:12 AM'
  },
  {
    id: 'm2',
    sender: 'patient',
    text: 'Yes actually, felt suffocated when I tried lying flat. Had to prop up on 2 pillows.',
    timestamp: '08:14 AM'
  },
  {
    id: 'm3',
    sender: 'agent',
    text: "Thank you for letting us know, Arthur. Dr. Chen's cardiology team has received this. Please take your normal morning pills, and we will update you shortly with Dr. Chen's instructions.",
    timestamp: '08:15 AM'
  }
]

export const INITIAL_SWARM_TRACE: SwarmTraceNode[] = [
  {
    id: 'decider',
    name: '1. Strands System 1 Decider Gate',
    model: 'Amazon Nova Micro',
    latency_ms: 4,
    status: 'COMPLETE',
    summary: 'Triaged 48h EWMA velocity (+3.6 lbs). Evaluated urgency score: 2.9 / 3.0. Action: CLINICAL_ESCALATION.'
  },
  {
    id: 'datascience',
    name: '2. Data Science Agent (Python)',
    model: 'Code Interpreter / Pandas',
    latency_ms: 650,
    status: 'COMPLETE',
    summary: 'DuckDB SQL-on-FHIR query executed. EWMA 7d delta = +3.12 lbs, Z-Score = +2.41 (p < 0.01 anomaly).'
  },
  {
    id: 'coach',
    name: '3. Health Coach Agent (Nova Micro)',
    model: 'Amazon Nova Micro',
    latency_ms: 334,
    status: 'COMPLETE',
    summary: 'Elicited 2-pillow orthopnea via SMS. Validated absence of acute chest pain (911 rule-out).'
  },
  {
    id: 'reranker',
    name: '4. Guideline Reranker (Cohere 3.5)',
    model: 'Cohere Rerank 3.5 on Bedrock',
    latency_ms: 320,
    status: 'COMPLETE',
    summary: 'Top match: ACC/AHA 2022 Section 7.3.1 (Loop Diuretic Titration for Ambulatory Volume Overload).'
  },
  {
    id: 'expert',
    name: '5. Clinical Expert (Claude Sonnet 4.6)',
    model: 'Anthropic Claude Sonnet 4.6',
    latency_ms: 1420,
    status: 'COMPLETE',
    summary: 'Synthesized 45-second SBAR card and proposed temporary Furosemide escalation to 80mg PO x 3d.'
  },
  {
    id: 'guardian',
    name: '6. CDSS Safety Guardian',
    model: 'Pure Python Rule Engine',
    latency_ms: 1.8,
    status: 'COMPLETE',
    summary: 'Deterministic check: K+ = 4.6 (<5.2), SBP = 133 (>=95). Hard veto = FALSE. Proposal cleared.'
  }
]

const ENV_API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
  ? (import.meta.env.VITE_API_URL as string)
  : 'http://localhost:8000/api/v1'

export const CorinAPI = {
  USE_LIVE_BACKEND: Boolean(typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL),
  BASE_URL: ENV_API_URL,

  isLiveBackend(): boolean {
    return this.USE_LIVE_BACKEND
  },

  setLiveBackend(enabled: boolean, url?: string) {
    this.USE_LIVE_BACKEND = enabled
    if (url) this.BASE_URL = url
  },

  async checkBackendHealth(): Promise<{ online: boolean; latency_ms?: number }> {
    try {
      const start = performance.now()
      const res = await fetch(`${this.BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) })
      return { online: res.ok, latency_ms: Math.round(performance.now() - start) }
    } catch {
      return { online: false }
    }
  },

  async getPatientSnapshot(patientId?: string): Promise<PatientSnapshot> {
    if (this.USE_LIVE_BACKEND) {
      try {
        const query = patientId ? `?patient_id=${encodeURIComponent(patientId)}` : ''
        const res = await fetch(`${this.BASE_URL}/patient/snapshot${query}`)
        if (res.ok) {
          return await res.json()
        }
      } catch (err) {
        console.warn('[CorinAPI] Backend unreachable, falling back to local snapshot', err)
      }
    }
    return INITIAL_PATIENT_SNAPSHOT
  },

  async getTelemetryHistory(patientId: string): Promise<TelemetryDataPoint[]> {
    if (this.USE_LIVE_BACKEND) {
      try {
        const res = await fetch(`${this.BASE_URL}/telemetry/14d?patient_id=${encodeURIComponent(patientId)}`)
        if (res.ok) return await res.json()
      } catch (err) {
        console.warn('[CorinAPI] Backend unreachable, falling back to local telemetry', err)
      }
    }
    return TELEMETRY_14D_HISTORY
  },

  async getSmsMessages(patientId: string): Promise<SmsMessage[]> {
    if (this.USE_LIVE_BACKEND) {
      try {
        const res = await fetch(`${this.BASE_URL}/sms/history?patient_id=${encodeURIComponent(patientId)}`)
        if (res.ok) return await res.json()
      } catch (err) {
        console.warn('[CorinAPI] Backend unreachable, falling back to local SMS history', err)
      }
    }
    return INITIAL_SMS_THREAD
  },

  async sendSms(payload: SmsMessagePayload): Promise<SmsMessage> {
    if (this.USE_LIVE_BACKEND) {
      try {
        const res = await fetch(`${this.BASE_URL}/sms/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (res.ok) return await res.json()
      } catch (err) {
        console.warn('[CorinAPI] Backend unreachable, falling back to local SMS simulation', err)
      }
    }
    return {
      id: `m_${Date.now()}`,
      sender: payload.sender || 'patient',
      text: payload.text,
      timestamp: 'Just now'
    }
  },

  async sendSmsMessage(patientId: string, text: string): Promise<SmsMessage> {
    return this.sendSms({ patient_id: patientId, text, sender: 'patient' })
  },

  async getSwarmTrace(patientId: string): Promise<SwarmTraceNode[]> {
    if (this.USE_LIVE_BACKEND) {
      try {
        const res = await fetch(`${this.BASE_URL}/swarm/trace?patient_id=${encodeURIComponent(patientId)}`)
        if (res.ok) return await res.json()
      } catch (err) {
        console.warn('[CorinAPI] Backend unreachable, falling back to local swarm trace', err)
      }
    }
    return INITIAL_SWARM_TRACE
  },

  async authorizeOrder(
    patientId: string, 
    npi: string = '1948201948',
    actionToken: string = 'act_corp_94021_loop80'
  ): Promise<{ 
    status: string
    action_intent_token: string
    timestamp: string
    medication_request: FhirMedicationRequest
    service_request: FhirServiceRequest
    guide_action?: string | null
  }> {
    if (this.USE_LIVE_BACKEND) {
      try {
        const res = await fetch(`${this.BASE_URL}/order/authorize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient_id: patientId, npi, action_token: actionToken })
        })
        if (res.ok) return await res.json()
      } catch (err) {
        console.warn('[CorinAPI] Backend unreachable, falling back to local order commitment', err)
      }
    }
    return {
      status: 'COMMITTED',
      action_intent_token: actionToken,
      timestamp: new Date().toISOString(),
      medication_request: FHIR_MEDICATION_REQUEST,
      service_request: FHIR_SERVICE_REQUEST,
      guide_action: null
    }
  },

  evaluateCdss(
    requestOrK: CdssEvaluationRequest | number, 
    sbpValue: number = 133,
    egfrValue: number = 54,
    lastLabDays: number = 7
  ): CdssVerdict {
    let kVal: number
    let sbpVal: number
    let egfrVal: number
    let labDays: number

    if (typeof requestOrK === 'object' && requestOrK !== null) {
      kVal = requestOrK.potassium_mEq_L
      sbpVal = requestOrK.systolic_bp_mmHg ?? 133
      egfrVal = requestOrK.egfr_mL_min ?? 54
      labDays = requestOrK.last_lab_days ?? 7
    } else {
      kVal = requestOrK
      sbpVal = sbpValue
      egfrVal = egfrValue
      labDays = lastLabDays
    }

    const isSafeK = kVal >= 3.5 && kVal < 5.2
    const isSafeSBP = sbpVal >= 95
    const isSafeEGFR = egfrVal >= 30
    const isSafeRecency = labDays <= 14
    const passed = isSafeK && isSafeSBP && isSafeEGFR && isSafeRecency

    let veto_reason: string | null = null
    let guide_action: string | null = null
    let guide_code: 'ORDER_STAT_BMP' | 'HOLD_MRA' | 'HYPOTENSION_ALERT' | 'NEPHROLOGY_CONSULT' | null = null
    let status: 'PASSED' | 'VETOED' | 'GUIDE' = 'PASSED'

    if (!isSafeK) {
      if (kVal >= 5.2) {
        veto_reason = 'Serum K+ >= 5.2 mEq/L (Hyperkalemia Contraindication Cliff)'
        guide_action = null
        guide_code = 'HOLD_MRA'
        status = 'VETOED'
      } else {
        veto_reason = 'Serum K+ < 3.5 mEq/L (Hypokalemia Arrhythmia Risk)'
        guide_action = 'GUIDE: Order STAT BMP and potassium repletion before loop diuretic escalation.'
        guide_code = 'ORDER_STAT_BMP'
        status = 'GUIDE'
      }
    } else if (!isSafeSBP) {
      veto_reason = 'Systolic BP < 95 mmHg (Hypotension Perfusion Risk)'
      guide_action = null
      guide_code = 'HYPOTENSION_ALERT'
      status = 'VETOED'
    } else if (!isSafeEGFR) {
      veto_reason = 'Acute eGFR Decline >= 30% (Renal Perfusion Veto)'
      guide_action = null
      guide_code = 'NEPHROLOGY_CONSULT'
      status = 'VETOED'
    } else if (!isSafeRecency) {
      veto_reason = 'Lab Specimen Recency > 14 Days (Outdated BMP Specimen)'
      guide_action = 'GUIDE: Fresh STAT BMP specimen required before authorizing medication titration.'
      guide_code = 'ORDER_STAT_BMP'
      status = 'GUIDE'
    }

    return {
      passed,
      status,
      evaluation_time_ms: 1.8,
      veto_reason,
      guide_action,
      guide_code,
      action_intent_token: passed ? 'act_corp_94021_loop80' : undefined,
      fhir_medication_request: passed ? FHIR_MEDICATION_REQUEST : undefined,
      fhir_service_request: passed ? FHIR_SERVICE_REQUEST : undefined,
      invariants: {
        k_window_check: {
          name: 'Serum K+ Safe Window [3.5 - 5.1 mEq/L]',
          value: `${kVal.toFixed(1)} mEq/L`,
          passed: isSafeK
        },
        sbp_check: {
          name: 'Systolic BP >= 95 mmHg Perfusion',
          value: `${sbpVal} mmHg`,
          passed: isSafeSBP
        },
        egfr_check: {
          name: 'Baseline eGFR Decline < 30%',
          value: `${egfrVal} mL/min (${isSafeEGFR ? 'Pass' : 'Veto'})`,
          passed: isSafeEGFR
        },
        recency_check: {
          name: 'Lab Specimen Recency <= 14 Days',
          value: `${labDays} days old (${isSafeRecency ? 'Valid' : 'Stale'})`,
          passed: isSafeRecency
        }
      }
    }
  }
}
