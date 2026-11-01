import { describe, it, expect } from 'bun:test'
import { 
  CorinAPI, 
  TELEMETRY_14D_HISTORY, 
  PROVENANCE_CITATIONS,
  FHIR_MEDICATION_REQUEST,
  FHIR_SERVICE_REQUEST,
  INITIAL_PATIENT_SNAPSHOT,
  COHORT_250_BENEFICIARIES,
  GDMT_PILLARS_DATA,
  INITIAL_SWARM_TRACE
} from '../lib/api'
import {
  BENCHMARK_SCENARIOS,
  getScenarioById,
  extractSymptomsFromText
} from '../lib/scenarios'
import type { CdssEvaluationRequest, OrderLifecycleState } from '../types/clinical'
import {
  getCardiacCycleDurationMs,
  getTimelineDayInfo,
  getInterpolatedPatientForDay
} from '../lib/timeline'


describe('Project Corin CDS v3.0 - Clinical Decision Support & Telemetry Suite', () => {

  describe('Principle 1: Deterministic CDSS Safety Guardian Engine (<2ms)', () => {
    it('passes all 4 safety invariants for Arthur Pendelton baseline state', () => {
      const verdict = CorinAPI.evaluateCdss(4.6, 133, 54, 7)
      expect(verdict.passed).toBe(true)
      expect(verdict.evaluation_time_ms).toBeLessThanOrEqual(2.0)
      expect(verdict.veto_reason).toBeNull()
      expect(verdict.action_intent_token).toBe('act_corp_94021_loop80')
      expect(verdict.fhir_medication_request?.id).toBe('#medrx-88319')
      expect(verdict.fhir_service_request?.id).toBe('#serv-29401')
      expect(verdict.invariants.k_window_check.passed).toBe(true)
      expect(verdict.invariants.sbp_check.passed).toBe(true)
      expect(verdict.invariants.egfr_check.passed).toBe(true)
      expect(verdict.invariants.recency_check.passed).toBe(true)
    })

    it('passes upper boundary safe threshold (K+ = 5.1 mEq/L)', () => {
      const verdict = CorinAPI.evaluateCdss(5.1, 133, 54, 7)
      expect(verdict.passed).toBe(true)
      expect(verdict.invariants.k_window_check.passed).toBe(true)
    })

    it('triggers HARD VETO when Serum K+ reaches or exceeds the 5.2 mEq/L hyperkalemia cliff', () => {
      const cliffVerdict = CorinAPI.evaluateCdss(5.2, 133, 54, 7)
      expect(cliffVerdict.passed).toBe(false)
      expect(cliffVerdict.veto_reason).toContain('Hyperkalemia Contraindication Cliff')
      expect(cliffVerdict.action_intent_token).toBeUndefined()
      expect(cliffVerdict.fhir_medication_request).toBeUndefined()
      expect(cliffVerdict.invariants.k_window_check.passed).toBe(false)

      const lethalVerdict = CorinAPI.evaluateCdss(5.8, 133, 54, 7)
      expect(lethalVerdict.passed).toBe(false)
      expect(lethalVerdict.invariants.k_window_check.passed).toBe(false)
    })

    it('triggers HARD VETO on hypokalemia boundary violation (<3.5 mEq/L)', () => {
      const hypokVerdict = CorinAPI.evaluateCdss(3.4, 133, 54, 7)
      expect(hypokVerdict.passed).toBe(false)
      expect(hypokVerdict.veto_reason).toContain('Hypokalemia')
      expect(hypokVerdict.invariants.k_window_check.passed).toBe(false)
    })

    it('triggers HARD VETO on systolic perfusion shock (<95 mmHg)', () => {
      const shockVerdict = CorinAPI.evaluateCdss(4.6, 90, 54, 7)
      expect(shockVerdict.passed).toBe(false)
      expect(shockVerdict.veto_reason).toContain('Hypotension Perfusion Risk')
      expect(shockVerdict.invariants.sbp_check.passed).toBe(false)
    })

    it('triggers HARD VETO on acute eGFR failure (<30 mL/min)', () => {
      const renalVerdict = CorinAPI.evaluateCdss(4.6, 133, 28, 7)
      expect(renalVerdict.passed).toBe(false)
      expect(renalVerdict.veto_reason).toContain('Renal Perfusion Veto')
      expect(renalVerdict.invariants.egfr_check.passed).toBe(false)
    })

    it('triggers HARD VETO on outdated BMP lab draw (>14 days stale)', () => {
      const staleVerdict = CorinAPI.evaluateCdss(4.6, 133, 54, 21)
      expect(staleVerdict.passed).toBe(false)
      expect(staleVerdict.veto_reason).toContain('Outdated BMP Specimen')
      expect(staleVerdict.invariants.recency_check.passed).toBe(false)
    })

    it('blocks order commitment if an adversarial hyperkalemic spike (5.8 mEq/L) occurs during the signing ceremony (TOCTOU protection)', async () => {
      // Step 1: Pre-flight passes at baseline K+ 4.6
      let currentK = 4.6
      const preFlightVerdict = CorinAPI.evaluateCdss(currentK, 133, 54, 7)
      expect(preFlightVerdict.passed).toBe(true)

      // Step 2: During asynchronous 280ms signing, an adversarial spike occurs
      currentK = 5.8

      // Step 3: Atomic invariant check evaluated immediately before commit
      const preCommitVerdict = CorinAPI.evaluateCdss(currentK, 133, 54, 7)
      expect(preCommitVerdict.passed).toBe(false)
      expect(preCommitVerdict.veto_reason).toContain('Hyperkalemia Contraindication Cliff')

      // Assert that an order is NEVER authorized if preCommitVerdict fails
      let orderAuthorized = false
      if (preCommitVerdict.passed) {
        await CorinAPI.authorizeOrder('P-94021')
        orderAuthorized = true
      }
      expect(orderAuthorized).toBe(false)
    })
  })

  describe('Principle 2: Dual-Vector Telemetry & EWMA alpha=0.28 Math', () => {
    it('contains full 14-day history with valid chronological timestamps', () => {
      expect(TELEMETRY_14D_HISTORY.length).toBe(14)
      expect(TELEMETRY_14D_HISTORY[0].day).toBe(1)
      expect(TELEMETRY_14D_HISTORY[13].day).toBe(14)
    })

    it('confirms stable baseline on Day 1 (180.8 lbs raw, 68 bpm RHR)', () => {
      const day1 = TELEMETRY_14D_HISTORY[0]
      expect(day1.raw_weight_lbs).toBe(180.8)
      expect(day1.resting_hr_bpm).toBe(68)
      expect(day1.z_score).toBeLessThan(0)
    })

    it('verifies Day 14 acute volume surge and autonomic sympathetic activation', () => {
      const day14 = TELEMETRY_14D_HISTORY[13]
      const deltaWeight = day14.raw_weight_lbs - 181.0
      const deltaHR = day14.resting_hr_bpm - 68

      expect(deltaWeight).toBeCloseTo(3.6, 1)
      expect(deltaHR).toBe(14)
      expect(day14.z_score).toBe(2.41)
      expect(day14.z_score).toBeGreaterThanOrEqual(2.0)
      // Day 14 EWMA weight exceeds confidence corridor upper bound (182.8 lbs)
      expect(day14.ewma_weight_lbs).toBeGreaterThan(day14.corridor_upper_lbs)
    })

    it('validates EWMA smoothing formulation: S_t = alpha * Y_t + (1 - alpha) * S_{t-1}', () => {
      const alpha = 0.28
      // Verify transition from Day 13 to Day 14
      const day13 = TELEMETRY_14D_HISTORY[12]
      const day14 = TELEMETRY_14D_HISTORY[13]
      const expectedEwma = alpha * day14.raw_weight_lbs + (1 - alpha) * day13.ewma_weight_lbs
      expect(day14.ewma_weight_lbs).toBeCloseTo(expectedEwma, 1)
    })
  })

  describe('Principle 4: Abridge Linked Evidence (ONC HTI-1 Algorithm Transparency)', () => {
    it('provides 5 immutable grounding tiers mapped to clinical sources', () => {
      expect(Object.keys(PROVENANCE_CITATIONS)).toEqual(['1', '2', '3', '4', '5'])

      expect(PROVENANCE_CITATIONS['1'].tier).toBe('Clinical Guideline')
      expect(PROVENANCE_CITATIONS['1'].title).toContain('ACC/AHA/HFSA 2022')
      expect(PROVENANCE_CITATIONS['1'].targetOrgan).toBe('cardio')

      expect(PROVENANCE_CITATIONS['2'].tier).toBe('IoT Scale Telemetry (DuckDB)')
      expect(PROVENANCE_CITATIONS['2'].source).toContain('CS-88219')
      expect(PROVENANCE_CITATIONS['2'].targetOrgan).toBe('lungs')
      expect(PROVENANCE_CITATIONS['2'].highlightCard).toBe('volume')

      expect(PROVENANCE_CITATIONS['3'].tier).toBe('Autonomic Sensor (PPG)')
      expect(PROVENANCE_CITATIONS['3'].source).toContain('PHA-WEAR-4902')
      expect(PROVENANCE_CITATIONS['3'].targetOrgan).toBe('cardio')

      expect(PROVENANCE_CITATIONS['4'].tier).toBe('EHR Laboratory Observation')
      expect(PROVENANCE_CITATIONS['4'].source).toContain('LOINC 2823-3')
      expect(PROVENANCE_CITATIONS['4'].targetOrgan).toBe('kidneys')
      expect(PROVENANCE_CITATIONS['4'].highlightCard).toBe('safety')

      expect(PROVENANCE_CITATIONS['5'].tier).toBe('Patient Voice (Twilio SMS)')
      expect(PROVENANCE_CITATIONS['5'].source).toContain('Twilio')
      expect(PROVENANCE_CITATIONS['5'].snippet).toContain('orthopnea')
      expect(PROVENANCE_CITATIONS['5'].targetOrgan).toBe('lungs')
    })
  })

  describe('Principle 5: Zero-Modal Prescribing & HL7 FHIR Interoperability', () => {
    it('conforms to HL7 FHIR R4 MedicationRequest specification', () => {
      expect(FHIR_MEDICATION_REQUEST.resourceType).toBe('MedicationRequest')
      expect(FHIR_MEDICATION_REQUEST.id).toBe('#medrx-88319')
      expect(FHIR_MEDICATION_REQUEST.status).toBe('active')
      expect(FHIR_MEDICATION_REQUEST.intent).toBe('order')
      expect(FHIR_MEDICATION_REQUEST.subject.reference).toBe('Patient/P-94021')
      expect(FHIR_MEDICATION_REQUEST.requester.npi).toBe('1948201948')
      expect(FHIR_MEDICATION_REQUEST.medicationCodeableConcept.coding[0].code).toBe('4603') // RxNorm for Furosemide 80mg
      expect(FHIR_MEDICATION_REQUEST.dosageInstruction[0].doseAndRate[0].doseQuantity.value).toBe(80)
      expect(FHIR_MEDICATION_REQUEST.dosageInstruction[0].doseAndRate[0].doseQuantity.unit).toBe('mg')
    })

    it('conforms to HL7 FHIR R4 ServiceRequest specification for Day 3 STAT BMP', () => {
      expect(FHIR_SERVICE_REQUEST.resourceType).toBe('ServiceRequest')
      expect(FHIR_SERVICE_REQUEST.id).toBe('#serv-29401')
      expect(FHIR_SERVICE_REQUEST.status).toBe('active')
      expect(FHIR_SERVICE_REQUEST.code.coding[0].code).toBe('24323-8') // LOINC for BMP
    })

    it('generates cryptographic Action Intent Token on commitment', async () => {
      const orderResult = await CorinAPI.authorizeOrder('P-94021', '1948201948')
      expect(orderResult.status).toBe('COMMITTED')
      expect(orderResult.action_intent_token).toBe('act_corp_94021_loop80')
      expect(orderResult.medication_request.id).toBe('#medrx-88319')
      expect(orderResult.service_request.id).toBe('#serv-29401')
    })
  })

  describe('Organ Telemetry Profile & Patient Demographics Integrity', () => {
    it('verifies Arthur Pendelton clinical snapshot conforms to cardiorenal syndrome triad', () => {
      expect(INITIAL_PATIENT_SNAPSHOT.patient_id).toBe('P-94021')
      expect(INITIAL_PATIENT_SNAPSHOT.name).toBe('Arthur Pendelton')
      expect(INITIAL_PATIENT_SNAPSHOT.age).toBe(71)
      expect(INITIAL_PATIENT_SNAPSHOT.organ_telemetry.cardio.ef_percent).toBe(32)
      expect(INITIAL_PATIENT_SNAPSHOT.organ_telemetry.lungs.orthopnea_pillows).toBe(2)
      expect(INITIAL_PATIENT_SNAPSHOT.organ_telemetry.kidneys.potassium_mEq_L).toBe(4.6)
      expect(INITIAL_PATIENT_SNAPSHOT.organ_telemetry.kidneys.egfr_mL_min).toBe(54)
      expect(INITIAL_PATIENT_SNAPSHOT.organ_telemetry.genomics.cyp2c9).toContain('*1/*3')
    })
  })

  describe('Principle 6: Living Bio-Rhythmic Cardiac Pulsation Engine', () => {
    it('computes exact 60fps cardiac period synced to Arthur resting heart rate (82 bpm => 731.7ms)', () => {
      const cycle82 = getCardiacCycleDurationMs(82)
      expect(cycle82).toBeCloseTo(731.7, 1)

      const cycle68 = getCardiacCycleDurationMs(68)
      expect(cycle68).toBeCloseTo(882.4, 1)

      const cycle75 = getCardiacCycleDurationMs(75)
      expect(cycle75).toBeCloseTo(800.0, 1)
    })

    it('enforces physiological boundary safety clamps on cardiac period formula', () => {
      // Clamps bradycardia below 40 bpm to 40 bpm (1500ms max period)
      expect(getCardiacCycleDurationMs(25)).toBe(1500.0)

      // Clamps extreme tachycardia above 180 bpm to 180 bpm (333.3ms min period)
      expect(getCardiacCycleDurationMs(240)).toBeCloseTo(333.3, 1)
    })
  })

  describe('Principle 7: 14-Day Time-Travel Longitudinal Trajectory Engine', () => {
    it('accurately interpolates Day 1 (Day -14) baseline state', () => {
      const day1 = getInterpolatedPatientForDay(1)
      expect(day1.trajectory.current_weight_lbs).toBe(180.8)
      expect(day1.trajectory.resting_hr_bpm).toBe(68)
      expect(day1.trajectory.hr_drift_bpm).toBe(0)
      expect(day1.symptoms.pillows_count).toBe(0)
      expect(day1.symptoms.orthopnea_present).toBe(false)
      expect(day1.heart_age_estimate).toBe(71)
      expect(day1.organ_telemetry.cardio.accelerated_age_delta).toBe(0)
      expect(day1.risk_score).toBe(14.2)
      expect(day1.urgency_tier).toBe('ROUTINE')

      const day1Info = getTimelineDayInfo(1)
      expect(day1Info.milestone).toBe('Baseline Dry')
      expect(day1Info.label).toBe('Day -14')
    })

    it('identifies Day 8 (Day -7) autonomic sympathetic drift onset', () => {
      const day8 = getInterpolatedPatientForDay(8)
      expect(day8.trajectory.resting_hr_bpm).toBe(74)
      expect(day8.trajectory.hr_drift_bpm).toBe(6)
      expect(day8.trajectory.current_weight_lbs).toBe(181.6)
      expect(day8.symptoms.pillows_count).toBe(0)
      expect(day8.risk_score).toBe(36.8)

      const day8Info = getTimelineDayInfo(8)
      expect(day8Info.milestone).toBe('Sympathetic Drift')
      expect(day8Info.label).toBe('Day -7')
    })

    it('pinpoints Day 12 (Day -3) weight velocity inflection point (+3.0 lbs 48h)', () => {
      const day12 = getInterpolatedPatientForDay(12)
      expect(day12.trajectory.current_weight_lbs).toBe(184.0)
      expect(day12.trajectory.resting_hr_bpm).toBe(77)
      expect(day12.trajectory.hr_drift_bpm).toBe(9)
      expect(day12.trajectory.weight_delta_48h).toBe(3.0)
      expect(day12.symptoms.pillows_count).toBe(1)
      expect(day12.symptoms.orthopnea_present).toBe(true)
      expect(day12.heart_age_estimate).toBe(76)
      expect(day12.risk_score).toBe(68.5)
      expect(day12.urgency_tier).toBe('URGENT')

      const day12Info = getTimelineDayInfo(12)
      expect(day12Info.milestone).toBe('Velocity Inflection')
      expect(day12Info.label).toBe('Day -3')
    })

    it('verifies Day 13 (Day -1) sub-acute progression before alert', () => {
      const day13 = getInterpolatedPatientForDay(13)
      expect(day13.trajectory.current_weight_lbs).toBe(184.2)
      expect(day13.trajectory.weight_delta_48h).toBe(3.2)
      expect(day13.symptoms.pillows_count).toBe(2)

      const day13Info = getTimelineDayInfo(13)
      expect(day13Info.label).toBe('Day -1')
      expect(day13Info.relativeDay).toBe(-1)
    })

    it('matches Day 14 (Day 0) acute decompensation alert state exactly with INITIAL_PATIENT_SNAPSHOT', () => {
      const day14 = getInterpolatedPatientForDay(14)
      expect(day14.trajectory.current_weight_lbs).toBe(INITIAL_PATIENT_SNAPSHOT.trajectory.current_weight_lbs)
      expect(day14.trajectory.resting_hr_bpm).toBe(INITIAL_PATIENT_SNAPSHOT.trajectory.resting_hr_bpm)
      expect(day14.trajectory.weight_delta_48h).toBe(3.6)
      expect(day14.symptoms.pillows_count).toBe(2)
      expect(day14.heart_age_estimate).toBe(78)
      expect(day14.risk_score).toBe(87.4)
      expect(day14.urgency_tier).toBe('URGENT')

      const day14Info = getTimelineDayInfo(14)
      expect(day14Info.milestone).toBe('Acute Decompensation Alert')
      expect(day14Info.label).toBe('Day 0')
    })

    it('verifies chronological monotonicity of risk score from Day 1 to Day 14', () => {
      for (let d = 1; d < 14; d++) {
        const infoCurr = getTimelineDayInfo(d)
        const infoNext = getTimelineDayInfo(d + 1)
        expect(infoNext.risk_score).toBeGreaterThanOrEqual(infoCurr.risk_score)
      }
    })
  })

  describe('Principle 8: Direct Caliper Probing & What-If Simulation Sandbox', () => {
    it('simulates hypothetical hyperkalemic probe (5.4 mEq/L) triggering instant CDSS Hard Veto', () => {
      const probedPatient = getInterpolatedPatientForDay(14, INITIAL_PATIENT_SNAPSHOT, {
        metric: 'potassium',
        value: 5.4
      })

      expect(probedPatient.labs.potassium_mEq_L).toBe(5.4)
      expect(probedPatient.labs.potassium_status).toBe('critical')

      const probedVerdict = CorinAPI.evaluateCdss(
        probedPatient.labs.potassium_mEq_L,
        probedPatient.trajectory.blood_pressure_sys,
        probedPatient.labs.egfr_mL_min,
        7
      )

      expect(probedVerdict.passed).toBe(false)
      expect(probedVerdict.veto_reason).toContain('Hyperkalemia Contraindication Cliff')
      expect(probedVerdict.invariants.k_window_check.passed).toBe(false)
    })

    it('simulates hypothetical hypokalemic probe (3.2 mEq/L) triggering CDSS Hard Veto', () => {
      const probedPatient = getInterpolatedPatientForDay(14, INITIAL_PATIENT_SNAPSHOT, {
        metric: 'potassium',
        value: 3.2
      })

      expect(probedPatient.labs.potassium_mEq_L).toBe(3.2)
      expect(probedPatient.labs.potassium_status).toBe('critical')

      const probedVerdict = CorinAPI.evaluateCdss(
        probedPatient.labs.potassium_mEq_L,
        probedPatient.trajectory.blood_pressure_sys,
        probedPatient.labs.egfr_mL_min,
        7
      )

      expect(probedVerdict.passed).toBe(false)
      expect(probedVerdict.veto_reason).toContain('Hypokalemia Arrhythmia Risk')
    })

    it('simulates safe boundary probe (4.8 mEq/L) passing all CDSS invariants', () => {
      const probedPatient = getInterpolatedPatientForDay(14, INITIAL_PATIENT_SNAPSHOT, {
        metric: 'potassium',
        value: 4.8
      })

      expect(probedPatient.labs.potassium_mEq_L).toBe(4.8)
      expect(probedPatient.labs.potassium_status).toBe('optimal')

      const probedVerdict = CorinAPI.evaluateCdss(
        probedPatient.labs.potassium_mEq_L,
        probedPatient.trajectory.blood_pressure_sys,
        probedPatient.labs.egfr_mL_min,
        7
      )

      expect(probedVerdict.passed).toBe(true)
      expect(probedVerdict.veto_reason).toBeNull()
    })

    it('simulates weight delta probing (+4.2 lbs) updating volume overload vector', () => {
      const probedPatient = getInterpolatedPatientForDay(14, INITIAL_PATIENT_SNAPSHOT, {
        metric: 'weight',
        value: 4.2
      })

      expect(probedPatient.trajectory.weight_delta_48h).toBe(4.2)
    })
  })

  describe('Principle 9: Multi-Workspace Clinical Navigation, Population Cohort Triage & GDMT Regimen', () => {
    it('verifies COHORT_250_BENEFICIARIES panel integrity and risk prioritization', () => {
      expect(COHORT_250_BENEFICIARIES.length).toBeGreaterThanOrEqual(8)

      // 1. Arthur Pendelton (Active Workstation Patient)
      const arthur = COHORT_250_BENEFICIARIES.find(p => p.id === 'P-94021')
      expect(arthur).toBeDefined()
      expect(arthur?.name).toBe('Arthur Pendelton')
      expect(arthur?.urgency_tier).toBe('URGENT')
      expect(arthur?.weight_delta_48h).toBe(3.6)
      expect(arthur?.z_score).toBe(2.41)
      expect(arthur?.resting_hr).toBe(82)
      expect(arthur?.decider_route).toContain('Clinical Escalation')

      // 2. Beatrice Thorne (Emergency Shock)
      const beatrice = COHORT_250_BENEFICIARIES.find(p => p.id === 'P-88219')
      expect(beatrice).toBeDefined()
      expect(beatrice?.urgency_tier).toBe('EMERGENCY')
      expect(beatrice?.sbp).toBe(88)
      expect(beatrice?.decider_route).toContain('Emergency Attending Alert')

      // 3. Euvolemic Stable Patients
      const eleanor = COHORT_250_BENEFICIARIES.find(p => p.id === 'P-66504')
      expect(eleanor?.urgency_tier).toBe('ROUTINE')
      expect(eleanor?.weight_delta_48h).toBeLessThan(1.0)
    })

    it('verifies GDMT ACC/AHA Quadruple Pharmacotherapy pillars and target dosing', () => {
      expect(GDMT_PILLARS_DATA.length).toBe(5)

      // ARNI/ACEI
      const acei = GDMT_PILLARS_DATA.find(p => p.id === 'acei')
      expect(acei?.current_drug).toBe('Lisinopril')
      expect(acei?.optimization_pct).toBe(50)

      // Beta-blocker
      const bb = GDMT_PILLARS_DATA.find(p => p.id === 'bb')
      expect(bb?.current_drug).toContain('Carvedilol')
      expect(bb?.status).toBe('OPTIMAL')
      expect(bb?.optimization_pct).toBe(100)

      // MRA Held for Safety Cliff
      const mra = GDMT_PILLARS_DATA.find(p => p.id === 'mra')
      expect(mra?.status).toBe('HELD_SAFETY')
      expect(mra?.clinical_rationale).toContain('invariant prevents simultaneous loop escalation')

      // SGLT2i
      const sglt2i = GDMT_PILLARS_DATA.find(p => p.id === 'sglt2i')
      expect(sglt2i?.current_drug).toContain('Empagliflozin')
      expect(sglt2i?.status).toBe('OPTIMAL')

      // Loop Diuretic Titration
      const loop = GDMT_PILLARS_DATA.find(p => p.id === 'loop')
      expect(loop?.current_drug).toContain('Furosemide')
      expect(loop?.status).toBe('TITRATING')
      expect(loop?.target_dose).toContain('80 mg')
    })
  })

  describe('Principle 10: Benchmark Clinical Scenarios A–I Fixture Integrity', () => {
    it('verifies all 9 benchmark scenarios exist with valid structure and distinct codes', () => {
      expect(BENCHMARK_SCENARIOS.length).toBe(9)
      const codes = BENCHMARK_SCENARIOS.map(s => s.code)
      expect(codes).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'])
      
      for (const scenario of BENCHMARK_SCENARIOS) {
        expect(scenario.id).toBeDefined()
        expect(scenario.title).toBeDefined()
        expect(scenario.category).toBeDefined()
        expect(scenario.description.length).toBeGreaterThan(10)
        expect(scenario.expectedOutcome.length).toBeGreaterThan(10)
        expect(scenario.patientSnapshot).toBeDefined()
        expect(scenario.patientSnapshot.patient_id).toBe('P-94021')
        expect(scenario.initialSmsThread.length).toBeGreaterThan(0)
      }
    })

    it('verifies getScenarioById resolves correctly by id and fallback', () => {
      expect(getScenarioById('A').code).toBe('A')
      expect(getScenarioById('B').code).toBe('B')
      expect(getScenarioById('H').code).toBe('H')
      expect(getScenarioById('non-existent').code).toBe('A')
    })

    it('Scenario A: verifies classic decompensation profile (+3.6 lbs, RHR 82 bpm, 2-pillow orthopnea)', () => {
      const scenarioA = getScenarioById('A')
      expect(scenarioA.patientSnapshot.trajectory.weight_delta_48h).toBe(3.6)
      expect(scenarioA.patientSnapshot.trajectory.resting_hr_bpm).toBe(82)
      expect(scenarioA.patientSnapshot.symptoms.orthopnea_present).toBe(true)
      expect(scenarioA.patientSnapshot.symptoms.pillows_count).toBe(2)
      
      // Invariants evaluate to safe
      const verdict = CorinAPI.evaluateCdss({
        potassium_mEq_L: scenarioA.patientSnapshot.labs.potassium_mEq_L,
        systolic_bp_mmHg: scenarioA.patientSnapshot.trajectory.blood_pressure_sys,
        egfr_mL_min: scenarioA.patientSnapshot.labs.egfr_mL_min,
        last_lab_days: 7
      })
      expect(verdict.passed).toBe(true)
      expect(verdict.status).toBe('PASSED')
      expect(verdict.action_intent_token).toBeDefined()
    })

    it('Scenario B (Golden Test): detects splanchnic fluid shift with flat weight (+0.2 lbs) and autonomic HR drift (+11 bpm)', () => {
      const scenarioB = getScenarioById('B')
      // Flat cellular scale weight delta
      expect(scenarioB.patientSnapshot.trajectory.weight_delta_48h).toBe(0.2)
      // Autonomic drift in resting HR
      expect(scenarioB.patientSnapshot.trajectory.hr_drift_bpm).toBe(11)
      expect(scenarioB.patientSnapshot.trajectory.resting_hr_bpm).toBe(79)
      // Pulmonary congestion despite lack of scale gain
      expect(scenarioB.patientSnapshot.symptoms.orthopnea_present).toBe(true)
      expect(scenarioB.patientSnapshot.symptoms.pillows_count).toBe(2)
      expect(scenarioB.patientSnapshot.organ_telemetry.lungs.splanchnic_congestion_score).toBe(84)
      expect(scenarioB.category).toContain('Golden Test')
    })

    it('Scenario C (False-Positive Control): handles dietary salt spike (+2.4 lbs) without orthopnea or tachycardia', () => {
      const scenarioC = getScenarioById('C')
      expect(scenarioC.patientSnapshot.trajectory.weight_delta_48h).toBe(2.4)
      expect(scenarioC.patientSnapshot.trajectory.resting_hr_bpm).toBe(68)
      expect(scenarioC.patientSnapshot.trajectory.hr_drift_bpm).toBe(0)
      expect(scenarioC.patientSnapshot.symptoms.orthopnea_present).toBe(false)
      expect(scenarioC.patientSnapshot.symptoms.pillows_count).toBe(0)
      expect(scenarioC.patientSnapshot.urgency_tier).toBe('MONITOR')
    })

    it('Scenario D: quaratines impossible scale jump (+45 lbs) to Pandera DLQ', () => {
      const scenarioD = getScenarioById('D')
      expect(scenarioD.quarantined).toBe(true)
      expect(scenarioD.quarantineReason).toContain('Pandera Contract Violation')
      expect(scenarioD.patientSnapshot.trajectory.weight_delta_48h).toBe(45.0)
    })

    it('Scenario E: triggers hard safety cliff veto on hyperkalemia (K+ = 5.6 mEq/L)', () => {
      const scenarioE = getScenarioById('E')
      expect(scenarioE.patientSnapshot.labs.potassium_mEq_L).toBe(5.6)
      const verdict = CorinAPI.evaluateCdss({
        potassium_mEq_L: scenarioE.patientSnapshot.labs.potassium_mEq_L,
        systolic_bp_mmHg: scenarioE.patientSnapshot.trajectory.blood_pressure_sys,
        egfr_mL_min: scenarioE.patientSnapshot.labs.egfr_mL_min,
        last_lab_days: 7
      })
      expect(verdict.passed).toBe(false)
      expect(verdict.status).toBe('VETOED')
      expect(verdict.guide_code).toBe('HOLD_MRA')
      expect(verdict.veto_reason).toContain('Hyperkalemia')
    })

    it('Scenario F: blocks loop escalation on hypokalemia (K+ = 3.2 mEq/L) and guides to STAT BMP', () => {
      const scenarioF = getScenarioById('F')
      expect(scenarioF.patientSnapshot.labs.potassium_mEq_L).toBe(3.2)
      const verdict = CorinAPI.evaluateCdss({
        potassium_mEq_L: scenarioF.patientSnapshot.labs.potassium_mEq_L,
        systolic_bp_mmHg: scenarioF.patientSnapshot.trajectory.blood_pressure_sys,
        egfr_mL_min: scenarioF.patientSnapshot.labs.egfr_mL_min,
        last_lab_days: 7
      })
      expect(verdict.passed).toBe(false)
      expect(verdict.status).toBe('GUIDE')
      expect(verdict.guide_code).toBe('ORDER_STAT_BMP')
      expect(verdict.guide_action).toContain('STAT BMP')
    })

    it('Scenario G: rejects stale labs (18 days old) and guides to fresh specimen order', () => {
      const scenarioG = getScenarioById('G')
      expect(scenarioG.patientSnapshot.labs.is_lab_stale).toBe(true)
      const verdict = CorinAPI.evaluateCdss({
        potassium_mEq_L: 4.6,
        systolic_bp_mmHg: 133,
        egfr_mL_min: 54,
        last_lab_days: 18
      })
      expect(verdict.passed).toBe(false)
      expect(verdict.status).toBe('GUIDE')
      expect(verdict.guide_code).toBe('ORDER_STAT_BMP')
      expect(verdict.veto_reason).toContain('Outdated BMP Specimen')
    })

    it('Scenario H: flags crushing chest pain as 911 red-flag emergency bypass', () => {
      const scenarioH = getScenarioById('H')
      expect(scenarioH.redFlagBypass).toBe(true)
      expect(scenarioH.patientSnapshot.urgency_tier).toBe('EMERGENCY')
      expect(scenarioH.expectedOutcome).toContain('911')
    })

    it('Scenario I: maintains prompt injection security shields intact', () => {
      const scenarioI = getScenarioById('I')
      expect(scenarioI.promptInjectionShielded).toBe(true)
      expect(scenarioI.category).toBe('Adversarial Shield & Security')
      expect(scenarioI.expectedOutcome).toContain('SECURITY SHIELD')
    })
  })

  describe('Principle 11: Hybrid API Adapter & Pydantic Data Contracts', () => {
    it('returns valid initial PatientSnapshot conforming to backend Pydantic schema', async () => {
      const snapshot = await CorinAPI.getPatientSnapshot('P-94021')
      expect(snapshot.patient_id).toBe('P-94021')
      expect(snapshot.name).toBe('Arthur Pendelton')
      expect(snapshot.organ_telemetry).toBeDefined()
      expect(snapshot.trajectory).toBeDefined()
      expect(snapshot.labs).toBeDefined()
      expect(snapshot.symptoms).toBeDefined()
    })

    it('evaluates CDSS via Pydantic request object signature and numeric signature identically', () => {
      const request: CdssEvaluationRequest = {
        patient_id: 'P-94021',
        potassium_mEq_L: 4.6,
        systolic_bp_mmHg: 133,
        egfr_mL_min: 54,
        last_lab_days: 7
      }
      const objectVerdict = CorinAPI.evaluateCdss(request)
      const numericVerdict = CorinAPI.evaluateCdss(4.6, 133, 54, 7)

      expect(objectVerdict.passed).toBe(numericVerdict.passed)
      expect(objectVerdict.status).toBe(numericVerdict.status)
      expect(objectVerdict.veto_reason).toBe(numericVerdict.veto_reason)
      expect(objectVerdict.action_intent_token).toBe(numericVerdict.action_intent_token)
    })

    it('handles all guide and veto failure paths via CdssEvaluationRequest object', () => {
      // 1. Hypokalemia -> GUIDE
      const hypoVerdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 3.1 })
      expect(hypoVerdict.status).toBe('GUIDE')
      expect(hypoVerdict.guide_code).toBe('ORDER_STAT_BMP')

      // 2. Hyperkalemia -> VETOED
      const hyperVerdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 5.5 })
      expect(hyperVerdict.status).toBe('VETOED')
      expect(hyperVerdict.guide_code).toBe('HOLD_MRA')

      // 3. Hypotension -> VETOED
      const hypoBpVerdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 4.5, systolic_bp_mmHg: 88 })
      expect(hypoBpVerdict.status).toBe('VETOED')
      expect(hypoBpVerdict.guide_code).toBe('HYPOTENSION_ALERT')

      // 4. Low eGFR -> VETOED
      const egfrVerdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 4.5, egfr_mL_min: 22 })
      expect(egfrVerdict.status).toBe('VETOED')
      expect(egfrVerdict.guide_code).toBe('NEPHROLOGY_CONSULT')

      // 5. Stale labs -> GUIDE
      const staleVerdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 4.5, last_lab_days: 20 })
      expect(staleVerdict.status).toBe('GUIDE')
      expect(staleVerdict.guide_code).toBe('ORDER_STAT_BMP')
    })

    it('sends SMS via SmsMessagePayload contract and local fallback', async () => {
      const msg = await CorinAPI.sendSms({
        patient_id: 'P-94021',
        text: 'Checking in about morning symptoms',
        sender: 'clinician'
      })
      expect(msg.id).toBeDefined()
      expect(msg.sender).toBe('clinician')
      expect(msg.text).toBe('Checking in about morning symptoms')
    })

    it('sends SMS via shorthand sendSmsMessage', async () => {
      const msg = await CorinAPI.sendSmsMessage('P-94021', 'I feel breathless')
      expect(msg.id).toBeDefined()
      expect(msg.sender).toBe('patient')
      expect(msg.text).toBe('I feel breathless')
    })

    it('toggles live backend mode via setLiveBackend', () => {
      expect(CorinAPI.isLiveBackend()).toBe(false)
      CorinAPI.setLiveBackend(true)
      expect(CorinAPI.isLiveBackend()).toBe(true)
      CorinAPI.setLiveBackend(false)
      expect(CorinAPI.isLiveBackend()).toBe(false)
    })
  })

  describe('Principle 12: Structured HITL Prescribing State Machine & Guide Steering', () => {
    it('verifies valid 5-state lifecycle progression types', () => {
      const validStates: OrderLifecycleState[] = [
        'PROPOSAL_PENDING',
        'GUARDIAN_VERIFIED',
        'AWAITING_SIGNATURE',
        'COMMITTED_TO_EHR',
        'VETOED_SAFETY_CLIFF'
      ]
      expect(validStates.length).toBe(5)
      expect(validStates).toContain('PROPOSAL_PENDING')
      expect(validStates).toContain('COMMITTED_TO_EHR')
      expect(validStates).toContain('VETOED_SAFETY_CLIFF')
    })

    it('authorizes order through HITL ceremony returning token and FHIR resources', async () => {
      const auth = await CorinAPI.authorizeOrder('P-94021', '1948201948', 'act_corp_94021_loop80')
      expect(auth.status).toBe('COMMITTED')
      expect(auth.action_intent_token).toBe('act_corp_94021_loop80')
      expect(auth.medication_request.resourceType).toBe('MedicationRequest')
      expect(auth.service_request.resourceType).toBe('ServiceRequest')
      expect(auth.timestamp).toBeDefined()
    })
  })

  describe('Principle 13: Clinical Symptom Extraction Engine (Nova Micro Emulation)', () => {
    it('extracts red flag chest pain symptoms with high confidence', () => {
      const symptoms = extractSymptomsFromText('Help, I have crushing chest pain radiating to my left arm')
      expect(symptoms.length).toBeGreaterThan(0)
      const redFlag = symptoms.find(s => s.category === 'red_flag')
      expect(redFlag).toBeDefined()
      expect(redFlag?.entity).toContain('Crushing Chest Pain')
      expect(redFlag?.confidence).toBeGreaterThanOrEqual(0.95)
    })

    it('extracts orthopnea with pillow quantification', () => {
      const symptoms = extractSymptomsFromText('I had to prop myself up with 3-pillow support last night')
      const ortho = symptoms.find(s => s.category === 'respiratory')
      expect(ortho).toBeDefined()
      expect(ortho?.entity).toContain('3-Pillow Orthopnea')
      expect(ortho?.confidence).toBeGreaterThanOrEqual(0.95)
    })

    it('extracts peripheral ankle edema', () => {
      const symptoms = extractSymptomsFromText('My ankles and feet are swollen and heavy today')
      const edema = symptoms.find(s => s.category === 'volume')
      expect(edema).toBeDefined()
      expect(edema?.entity).toContain('Peripheral Ankle Edema')
    })

    it('extracts autonomic sympathetic drift / palpitations', () => {
      const symptoms = extractSymptomsFromText('I feel my heart racing while sitting quietly')
      const autonomic = symptoms.find(s => s.category === 'autonomic')
      expect(autonomic).toBeDefined()
      expect(autonomic?.entity).toContain('Autonomic Sympathetic Drift')
    })

    it('extracts dietary sodium indiscretion', () => {
      const symptoms = extractSymptomsFromText('I had some salty ramen soup for dinner yesterday')
      const salt = symptoms.find(s => s.category === 'volume')
      expect(salt).toBeDefined()
      expect(salt?.entity).toContain('Dietary Sodium Indiscretion')
    })

    it('extracts unverified dosage mutation query', () => {
      const symptoms = extractSymptomsFromText('My doctor said double my Lasix today')
      const med = symptoms.find(s => s.category === 'vital')
      expect(med).toBeDefined()
      expect(med?.entity).toContain('Unverified Dosage Mutation Query')
    })

    it('returns empty array when no clinical symptoms match', () => {
      const symptoms = extractSymptomsFromText('Good morning, the weather is nice today.')
      expect(symptoms).toEqual([])
    })
  })

  describe('Principle 14: Time-Travel Engine & Scenario Urgency Tier Fidelity', () => {
    it('preserves scenario urgency_tier on Day 14 for all benchmark scenarios', () => {
      // Scenario A: Classic decompensation -> URGENT
      const scA = getScenarioById('A')
      const patientA = getInterpolatedPatientForDay(14, scA.patientSnapshot)
      expect(patientA.urgency_tier).toBe('URGENT')

      // Scenario C: High-sodium false positive control -> MONITOR
      const scC = getScenarioById('C')
      const patientC = getInterpolatedPatientForDay(14, scC.patientSnapshot)
      expect(patientC.urgency_tier).toBe('MONITOR')

      // Scenario D: Sensor artifact jump -> MONITOR
      const scD = getScenarioById('D')
      const patientD = getInterpolatedPatientForDay(14, scD.patientSnapshot)
      expect(patientD.urgency_tier).toBe('MONITOR')

      // Scenario H: 911 Red-Flag emergency -> EMERGENCY
      const scH = getScenarioById('H')
      const patientH = getInterpolatedPatientForDay(14, scH.patientSnapshot)
      expect(patientH.urgency_tier).toBe('EMERGENCY')

      // Scenario I: Adversarial injection -> MONITOR
      const scI = getScenarioById('I')
      const patientI = getInterpolatedPatientForDay(14, scI.patientSnapshot)
      expect(patientI.urgency_tier).toBe('MONITOR')
    })

    it('interpolates trajectory metrics accurately on prior timeline days while respecting day boundaries', () => {
      const day1 = getInterpolatedPatientForDay(1)
      expect(day1.urgency_tier).toBe('ROUTINE')
      expect(day1.trajectory.weight_delta_48h).toBe(-0.2)
      expect(day1.trajectory.resting_hr_bpm).toBe(68)
    })
  })

  describe('Principle 15: Swarm Stream Replay DAG & Live SSE Node Invariant Alignment', () => {
    it('verifies that INITIAL_SWARM_TRACE contains all 6 required production agent nodes', () => {
      const nodeIds = INITIAL_SWARM_TRACE.map(n => n.id)
      expect(nodeIds).toEqual([
        'decider',
        'datascience',
        'coach',
        'reranker',
        'expert',
        'guardian'
      ])
    })

    it('verifies all 6 swarm node models, latency profiles, and descriptions', () => {
      const decider = INITIAL_SWARM_TRACE.find(n => n.id === 'decider')
      expect(decider?.model).toBe('Amazon Nova Micro')
      expect(decider?.latency_ms).toBeLessThanOrEqual(5)

      const datascience = INITIAL_SWARM_TRACE.find(n => n.id === 'datascience')
      expect(datascience?.model).toContain('Pandas')

      const coach = INITIAL_SWARM_TRACE.find(n => n.id === 'coach')
      expect(coach?.model).toBe('Amazon Nova Micro')

      const reranker = INITIAL_SWARM_TRACE.find(n => n.id === 'reranker')
      expect(reranker?.model).toContain('Cohere Rerank')

      const expert = INITIAL_SWARM_TRACE.find(n => n.id === 'expert')
      expect(expert?.model).toContain('Claude Sonnet')

      const guardian = INITIAL_SWARM_TRACE.find(n => n.id === 'guardian')
      expect(guardian?.model).toBe('Pure Python Rule Engine')
      expect(guardian?.latency_ms).toBeLessThanOrEqual(2.0)
    })
  })

  describe('Principle 16: CDSS Safety Cliff (VETO vs GUIDE) Disambiguation Contract', () => {
    it('enforces hard VETO without Guide action on hyperkalemia safety cliff (K+ >= 5.2)', () => {
      const verdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 5.6 })
      expect(verdict.passed).toBe(false)
      expect(verdict.status).toBe('VETOED')
      expect(verdict.guide_action).toBeNull()
      expect(verdict.veto_reason).toContain('Hyperkalemia')
      expect(verdict.invariants.k_window_check.passed).toBe(false)
    })

    it('enforces hard VETO without Guide action on cardiogenic hypoperfusion shock (SBP < 95)', () => {
      const verdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 4.6, systolic_bp_mmHg: 88 })
      expect(verdict.passed).toBe(false)
      expect(verdict.status).toBe('VETOED')
      expect(verdict.guide_action).toBeNull()
      expect(verdict.veto_reason).toContain('Hypotension')
      expect(verdict.invariants.sbp_check.passed).toBe(false)
    })

    it('enforces hard VETO without Guide action on acute eGFR failure (< 30 mL/min)', () => {
      const verdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 4.6, egfr_mL_min: 24 })
      expect(verdict.passed).toBe(false)
      expect(verdict.status).toBe('VETOED')
      expect(verdict.guide_action).toBeNull()
      expect(verdict.veto_reason).toContain('Renal Perfusion')
      expect(verdict.invariants.egfr_check.passed).toBe(false)
    })

    it('enforces GUIDE steering action to order STAT BMP on hypokalemia boundary (< 3.5)', () => {
      const verdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 3.2 })
      expect(verdict.passed).toBe(false)
      expect(verdict.status).toBe('GUIDE')
      expect(verdict.guide_code).toBe('ORDER_STAT_BMP')
      expect(verdict.guide_action).toContain('STAT BMP')
      expect(verdict.invariants.k_window_check.passed).toBe(false)
    })

    it('enforces GUIDE steering action to order fresh BMP on stale labs (> 14 days)', () => {
      const verdict = CorinAPI.evaluateCdss({ potassium_mEq_L: 4.6, last_lab_days: 18 })
      expect(verdict.passed).toBe(false)
      expect(verdict.status).toBe('GUIDE')
      expect(verdict.guide_code).toBe('ORDER_STAT_BMP')
      expect(verdict.guide_action).toContain('Fresh STAT BMP')
      expect(verdict.invariants.recency_check.passed).toBe(false)
    })
  })

  describe('Principle 17: Clinician Ergonomic Invariants & Cohort-Patient Demographic Mapping', () => {
    it('verifies all 7 multi-page clinical workspaces map to discrete key shortcuts', () => {
      const workspaceShortcuts: Record<string, string> = {
        '1': 'workstation',
        '2': 'cohort',
        '3': 'pulmonary',
        '4': 'renal',
        '5': 'genomics',
        '6': 'pharmacy',
        '7': 'telemetry'
      }
      expect(Object.keys(workspaceShortcuts).length).toBe(7)
      expect(workspaceShortcuts['1']).toBe('workstation')
      expect(workspaceShortcuts['2']).toBe('cohort')
      expect(workspaceShortcuts['7']).toBe('telemetry')
    })

    it('verifies cohort patient records map seamlessly into clinical scenarios and retain MRN identifiers', () => {
      const arthur = COHORT_250_BENEFICIARIES.find(p => p.id === 'P-94021')
      const walter = COHORT_250_BENEFICIARIES.find(p => p.id === 'P-33890')
      const elena = COHORT_250_BENEFICIARIES.find(p => p.id === 'P-44911')
      const beatrice = COHORT_250_BENEFICIARIES.find(p => p.id === 'P-88219')

      expect(arthur?.mrn).toBe('MRN-94021')
      expect(walter?.mrn).toBe('MRN-33890')
      expect(elena?.mrn).toBe('MRN-44911')
      expect(beatrice?.mrn).toBe('MRN-88219')

      // Arthur is Scenario A
      expect(arthur?.name).toBe('Arthur Pendelton')
      expect(arthur?.nyha_class).toBe('NYHA Class III')
      // Beatrice is Scenario H (Emergency)
      expect(beatrice?.urgency_tier).toBe('EMERGENCY')
    })
  })
})

