# Corin — Autonomous Cardiorenal Decompensation Interceptor

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.3-black?logo=bun&logoColor=white)](https://bun.sh/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![AWS Strands](https://img.shields.io/badge/AWS%20Strands-Agent%20SDK-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![Amazon Bedrock](https://img.shields.io/badge/Amazon%20Bedrock-Nova%20%7C%20Claude%203.5-232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![HL7 FHIR R4](https://img.shields.io/badge/HL7%20FHIR-R4%20Compliant-E60000)](https://hl7.org/fhir/R4/)
[![ONC HTI-1](https://img.shields.io/badge/ONC%20HTI--1-Algorithm%20Transparency-005A9C)](https://www.healthit.gov/)

> **Clinical Etymology & Design Rationale:**  
> **Corin** is named after the cardiac transmembrane serine protease expressed in human cardiomyocytes. When the myocardium experiences mechanical wall stretch and volume overload, **Corin cleaves inactive pro-ANP into active Atrial Natriuretic Peptide (ANP)**, triggering renal natriuresis and diuresis (\(\text{Na}^+ / \text{H}_2\text{O}\)) to relieve intravascular pressure.  
>  
> **Project Corin** is the computational analog of nature's cardiorenal feedback loop: detecting subclinical hemodynamic drift in ambulatory heart failure patients **7 to 14 days before acute pulmonary decompensation**, enabling safe, zero-modal guideline-directed medical therapy (GDMT) titration with deterministic clinical safety guardrails.

---

## 🏥 The Problem: Ambulatory Cardiorenal Decompensation

In heart failure patients with Cardiorenal Syndrome (CRS Type 2), **80% of fluid accumulation begins invisibly in the splanchnic venous reservoir** days before lung congestion or peripheral edema manifest.

```
Subclinical Venous Shift       Autonomic Sympathetic Surge      Weight Spike (>3 lbs)      Overt Pulmonary Edema
[Day -14 to -10]       ───►    [Day -9 to -4]            ───►   [Day -3 to -1]       ───►  [Day 0: Emergency Dept]
Splanchnic capacitance         Resting HR drift (+8 bpm)        Renal venous congestion    Dyspnea, orthopnea
shifts blood centrally.        Nocturnal tachycardia            eGFR drops, K+ shifts      \$24,000 Readmission
```

Current remote patient monitoring (RPM) relies on isolated scale readings, triggering alerts **too late** (at Day -2 or Day -1). Corin integrates **dual-vector EWMA telemetry** (weight velocity \(\alpha=0.28\) + resting heart rate drift) with **quadruple GDMT pharmacology constraints** to intervene during the asymptomatic 10-day window.

---

## ⚡ Key Capabilities & Architectural Principles

### 1. Deterministic CDSS Safety Guardian Engine (`<2ms`, Fail-Closed)
No probabilistic large language model is permitted to authorize medications or override physiological boundaries. Safety invariants are verified mathematically in pure deterministic code:

| Safety Invariant | Normal Operating Range | Safety Action Boundary | Deterministic Enforcement |
|---|---|---|---|
| **Serum Potassium (\(\text{K}^+\))** | 3.5 – 5.1 mEq/L | \(\ge 5.2 \text{ mEq/L}\) | **HARD VETO**: Locks loop diuretic titration; alerts clinician to hyperkalemia cliff. |
| **Systolic Blood Pressure (SBP)** | 95 – 135 mmHg | \(< 95 \text{ mmHg}\) | **HARD VETO**: Blocks titration to prevent cardiogenic hypoperfusion shock. |
| **Renal Function (eGFR)** | \(\ge 30 \text{ mL/min/1.73m}^2\) | \(< 30 \text{ mL/min}\) | **HARD VETO**: Prevents acute nephrotoxic injury; halts titration. |
| **BMP Lab Recency** | \(\le 14 \text{ days}\) | \(> 14 \text{ days}\) | **GUIDE Steering**: Holds medication titration and auto-generates a STAT BMP lab order. |

### 2. Multi-Workspace Clinical Workstation (7 Workspaces)
Corin organizes complex cardiorenal care into 7 keyboard-navigable (`1`–`7`), porcelain daylight workspaces:

1. **Cohort Stratification (`Key 1`)**: 250-patient ACO cohort triage with composite decompensation risk ranking and urgency tiers (STAT / Urgent / Routine).
2. **Organ Digital Twin Canvas (`Key 2`)**: Interactive 3D biological twin with real-time bio-rhythmic cardiac pulsation (synced to resting HR), dual-vector biomarker calipers, and 14-day time-travel scrubber.
3. **Renal Invariant Engine (`Key 3`)**: Nephrology trajectory tracking (eGFR, BUN/Cr ratio, potassium trends) and mathematical invariant checks.
4. **Pulmonary Congestion Studio (`Key 4`)**: Interstitial lung fluid accumulation modeling and orthopnea/pillow-count tracking.
5. **Quadruple GDMT Pharmacy (`Key 5`)**: Guideline-directed medical therapy titration (ARNI/ACEi, Beta-Blocker, MRA, SGLT2i) with contraindication gates.
6. **Pharmacogenomics Engine (`Key 6`)**: CYP2C9/VKORC1 metabolizer status, HLA risk alleles, and personalized drug dosing adjustments.
7. **Clinical Agent Execution Trace (`Key 7`)**: Full 6-stage DAG execution trace inspecting model provenance, latency profiles, and decision rationale.

### 3. Human-in-the-Loop (HITL) Prescribing Ceremony & FHIR R4
- **Zero-Modal Signing**: Prescriptions are prepared contextually with full audit trails.
- **Cryptographic Action Intent Tokens**: Every approved order generates a sha256 intent token binding patient MRN, clinician identity, and clinical rationale.
- **HL7 FHIR Interoperability**: Automatic export of standard FHIR R4 [`MedicationRequest`](https://hl7.org/fhir/R4/medicationrequest.html) and [`ServiceRequest`](https://hl7.org/fhir/R4/servicerequest.html) bundles.

---

## 🏛 System Architecture

```
                                  ┌──────────────────────────────────────────────┐
                                  │           Ambulatory Patient (SMS)           │
                                  └──────────────────────┬───────────────────────┘
                                                         │ Inbound SMS
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │      Stage 1: Primary Triage Engine          │
                                  │  Amazon Nova Micro (Deterministic Guardrail) │
                                  └──────────────────────┬───────────────────────┘
                                                         │ Red flags / Biomarkers
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │     Stage 2: Biometric Trajectory Engine     │
                                  │    Code Interpreter / Dual-Vector EWMA       │
                                  └──────────────────────┬───────────────────────┘
                                                         │ Trajectory Metrics
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │      Stage 3: Evidence Grounding Engine      │
                                  │ Cohere Rerank 3.5 + ACC/AHA Guidelines / KB  │
                                  └──────────────────────┬───────────────────────┘
                                                         │ Grounded Evidence
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │    Stage 4: Clinical Synthesis & SBAR        │
                                  │       Anthropic Claude 3.5 Sonnet            │
                                  └──────────────────────┬───────────────────────┘
                                                         │ Proposed Order
                                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   Stage 5: CDSS Deterministic Safety Guardian (<2ms)                   │
│   Checks: [K+ < 5.2 mEq/L] ∧ [SBP >= 95 mmHg] ∧ [eGFR >= 30 mL/min] ∧ [Lab <= 14d]    │
└──────────────────┬──────────────────────────────────────────────────┬──────────────────┘
                   │ Safety PASS                                      │ Safety VETO / GUIDE
                   ▼                                                  ▼
┌──────────────────────────────────────┐            ┌────────────────────────────────────┐
│ Stage 6: HITL Prescribing Ceremony   │            │ Hard VETO / Guided Steer:          │
│ - Clinician 1-Click Signature        │            │ - Diuretic Titration Locked        │
│ - Cryptographic Action Intent Token  │            │ - Auto-Order STAT BMP Lab (FHIR)   │
│ - HL7 FHIR R4 MedicationRequest      │            │ - Clinician Notification & Alert   │
└──────────────────────────────────────┘            └────────────────────────────────────┘
```

---

## 🚀 Quickstart Guide

### Prerequisites
- [Bun](https://bun.sh/) (v1.2+) or Node.js (v20+)
- [Python](https://python.org/) 3.12+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/abdullahabtahi/corin.git
cd corin
```

### 2. Frontend Setup & Local Development
```bash
cd frontend
bun install
bun run dev
```
The workstation interface will start at `http://localhost:5173/`.

### 3. Running Unit Tests
```bash
cd frontend
bun test
```
Runs the full suite of **68 unit tests** (422 assertions) verifying deterministic CDSS invariant proofs, EWMA smoothing calculations, FHIR resource conformity, and keyboard navigation.

### 4. Production Build Verification
```bash
cd frontend
bun run build
bun run preview
```

---

## 📁 Repository Structure

```
corin/
├── .github/
│   ├── ISSUE_TEMPLATE/            # Bug reports, feature requests, clinical safety templates
│   ├── PULL_REQUEST_TEMPLATE.md   # PR review checklist with clinical safety gates
│   └── workflows/ci.yml           # Automated GitHub Actions CI pipeline
├── docs/                          # MECE Documentation System (5 Pillars)
│   ├── 01_clinical_domain/        # Pathophysiology, trial data, Prior Auth audits
│   ├── 02_venture_strategy/       # Venture memo, $100M ARR math, Blue Ocean ERRC
│   ├── 03_technical_architecture/ # Strands SDK, Bedrock Mesh, Kedro Tri-Store, MCP
│   ├── 04_ux_and_design/          # Design system, UX research, wireframes
│   └── 05_cloud_and_infrastructure/ # Bedrock models, latency benchmarks
├── frontend/
│   ├── src/
│   │   ├── components/            # Porcelain daylight clinical components
│   │   │   ├── BiomarkerCalipers.tsx    # Dual-vector calipers (HR, weight, K+)
│   │   │   ├── CareStrategyGrid.tsx     # SBAR synthesis & order proposal
│   │   │   ├── CohortWorklistView.tsx   # 250-patient ACO risk table
│   │   │   ├── GdmtPharmacyView.tsx     # Quadruple GDMT protocol tracker
│   │   │   ├── GenomicsView.tsx         # CYP2C9/VKORC1 metabolizer engine
│   │   │   ├── HeaderNav.tsx            # Institution bar & patient demographic banner
│   │   │   ├── OrganRail.tsx            # Left multi-workspace navigation rail (1-7)
│   │   │   ├── PulmonaryView.tsx        # Interstitial congestion view
│   │   │   ├── RenalView.tsx            # Nephrology invariant engine
│   │   │   ├── SbarDrawer.tsx           # 1-Click SBAR recommendation drawer
│   │   │   ├── ScenarioSelector.tsx     # 4 clinical decompensation benchmark scenarios
│   │   │   ├── SmsSimulatorDrawer.tsx   # Patient SMS interaction & symptom extractor
│   │   │   ├── SwarmTelemetryView.tsx   # Full 6-stage DAG agent telemetry workspace
│   │   │   ├── SwarmTheaterDrawer.tsx   # Porcelain daylight execution trace drawer
│   │   │   ├── TimeTravelScrubber.tsx   # 14-day longitudinal trajectory scrubber
│   │   │   └── TwinCanvas.tsx           # Living cardiorenal digital twin canvas
│   │   ├── context/
│   │   │   └── ClinicalContext.tsx      # Central reactive clinical state & scenario engine
│   │   ├── hooks/                       # Keyboard shortcuts, SSE stream listeners
│   │   ├── lib/                         # Invariant engine, API contracts, timeline math
│   │   ├── test/
│   │   │   └── corin-cds.test.ts        # Comprehensive CDSS verification test suite
│   │   └── types/clinical.ts            # Strongly typed TypeScript clinical domain contracts
│   ├── package.json
│   └── vite.config.ts
├── specs/                         # Executable design & implementation specs
├── CITATION.cff                   # Academic citation metadata
├── CODE_OF_CONDUCT.md             # Contributor Covenant v2.1
├── CONTRIBUTING.md                # Google Open Source contributing guidelines
├── LICENSE                        # Apache 2.0 License
├── README.md                      # This master README
└── SECURITY.md                    # Healthcare security & vulnerability disclosure policy
```

---

## 🔒 Security & Privacy Posture

- **Zero PHI in Client Storage**: No patient health information is cached in unencrypted localStorage or browser session cookies.
- **Fail-Closed Architecture**: Any missing lab data, network timeout, or ambiguous physiological signal immediately drops into a fail-closed hard stop, alerting the human clinician.
- **Cryptographic Order Integrity**: All medication authorizations require human-in-the-loop signing and return a sha256 Action Intent Token to prevent replay or mutation attacks.

For vulnerability reporting, please see [SECURITY.md](./SECURITY.md).

---

## ⚖️ Clinical & Regulatory Disclaimer

> **IMPORTANT NOTICE**: Corin CDS is an open-source clinical decision support **research prototype** designed for academic evaluation, algorithm transparency research, and developer demonstration.  
>  
> It does **NOT** constitute an approved medical device under FDA regulations (21 CFR § 860) and must not be used as the sole basis for clinical diagnosis, treatment decisions, or acute emergency triage. In accordance with the 21st Century Cures Act § 3060 and ONC HTI-1, all algorithmic recommendations require independent human clinical verification by a licensed healthcare provider before implementation.

---

## 📜 License

Licensed under the **Apache License, Version 2.0**. See the [LICENSE](./LICENSE) file for details.
