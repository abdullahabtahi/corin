# Product: Corin (Cardiorenal Decision Support & Ambulatory Care)

## 1. Vision & Problem Statement
Heart failure (HFrEF) and chronic kidney disease (CKD) patients suffer frequent, costly emergency hospitalizations due to insidious fluid overload. Traditional RPM systems overwhelm clinicians with raw, uncontextualized scale alerts. Corin acts as an autonomous cardiorenal care management system that detects subclinical congestion 10–14 days before acute symptoms emerge, conducts empathetic conversational check-ins via SMS, synthesizes evidence-anchored SBAR reviews, and pre-drafts clinically sound, deterministically governed diuretic titration orders.

## 2. Target Personas
- **Primary Clinician:** Sarah Jenkins, RN — Ambulatory Heart Failure Nurse Care Manager at Pine Valley ACO REACH. Needs rapid verification and 1-click order execution without EHR tab fragmentation.
- **Attending Physician:** Dr. Robert Chen, MD — Board-Certified Cardiologist at St. Jude Heart Institute. Requires transparent provenance and hard deterministic safety invariant guarantees before delegating titration.
- **Patient:** Arthur Pendelton (71M, NYHA Class III HFrEF, EF 32%, CKD 3a). Lives independently; uses a cellular weight scale and responds to simple, respectful SMS check-ins from the Care Companion agent.
- **Auditor / Regulatory Evaluator:** Clinical Informaticist or hackathon judge inspecting agent execution traces, token costs, and safety rules.

## 3. Visual Experience & Design Language
- **Aesthetic Direction:** ClyHealth (*Designing Healthcare in Motion*).
- **Core Surface:** Luminous studio porcelain canvas (`#F3F5F9`) with pure white tactile cards (`#FFFFFF`), diffuse soft elevation shadows, and signature deep navy floating accent cards (`#1E293B`).
- **Anatomical Twin (Option A):** Interactive 3D WebGL / Three.js cardiorenal model with dynamic hemodynamic hotspots highlighting myocardial filling pressure, renal perfusion, and pulmonary congestion.
- **Safety Semantics:** Continuous gradient sliders (Optimal $\leftrightarrow$ Suboptimal $\leftrightarrow$ Critical) and deterministic CDSS verification shields.

## 4. Architectural Foundation
- **Multi-Agent Engine:** Strands SDK with AWS Bedrock (Claude 3.7 Sonnet for SBAR synthesis, AWS Nova Micro for high-speed SMS dialogue).
- **Deterministic CDSS Guardian:** Hardcoded Python safety invariants (Potassium $< 5.2$, Systolic BP $\ge 95$, eGFR delta $< 15\%$) physically gating order execution.
- **EHR Interoperability:** SMART on FHIR R4 REST API client generating cryptographically signed `MedicationRequest` and `ServiceRequest` bundles.

