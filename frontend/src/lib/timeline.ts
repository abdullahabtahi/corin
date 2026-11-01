import type { 
  PatientClinicalSnapshot, 
  TimelineDayInfo, 
  CaliperProbe 
} from '../types/clinical'
import { INITIAL_PATIENT_SNAPSHOT } from './api'

/**
 * Calculates bio-rhythmic cardiac cycle period in milliseconds:
 * T = (60 / resting_hr_bpm) * 1000
 * E.g.: 82 bpm => 731.7ms; 68 bpm => 882.4ms
 */
export function getCardiacCycleDurationMs(restingHr: number): number {
  const safeHr = Math.max(40, Math.min(180, restingHr || 82))
  return Number(((60 / safeHr) * 1000).toFixed(1))
}

/**
 * Mapping of 14-day timeline telemetry milestones and clinical annotations
 */
export const TIMELINE_14D_DETAILS: TimelineDayInfo[] = [
  {
    day: 1,
    relativeDay: -14,
    label: 'Day -14',
    date: 'Oct 18',
    raw_weight_lbs: 180.8,
    ewma_weight_lbs: 180.9,
    resting_hr_bpm: 68,
    z_score: -0.12,
    weight_delta_lbs: -0.2,
    hr_drift_bpm: 0,
    orthopnea_pillows: 0,
    cardiorenal_age: 71,
    risk_score: 14.2,
    urgency_tier: 'ROUTINE',
    milestone: 'Baseline Dry',
    clinical_note: 'Arthur at stable dry baseline (180.8 lbs). Zero nocturnal dyspnea, normal renal perfusion.'
  },
  {
    day: 2,
    relativeDay: -13,
    label: 'Day -13',
    date: 'Oct 19',
    raw_weight_lbs: 181.1,
    ewma_weight_lbs: 181.0,
    resting_hr_bpm: 67,
    z_score: 0.08,
    weight_delta_lbs: 0.1,
    hr_drift_bpm: -1,
    orthopnea_pillows: 0,
    cardiorenal_age: 71,
    risk_score: 15.5,
    urgency_tier: 'ROUTINE',
    clinical_note: 'Telemetry well within +/- 1.96 sigma confidence corridor. Sleep efficiency 92%.'
  },
  {
    day: 3,
    relativeDay: -12,
    label: 'Day -12',
    date: 'Oct 20',
    raw_weight_lbs: 180.9,
    ewma_weight_lbs: 180.95,
    resting_hr_bpm: 69,
    z_score: -0.05,
    weight_delta_lbs: -0.1,
    hr_drift_bpm: 1,
    orthopnea_pillows: 0,
    cardiorenal_age: 71,
    risk_score: 16.1,
    urgency_tier: 'ROUTINE',
    clinical_note: 'Nocturnal respiratory rate 14 breaths/min. Full GDMT adherence verified.'
  },
  {
    day: 4,
    relativeDay: -11,
    label: 'Day -11',
    date: 'Oct 21',
    raw_weight_lbs: 181.2,
    ewma_weight_lbs: 181.02,
    resting_hr_bpm: 68,
    z_score: 0.12,
    weight_delta_lbs: 0.2,
    hr_drift_bpm: 0,
    orthopnea_pillows: 0,
    cardiorenal_age: 72,
    risk_score: 18.0,
    urgency_tier: 'ROUTINE',
    clinical_note: 'Ambulatory blood pressure 122/79 mmHg. Normal urine sodium excretion.'
  },
  {
    day: 5,
    relativeDay: -10,
    label: 'Day -10',
    date: 'Oct 22',
    raw_weight_lbs: 181.0,
    ewma_weight_lbs: 181.01,
    resting_hr_bpm: 70,
    z_score: 0.00,
    weight_delta_lbs: 0.0,
    hr_drift_bpm: 2,
    orthopnea_pillows: 0,
    cardiorenal_age: 72,
    risk_score: 20.4,
    urgency_tier: 'ROUTINE',
    clinical_note: 'Daily weight on target at 181.0 lbs baseline. Morning Lasix 40mg confirmed.'
  },
  {
    day: 6,
    relativeDay: -9,
    label: 'Day -9',
    date: 'Oct 23',
    raw_weight_lbs: 181.4,
    ewma_weight_lbs: 181.12,
    resting_hr_bpm: 69,
    z_score: 0.25,
    weight_delta_lbs: 0.4,
    hr_drift_bpm: 1,
    orthopnea_pillows: 0,
    cardiorenal_age: 72,
    risk_score: 24.1,
    urgency_tier: 'ROUTINE',
    clinical_note: 'Mild transient fluid fluctuation (+0.4 lbs). Autonomic HRV rmssd 28ms.'
  },
  {
    day: 7,
    relativeDay: -8,
    label: 'Day -8',
    date: 'Oct 24',
    raw_weight_lbs: 181.2,
    ewma_weight_lbs: 181.14,
    resting_hr_bpm: 70,
    z_score: 0.15,
    weight_delta_lbs: 0.2,
    hr_drift_bpm: 2,
    orthopnea_pillows: 0,
    cardiorenal_age: 73,
    risk_score: 28.5,
    urgency_tier: 'ROUTINE',
    clinical_note: 'End of 7-day stable baseline. BMP lab draw scheduled at Quest Diagnostics.'
  },
  {
    day: 8,
    relativeDay: -7,
    label: 'Day -7',
    date: 'Oct 25',
    raw_weight_lbs: 181.6,
    ewma_weight_lbs: 181.28,
    resting_hr_bpm: 74,
    z_score: 0.38,
    weight_delta_lbs: 0.6,
    hr_drift_bpm: 6,
    orthopnea_pillows: 0,
    cardiorenal_age: 73,
    risk_score: 36.8,
    urgency_tier: 'MONITOR',
    milestone: 'Sympathetic Drift',
    clinical_note: 'Subclinical autonomic sympathetic drift detected (+6 bpm resting HR elevation, 181.6 lbs). Weight remains near baseline.'
  },
  {
    day: 9,
    relativeDay: -6,
    label: 'Day -6',
    date: 'Oct 26',
    raw_weight_lbs: 181.8,
    ewma_weight_lbs: 181.42,
    resting_hr_bpm: 74,
    z_score: 0.52,
    weight_delta_lbs: 0.8,
    hr_drift_bpm: 6,
    orthopnea_pillows: 0,
    cardiorenal_age: 74,
    risk_score: 42.0,
    urgency_tier: 'MONITOR',
    clinical_note: 'Splanchnic vascular tone shifting. Resting pulse stabilizes elevated at 74 bpm.'
  },
  {
    day: 10,
    relativeDay: -5,
    label: 'Day -5',
    date: 'Oct 27',
    raw_weight_lbs: 182.0,
    ewma_weight_lbs: 181.58,
    resting_hr_bpm: 75,
    z_score: 0.65,
    weight_delta_lbs: 1.0,
    hr_drift_bpm: 7,
    orthopnea_pillows: 0,
    cardiorenal_age: 74,
    risk_score: 47.3,
    urgency_tier: 'MONITOR',
    clinical_note: 'Verified Quest BMP results: K+ 4.6 mEq/L, eGFR 54 mL/min (CKD 3a stable).'
  },
  {
    day: 11,
    relativeDay: -4,
    label: 'Day -4',
    date: 'Oct 28',
    raw_weight_lbs: 182.8,
    ewma_weight_lbs: 181.92,
    resting_hr_bpm: 75,
    z_score: 1.25,
    weight_delta_lbs: 1.8,
    hr_drift_bpm: 7,
    orthopnea_pillows: 0,
    cardiorenal_age: 75,
    risk_score: 55.0,
    urgency_tier: 'MONITOR',
    clinical_note: 'Gradual interstitial transudation accelerating. Resting HR steady at 75 bpm.'
  },
  {
    day: 12,
    relativeDay: -3,
    label: 'Day -3',
    date: 'Oct 29',
    raw_weight_lbs: 184.0,
    ewma_weight_lbs: 182.50,
    resting_hr_bpm: 77,
    z_score: 2.05,
    weight_delta_lbs: 3.0,
    hr_drift_bpm: 9,
    orthopnea_pillows: 1,
    cardiorenal_age: 76,
    risk_score: 68.5,
    urgency_tier: 'URGENT',
    milestone: 'Velocity Inflection',
    clinical_note: 'Weight velocity inflection threshold crossed (+3.0 lbs 48h surge). Patient props 1 extra pillow for nocturnal comfort.'
  },
  {
    day: 13,
    relativeDay: -1,
    label: 'Day -1',
    date: 'Oct 30',
    raw_weight_lbs: 184.2,
    ewma_weight_lbs: 182.72,
    resting_hr_bpm: 80,
    z_score: 2.22,
    weight_delta_lbs: 3.2,
    hr_drift_bpm: 12,
    orthopnea_pillows: 2,
    cardiorenal_age: 77,
    risk_score: 79.2,
    urgency_tier: 'URGENT',
    clinical_note: 'Rapid volume accumulation (+3.2 lbs). Pulmonary interstitial congestion escalating; Arthur propped 2 pillows.'
  },
  {
    day: 14,
    relativeDay: 0,
    label: 'Day 0',
    date: 'Oct 31',
    raw_weight_lbs: 184.6,
    ewma_weight_lbs: 182.93,
    resting_hr_bpm: 82,
    z_score: 2.41,
    weight_delta_lbs: 3.6,
    hr_drift_bpm: 14,
    orthopnea_pillows: 2,
    cardiorenal_age: 78,
    risk_score: 87.4,
    urgency_tier: 'URGENT',
    milestone: 'Acute Decompensation Alert',
    clinical_note: 'Acute decompensation alert (+3.6 lbs, 82 bpm, 2-pillow orthopnea). ACC/AHA titration protocol pre-drafted.'
  }
]

export function getTimelineDayInfo(dayNumber: number): TimelineDayInfo {
  const clampedDay = Math.max(1, Math.min(14, Math.round(dayNumber || 14)))
  return TIMELINE_14D_DETAILS[clampedDay - 1] || TIMELINE_14D_DETAILS[13]
}

/**
 * Creates an interpolated patient snapshot corresponding to the active timeline day.
 * When dayNumber is 14 with no probes, matches INITIAL_PATIENT_SNAPSHOT exactly.
 */
export function getInterpolatedPatientForDay(
  dayNumber: number,
  basePatient: PatientClinicalSnapshot = INITIAL_PATIENT_SNAPSHOT,
  caliperProbe?: CaliperProbe,
  kOverride?: number
): PatientClinicalSnapshot {
  const info = getTimelineDayInfo(dayNumber)
  const isDay14 = dayNumber === 14

  // Caliper probe overrides
  const effectiveK = kOverride !== undefined 
    ? kOverride 
    : caliperProbe?.metric === 'potassium' && caliperProbe.value !== null
    ? caliperProbe.value
    : basePatient.labs.potassium_mEq_L

  const effectiveWeightDelta48h = caliperProbe?.metric === 'weight' && caliperProbe.value !== null
    ? caliperProbe.value
    : isDay14
    ? basePatient.trajectory.weight_delta_48h
    : info.weight_delta_lbs

  const effectiveRestingHr = caliperProbe?.metric === 'hr' && caliperProbe.value !== null
    ? caliperProbe.value
    : isDay14
    ? basePatient.trajectory.resting_hr_bpm
    : info.resting_hr_bpm

  const effectiveHrDrift = effectiveRestingHr - 68

  const effectiveSystolicBp = isDay14
    ? basePatient.trajectory.blood_pressure_sys
    : Math.round(120 + ((info.day - 1) / 13) * 13)

  const effectiveDiastolicBp = isDay14
    ? basePatient.trajectory.blood_pressure_dia
    : Math.round(78 + ((info.day - 1) / 13) * 6)

  const effectiveEgfr = isDay14
    ? basePatient.labs.egfr_mL_min
    : Math.round(58 - ((info.day - 1) / 13) * 4)

  const effectiveCardiorenalAge = isDay14
    ? basePatient.heart_age_estimate
    : info.cardiorenal_age

  const effectiveRiskScore = isDay14
    ? basePatient.risk_score
    : info.risk_score

  const effectivePillows = isDay14
    ? basePatient.symptoms.pillows_count
    : info.orthopnea_pillows

  const kStatus: 'optimal' | 'suboptimal' | 'critical' = 
    effectiveK >= 5.2 || effectiveK < 3.5 ? 'critical' : 'optimal'

  return {
    ...basePatient,
    heart_age_estimate: effectiveCardiorenalAge,
    risk_score: effectiveRiskScore,
    urgency_tier: isDay14 ? basePatient.urgency_tier : info.urgency_tier,
    trajectory: {
      ...basePatient.trajectory,
      current_weight_lbs: isDay14 ? basePatient.trajectory.current_weight_lbs : info.raw_weight_lbs,
      weight_delta_48h: effectiveWeightDelta48h,
      weight_delta_7d: isDay14 ? basePatient.trajectory.weight_delta_7d : info.weight_delta_lbs,
      resting_hr_bpm: effectiveRestingHr,
      hr_drift_bpm: effectiveHrDrift,
      blood_pressure_sys: effectiveSystolicBp,
      blood_pressure_dia: effectiveDiastolicBp,
      z_score: isDay14 ? basePatient.trajectory.z_score : info.z_score,
      is_telemetry_anomaly: isDay14 ? basePatient.trajectory.is_telemetry_anomaly : info.z_score >= 2.0
    },
    labs: {
      ...basePatient.labs,
      potassium_mEq_L: effectiveK,
      potassium_status: kStatus,
      egfr_mL_min: effectiveEgfr
    },
    symptoms: {
      ...basePatient.symptoms,
      orthopnea_present: effectivePillows > 0,
      pillows_count: effectivePillows,
      reported_text: isDay14
        ? basePatient.symptoms.reported_text
        : effectivePillows > 0
        ? `Arthur: Needed ${effectivePillows} extra pillow${effectivePillows > 1 ? 's' : ''} to sleep.`
        : 'Arthur: Sleeping flat comfortably without shortness of breath.'
    },
    organ_telemetry: {
      ...basePatient.organ_telemetry,
      cardio: {
        ...basePatient.organ_telemetry.cardio,
        resting_hr: effectiveRestingHr,
        hr_drift: effectiveHrDrift,
        sbp: effectiveSystolicBp,
        dbp: effectiveDiastolicBp,
        cardiorenal_age: effectiveCardiorenalAge,
        accelerated_age_delta: effectiveCardiorenalAge - basePatient.age
      },
      lungs: {
        ...basePatient.organ_telemetry.lungs,
        orthopnea_pillows: effectivePillows,
        pef_l_min: isDay14 ? basePatient.organ_telemetry.lungs.pef_l_min : Math.round(410 - ((info.day - 1) / 13) * 100),
        splanchnic_congestion_score: isDay14 ? basePatient.organ_telemetry.lungs.splanchnic_congestion_score : Math.round(20 + ((info.day - 1) / 13) * 64)
      },
      kidneys: {
        ...basePatient.organ_telemetry.kidneys,
        potassium_mEq_L: effectiveK,
        egfr_mL_min: effectiveEgfr,
        safety_window_passed: effectiveK >= 3.5 && effectiveK < 5.2
      }
    }
  }
}
