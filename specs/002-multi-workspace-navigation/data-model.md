# Phase 1 Data Model: Workspaces, Cohort Patients & GDMT

```typescript
export type ClinicalWorkspace = 'workstation' | 'cohort' | 'pharmacy';

export interface CohortPatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  mrn: string;
  nyha_class: string;
  ef_percent: number;
  ckd_stage: string;
  risk_score: number; // 0 to 100
  urgency_tier: 'EMERGENCY' | 'URGENT' | 'MONITOR' | 'ROUTINE';
  weight_delta_48h: number;
  z_score: number;
  hr_drift_bpm: number;
  resting_hr: number;
  serum_k: number;
  sbp: number;
  egfr: number;
  symptoms: string[];
  decider_route: string;
  pending_action: string;
  last_reading_time: string;
}

export interface GdmtPillar {
  name: string;
  drug_class: 'acei_arb_arni' | 'beta_blocker' | 'mra' | 'sglt2i' | 'loop_diuretic';
  current_drug: string;
  current_dose: string;
  target_dose: string;
  optimization_pct: number;
  status: 'OPTIMAL' | 'SUBOPTIMAL' | 'HELD_SAFETY' | 'TITRATING';
  clinical_rationale: string;
}
```

