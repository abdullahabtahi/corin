---
name: academic-research-writer
description: Author, structure, and peer-review academic research papers, preprints (arXiv/medRxiv), and conference submissions (ML4H, CHIL, JAMIA, IEEE JBHI) for healthcare AI and multi-agent systems. Enforces rigorous scientific methodology, mathematical formalization, empirical validation against clinical benchmarks, and formatted BibTeX citations.
---

# Academic Research Paper Authoring & Peer-Review Skill

Use this skill to transform clinical AI projects, multi-agent architectures, and empirical trial benchmarks into submission-ready academic papers, preprints (arXiv / medRxiv), and conference manuscripts (NeurIPS ML4H, CHIL, AMIA, IEEE JBHI, Nature Digital Medicine).

---

## 1. Core Publication Philosophy & Standards

A high-impact health AI paper must satisfy three rigorous criteria:
1. **Zero Hand-Waving:** Avoid marketing jargon ("revolutionary", "game-changing"). Replace with precise quantifiable claims (e.g., *"achieved a median subclinical lead time of 6.5 days across 1,000 synthetic patient-years, intercepting 100% of simulated contraindicated diuretic titrations"*).
2. **Mathematical & Architectural Formalization:** Define algorithms, agent state transitions, and time-series anomaly detection formally using LaTeX equations and state diagrams.
3. **Honest Limitations & Grounding:** Explicitly address failure modes (e.g., sensor noise floors, adherence attrition, Medicare demographic gap) rather than obscuring them. Reviewers reward intellectual honesty.

---

## 2. Standard Healthcare AI Manuscript Structure (IMRaD+)

### Title
Must be descriptive, precise, and state the methodology and clinical focus:
* *Example:* *"Autonomous Multi-Agent Orchestration with Deterministic Safety Vetoing for Early Ambulatory Decompensation Detection in Heart Failure"*

### Abstract (Structured, 250 Words)
* **Background:** The clinical problem (e.g. 21% 30-day readmissions in CHF, \$38B Medicare burden, silent subclinical filling pressure rise).
* **Objective:** The proposed computational paradigm (e.g. multi-agent telemetry decomposition with deterministic clinical decision support).
* **Methods:** Agent swarm architecture (Strands SDK, Amazon Bedrock), data sources (Synthea FHIR R4 cohorts, continuous telemetry schema), and the deterministic safety invariant engine.
* **Results:** Quantitative empirical outcomes (lead time in days, sensitivity/specificity, contraindication veto rate, token efficiency, inference latency).
* **Conclusion:** Translation to value-based care and clinical safety significance.

### 1. Introduction
* **The Clinical Care Chasm:** Describe the pathophysiological divergence between continuous physiological decline and episodic 15-minute clinical visits.
* **Failure of Monolithic LLMs in Healthcare:** Explain the stochastic danger of unconstrained generative models in pharmacology and dosing.
* **Key Contributions:** Bulleted list of 3–4 explicit scientific and engineering contributions.

### 2. Related Work & Systematic Taxonomy
* Remote Patient Monitoring (RPM) landmark trials (*CHAMPION*, *LINK-HF*, *MultiSENSE*, *Tele-HF*).
* Clinical Decision Support Systems (CDSS) & Regulatory Safe Harbors (FDA 21st Century Cures Act Non-Device CDS criteria).
* LLM Agents & Multi-Agent Cognitive Swarms in Biomedicine.
* *Comparative Taxonomy Table:* Contrast legacy RPM vs. rule-based CDSS vs. monolithic LLM chat vs. deterministic multi-agent mesh.

### 3. System Architecture & Methodology
* **Agent Mesh Topology:** Formal definition of agent roles, messaging protocols, and tool bindings.
* **Biometric Drift Engine (Data Science Agent):**
  $$\text{EWMA}_t = \alpha \cdot x_t + (1 - \alpha) \cdot \text{EWMA}_{t-1}$$
  $$Z_{\text{drift}} = \frac{x_t - \mu_{7\text{d}}}{\sigma_{7\text{d}}}$$
* **Conversational Subclinical Discovery (Health Coach Agent):** Structured symptom elicitation (orthopnea angle, bendopnea, nocturia) without leading questions.
* **Guideline-Adherent Synthesis (Clinical Expert Agent):** ACC/AHA & KDIGO guideline retrieval, SBAR formatting.
* **The Deterministic Safety Envelope (Safety Guardian Agent):** Mathematical invariant gating where:
  $$\text{SafetyGate}(\text{Order}) = \begin{cases} \text{APPROVE}, & \text{if } \text{K}^+ \le 5.0 \land \text{eGFR} \ge 30 \land \text{NoContraindications} \\ \text{VETO}, & \text{otherwise} \end{cases}$$

### 4. Empirical Evaluation & Simulation Experiments
* **Cohort Construction:** Synthetic multi-morbid patient population (Synthea FHIR R4).
* **Experiment 1 — Lead Time & Anomaly Detection:** Comparison of subclinical detection date vs. gross scale weight gain date (evaluating the splanchnic shift hypothesis).
* **Experiment 2 — Safety Invariant Stress Testing:** Injection of 100 adversarial clinical edge cases (hyperkalemia, renal failure, drug-drug interactions); measure veto rate vs. unconstrained LLM.
* **Experiment 3 — Computational Economics & Latency:** Tokens per patient encounter, runtime latency (Bedrock Claude Opus 4.6 vs. Sonnet 4.6 vs. Nova Pro).

### 5. Discussion, Clinical Implications & Limitations
* The "Wearable Data Access" gap: Consumer PPG vs. clinical-grade patch sensors.
* Provider cognitive load and alert fatigue mitigation.
* Medicolegal liability and the Physician-in-the-Loop paradigm.

### 6. Conclusion & Open-Source Artifacts
* Code repository, dataset schemas, and reproducibility instructions.

---

## 3. Citation & Bibliography Standards

* Use **BibTeX** format stored in `references.bib`.
* Ground all medical claims in authenticated **PubMed PMIDs** using the `scientific-db-pubmed-database` skill.
* Cross-verify trial acronyms, lead authors, and journal names (e.g. *Lancet*, *NEJM*, *JACC*, *Circulation*).
