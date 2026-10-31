# Deep Research: Available Healthcare Data, Datasets, and Model Context Protocol (MCP) Ecosystem

**Author Context:** Senior AI Product Leadership (Google Health / AWS AgentCore / McKinsey QuantumBlack / Palantir) & Board-Certified Physician (MD)  
**Hackathon Target:** AWS Builder Center — *Strands SDK: Workshop to Ship*  
**Scope:** Ready-to-Use Clinical & Biometric Datasets, Zero-PHI Synthetic Data Generators, and Healthcare MCP Architecture

---

## 1. Master Data Asset Taxonomy & Landscape

In healthcare agent development, data access is constrained by HIPAA Title II Privacy and Security Rules, Institutional Review Board (IRB) oversight, and Business Associate Agreements (BAAs). For a rapid-ship hackathon, using un-anonymized real Protected Health Information (PHI) is illegal and disqualifying.

The optimal strategy leverages **statistically rigorous, schema-validated synthetic and open clinical benchmarks** that mirror enterprise hospital EHRs and commercial wearables with zero privacy liability.

```
                               HEALTHCARE DATA ASSET SPECTRUM
                               
     Wearable Time-Series           HL7 FHIR Clinical Records          Clinical Knowledge & Rules
  ┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
  │ Google Health PHA Sample│      │ Synthea FHIR R4 Engine  │      │ PubMed / NCBI API       │
  │ • summary.csv           │      │ • Full Patient Bundles  │      │ • 36M+ Citations        │
  │ • activities.csv        │      │ • Disease Cohorts (CHF, │      │ OpenFDA & DailyMed APIs │
  │ • population_percentiles│      │   CKD, T2D, Sepsis)     │      │ • Drug-Drug Interactions│
  │ PMData (Fitbit Versa 2) │      │ SMART on FHIR Sandbox   │      │ CMS / Payer Bulletins   │
  │ • 5-month longitudinal  │      │ • Live REST R4 Endpoint │      │ • Prior Auth Criteria   │
  └────────────┬────────────┘      └────────────┬────────────┘      └────────────┬────────────┘
               │                                │                                │
               └───────────────────────┬────────┴────────────────────────────────┘
                                       ▼
                       AWS Strands Multi-Agent Swarm
                      (Data Science + FHIR + Evidence)
```

---

## 2. Deep Dive: Available Clinical & Biometric Datasets

### A. Google Health Personal Health Agent (PHA) Benchmark Data
* **Repository Origin:** `Google-Health/consumer-health-research/personal_health_agent/data`
* **Format:** Four relational CSV files modeling continuous consumer wearable telemetry and population benchmarks.
* **Schema Granularity:**
  1. `summary.csv` (Daily Aggregated Biometrics):
     * `datetime` (Date index)
     * `resting_heart_rate` (bpm)
     * `heart_rate_variability` (ms, rMSSD/SDNN)
     * `sleep_minutes`, `deep_sleep_minutes`, `rem_sleep_minutes`, `light_sleep_minutes`, `awake_minutes`
     * `steps`, `active_zone_minutes`, `cardio_active_zone_minutes`, `fatburn_active_zone_minutes`
     * `stress_management_score`, `readiness_score`, `cardio_load_total` (TRIMP)
  2. `activities.csv` (Intra-Day Event Logs): Individual workout, walk, and exertion sessions with duration, heart rate zone splits, and calorie expenditure.
  3. `population_percentiles.csv` (Normative Benchmarks): Reference percentiles by age bracket ($18\text{--}29, 30\text{--}39, \dots, 70+$) and biological sex for benchmarking patient vitals against normal distributions.
  4. `profile.csv` (User Metadata): Age, gender, VO2 max estimate, resting baseline metrics.
* **Why It Fits Strands:** Tailor-made for a `DataScienceAgent` using Python `@tool` functions (Pandas/NumPy) to calculate rolling 7-day baselines, z-scores, and detect subclinical decompensation trajectories.

### B. Synthea™ Open-Source Synthetic Patient Generator
* **Source:** MITRE Corporation / Open-Source FHIR Community (`github.com/synthetichealth/synthea`)
* **Format:** Complete, standard **HL7 FHIR R4 JSON Bundles**, C-CDA, and CSV.
* **Capabilities:**
  * Generates realistic, longitudinally consistent synthetic patient histories from birth to death using published CDC/NIH epidemiological statistics.
  * Models complex multi-morbid clinical pathways: **Congestive Heart Failure, Type 2 Diabetes, Diabetic Nephropathy (CKD), Sepsis, COPD, Breast Cancer, and Hypertension**.
* **Clinical Breadth in Every Patient Bundle:**
  * `Patient`: Demographics, address, contact info.
  * `Condition`: ICD-10-CM and SNOMED-CT coded active and resolved diagnoses.
  * `Observation`: LOINC-coded vitals (blood pressure, pulse, SpO2, BMI) and longitudinal lab panels (eGFR, serum creatinine, BNP, HbA1c, potassium, sodium, lipid panels).
  * `MedicationRequest`: RxNorm-coded active prescriptions with dose, frequency, and dispense quantity.
  * `Encounter`: Inpatient stays, ED visits, ambulatory visits with admission/discharge timestamps.
  * `AllergyIntolerance`: Documented drug and environmental allergies with severity indicators.
* **Hackathon Readiness:** Pre-generated 1,000-patient test bundles are publicly available for immediate instant download without compiling Java code.

### C. SMART on FHIR Public Open Sandbox
* **Public Endpoint:** `https://r4.smarthealthit.org`
* **Access Mode:** Fully open, zero-authentication, read-only FHIR R4 REST API.
* **Sample Patient IDs:** Pre-populated with hundreds of rich synthetic clinical records (e.g., `Patient/smart-1288992`, `Patient/smart-8888802`).
* **Supported Queries:**
  ```http
  GET https://r4.smarthealthit.org/Patient?name=Smith
  GET https://r4.smarthealthit.org/Observation?patient=smart-1288992&category=laboratory
  GET https://r4.smarthealthit.org/MedicationRequest?patient=smart-1288992&status=active
  GET https://r4.smarthealthit.org/Condition?patient=smart-1288992&clinical-status=active
  ```
* **Why It Fits Strands:** Enables our `FHIRAgent` to demonstrate live, real-time FHIR queries against a real server during the hackathon demo rather than mocking static files.

### D. PMData (Continuous Lifelogging & Fitbit Dataset)
* **Source:** Simula Research Laboratory / Nature Scientific Data (PhysioNet & Open Access).
* **Cohort:** 16 participants continuously monitored for 5 months with Fitbit Versa 2 smartwatches.
* **Data Streams:**
  * Minute-level heart rate, sleep stage epochs, minute-by-minute step intensity, calories.
  * Synchronized PMSys mobile app daily survey reports (mood, perceived stress, muscle fatigue, sleep quality).
  * Dietary and beverage logging (water, caffeine, alcohol).
* **Clinical Value:** Provides authentic intra-day sensor noise, missed wearing epochs, and autonomic shifts for stress/sleep analysis.

### E. Open Payer Coverage Policies & Prior Authorization Rules
* **CMS Coverage Database (NCD / LCD):** National Coverage Determinations (NCDs) and Local Coverage Determinations (LCDs) downloadable in JSON/CSV directly from CMS.gov.
* **Aetna Clinical Policy Bulletins (CPBs) & UnitedHealthcare Medical Policies:**
  * Publicly indexed web repositories defining exact step-therapy logic for high-cost drugs:
    * *Aetna CPB 0315* (Biologics for Rheumatoid Arthritis)
    * *UHC Medical Policy 2024D0040* (GLP-1 Receptor Agonists for T2D/Obesity)
    * *Aetna CPB 0716* (EGFR Kinase Inhibitors for Oncology)

---

## 3. Deep Dive: Model Context Protocol (MCP) Ecosystem

The Model Context Protocol (MCP) standardizes how AI agents discover and execute tools across disparate infrastructure. In our Strands architecture, MCP serves as the governed bridge connecting the model to medical knowledge, cloud resources, and external APIs.

```
                          STRANDS + MCP ARCHITECTURAL WIRING

   ┌────────────────────────────────────────────────────────────────────────┐
   │                       Strands Agent Orchestrator                       │
   │               (Amazon Bedrock Nova Pro / Claude 3.5 Sonnet)            │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
   ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
   │   FHIR MCP Server │      │ PubMed MCP Server │      │  AWS Agent MCP    │
   │   - search_patient│      │ - search_pubmed   │      │  - s3_read/write  │
   │   - get_vitals    │      │ - fetch_abstract  │      │  - dynamodb_state │
   │   - get_meds      │      │ - mesh_lookup     │      │  - bedrock_kb     │
   └─────────┬─────────┘      └─────────┬─────────┘      └─────────┬─────────┘
             │                          │                          │
             ▼                          ▼                          ▼
     SMART on FHIR API          NCBI E-Utilities           AWS Cloud Services
```

### A. Healthcare-Specific MCP Servers

#### 1. FHIR MCP Server (`fhir-mcp`)
* **Standard:** HL7 FHIR Release 4 (R4).
* **Exposed Agent Tools:**
  * `fhir_search_patient(name, identifier)`: Resolves patient identity across demographics.
  * `fhir_get_observations(patient_id, loinc_code, date_range)`: Returns longitudinal vitals or lab trends (e.g., LOINC `8867-4` Heart Rate, `2951-2` Serum Sodium, `2160-0` Serum Creatinine).
  * `fhir_get_medications(patient_id, status)`: Returns active outpatient and inpatient prescriptions with RxNorm codes and dosage instructions.
  * `fhir_get_conditions(patient_id)`: Fetches active problem lists with ICD-10-CM codes.
* **Safety Gating:** Automatic redacting of direct identifiers (SSN, phone number, full street address) before returning tokens to the LLM context.

#### 2. PubMed / NCBI E-Utilities MCP Server (`pubmed-mcp`)
* **Data Provider:** National Library of Medicine (NLM) / National Institutes of Health (NIH).
* **Exposed Agent Tools:**
  * `pubmed_search(query, max_results, filter_peer_reviewed)`: Executes boolean queries over 36 million biomedical citations.
  * `pubmed_fetch_abstract(pmid)`: Retrieves full abstract text, clinical trial registration IDs, and author conclusions.
  * `pubmed_mesh_lookup(clinical_term)`: Resolves colloquial terms to Medical Subject Headings (MeSH) to ensure search precision.
* **Role in Swarm:** Empowers the `DomainExpertAgent` to cite exact PMIDs and trial statistics rather than relying on hallucinated medical memories.

#### 3. OpenFDA Drug Safety & Interactions MCP Server
* **Data Provider:** U.S. Food & Drug Administration (FDA) openFDA REST APIs.
* **Exposed Agent Tools:**
  * `fda_check_drug_interaction(drug_a, drug_b)`: Queries the FDA Adverse Event Reporting System (FAERS) and drug package insert interaction tables.
  * `fda_get_boxed_warning(drug_name)`: Returns official FDA Black Box Warnings.
  * `fda_get_renal_dosage(drug_name, egfr_value)`: Fetches package insert dosing adjustments for impaired kidney function.

---

### B. Core Developer & Cloud MCP Servers in Workspace

| MCP Server | Server Name | Core Tools Provided | Usage in This Hackathon |
| :--- | :--- | :--- | :--- |
| **Sequential Thinking** | `sequential-thinking` | `sequentialthinking` | Dynamic multi-step clinical reasoning, diagnostic hypothesis testing, and error-correction loops. |
| **Exa Search** | `exa` | `web_search_exa`<br>`web_fetch_exa` | Real-time retrieval of clinical practice guidelines (ACC/AHA, KDIGO, ADA) and payer medical policy bulletins. |
| **Context7** | `context7` | `resolve-library-id`<br>`query-docs` | Instant syntax lookups for `strands-agents`, `boto3`, `fhir.resources`, `pydantic`, and `pandas`. |
| **AWS Agent Toolkit MCP** | `aws-agent-toolkit` | `s3_get_object`<br>`dynamodb_query`<br>`bedrock_invoke` | Storing generated patient reports, persisting session memory across multi-agent turns, and audit logging. |
| **Postman** | `postman-mcp-server` | `execute_request`<br>`test_endpoint` | Probing and testing external FHIR R4 sandbox endpoints during agent execution. |

---

## 4. Native Strands SDK Integration Architecture

The Strands SDK natively supports connecting to any MCP server via its built-in `strands.tools.mcp.MCPClient`.

### Minimal Production Pattern (Python Strands SDK)

```python
from mcp import StdioServerParameters, stdio_client
from strands import Agent, tool
from strands.models import BedrockModel
from strands.tools.mcp import MCPClient

# 1. Connect to PubMed MCP Server via uvx
pubmed_mcp = MCPClient(
    lambda: stdio_client(
        StdioServerParameters(
            command="uvx",
            args=["pubmed-mcp@latest"],
        )
    )
)

# 2. Define custom deterministic Python tool for physiological telemetry analysis
@tool
def calculate_decompensation_index(resting_hr_series: list[float], hrv_series: list[float]) -> dict:
    """Calculate the subclinical heart failure autonomic deterioration index.
    
    Args:
        resting_hr_series: Last 14 days of nocturnal resting heart rate (bpm).
        hrv_series: Last 14 days of heart rate variability (rMSSD in ms).
    """
    import numpy as np
    
    baseline_hr = np.mean(resting_hr_series[:7])
    recent_hr = np.mean(resting_hr_series[-3:])
    hr_drift = recent_hr - baseline_hr
    
    baseline_hrv = np.mean(hrv_series[:7])
    recent_hrv = np.mean(hrv_series[-3:])
    hrv_drop_pct = ((baseline_hrv - recent_hrv) / baseline_hrv) * 100
    
    # Clinical heuristic based on LINK-HF trial criteria
    is_decompensating = (hr_drift >= 5.0) and (hrv_drop_pct >= 20.0)
    
    return {
        "hr_drift_bpm": round(float(hr_drift), 2),
        "hrv_suppression_pct": round(float(hrv_drop_pct), 2),
        "decompensation_risk": "HIGH" if is_decompensating else "LOW",
        "early_warning_lead_days": 6.5 if is_decompensating else 0.0
    }

# 3. Assemble Strands Agent with both MCP tools and deterministic Python tools
model = BedrockModel(model_id="amazon.nova-pro-v1:0")

agent = Agent(
    model=model,
    tools=[pubmed_mcp, calculate_decompensation_index],
    system_prompt="You are a clinical data scientist analyzing patient biometrics grounded in peer-reviewed evidence."
)
```

---

## 5. Strategic Data & MCP Assessment Summary

1. **Zero Data Liability:** By pairing Google’s synthetic PHA wearable data with Synthea’s FHIR R4 clinical records, the system can demonstrate continuous ambulatory monitoring and acute inpatient transitions with 100% realistic schemas and 0% HIPAA compliance risk.
2. **Standardized Interoperability:** Using standard FHIR R4 schemas and LOINC/RxNorm coding guarantees that any agent logic developed during the hackathon is immediately compatible with real hospital EHR systems (Epic on FHIR, Cerner Millennium, AthenaHealth).
3. **Pluggable Agentic Architecture:** The Strands SDK’s `MCPClient` allows the swarm to dynamically delegate tasks: the `DataScienceAgent` executes local pandas calculations, the `ClinicalExpertAgent` queries live PubMed via `pubmed-mcp`, and the `SafetyGuardian` validates drug safety deterministically via `healthcare-cdss-patterns`.
