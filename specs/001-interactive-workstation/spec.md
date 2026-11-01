# Feature Specification: Interactive Cardiorenal Workstation (Top 0.01% Clinical UX/UI)

**Feature Branch**: `001-interactive-workstation`  
**Created**: November 2026  
**Status**: Draft / Proposed for Review  
**Standard**: Google Health Design Director & Apple Health HIG / visionOS Standard  
**Governing Constitution**: `.specify/memory/constitution.md`  

---

## 1. Problem Diagnosis: Why the Current Workstation Feels Like a "Poster"

While the current visual palette (luminous porcelain surfaces, continuous calipers, and 1px specular rim highlights) satisfies static graphic polish, it exhibits the fatal flaw of **passive presentation**:
1. **Non-Interactive "Static" Anatomical Centerpiece:** The digital twin is a static 2D image with static callout pins. It does not reflect live physiological rhythm (e.g. 82 bpm cardiac cycle), cannot be rotated or inspected across anatomical layers (vascular, pulmonary, renal, skeletal), and lacks tactile depth.
2. **Zero Temporal Continuity (No Time-Travel Scrubber):** Cardiorenal decompensation is a 14-day pathophysiological journey. A clinician viewing a single frozen timestamp cannot scrub through time to understand *when* autonomic heart rate drift preceded weight velocity.
3. **Passive Metric Cards without "What-If" Exploration:** Clinicians cannot interactively drag calipers to test safety boundaries (e.g., "What happens if Serum K+ rises to 5.2 mEq/L?") or simulate therapeutic interventions (e.g., "Simulate 80mg Lasix: Projected -2.4 lbs diuresis over 48 hours").
4. **Rigid Layout & Lack of Fluid Microinteractions:** Cards sit in static rows without spring physics, interactive waveform monitors, or contextual drill-downs.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - The Living Bio-Rhythmic Twin & Anatomical Layer Inspection (Priority: P1)
**User Journey:** As an attending cardiologist reviewing Arthur's chart, I want the anatomical digital twin to pulse with his actual resting heart rate (82 bpm), allow 360° inspection, and let me toggle between physiological layers (Cardiovascular Congestion, Pulmonary Fluid Stasis, Renal Filtration, CDSS Safety Heatmap) so I can immediately visualize multi-organ strain in under 5 seconds.

**Why this priority:** Solves the core "poster" critique immediately by transforming the passive center image into an active, living biological organism.

**Independent Test:** Clicking layer pills ("Vascular", "Pulmonary", "Renal") changes shader overlays, pulsatile rate matches 82 bpm, and anatomical hotspots dynamically spotlight corresponding telemetry cards.

**Acceptance Scenarios:**
1. **Given** the workstation loads, **When** viewing the central twin, **Then** the left ventricular bed and pulmonary veins exhibit a subtle physiological pulse matching the patient's heart rate ($82\text{ bpm} \to 731\text{ms}$ cycle).
2. **Given** the twin canvas, **When** the user clicks "Pulmonary Layer", **Then** the model cross-fades into a thoracic focus highlighting alveolar fluid stasis with an amber transudation overlay.
3. **Given** any anatomical hotspot, **When** hovered or clicked, **Then** a tactile leader-line callout springs into view and spotlights the corresponding telemetry caliper on the right panel.

---

### User Story 2 - 14-Day Longitudinal Time-Travel Scrubber (Priority: P1)
**User Journey:** As a clinician diagnosing the root cause of decompensation, I want an interactive chronological scrubber at the bottom of the workstation to scrub across Day -14 (stable baseline) to Day 0 (current alert), watching vitals, caliper markers, SMS notes, and anatomical strain morph in real time.

**Why this priority:** Clinical heart failure decompensation is defined by trajectory velocity, not static values. Enabling time scrubbing turns the dashboard into a dynamic clinical diagnostic instrument.

**Independent Test:** Dragging the scrubber slider from Day -14 to Day 0 smoothly updates the weight ($180.8 \to 184.6\text{ lbs}$), heart rate ($68 \to 82\text{ bpm}$), SBAR summary, and organ radar pings at 60fps.

**Acceptance Scenarios:**
1. **Given** the workstation viewport, **When** the user drags the timeline scrubber to Day -7, **Then** all cards update to display Day -7 metrics (Weight $181.6\text{ lbs}$, HR $74\text{ bpm}$), with the twin reflecting early sympathetic drift.
2. **Given** the scrubber is playing or scrubbing, **When** it crosses Day -3 (the moment 48h weight velocity exceeded $+3.0\text{ lbs}$), **Then** the Volume caliper smoothly transitions from Slate to Amber with a subtle haptic/visual cue.

---

### User Story 3 - Interactive "What-If" Therapeutic Simulation Sandbox (Priority: P2)
**User Journey:** As a treating physician evaluating loop diuretic escalation, I want to interactively simulate titrating Furosemide (40mg baseline vs 80mg escalation vs 120mg high-dose) to see projected 24h/48h/72h diuresis (-2.4 lbs), projected Serum K+ drop (-0.3 mEq/L), and real-time CDSS invariant validation.

**Why this priority:** Replaces passive reading of recommendations with active, participatory clinical simulation, elevating clinician trust to 100%.

**Independent Test:** Adjusting the simulation dosage slider from 40mg to 80mg dynamically projects the fluid recovery trajectory on the chart and clears the CDSS invariant gate.

**Acceptance Scenarios:**
1. **Given** the Care Strategy panel, **When** the clinician activates "Simulate 80mg Escalation", **Then** the 14-day chart projects a dotted green recovery curve predicting Arthur's return to $181.2\text{ lbs}$ by Day +3.
2. **Given** an adversarial simulation (e.g. simulating $K^+ \ge 5.2\text{ mEq/L}$ or $\text{SBP} < 95\text{ mmHg}$), **When** evaluated, **Then** the CDSS Guardian instantly triggers an inline red hard veto in $<2\text{ms}$ and disables order dispatch.

---

### User Story 4 - Live ECG Rhythm Strip & Thoracic Bioimpedance Waveform (Priority: P3)
**User Journey:** As an acute care cardiologist, I want a live SVG physiological waveform strip (Lead II rhythm strip + continuous thoracic fluid bioimpedance curve) displaying subtle real-time motion at the top of the telemetry panel.

**Why this priority:** Solidifies the feeling of an active, living ICU/ambulatory telemetry workstation rather than a static presentation.

**Independent Test:** Continuous SVG path animation rendering 82 bpm sinus rhythm with tabular pulse rate indicator.

---

## 3. Functional Requirements

- **FR-001 (Living Rhythm Engine):** System MUST synchronize CSS/Canvas animation loops to `patient.trajectory.resting_hr_bpm` ($82\text{ bpm} = 1.36\text{ Hz}$).
- **FR-002 (Layered Anatomical Shaders):** System MUST support 4 distinct visual layer toggles for the digital twin (`Vascular`, `Pulmonary`, `Renal`, `Safety Corridor Heatmap`).
- **FR-003 (60fps Time Scrubber):** System MUST provide a continuous 14-day timeline scrubber with keyframe interpolation across all vitals and laboratory values.
- **FR-004 (Direct Caliper Dragging & Probing):** Clinicians MUST be able to click and drag biomarker caliper needles to test hypothetical clinical states.
- **FR-005 (Predictive Trajectory Projection):** Activating therapeutic options MUST project forward-looking 72h physiological curves with confidence envelopes.
- **FR-006 (Zero Modal Violation):** All interactions, simulators, and SBAR linked evidence MUST remain inline or within non-blocking slide-over drawers.
- **FR-007 (Performance Constraint):** All animations and transitions MUST run at 60fps on standard desktop browsers with zero main-thread freezing ($<16.6\text{ms}$ frame budget).

---

## 4. Proposed Architectural Directions (Overdrive Evaluation)

| Metric / Dimension | Direction 1: Living Bio-Twin & Time Scrubber (Recommended) | Direction 2: Therapeutic Sandbox & Waveform Monitor | Direction 3: Full 3D Spatial Glass OS (Three.js) |
| :--- | :--- | :--- | :--- |
| **Visual Ambition** | High (Bio-rhythmic pulsing, layered shaders, 60fps time scrubber) | High (Predictive projection curves, live ECG wave, simulation sliders) | Extreme (360° 3D mesh orbit, volumetric organ slicing) |
| **Interactivity** | Maximum (Scrub 14 days, drag calipers, toggle organ layers) | High (Dosage simulation, threshold testing, predictive curves) | Moderate (3D camera rotation, pan, zoom) |
| **Performance & Load** | Ultra-light (Canvas 2D + SVG + CSS `@property`, 0ms latency) | Ultra-light (D3 interpolation + SVG path morphing) | Heavy (Three.js WebGL engine, 400KB+ asset overhead, GPU fan spin) |
| **Clinical Utility** | Highest (Physicians understand disease trajectory over time) | Very High (Physicians evaluate projected drug efficacy) | Moderate (3D manipulation can distract from clinical data) |
| **Browser Compatibility**| 100% (All modern browsers, mobile, iPad) | 100% (All modern browsers, mobile, iPad) | Requires WebGL2 support, fallback required |
