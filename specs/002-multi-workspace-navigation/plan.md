# Implementation Plan: Multi-Workspace Clinical Navigation & Triage Workspaces

**Branch**: `002-multi-workspace-navigation` | **Date**: November 2026 | **Spec**: [spec.md](file:///Users/abdullahabtahi/Strands%20SDK-%20Workshop%20to%20Ship%20/specs/002-multi-workspace-navigation/spec.md)

**Input**: Feature specification from `specs/002-multi-workspace-navigation/spec.md`  
**Audited By**: Impeccable Critique (`specs/corin_plan_audit_and_review.md`)  
**Governing Constitution**: `.specify/memory/constitution.md`  

## Summary

Expand Project Corin from a single-screen dashboard into a cohesive 3-workspace clinical suite:
1. **Workspace 1: Patient Workstation (`workstation`):** Arthur Pendelton's acute care triage (Living 82 bpm twin, 14d time-travel scrubber, continuous calipers, 1-click prescribing ceremony).
2. **Workspace 2: Cohort Triage Panel (`cohort`):** High-density panel management table across 250 Medicare Advantage HFrEF/CKD beneficiaries with risk priority sorting, search, and 1-click patient handoff to the Workstation.
3. **Workspace 3: GDMT Regimen & Prescribing (`pharmacy`):** ACC/AHA Quadruple Therapy Cockpit (Lisinopril, Carvedilol, Spironolactone hold, Empagliflozin, Furosemide titration), Pharmacogenomics (`CYP2C9 *1/*3`), DDI safety matrix, and FHIR order audit ledger.

---

## Technical Context

**Language/Version**: TypeScript 5.7+ (Strict Mode), React 19, Tailwind CSS v4, Bun  
**Dependencies**: `lucide-react` (icons), `clsx` / `tailwind-merge`  
**Storage**: In-memory React Context (`ClinicalContext.tsx`) with DuckDB SQL-on-FHIR contract parity  
**Testing**: `bun test` in `frontend/src/test/corin-cds.test.ts` (30+ automated assertions)  
**Performance Budget**: Instant tab transition ($< 100\text{ms}$), zero layout shift, 60fps animations  
**Design Standards**: WCAG 2.2 AAA, zero pure `#FFFFFF` glare, porcelain `#EAEFF5`/`#EDF1F6`/`#F4F6FA`, no kickers, strictly tabular numerals  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Invariant Rule | Proposed Implementation | Gate Status |
| :--- | :--- | :--- | :--- |
| **Principle 1** | Deterministic Safety Invariant Priority ($< 2\text{ms}$) | Preserved across all 3 workspaces; hard veto halts prescribing everywhere. | **PASS** |
| **Principle 2** | Data Strategy & Zero State Drift | Cohort data contract mirrors Synthea/FHIR population panel schema. | **PASS** |
| **Principle 3** | "Luminous Tactile Calm" (No pure white glare, no kickers) | All 3 views strictly use porcelain surfaces and specular white rims. | **PASS** |
| **Principle 4** | Abridge Linked Evidence (ONC HTI-1) | SBAR drawer accessible from header across all workspaces. | **PASS** |
| **Principle 5** | Zero-Modal Prescribing Ceremony | Order flow remains non-blocking with Action Intent Tokens. | **PASS** |
| **Principle 6** | Multi-Agent Strands Mesh Architecture | Swarm Theater accessible as slide-over drawer in header utility dock. | **PASS** |

---

## Project Structure

### Documentation

```text
specs/002-multi-workspace-navigation/
├── spec.md              # Requirements and prioritized user stories
├── plan.md              # This file
├── research.md          # Ergonomics of multi-view clinical EHRs
├── data-model.md        # Cohort patient interfaces and GDMT pillar models
├── quickstart.md        # Verification scripts and test workflows
└── tasks.md             # Execution task breakdown
```

### Source Code

```text
frontend/src/
├── types/
│   └── clinical.ts              # Extended with ClinicalWorkspace, CohortPatientRecord, GdmtPillar
├── context/
│   └── ClinicalContext.tsx      # currentWorkspace, activePatientId, cohortRecords
├── lib/
│   └── api.ts                   # COHORT_250_BENEFICIARIES dataset & GDMT definitions
├── components/
│   ├── HeaderNav.tsx            # Global workspace navigation tabs & patient context pill
│   ├── OrganRail.tsx            # Left system rail with cohort jump & organ lenses
│   ├── CohortWorklistView.tsx   # Workspace 2: 250-patient high-density triage worklist
│   ├── GdmtPharmacyView.tsx     # Workspace 3: Quadruple therapy, genomics & DDI matrix
│   ├── TwinCanvas.tsx           # Workspace 1: Living twin & 14-day time scrubber
│   ├── BiomarkerCalipers.tsx    # Workspace 1: Continuous physiological calipers
│   ├── CardiorenalStatusCard.tsx# Workspace 1: Status & biological aging delta
│   └── CareStrategyGrid.tsx     # Workspace 1: Action plan & 1-click order ceremony
└── App.tsx                      # Primary view router rendering active workspace
```
