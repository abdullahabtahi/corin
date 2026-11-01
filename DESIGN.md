---
name: Corin CDS v3.0 (ClyHealth Tactile Clinical)
description: Light Glassmorphic Cardiorenal Review Workspace inspired by ClyHealth
colors:
  surface-canvas: "#F3F5F9"
  surface-card: "#FFFFFF"
  surface-card-subtle: "#F8FAFC"
  surface-floating-dark: "#1E293B"
  surface-backdrop: "#070D18"
  border-card: "#E2E8F0"
  border-subtle: "#CBD5E1"
  text-primary: "#0F172A"
  text-secondary: "#475569"
  text-muted: "#94A3B8"
  accent-primary: "#2563EB"
  accent-blue-deep: "#1D4ED8"
  accent-cyan: "#0EA5E9"
  status-optimal: "#10B981"
  status-suboptimal: "#F59E0B"
  status-critical: "#EF4444"
  spectrum-orange: "#F97316"
  spectrum-amber: "#FBBF24"
  spectrum-emerald: "#34D399"
  spectrum-sky: "#38BDF8"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  display-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"
  caption-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
  micro:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.5625rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.surface-floating-dark}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "8px 20px"
  card-tactile:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "20px"
  pill-tab:
    backgroundColor: "{colors.surface-card-subtle}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  badge-status:
    backgroundColor: "{colors.surface-card-subtle}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Corin CDS v3.0 (ClyHealth Tactile Clinical)

## Overview

**Creative North Star: "The Living Cardiorenal Twin"**

Corin adopts the visual design language of **ClyHealth (*Designing Healthcare in Motion*)**: a luminous, tactile, high-density clinical workstation that pairs an interactive 3D anatomical twin with precise physiological telemetry. 

Unlike sterile legacy EHRs or dark developer terminals, this aesthetic uses soft studio lighting, crisp frosted glass cards, and continuous biomarker gradient ranges to reduce cognitive fatigue while elevating diagnostic precision. Every pixel is structurally wired to Corin's underlying **Strands SDK multi-agent backend** and **deterministic CDSS safety pipeline**.

**Key Characteristics:**
- **Luminous Studio Canvas (`#F3F5F9`):** Clean, glare-free porcelain slate background with subtle ambient depth.
- **Pure White Frosted Cards (`#FFFFFF`):** High-radius containers (16px–24px) with hairline borders (`#E2E8F0`) and soft diffuse drop shadows (`0 10px 30px -5px rgba(15, 23, 42, 0.04)`).
- **Signature Floating Dark Navy Accent (`#1E293B`):** Deep slate-blue frosted cards floating over the 3D twin for high-priority patient insights and active navigation tabs.
- **Continuous Physiological Range Calipers:** Gradient spectrum bars (optimal $\leftrightarrow$ suboptimal $\leftrightarrow$ critical) with tabular numeric values and reference range markers.
- **Interactive 3D Cardiorenal Model (Option A):** Translucent anatomical torso with pulsing hemodynamic alert hotspots over the heart, kidneys, splanchnic circulation, and pulmonary beds.

## Colors

The palette directly replicates the ClyHealth screenshot reference, calibrated for WCAG 2.2 AAA text contrast against pure white and porcelain slate.

### Primary Surfaces
- **Porcelain Canvas (`#F3F5F9`):** The primary workstation canvas.
- **Pure White Surface (`#FFFFFF`):** Base container for clinical telemetry cards, tabs, and control pills.
- **Subtle Surface (`#F8FAFC`):** Inset backgrounds for sliders, secondary lists, and baseline boxes.
- **Deep Navy Floating Anchor (`#1E293B`):** Signature high-contrast surface for the active navigation pill and floating patient insight cards.

### Text Hierarchy
- **Primary Ink (`#0F172A`):** Deep charcoal for patient names, vital numbers, and diagnoses.
- **Secondary Slate (`#475569`):** Body narrative and clinical labels.
- **Muted Metadata (`#94A3B8`):** Measurement units (`lbs`, `bpm`, `mEq/L`), timestamps, and LOINC codes.

### Physiological Range Spectrum
- **Optimal / Safe (`#10B981`):** Verified normal range; gradient shift to clean cyan `#38BDF8`.
- **Suboptimal / Alert (`#F59E0B`):** Subclinical drift (+3.6 lbs EWMA weight, +14 bpm resting HR); gradient shift to warm amber `#FB923C`.
- **Critical / Veto (`#EF4444`):** Physiological contraindications ($K^+ \ge 5.2$, $\text{SBP} < 95$); gradient shift to crimson `#DC2626`.

### Named Rules
**The ClyHealth Gradient Rule.** Gradient fills are strictly reserved for continuous physiological range sliders and organ hotspot glow envelopes. They must never be applied to typography or card backgrounds.

**The Floating Anchor Rule.** High-priority alerts floating over the 3D canvas must use the deep navy glass token (`#1E293B`) with frosted white text to maintain high legibility over the translucent 3D twin.

## Typography

**Primary Font Family:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.  
**Numeric Styling:** Strict `font-variant-numeric: tabular-nums` across all weights, heart rates, lab values, and timestamps.

### Hierarchy
- **Display** (Bold 700, 1.75rem / 28px, line-height 1.2): Screen title and patient identification banner.
- **Title** (Semibold 600, 1.125rem / 18px, line-height 1.3): Organ system headers ("Cardiovascular System", "Renal Hemodynamics").
- **Body** (Regular 400, 0.875rem / 14px, line-height 1.5): Clinical narrative prose, SBAR assessment text, and guidelines. Max line length 68ch.
- **Label** (Semibold 600, 0.75rem / 12px, line-height 1.4, tracking 0.04em): Section tags, slider boundaries, and badge metadata.

### Named Rules
**The Tabular Metric Rule.** Every vital sign, lab number, dosage, and timestamp must render with `tabular-nums` so numbers remain vertically aligned and do not jitter during live updates.

## Layout

Corin maps the ClyHealth spatial architecture into a high-leverage 3-zone layout:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ CORIN HEALTH  |  Cardiorenal Review        [Dashboard]  [Telemetry]  [Orders]    Care Manager: Sarah J. │
├────┬───────────────────────────────────────────┬───────────────────────────────────────────────────────┤
│ 🫀 │ 🧍 3D CARDIORENAL TWIN (Center-Left)      │ 📊 CLINICAL TELEMETRY & CDSS RAIL (Right Stage)       │
│ 🫘 │                                           │                                                       │
│ 🫁 │       [Arthur Pendelton • 71M]            │ Cardiovascular & Renal Status               Risk: HIGH│
│ ⚖️ │                                           │ ┌───────────────────────┬───────────────────────────┐ │
│ 💊 │             ╭─────────╮                   │ │ Heart Age: 48 yrs     │ Chronological Age: 71 yrs │ │
│ 🛡️ │             │  (🫁)   │ ── Orthopnea (2p) │ │ (Risk: +14% decomp)   │ NYHA Class III (EF 32%)   │ │
│ ⚙️ │             │   │     │                   │ └───────────────────────┴───────────────────────────┘ │
│    │             │  (🫀)   │ ── PCWP ~22 mmHg  │                                                       │
│    │             │  / \    │    ▲ HR 82 bpm    │ Key Areas of Concern (Continuous Biomarker Sliders)   │
│    │             │ (🫘 🫘) │ ── eGFR 54 ml/min │ ┌───────────────────────────────────────────────────┐ │
│    │             ╰─────────╯    K+ 4.6 mEq/L   │ │ Weight Velocity (14d)  ▲ +3.6 lbs        Suboptimal │ │
│    │                                           │ │ 179 lb ───[181.0 Base]───────● 184.6 lb ─── 188 lb│ │
│    │  ┌─────────────────────────────────────┐  │ ├───────────────────────────────────────────────────┤ │
│    │  │ 💬 2 New Patient Insights           │  │ │ Resting HR Drift       ▲ +14 bpm        Suboptimal │ │
│    │  │ • Orthopnea confirmed via SMS (08:14)│ │ │ 60 bpm ───[68 Base]──────────● 82 bpm ───── 100 bpm│ │
│    │  │ • 100% Med Adherence (Lasix 40mg)   │  │ ├───────────────────────────────────────────────────┤ │
│    │  │ [ View Arthur's Transcript ]        │  │ │ Serum Potassium (K+)   4.6 mEq/L            Optimal│ │
│    │  └─────────────────────────────────────┘  │ │ 3.5 mEq/L ───────● 4.6 ────────[5.2 Limit] 5.5 mEq │ │
│    │                                           │ └───────────────────────────────────────────────────┘ │
│    │  [ + ] Zoom In                            │                                                       │
│    │  [ - ] Zoom Out                           │ Evidence-Anchored SBAR Synthesis                      │
│    │  [ ⛶ ] Reset Canvas                       │ [S] Subclinical fluid overload: [+3.6 lbs]¹ + [HR +14]│
│    │                                           │ [B] Baseline dry weight 181.0 lbs; [K+ 4.6, eGFR 54]⁴ │
│    │                                           │ [A] 87% probability of acute HF hospitalization in 14d│
│    │                                           │ [R] Titrate Furosemide to 80mg PO x 3d; repeat BMP D3 │
│    │                                           │                                                       │
│    │                                           │ 🔒 CDSS Governed Order Rail (Zero-Modal)              │
│    │                                           │ ┌───────────────────────────────────────────────────┐ │
│    │                                           │ │ 🛡️ CDSS VERDICT: PASSED (All 3 Invariants Verified)│ │
│    │                                           │ │ • K+ < 5.2 mEq/L (✓)  • SBP >= 95 mmHg (✓)        │ │
│    │                                           │ ├───────────────────────────────────────────────────┤ │
│    │                                           │ │ Rx: Furosemide 80mg PO qAM x 3 days (Return to 40)│ │
│    │                                           │ │ Lab: Day 3 Morning Fasting BMP (LOINC 24323-8)    │ │
│    │                                           │ └───────────────────────────────────────────────────┘ │
│    │                                           │ ┌───────────────────────────────────────────────────┐ │
│    │                                           │ │ [ ⚡ SIGN & TRANSMIT TITRATION ORDER ]             │ │
│    │                                           │ └───────────────────────────────────────────────────┘ │
└────┴───────────────────────────────────────────┴───────────────────────────────────────────────────────┘
```

## Elevation & Depth

- **Tactile Card Depth:** `box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.04), 0 2px 4px -1px rgba(15, 23, 42, 0.02)`.
- **Floating Controls (Canvas):** Circular white pills with `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08)`.
- **Floating Insight Card:** Navy frosted glass (`#1E293B`) with `backdrop-filter: blur(20px)` and subtle white glow border `rgba(255, 255, 255, 0.1)`.

## Shapes

- **Card Containers:** Deep rounded corners (`20px` radius) matching ClyHealth's friendly yet clinical geometry.
- **Segmented Control Tabs & Action Buttons:** Full pill geometry (`rounded-full` / `9999px`).
- **Dividers:** 1px hairline rules using `#E2E8F0`.

## Components

### 1. Top Clinical Navigation
- Segmented pill tabs (`Dashboard`, `Telemetry Stream`, `Care Plans`, `Audit Trace`) with active tab in deep navy `#1E293B` and white text.
- Patient quick-context chip with MRN and diagnosis codes.

### 2. Left Organ System Rail
- Vertical 64px width dock with minimal line-drawn organ icons: Heart (Active), Kidney, Lung, Fluid Mass, Meds, CDSS Shield, Agent Trace.

### 3. Interactive 3D Cardiorenal Twin (Center Stage)
- 3D WebGL / Three.js torso with translucent glass shader.
- Interactive hotspots with glowing concentric radar rings:
  - Heart: `PCWP ~22 mmHg`, resting HR elevation.
  - Kidney: `eGFR 54 mL/min`, sodium retention vector.
  - Lung: `Orthopnea (2 Pillows)` callout tag.
- Floating `2 New Insights` dark navy card with quick link to Arthur's Care Companion SMS transcript.
- Floating zoom (`+` / `-`) and reset viewport pills.

### 4. Continuous Biomarker Sliders ("Key Areas of Concern")
- Replicates ClyHealth's horizontal biomarker bars:
  - **Weight Velocity Slider:** Displays dry weight baseline (181.0 lbs), current telemetry dot (184.6 lbs), and gradient track shifting into amber.
  - **Resting Heart Rate Drift Slider:** Baseline 68 bpm drifting to 82 bpm.
  - **Serum Potassium (K+) Safety Slider:** Current 4.6 mEq/L comfortably positioned below the 5.2 mEq/L hard contraindication threshold.

### 5. Deterministic CDSS Order Rail & 1-Click Signature
- Inline green verification shield (`CDSS VERDICT: PASSED`).
- Structured FHIR `MedicationRequest` order bundle (Furosemide 80mg PO x 3 days + Day 3 BMP safety check).
- High-visibility action button (`[ ⚡ SIGN & TRANSMIT TITRATION ORDER ]`).

## Do's and Don'ts

### Do:
- **Do** use pure white cards with soft diffuse shadows on the porcelain `#F3F5F9` canvas.
- **Do** use continuous gradient bars for physiological biomarkers (optimal $\leftrightarrow$ suboptimal $\leftrightarrow$ critical).
- **Do** use the signature `#1E293B` deep navy pill for the active tab and floating patient insight card.
- **Do** ensure all numerical vitals and lab values use `font-variant-numeric: tabular-nums`.

### Don't:
- **Don't** use dark mode backgrounds or harsh neon borders; maintain the clean, daylight studio look of ClyHealth.
- **Don't** use gradient text on headings.
- **Don't** use modal dialogs for order confirmations; keep the CDSS safety gate inline next to the data.
- **Don't** display unverified claims without clickable provenance chips.

