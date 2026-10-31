# 03. Technical Architecture & Agent Systems

This directory contains technical research, agent frameworks, open-source toolkits, Model Context Protocol (MCP) integrations, and architecture blueprints for **AegisHealth AI**.

---

## Documents

1. [**Jev & Strands Decider: System One Decision Models**](./strands_decider_and_jev_deep_research.md)
   * The System 1 vs. System 2 paradigm shift in AI agent architecture.
   * TypeSafe AI's Jev (`POST /v1/systemone`, RLCD calibration, three primitives: `choice`, `score`, `noul`).
   * AWS Strands Decider 2B (Marc Brooker et al. at Strands Labs; Qwen3.5/Gemma 4 torso + 1M parameter pointer head, 115ms local latency, #1 on JevBench).
   * Strands SDK Intervention System (`before_tool_call`, `Proceed`, `Deny`, `Confirm`, `Guide`).
   * The Tri-Tier Clinical Decision Mesh (System 1 edge gating + System 2 clinical synthesis + Tier 3 deterministic CDSS).

2. [**AWS Open-Source Healthcare Stack & Strands Ecosystem**](./aws_open_source_healthcare_stack_research.md)
   * Official AWS Labs Model Context Protocol server: `awslabs/mcp` (`src/healthlake-mcp-server`) with 11 FHIR tools.
   * Strands-native healthcare implementations:
     - `sample-healthcare-decision-support-agent` (Strands + Bedrock CDS narratives)
     - `healthcare-assistant-using-episodic` (Strands memory hooks + Episodic Long-Term Memory)
     - `sample-clinical-chatbot-with-logically-verified-responses` (Strands + cvc5 theorem prover for zero hallucination)
     - `sample-healthcare-agents` (Strands Prior Auth, Da Vinci PAS, CDS Hooks)
   * Managed HIPAA-eligible AWS services (HealthLake, HealthScribe, Comprehend Medical, Cedar Policy).

3. [**Google Open Health Stack & MedGemma Ecosystem**](./google_open_health_stack_and_medgemma_research.md)
   * Google Open Health Stack (OHS): Android FHIR SDK (Structured Data Capture, FHIR Engine, CQL Workflow), FHIR Info Gateway, and FHIR Data Pipes (SQL-on-FHIR v2 / Parquet-on-FHIR).
   * Google Health AI Developer Foundations (HAI-DEF): MedGemma 1.5 4B multimodal, MedGemma 27B, MedSigLIP 0.9B, HeAR (lung acoustics), MedASR, and TxGemma.
   * Google Research Personal Health Agent (PHA) code interpreter design and bridging Google's open health tools with AWS Strands SDK.

4. [**Healthcare Data, Datasets & MCP Research**](./healthcare_data_and_mcp_research.md)
   * Pre-built synthetic datasets with zero PHI liability (Google Health PHA telemetry schema, Synthea FHIR R4 cohorts).
   * Live interactive test endpoints (SMART on FHIR Public Sandbox).
   * Healthcare MCP servers (`fhir-mcp`, `pubmed-mcp`, `openfda-mcp`) and native Strands `MCPClient` Python wiring.

5. [**Open-Source Toolkits & Winning Hackathon Architectures**](./open_source_and_winning_hackathons_research.md)
   * Case studies of champion projects from TreeHacks, CalHacks, and AWS Devpost competitions (Agent Ricky, NEST, LoopGuard Passport, RepoRx).
   * Proven "secret sauce" winning formula: 30-second clinical hook + visible multi-agent swarm ("Multi-Agent Theater") + live deterministic safety veto.
