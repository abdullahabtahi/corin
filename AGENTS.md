# AGENTS.md — AI Agent Operating Instructions & Repository Guidelines

Welcome, AI Agent (Claude Code, Antigravity, Codex, Cursor, Windsurf, Copilot, or autonomous subagents). This document outlines operational protocols, non-negotiable architectural boundaries, coding standards, and verification requirements for working in **Project Corin**.

---

## 1. Project Mission & Identity

**Corin** is an **Autonomous Cardiorenal Decompensation Interceptor & Clinical Decision Support System (CDSS)** for ambulatory heart failure patients with Cardiorenal Syndrome (CRS Type 2).

- **Clinical Rationale**: Detects subclinical splanchnic venous hemodynamic shifts **7 to 14 days before acute pulmonary edema** using dual-vector EWMA telemetry (weight velocity \(\alpha=0.28\) + resting heart rate drift).
- **Core Philosophy**: **Deterministic Safety Over Probabilistic Autonomy**. Probabilistic LLMs synthesize text and extract symptoms, but deterministic code mathematically enforces all clinical safety boundaries.
- **Design Aesthetic**: **Hospital-Grade Porcelain Daylight Instrumentation**. Never use consumer AI tropes or sci-fi cyberpunk styling.

---

## 2. Non-Negotiable Clinical Invariants (FAIL-CLOSED)

Any code modification that weakens, bypasses, or softens these 4 deterministic safety boundaries is a critical defect and must be rejected immediately:

| Safety Invariant | Normal Operating Range | Trigger Boundary | Required Deterministic Action |
|---|---|---|---|
| **Serum Potassium (\(\text{K}^+\))** | 3.5 – 5.1 mEq/L | \(\ge 5.2 \text{ mEq/L}\) | **HARD VETO**: Locks loop diuretic titration; alerts clinician to hyperkalemia cliff. |
| **Systolic Blood Pressure (SBP)** | 95 – 135 mmHg | \(< 95 \text{ mmHg}\) | **HARD VETO**: Blocks titration to prevent cardiogenic hypoperfusion shock. |
| **Renal Function (eGFR)** | \(\ge 30 \text{ mL/min/1.73m}^2\) | \(< 30 \text{ mL/min}\) | **HARD VETO**: Prevents acute nephrotoxic tubular injury; halts titration. |
| **BMP Lab Recency** | \(\le 14 \text{ days}\) | \(> 14 \text{ days}\) | **GUIDE Steering**: Holds medication titration and auto-generates a STAT BMP lab order. |

### Prescribing Ceremony Constraints
- **Zero Phantom Prescriptions**: LLMs are strictly forbidden from writing or committing prescriptions autonomously.
- **Human-in-the-Loop (HITL)**: All orders require clinician confirmation.
- **Cryptographic Action Intent Tokens**: Every order commitment must compute a sha256 token binding patient MRN, timestamp, clinician ID, and order payload.
- **Execution Latency**: Pure deterministic CDSS functions must execute in \(<2\text{ms}\).

---

## 3. UI/UX & Craft Standards (Zero AI Slop)

When designing, modifying, or refactoring frontend components in `frontend/src/`:

1. **Color Palette Enforcement**:
   - **Banned Colors**: NO electric cyan (`cyan-*`), NO neon indigo (`indigo-*`), NO purple (`purple-*`), NO fuchsia/violet, NO rainbow gradients.
   - **Allowed Surface Colors**: Porcelain daylight backdrops (`#EDF1F6`, `#EAEFF5`), clean cards (`bg-white/80`, `#F4F6FA`), specular 1px borders (`border-slate-200/60`, `border-white/90`).
   - **Primary Action & Navigation**: High-contrast clinical cobalt blue (`#2563EB`, `text-blue-600`, `bg-blue-600`).
   - **Semantic Physiological Badges**:
     - Emerald (`text-emerald-700 bg-emerald-50 border-emerald-200`): Normal / Invariant Passed.
     - Amber (`text-amber-800 bg-amber-50 border-amber-200`): Suboptimal / Guide Steering / Active Monitoring.
     - Rose (`text-rose-800 bg-rose-50 border-rose-200`): Hard Veto / Decompensation Alert / Critical Boundary.
2. **Icon & Motion Discipline**:
   - **Banned Icons**: The `Sparkles` (`✨`) icon is completely prohibited for clinical instrumentation. Use [`ShieldCheck`](file:///Users/abdullahabtahi/Strands%20SDK-%20Workshop%20to%20Ship%20/frontend/src/components/OrganRail.tsx) for safety validations and [`Activity`](file:///Users/abdullahabtahi/Strands%20SDK-%20Workshop%20to%20Ship%20/frontend/src/components/TwinCanvas.tsx) for biometric signals.
   - **No Vibrating Caliper Needles**: Do NOT add `animate-pulse` to biomarker measurement needles. Calipers must be stationary, sharp, and razor-precise.
3. **Typography & Nomenclature**:
   - Apply `tabular-nums font-mono` to all numbers, physiological metrics, dates, and timestamps.
   - **No Vendor Model Stuffing**: Do not print raw LLM vendor names (`Amazon Nova Micro`, `Claude Sonnet 4.6`, `Code Interpreter`) as main UI headers. Use functional clinical systems architecture:
     - *"Primary Triage Engine"* (Bedrock Decider)
     - *"Biometric Trajectory Engine"*
     - *"Clinical Synthesis & SBAR Drafter"*
     - *"Deterministic Safety Guardrail"*

---

## 4. Repository Structure & Key Paths

```
corin/
├── .github/workflows/ci.yml   # CI pipeline (Bun typecheck, bun test, secret scan)
├── assets/                    # High-res clinical diagrams and transparent twin assets
├── docs/                      # 5-Pillar MECE Documentation System
├── frontend/                  # React 19 + Tailwind v4 + Vite + Bun Clinical Workstation
│   ├── src/
│   │   ├── components/        # Porcelain daylight UI components (Calipers, Twin, Workspaces)
│   │   ├── context/           # Central reactive clinical state (ClinicalContext.tsx)
│   │   ├── hooks/             # useClinicianShortcuts.ts, useSwarmStream.ts
│   │   ├── lib/               # api.ts, scenarios.ts, timeline.ts
│   │   ├── test/              # corin-cds.test.ts (68 unit tests)
│   │   └── types/             # clinical.ts (Strongly typed domain models)
│   └── package.json           # Frontend dependencies & scripts
├── specs/                     # Executable specifications & tasks
├── AGENTS.md                  # This file
├── LICENSE                    # Apache 2.0 License
├── README.md                  # Master repository documentation
└── SECURITY.md                # Healthcare security & vulnerability disclosure
```

---

## 5. Development Recipes & Execution Commands

Always run frontend commands using **Bun** (`bun`), not npm or yarn:

### Running Tests
```bash
cd frontend && bun test
```
- **Rule**: All 68 unit tests (422 assertions) must pass with 0 failures before any task is marked complete.

### Static Type Checking & Production Build
```bash
cd frontend && bunx tsc -b
cd frontend && bun run build
```
- **Rule**: Build must complete cleanly with 0 TypeScript errors.

### Code Linting
```bash
cd frontend && bun run lint
```
- Uses `oxlint` for fast, zero-configuration linting.

### Local Development Server
```bash
cd frontend && bun run dev
```
- Runs Vite on `http://localhost:5173/`.

---

## 6. Git Hygiene, Security & Privacy Rules

1. **NEVER Commit Credentials or Environment Files**:
   - `.env`, `.env.*` (e.g. `.env.bedrock`), `*.pem`, `*.key`, `credentials.json`, and cloud tokens are strictly ignored.
   - Always run `git status` before committing to verify no secret files are staged.
2. **NEVER Track Local AI Agent Harness Folders in Public Repositories**:
   - The following local agent/tooling folders are excluded by `.gitignore`:
     - `.agents/`
     - `.codex/`
     - `.impeccable/`
     - `.specify/`
     - `.claude/`, `.gemini/`, `.antigravity/`
     - `skills-lock.json`, `run-claude.sh`
   - Keep them strictly on your local machine; never stage or push them to GitHub.
3. **Conventional Commits**:
   - Use standardized prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
   - Provide clear, bulleted changelogs in the commit body.

---

## 7. Verification Checklist Before Handing Off Work

Before concluding any turn or declaring a task complete, verify the following:

- [ ] `bun test` passes 100% in `frontend/`.
- [ ] `bunx tsc -b` succeeds without type errors.
- [ ] `bun run build` generates clean output.
- [ ] No `Sparkles`, cyan, neon purple, or vibrating caliper needles introduced.
- [ ] No local assistant directories or credential files staged in git (`git status`).
- [ ] Working tree is clean and committed with conventional commit message.
