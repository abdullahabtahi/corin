# Feature Specification: Multi-Workspace Clinical Navigation & Triage Workspaces

**Feature Branch**: `002-multi-workspace-navigation`  
**Created**: November 2026  
**Status**: Ratified / Ready for Implementation  
**Standard**: Google Health Product Design Director / Apple Health HIG / Epic Systems Modern EHR Standard  
**Governing Documents**: `.specify/memory/constitution.md`, `specs/corin_plan_audit_and_review.md`  

---

## 1. Problem Statement & User Value

Currently, clicking the navigation rail or header triggers only superficial, 1-line text or camera zoom changes within a single screen. This fails clinical expectations where providers must transition between distinct high-stakes cognitive tasks:
1. **Acute Patient Triage:** Deep analysis of an individual deteriorating patient (Arthur Pendelton).
2. **Population Health Panel Triage:** Managing an entire panel of 250 Medicare Advantage HFrEF/CKD beneficiaries to prioritize interventions.
3. **Guideline-Directed Medical Therapy (GDMT):** Auditing drug regimens against ACC/AHA guidelines, checking pharmacogenomic clearance, and verifying multi-drug safety invariants.

This feature establishes **3 distinct, high-value clinical workspaces** unified under a persistent patient context banner, eliminating superficial rail switches without introducing developer-facing clutter.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - Global Clinical Workspace Switching (Priority: P1) 🎯 MVP
**User Journey:** As an attending cardiologist or heart failure care manager, I want to switch between the Patient Workstation, Cohort Triage panel, and GDMT Regimen view via both the Top Header and Left Rail so that I can seamlessly move between population oversight and acute bed-level titration.

**Why this priority:** Establishes the foundational information architecture and view routing for the entire clinical system.

**Independent Test:** Clicking `Patient Cohort` in `HeaderNav` or the `Users` icon in `OrganRail` switches the view to the Cohort Triage panel with zero page reloads and instant 60fps cross-fade.

**Acceptance Scenarios:**
1. **Given** any view, **When** clicking `[ 👥 Patient Cohort ]`, **Then** the primary stage transitions to the Cohort Triage panel while maintaining the top clinical brand and patient banner.
2. **Given** any view, **When** clicking `[ 💊 ClyHealth Rx ]`, **Then** the primary stage transitions to the GDMT Regimen & Prescriptions workspace.
3. **Given** any view, **When** clicking `[ 🫀 Dashboard ]`, **Then** the view returns to the Living Digital Twin Workstation.

---

### User Story 2 - Population Health Cohort Triage Panel (Priority: P1)
**User Journey:** As Care Manager Sarah, RN, I want a high-density, sortable table displaying my panel of 250 heart failure patients, filtered by risk priority (`Critical Alerts [3]`, `Pending Orders [7]`, `Stable [240]`), so I can identify deteriorating patients and immediately load them into the Workstation in 1 click.

**Why this priority:** Population health nursing is the primary operational intake for cardiorenal RPM programs. Without a cohort panel, the application cannot demonstrate enterprise clinical utility.

**Independent Test:** Filtering by "Critical Alerts" displays Arthur Pendelton and 2 other high-risk patients; clicking Arthur's row immediately opens his Workstation view with the SBAR drawer primed.

**Acceptance Scenarios:**
1. **Given** the Cohort Triage view, **When** the page loads, **Then** 4 summary metric tiles render: `250 Active Panel Lives`, `3 Urgent Alerts (Avg Risk 84%)`, `7 Pending Physician Orders`, `240 Stable Beneficiaries`.
2. **Given** the patient table, **When** searching by patient name (e.g. "Arthur") or clicking the "Critical Alerts" filter tab, **Then** the list filters instantaneously.
3. **Given** Arthur Pendelton's row in the table, **When** clicking `[ Open Workstation ]`, **Then** the app transitions to Workspace 1 with Arthur selected and his 14-day telemetry loaded.

---

### User Story 3 - GDMT Pharmacotherapy & CDSS Prescribing Engine (Priority: P2)
**User Journey:** As an attending cardiologist or clinical pharmacist, I want a dedicated GDMT workspace that evaluates the ACC/AHA Quadruple Therapy pillars, audits pharmacogenomic clearance alleles (`CYP2C9 *1/*3`), displays an interactive Drug-Drug Interaction (DDI) safety matrix, and lists signed FHIR prescription orders.

**Why this priority:** Heart failure mortality is directly governed by GDMT optimization. Providing a dedicated prescribing engine transforms Corin into an end-to-end therapeutic solution.

**Independent Test:** Viewing GDMT Regimen displays all 4 drug classes with adherence/target percentages, Arthur's PGx profile, and the pending Furosemide 80mg escalation order.

**Acceptance Scenarios:**
1. **Given** the GDMT workspace, **When** viewing the Quadruple Therapy Cockpit, **Then** Lisinopril (ACEi), Carvedilol (Beta-Blocker), Spironolactone (MRA - Held for safety), and Empagliflozin (SGLT2i) display target dosage percentages and clinical rationale.
2. **Given** the Pharmacogenomics section, **When** reviewing `CYP2C9 *1/*3` and `PHACTR1`, **Then** clinical annotations explain Arthur's intermediate loop diuretic clearance and calcification risk.
3. **Given** the active prescription list, **When** an order is authorized, **Then** the HL7 FHIR `MedicationRequest` (#medrx-88319) appears with an immutable audit hash and pharmacy dispatch confirmation.

---

### User Story 4 - Unified Organ Rail System Lenses & Utility Drawers (Priority: P2)
**User Journey:** As a clinician, I want the Left System Rail to act as an anatomical lens across views, and I want Swarm Trace and SMS Dialogue to slide in non-intrusively from the side so developer telemetry never obscures patient care.

**Why this priority:** Resolves the dual-navigation conflict identified in the Impeccable critique and adheres to Krug's "Don't Make Me Think".

**Independent Test:** Clicking `Lungs` on the rail focuses pulmonary fluid stasis; clicking `Agent Trace` opens the Swarm Theater drawer without leaving the current view.

---

## 3. Functional Requirements

- **FR-001 (Workspace Routing State):** `ClinicalContext.tsx` MUST provide `currentWorkspace: 'workstation' | 'cohort' | 'pharmacy'` and `setCurrentWorkspace(ws)`.
- **FR-002 (Cohort Data Contract):** System MUST model at least 8 high-fidelity patient records in `COHORT_PATIENT_RECORDS` representing varied risk tiers (Urgent decompensation, Pending order, Stable).
- **FR-003 (1-Click Patient Handoff):** Clicking any patient row in `CohortWorklistView` MUST update `patient` in context and route to `currentWorkspace = 'workstation'`.
- **FR-004 (GDMT Regimen Architecture):** `GdmtPharmacyView` MUST present the ACC/AHA 4-pillar GDMT cockpit, PGx biomarker cards, and FHIR order ledger.
- **FR-005 (Persistent Patient Banner):** Arthur Pendelton's clinical summary pill MUST remain anchored in the header across all workspaces.
- **FR-006 (Zero-Modal Slide-Over Drawers):** SBAR, SMS Simulator, and Swarm Theater MUST remain slide-over drawers accessible from all workspaces via header/rail utility triggers.
- **FR-007 (Performance & Craft):** All transitions between workspaces MUST complete in $< 150\text{ms}$ with zero layout shift, strictly adhering to `.agents/skills/impeccable/SKILL.md` (no kickers, no pure `#FFFFFF` glare, tabular numerals).
