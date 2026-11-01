---
description: "Actionable tasks list for Living Cardiorenal Workstation overhaul"
---

# Tasks: Living Cardiorenal Workstation Overhaul (001-interactive-workstation)

**Input**: Design documents from `specs/001-interactive-workstation/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`)  
**Prerequisites**: `spec.md`, `plan.md`, `.specify/memory/constitution.md`  
**Tests**: Automated unit/integration tests in `frontend/src/test/corin-cds.test.ts` via Bun.  

---

## Phase 1: Setup (Data Contracts & Types)

**Purpose**: Establish core data contracts and 14-day telemetry keyframe structures.

- [x] T001 [P] Extend `frontend/src/types/clinical.ts` with `AnatomicalLayer` union (`'full' | 'vascular' | 'pulmonary' | 'renal'`) and `TimelineDayInfo` interface.
- [x] T002 [P] Extend `frontend/src/lib/api.ts` with comprehensive `TIMELINE_14D_DAYS` containing day-by-day clinical values from Day -14 (stable) through Day 0 (alert).
- [x] T003 Implement linear interpolation helper `interpolateDayTelemetry(day: number)` in `frontend/src/lib/api.ts`.

---

## Phase 2: Foundational (Scrubber & Layer Reactive State)

**Purpose**: Core state management in `ClinicalContext.tsx` required for time-travel and layer inspection.

- [x] T004 Add `selectedDay` (1 to 14), `isPlayingTimeline`, `timelineSpeed`, and `activeAnatomicalLayer` to `ClinicalContext.tsx`.
- [x] T005 Implement automated timeline playback timer loop with `setInterval` and cancellation token in `ClinicalContext.tsx`.
- [x] T006 Ensure reactive derivation of active patient metrics (weight, resting HR, K+, SBP, orthopnea) based on `selectedDay`.

---

## Phase 3: User Story 1 - Living Bio-Rhythmic Twin & Anatomical Layers (Priority: P1) 🎯 MVP

**Goal**: Transform static center image into an active bio-rhythmic twin with 82 bpm cardiac pulse and multi-layer anatomical toggles.
**Independent Test**: Toggling layers changes visual shaders; cardiac beacon pulses at 82 bpm; clicking hotspots spotlights dashboard telemetry.

- [x] T007 [US1] Create CSS `@keyframes hemodynamic-cardiac-cycle` in `frontend/src/index.css` parameterized by `--resting-hr`.
- [x] T008 [US1] Implement Anatomical Layer Inspection pill selector (`Full Synthesis`, `Vascular Congestion`, `Pulmonary Stasis`, `Renal Invariants`) in `frontend/src/components/TwinCanvas.tsx`.
- [x] T009 [US1] Add dynamic SVG/CSS shader overlays for vascular congestion (pulmonary bed amber/cyan glow) and renal safety aura in `frontend/src/components/TwinCanvas.tsx`.
- [x] T010 [US1] Wire bidirectional leader-line callout hover states between organ hotspots and dashboard cards.

---

## Phase 4: User Story 2 - 14-Day Longitudinal Time-Travel Scrubber (Priority: P1)

**Goal**: Provide a bottom-docked liquid glass timeline scrubber allowing clinicians to travel from Day -14 to Day 0 at 60fps.
**Independent Test**: Dragging or playing the scrubber updates all dashboard cards, calipers, and twin radar pings fluidly without lag.

- [x] T011 [US2] Create new component `frontend/src/components/TimeTravelScrubber.tsx` with porcelain liquid glass styling and specular border highlight.
- [x] T012 [US2] Implement interactive scrubbing slider with tick marks for Day -14, Day -7 (sympathetic drift), Day -3 (weight spike), and Day 0 (current alert).
- [x] T013 [US2] Add Play/Pause toggle with 1x/2x speed controls and current day date stamp readout.
- [x] T014 [US2] Mount `TimeTravelScrubber.tsx` in `frontend/src/components/TwinCanvas.tsx` positioned strategically below the digital twin stage and clinical dashboard.

---

## Phase 5: User Story 3 - Tactile Calipers & Metric Probing (Priority: P2)

**Goal**: Replace passive caliper displays with interactive probing tooltips and dynamic threshold testing.
**Independent Test**: Hovering calipers displays sensor ID and LOINC accreditation; values update in lockstep with scrubber day.

- [x] T015 [US3] Bind `BiomarkerCalipers.tsx` needle positions and values to the active scrubbed telemetry metrics.
- [x] T016 [US3] Add interactive hover micro-tooltips showing sensor serial (`CS-88219`), timestamp, and LOINC codes.
- [x] T017 [US3] Smoothly interpolate color gradient tracks during time travel (slate blue $\to$ amber $\to$ rose).

---

## Phase 6: Polish, Testing & Constitution Verification

**Purpose**: Cross-cutting craft floor adherence, comprehensive test coverage, and build certification.

- [x] T018 Add test assertions in `frontend/src/test/corin-cds.test.ts` verifying time scrubber interpolation, layer switching, and 82 bpm pulse timing.
- [x] T019 Run `bun test` and ensure all tests pass with 0 failures (28 pass, 0 fail, 160 expectations verified).
- [x] T020 Run `bun run build` and ensure TypeScript strict mode passes with 0 bundle warnings.
- [x] T021 Run `impeccable detect` to guarantee 0 craft floor violations (no kickers, no pure `#FFFFFF` glare, tabular numerals).
