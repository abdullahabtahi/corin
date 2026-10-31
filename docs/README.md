# AegisHealth AI — Master Documentation Index

**Mutually Exclusive, Collectively Exhaustive (MECE) Knowledge Base**  
**Project:** AegisHealth AI — Autonomous Cardiorenal Decompensation Interceptor  
**Target Event:** AWS Builder Center Hackathon (*"Strands SDK: Workshop to Ship"*) → Y Combinator Seed  
**Date:** October 2026  

---

## The MECE Documentation Architecture

To ensure zero ambiguity, complete coverage, and institutional-grade rigor across clinical, commercial, technical, and UX domains, the documentation is partitioned into five distinct, non-overlapping pillars:

```
docs/
├── 01_clinical_domain/            # Clinical pathophysiology, trial data, & guidelines
├── 02_venture_strategy/           # Market math ($100M ARR), YC premortem, & venture reviews
├── 03_technical_architecture/     # Multi-agent systems, Strands Decider, MCP, & open-source stacks
├── 04_ux_and_design/              # Clinical design system, wireframes, & human-AI interaction
├── 05_cloud_and_infrastructure/   # Verified AWS sandbox endpoints, models, & latency benchmarks
└── README.md                      # This master navigation index
```

---

## Pillar 1: Clinical Domain & Medical Evidence
*Everything pertaining to medicine, pathophysiology, trial literature, and clinical decision support.*

* 📁 [**`docs/01_clinical_domain/`**](./01_clinical_domain/README.md)
  * [**Ambulatory Decompensation & Healthcare Problem Spaces**](./01_clinical_domain/healthcare_problem_spaces_deep_research.md): Deep pathophysiological breakdown of the 30-day cardiorenal decompensation cascade; quantitative evidence from landmark trials (LINK-HF, CHAMPION, MultiSENSE, DOT-HF, WEAR-ME); Prior Authorization metrics (AMA & HHS OIG audits); 21st Century Cures Act CDS safe harbor analysis.

---

## Pillar 2: Venture Strategy & Commercial Validation
*Everything pertaining to business viability, unit economics, investor critique, and competitive defensibility.*

* 📁 [**`docs/02_venture_strategy/`**](./02_venture_strategy/README.md)
  * [**YC Venture Capital Validation & Adversarial Premortem**](./02_venture_strategy/yc_startup_validation_and_premortem.md): YC Partner / a16z Bio+Health investment memo; Delta 4 framework (+7 leap); bottom-up unit economics to \$100M ARR (37 ACO contracts at \$65 PEPM); 5 fatal healthcare startup failure modes & structural defenses; Blue Ocean ERRC grid; Rumelt strategy kernel; 60-second winning live pitch script.
  * [**Opus Clinical & Venture Review**](./02_venture_strategy/opus_clinical_and_venture_review.md): Independent evaluation by Claude Opus 4.6 (Grade: A / A-); validation of deterministic safety guardrails; analysis of the wearable data access challenge.

---

## Pillar 3: Technical Architecture & Agent Systems
*Everything pertaining to AI models, agent frameworks, MCP tools, and open-source ecosystems.*

* 📁 [**`docs/03_technical_architecture/`**](./03_technical_architecture/README.md)
  * [**Jev & Strands Decider: System One Decision Models**](./03_technical_architecture/strands_decider_and_jev_deep_research.md): Technical analysis of System 1 vs. System 2 agent paradigms; TypeSafe AI's Jev (`POST /v1/systemone`, RLCD); AWS Strands Decider 2B (Marc Brooker et al., 115ms local latency, JevBench #1); Strands Intervention System (`before_tool_call`, `Proceed`, `Deny`, `Confirm`, `Guide`); Tri-Tier Clinical Decision Mesh.
  * [**AWS Open-Source Healthcare Stack & Strands Ecosystem**](./03_technical_architecture/aws_open_source_healthcare_stack_research.md): Official `awslabs/mcp` HealthLake MCP Server (11 FHIR tools); verified AWS samples (`sample-healthcare-decision-support-agent`, `healthcare-assistant-using-episodic`, `sample-clinical-chatbot-with-logically-verified-responses`); managed HIPAA building blocks (HealthLake, HealthScribe, Comprehend Medical, Cedar Policy).
  * [**Google Open Health Stack & MedGemma Ecosystem**](./03_technical_architecture/google_open_health_stack_and_medgemma_research.md): Android FHIR SDK (Structured Data Capture, FHIR Engine, CQL Workflow); FHIR Data Pipes (SQL-on-FHIR v2 / Parquet-on-FHIR); MedGemma 1.5 4B multimodal, MedGemma 27B, MedSigLIP, HeAR (lung acoustics); Google Personal Health Agent (PHA) code interpreter design.
  * [**Healthcare Data, Datasets & MCP Research**](./03_technical_architecture/healthcare_data_and_mcp_research.md): Google Health PHA telemetry schema; Synthea FHIR R4 cohorts; SMART on FHIR Sandbox; Healthcare MCP servers (`fhir-mcp`, `pubmed-mcp`, `openfda-mcp`) and native Strands `MCPClient` wiring.
  * [**Open-Source Toolkits & Winning Hackathon Architectures**](./03_technical_architecture/open_source_and_winning_hackathons_research.md): Analysis of champion repos from TreeHacks, CalHacks, and AWS Devpost; the winning formula ("Multi-Agent Theater" + 30s clinical hook + live deterministic safety veto).

---

## Pillar 4: UX & Interaction Design
*Everything pertaining to human-AI interfaces, clinical workflows, design systems, and wireframes.*

* 📁 [**`docs/04_ux_and_design/`**](./04_ux_and_design/README.md)
  * [**AegisHealth UX Architecture & Wireframe Blueprints**](./04_ux_and_design/aegishealth_ux_system_and_artifacts.md): Multi-actor information architecture (Patient SMS, Nurse Triage, Doctor 1-Click SBAR, Hackathon Multi-Agent Theater); AI-native agency-control ladder; Clinical Design System (CDS v1.0) tokens (WCAG 2.2 AAA colors, tabular numbers); ASCII layout wireframes; Nielsen's 10 Heuristics compliance audit.

---

## Pillar 5: Cloud & Infrastructure
*Everything pertaining to the AWS runtime environment, verified models, and live latency benchmarks.*

* 📁 [**`docs/05_cloud_and_infrastructure/`**](./05_cloud_and_infrastructure/README.md)
  * [**AWS Sandbox Environment Capabilities & Inventory**](./05_cloud_and_infrastructure/aws_sandbox_capabilities.md): Programmatic verification of all accessible services on AWS Bedrock (Claude Sonnet 4.6, Claude Opus 4.6, Nova Pro, Nova Micro); cross-region inference profile IDs; embedding and reranking models.
