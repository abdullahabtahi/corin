Create a comprehensive PRD and phased technical implementation plan in markdown for the Corin frontend prototype (Autonomous Cardiorenal Decision Support & Ambulatory Care Management System), showcasing clinician ergonomics and interactive UX.

Working directory: /Users/abdullahabtahi/Strands SDK- Workshop to Ship 
Integrity mode: development

Reference material:
- Target visual design: ClyHealth ("Designing Healthcare in Motion", Dribbble shot #26507817; reference implementation in `frontend/index.html` and Figma canvas `cbHiXKyBCIgnB8nb1J8Qfc`, node `9:2`)
- Visual assets: `assets/dna_navy_backdrop.png`, `assets/full_body_twin_transparent.png`, `assets/supplement_bottle_transparent.png`
- Project context and architecture: `PRODUCT.md`, `DESIGN.md`, `docs/`, `frontend_prototype_prd_and_implementation_plan.md`

## Requirements

### R1. Frontend Prototype Product Requirements Document (PRD)
Author a comprehensive PRD specifying the interactive prototype for Corin that aligns with the planned architecture and existing documentation. Detail clinical user personas, end-to-end ambulatory cardiorenal workflows (longitudinal monitoring, decompensation detection, medication titration), functional specifications for each view, and interaction states.

### R2. Clinical Workstation Interface and Cognitive Ergonomics
Specify the workstation UI architecture adhering to ClyHealth design patterns: porcelain tablet workstation frame (`rounded-[32px]`), top nav pill dock, left 56px organ rail, 3D anatomical twin canvas with leader pins, Age Differential card, Key Areas of Concern biomarker range sliders with caliper pins, Customized Care Strategy 6-card grid with bottle thumbnails, and bottom floating banner. Enforce the clinical invariant: Doctor-first cognitive ergonomics (lead with clinical meaning, physiological state, and visual calipers rather than raw numbers).

### R3. Component Stack and Primitives Architecture
Specify the component architecture utilizing Radix UI / shadcn primitives (Tabs, Slider, Tooltip, Dialog), Tailwind CSS v3.4+, Lucide Icons, and high-resolution layered WebP/PNG assets to reproduce workstation fidelity with 0 KB WebGL overhead.

### R4. Multi-Agent and Clinical Backend Integration Specifications
Specify technical integration contracts and data flows for the underlying backend: Strands SDK multi-agent system, Amazon Bedrock (Claude 3.7 Sonnet / Nova), deterministic CDSS guardian physically gating diuretic orders, and SMART on FHIR R4 client resources.

### R5. Phased Technical Implementation Plan
Produce a phased engineering implementation plan covering component scaffolding, state management, mock and live API/agent integration, verification milestones, and the transition path from static prototype (`frontend/index.html`) to full interactive application.

## Acceptance Criteria

### PRD and Functional Completeness
- [ ] PRD defines clinical personas, ambulatory workflows, and functional requirements for all workstation views.
- [ ] PRD specifies doctor-first cognitive ergonomics across all clinical status displays, prioritizing qualitative status and risk calipers over raw values.
- [ ] All workstation visual elements from ClyHealth and `frontend/index.html` are specified in the PRD (frame, pill dock, organ rail, twin canvas with leader pins, age differential, caliper sliders, care strategy card grid, and floating banner).

### Architectural and Component Integration
- [ ] Component architecture specifies exact Radix UI / shadcn primitives (Tabs, Slider, Tooltip, Dialog), Tailwind CSS v3.4+, Lucide Icons, and layered 2D assets.
- [ ] Backend integration specifications define contract and data flow for Strands SDK agent bridge and Amazon Bedrock models.
- [ ] Safety gating specifications mandate deterministic CDSS guardian physical interlock on all diuretic titration actions prior to order submission.
- [ ] Data layer specifies SMART on FHIR R4 resource mappings for patient, observations, conditions, and medication orders.

### Phased Implementation Plan
- [ ] Phased implementation plan breaks work into concrete, ordered engineering phases with explicit inputs, deliverables, and dependencies.
- [ ] Implementation plan defines verification checkpoints and validation criteria for each phase.
