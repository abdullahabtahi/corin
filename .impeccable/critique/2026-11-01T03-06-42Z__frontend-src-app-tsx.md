---
target: frontend/src/App.tsx
total_score: 37
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/abdullahabtahi/Strands SDK- Workshop to Ship /frontend/src/App.tsx"
target_fingerprint: "sha256:dbe661fef5f1bc7bb55793218c4ad75a7639999123a28642078ee6a549f4d6f4"
target_path: /Users/abdullahabtahi/Strands SDK- Workshop to Ship /frontend/src/App.tsx
timestamp: 2026-11-01T03-06-42Z
slug: frontend-src-app-tsx
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3.8 | Dynamic cardiac cycle duration, living 60fps pulse, 14-day timeline scrubber with explicit status indicators. |
| 2 | Match System / Real World | 4.0 | Abridge-standard 45s SBAR review, ACC/AHA guideline citations, LOINC & RxNorm nomenclature. |
| 3 | User Control and Freedom | 3.5 | 14-day scrubber with jump anchors, scenario switcher; cohort row click navigates to workstation but does not yet rebind twin model. |
| 4 | Consistency and Standards | 3.8 | Unified porcelain palette (`#EAEFF5`/`#EDF1F6`), specular 1px borders, strictly tabular numeric typography. |
| 5 | Error Prevention | 4.0 | Deterministic CDSS Guardian physically gates loop escalation; hard cliffs (K+ >= 5.2, SBP < 95) disable action with zero false negatives. |
| 6 | Recognition Rather Than Recall | 3.8 | Caliper corridors with baseline dry anchors; bidirectional citation spotlights between SBAR and 3D organ pins. |
| 7 | Flexibility and Efficiency | 3.5 | Zero-modal 1-click prescribing ceremony, 1x/2x replay speeds; keyboard accelerators for high-volume triage can be added. |
| 8 | Aesthetic and Minimalist Design | 3.8 | ClyHealth porcelain aesthetic, calm medical contrast, zero decorative dark glows or pure `#FFFFFF` glare. |
| 9 | Error Recovery | 3.5 | Explicit CDSS veto banners and Guide steering protocols instructing clinician to order STAT BMP instead of generic errors. |
| 10 | Help and Documentation | 3.5 | Abridge provenance drawer, raw telemetry packet inspection, inline ACC/AHA clinical citations. |
| **Total** | | **37.2/40** | **Excellent (93.0%)** |

### Design Specificity Verdict

**LLM assessment**: 
Corin CDS v3.0 demonstrates high design specificity tailored strictly to heart failure (HFrEF) and chronic kidney disease (CKD) ambulatory management. Rather than presenting generic dashboard widgets, the viewport organizes around the cardiorenal feedback loop: a living bio-rhythmic twin stage synchronized to Arthur's resting heart rate (82 bpm => 731.7ms period), an EWMA $\alpha=0.28$ trajectory corridor, interactive biomarker calipers with deterministic safety thresholds, and an Abridge-compliant SBAR review drawer with bidirectional citation illumination. The design feels custom-engineered for an attending cardiologist or heart failure care manager.

**Deterministic scan**:
Automated audit (`impeccable detect`) on the live runtime interface confirms:
- **0 dark glows**: Colored box-shadow glows completely removed in favor of subtle elevation and specular rings.
- **0 text occlusions**: Floating insight cards repositioned to eliminate overlap with anatomical hotspots.
- **0 decorative pulsing dots**: Replaced with calm, honest static status indicators.
- **0 undersized UI elements**: All interactive text, buttons, and badges strictly conform to the $\ge 11\text{px}$ legibility floor.
- **Tabular numbers**: 100% compliant `font-variant-numeric: tabular-nums` across all biomarkers, dates, and dosages.

### Overall Impression
The interface achieves exceptional clinical gravitas and tactile clarity. The porcelain surfaces and specular white rims create a calm, hospital-grade operational workstation. The primary opportunity before backend integration is resolving the state binding between the Population Health Cohort list and the active patient snapshot in the acute workstation.

### What's Working
1. **Bio-Rhythmic Dynamic Twin**: The 60fps pulsation dynamically computed from resting heart rate ($T = 60/\text{HR} \times 1000\text{ms}$) immediately communicates clinical acuity without cognitive strain.
2. **Deterministic CDSS Disambiguation**: The separation of hard contraindications (VETO) from actionable boundary alerts (GUIDE steering to order a STAT BMP) prevents clinical workflow dead-ends.
3. **Dual-Vector Longitudinal Scrubber**: The 14-day time-travel scrubber allows clinicians to review the trajectory leading to decompensation in under 10 seconds.

### Priority Issues

- **[P1] Cohort Patient Selection Does Not Update Workstation Snapshot**
  - **Why it matters**: Clicking a patient in `CohortWorklistView` (e.g. Beatrice Thorne or Marcus Brody) navigates to the Workstation, but the twin, calipers, and SBAR continue displaying Arthur Pendelton. This breaks the clinical mental model of cohort triage.
  - **Fix**: In `ClinicalContext.tsx`, load the selected cohort patient record or create a scenario fixture for selected patients so switching lives in the cohort updates the workstation view.
  - **Suggested command**: `$impeccable harden`

- **[P1] Stale Lab Elapsed Days Hardcoded in Evaluator Calls**
  - **Why it matters**: `ClinicalContext.tsx` lines 190, 327, and 358 use a ternary `patient.labs.is_lab_stale ? 18 : 7` instead of reading an explicit `last_bmp_days_ago` integer property. When connecting to FastAPI / FHIR R4, this requires brittle translation.
  - **Fix**: Add `last_lab_days: number` to `ClinicalLabs` in `frontend/src/types/clinical.ts` and bind directly to the CDSS evaluator.
  - **Suggested command**: `$impeccable harden`

- **[P2] Dead Code Duplication in Telemetry Data Structures**
  - **Why it matters**: `api.ts` contains `TIMELINE_14D_DAYS` and `interpolateDayTelemetry` (~250 lines) which are never imported or invoked by the application, duplicating `TIMELINE_14D_DETAILS` in `timeline.ts`.
  - **Fix**: Delete unused `TIMELINE_14D_DAYS` and `interpolateDayTelemetry` from `frontend/src/lib/api.ts`.
  - **Suggested command**: `$impeccable distill`

- **[P2] Window Mouse Drag Listeners Lack Defensive Unmount Cleanup**
  - **Why it matters**: In `TimeTravelScrubber.tsx`, mousemove and mouseup listeners attached to `window` during scrub operations could leak if the component unmounts mid-drag.
  - **Fix**: Add a cleanup `useEffect` or wrap in a dedicated drag hook with cancel/blur listeners.
  - **Suggested command**: `$impeccable harden`

### Persona Red Flags

- **Dr. Robert Chen, MD (Attending Cardiologist)**:
  - *Red flag*: When reviewing the SBAR, the 1-click prescribing ceremony works smoothly, but if he switches to the Cohort Worklist to check other urgent patients, clicking on Beatrice Thorne (NYHA IV, SBP 88) loads Arthur's data in the Workstation. He cannot triage Beatrice without manual workarounds.
- **Sarah Jenkins, RN (Ambulatory Care Manager)**:
  - *Red flag*: In the SMS simulator drawer, typing custom messages triggers simulated responses, but sending unlisted clinical text falls back to a generic default message. The extraction tags are helpful, but an explicit badge showing what clinical keywords trigger red flags would accelerate onboarding.
- **Alex (Impatient Power User)**:
  - *Red flag*: No global keyboard shortcuts exist to cycle through the 14-day timeline (e.g. left/right arrows when focused globally) or quickly trigger SBAR review (`Cmd+S` or `Space`). Triage requires mouse clicks for every step.

### Minor Observations
- The playback speed toggle (1x / 2x) in the timeline scrubber is crisp and functional; adding an auto-loop toggle would be beneficial for presentation/demo mode.
- In `GdmtPharmacyView.tsx`, the 5 pillars provide clear guideline context; linking each pillar directly to its corresponding anatomical organ pin in the 3D twin would deepen cross-workspace coherence.

### Questions to Consider
1. Should selecting a patient in the Cohort Triage list dynamically synthesize a cardiorenal twin profile for all 8 beneficiaries, or should non-Arthur patients display an "Ambulatory Profile Ingested" preview state?
2. Would introducing clinician keyboard shortcuts (`Space` to play/pause timeline, `Esc` to close drawers, `Cmd+Enter` to authorize order) significantly improve high-volume morning triage?
3. Should the live backend toggle automatically test connection health on startup with a subtle non-blocking status chip?
