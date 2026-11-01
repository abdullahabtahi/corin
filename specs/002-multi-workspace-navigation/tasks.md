---
description: "Tasks for Multi-Workspace Clinical Navigation & Triage Workspaces"
---

# Tasks: Multi-Workspace Clinical Navigation (002-multi-workspace-navigation)

**Input**: Design documents from `specs/002-multi-workspace-navigation/` (`spec.md`, `plan.md`, `data-model.md`)  
**Prerequisites**: `spec.md`, `plan.md`, `.specify/memory/constitution.md`  
**Tests**: Automated unit/integration tests in `frontend/src/test/corin-cds.test.ts` via Bun.  

---

## Phase 1: Setup (Data Contracts & Types)

**Purpose**: Establish data contracts for workspace routing, cohort patient records, and GDMT pillars.

- [x] T001 [P] Extend `frontend/src/types/clinical.ts` with `ClinicalWorkspace`, `CohortPatientRecord`, and `GdmtPillar` interfaces.
- [x] T002 [P] Add `COHORT_250_BENEFICIARIES` dataset and `GDMT_PILLARS_DATA` to `frontend/src/lib/api.ts`.

---

## Phase 2: Foundational (Context & Routing State)

**Purpose**: Core workspace state management in `ClinicalContext.tsx`.

- [x] T003 Add `currentWorkspace` (`'workstation' | 'cohort' | 'pharmacy'`), `setCurrentWorkspace`, and `selectCohortPatient` to `frontend/src/context/ClinicalContext.tsx`.

---

## Phase 3: User Story 1 - Global Clinical Workspace Switching (Priority: P1) 🎯 MVP

**Goal**: Seamlessly transition between Workstation, Cohort Triage, and GDMT Regimen.
**Independent Test**: Clicking header tabs or rail icons switches views in $<100\text{ms}$ with zero layout shift.

- [x] T004 [US1] Update `frontend/src/components/HeaderNav.tsx` tabs to control `currentWorkspace` with active visual pill states.
- [x] T005 [US1] Update `frontend/src/components/OrganRail.tsx` so Users icon switches to Cohort view, while organ icons switch to Workstation with the selected lens.
- [x] T006 [US1] Update `frontend/src/App.tsx` view router to render `CohortWorklistView` and `GdmtPharmacyView` alongside `TwinCanvas`.

---

## Phase 4: User Story 2 - Population Health Cohort Triage Panel (Priority: P1)

**Goal**: High-density panel management across 250 Medicare lives with risk priority filtering and 1-click patient handoff.
**Independent Test**: Filter by "Critical Alerts" to view Arthur Pendelton; clicking `[ Open Workstation ]` immediately loads Arthur in Workspace 1.

- [x] T007 [US2] Create `frontend/src/components/CohortWorklistView.tsx` with 4 summary metric tiles (`250 Lives`, `3 Critical Alerts`, `7 Pending Orders`, `240 Stable`).
- [x] T008 [US2] Implement filter tabs (`All [250]`, `Critical Alerts [3]`, `Pending Orders [7]`, `Stable [240]`) and search bar in `CohortWorklistView.tsx`.
- [x] T009 [US2] Implement patient table rows with trajectory deltas, Decider routes, and 1-click `[ Open Workstation ]` action handoff.

---

## Phase 5: User Story 3 - GDMT Pharmacotherapy & CDSS Prescribing Engine (Priority: P2)

**Goal**: Dedicated pharmacotherapy cockpit auditing Quadruple Therapy, PGx alleles, and DDI safety checks.
**Independent Test**: View GDMT Cockpit with target doses, PGx metabolic annotations, and verified FHIR order ledger.

- [x] T010 [US3] Create `frontend/src/components/GdmtPharmacyView.tsx` with ACC/AHA Quadruple Therapy Cockpit (Lisinopril, Carvedilol, Spironolactone hold, Empagliflozin, Furosemide).
- [x] T011 [US3] Add Pharmacogenomics panel (`CYP2C9 *1/*3`, `VKORC1`, `PHACTR1`) and DDI invariant matrix in `GdmtPharmacyView.tsx`.
- [x] T012 [US3] Display immutable FHIR `MedicationRequest` order audit card and pharmacy dispatch logs in `GdmtPharmacyView.tsx`.

---

## Phase 6: Polish, Testing & Impeccable Verification

**Purpose**: Cross-cutting craft floor adherence, comprehensive test coverage, and build certification.

- [x] T013 Add automated tests in `frontend/src/test/corin-cds.test.ts` for workspace routing, cohort selection, and GDMT compliance.
- [x] T014 Run `bun test` and ensure all tests pass with 0 failures.
- [x] T015 Run `bun run build` and ensure TypeScript strict mode passes.
- [x] T016 Run `impeccable detect` to verify 0 craft violations (no kickers, no pure `#FFFFFF` glare, tabular numerals).
