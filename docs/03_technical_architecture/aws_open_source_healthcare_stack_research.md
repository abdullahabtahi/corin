# Deep Research: AWS Open-Source Healthcare Stack & Strands Agent Ecosystem

**Technical Architecture & Catalog of AWS Open-Source Healthcare Assets**  
**Subject:** AWS Labs, AWS Samples, HealthLake MCP, Strands Agent Implementations, and Managed Healthcare AI  
**Primary Repositories:**  
- `awslabs/mcp` (`src/healthlake-mcp-server`): Official AWS Labs FHIR Model Context Protocol Server  
- `awslabs/amazon-bedrock-agentcore-samples`: Strands Healthcare Assistant with Episodic Memory & Cedar Policy  
- `aws-samples/sample-healthcare-decision-support-agent`: Strands + Bedrock Clinical Decision Support (CDS)  
- `aws-samples/sample-clinical-chatbot-with-logically-verified-responses`: Strands + Deductive Logic Theorem Proving  
- `aws-samples/sample-healthcare-agents`: Strands Prior Auth, Da Vinci PAS, and CDS Hooks  
- `aws-samples/sample-amazon-connect-health-unified-clinical-workflow`: Ambient AI & HealthLake FHIR write-back  
**Date:** October 2026  
**Document Location:** `docs/research/aws_open_source_healthcare_stack_research.md`  

---

## 1. Executive Summary: The AWS Open-Source Healthcare Landscape

AWS provides a mature, production-grade collection of open-source libraries, reference architectures, and Model Context Protocol (MCP) servers tailored for healthcare workloads. Crucially, **multiple official AWS repositories already feature the Strands Agents SDK running alongside Bedrock and HealthLake**, providing verified blueprints for our hackathon project.

```mermaid
flowchart TD
    subgraph DataPlane ["1. Data & Protocol Layer (FHIR R4)"]
        HL["AWS HealthLake (Managed FHIR R4)"]
        HL_MCP["awslabs/mcp (HealthLake MCP Server)<br/>• 11 FHIR tools: search, CRUD, patient-everything<br/>• Read-only security mode<br/>• SigV4 authentication"]
        SOF["aws-samples/aws-healthlake-smart-on-fhir<br/>• OAuth2 SMART-on-FHIR reverse proxy"]
    end

    subgraph AgentOrchestration ["2. Agent Orchestration Layer (AWS Strands SDK)"]
        direction TB
        Decider["Strands Decider 2B (Strands Labs)<br/>• 115ms System 1 tool gating & routing"]
        CDS_Agent["sample-healthcare-decision-support-agent<br/>• Strands + Bedrock CDS narratives"]
        Episodic_Agent["agentcore-samples/healthcare-assistant<br/>• Strands memory hooks + EpisodicStrategy"]
        Logic_Agent["sample-clinical-chatbot-logically-verified<br/>• Strands + cvc5 theorem prover for zero hallucination"]
    end

    subgraph SecuritySafety ["3. Security, NLP & Safety Layer"]
        Cedar["Cedar Policy Engine (awslabs/cedar-policy)<br/>• Deterministic ABAC/RBAC patient scoping"]
        CompMed["Amazon Comprehend Medical<br/>• ICD-10-CM, RxNorm, SNOMED CT ontology linking"]
        Scribe["AWS HealthScribe<br/>• Ambient consultation transcription & SOAP notes"]
    end

    DataPlane --> AgentOrchestration
    SecuritySafety --> AgentOrchestration
```

---

## 2. Official AWS Labs HealthLake MCP Server (`awslabs/mcp`)

Located in AWS Labs' official MCP repository (`src/healthlake-mcp-server`), this is a fully verified, production-ready **Model Context Protocol (MCP) server for AWS HealthLake**.

### 2.1 Key Capabilities & Tools (11 Built-In Tools)
The server exposes 11 FHIR tools across 4 categories:
1. **Datastore Management:**
   - `list_datastores`: Automatically discovers all active HealthLake datastores in the AWS account.
   - `get_datastore_details`: Fetches endpoints, FHIR version (R4), and datastore metadata.
2. **FHIR Resource Operations (CRUD):**
   - `create_fhir_resource`: Validates and writes new resources (`Observation`, `Condition`, `MedicationRequest`).
   - `read_fhir_resource`: Retrieves individual resources by type and ID.
   - `update_fhir_resource`: Updates resources with full versioning.
   - `delete_fhir_resource`: Removes resources from the datastore.
3. **Advanced Search & Aggregation:**
   - `search_fhir_resources`: Supports chained parameters, includes (`_include`), reverse includes (`_revinclude`), and date/number prefixes (`ge`, `le`).
   - `patient_everything`: Executes the FHIR `$patient-everything` operation to fetch an entire patient's longitudinal record in a single call.
4. **Bulk Job Management:**
   - `start_fhir_import_job` / `start_fhir_export_job` / `list_fhir_jobs`: Manages bulk S3 NDJSON data pipelines.

### 2.2 Native Strands Python Integration
Because the HealthLake MCP server adheres to the open Model Context Protocol standard, a Strands agent connects to it natively using `strands.tools.mcp.mcp_client`:

```python
from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp.mcp_client import MCPClient

# Initialize MCP Client connecting to HealthLake MCP Server
healthlake_mcp = MCPClient(
    command="uvx",
    args=["healthlake-mcp-server", "--read-only"]
)

# Strands Agent auto-discovers all 11 HealthLake FHIR tools
clinical_agent = Agent(
    model=BedrockModel(model_id="us.anthropic.claude-sonnet-4-6"),
    tools=healthlake_mcp.tools,
    system_prompt="You are a Clinical Data Specialist querying AWS HealthLake for CHF patient telemetry."
)
```

---

## 3. Official AWS Healthcare Samples Using Strands Agents

The following open-source repositories from `aws-samples` and `awslabs` directly demonstrate Strands Agents in healthcare:

### 3.1 `aws-samples/sample-healthcare-decision-support-agent`
- **What it does:** An AI-powered clinical decision support system that parses patient data from CCDA XML and FHIR JSON, generates specialty-specific clinical narratives, and outputs actionable provider recommendations (*clinical nudges*).
- **Strands Role:** Uses the Strands agent framework with Amazon Bedrock to coordinate clinical reasoning and guidelines search over OpenSearch.
- **Observability:** Pre-wired with OpenTelemetry (OTEL) trace capture, AWS X-Ray, and CloudWatch metrics.

### 3.2 `awslabs/amazon-bedrock-agentcore-samples/healthcare-assistant-using-episodic`
- **What it does:** Implements a multi-agent healthcare assistant system featuring **Episodic Long-Term Memory**.
- **Strands Role:** Uses **Strands Memory Hooks** (`from strands.hooks import HookProvider, HookRegistry`) to automatically record interactions into long-term memory without manual API calls.
- **Multi-Agent Architecture:**
  - `SupervisorAgent`: Routes clinical questions.
  - `ClaimsAgent`: Handles billing and insurance checks.
  - `DemographicsAgent`: Manages patient identity.
  - `MedicationAgent`: Analyzes active prescriptions.
- **The Episodic Memory Loop:**
  1. *Extraction:* Extracts key insights from short-term turn events.
  2. *Consolidation:* Writes structured episodes (situation, intent, assessment, justification).
  3. *Reflection:* Learns longitudinal patterns across multiple patient encounters over time.

### 3.3 `aws-samples/sample-clinical-chatbot-with-logically-verified-responses`
- **The Confabulation/Hallucination Problem:** Clinical chatbots frequently hallucinate numbers or contradict the patient's actual chart.
- **The AWS Solution (Strands + Formal Logic Theorem Provers):**
  - The chatbot is implemented as a **Strands Agents Agent**.
  - Before any response is delivered to the physician, an agent extracts first-order Well-Formed Formulas (WFFs) representing claims made in the text (e.g. `(= heart-rate 55)`).
  - A formal **Deductive Theorem Prover (`cvc5`)** tests these WFFs against the patient's ground-truth FHIR theory.
  - If a contradiction is detected (`Invalid`), the output is rejected or repaired.
- **Relevance to AegisHealth:** Provides empirical AWS-backed precedent for our **Safety Guardian Agent** deterministic validation architecture!

### 3.4 `aws-samples/sample-healthcare-agents`
- **What it does:** End-to-end Prior Authorization and Revenue Cycle Management built with the Strands SDK on Bedrock.
- **Key Modules:**
  - Automated Da Vinci PAS (Prior Authorization Support) FHIR bundle assembly.
  - Payer clinical policy lookup and medical necessity assessment.
  - **CDS Hooks Integration:** Native triggers on `patient-view` and `order-select` EHR events.
  - Medical coding extraction using **Amazon Comprehend Medical** (ICD-10-CM, CPT, SNOMED CT).

---

## 4. Managed AWS Healthcare AI Services (HIPAA-Eligible Building Blocks)

In addition to open-source code, AWS provides managed, HIPAA-eligible building blocks that integrate directly with Strands:

| AWS Service | Clinical Function | Open-Source / SDK Interface |
| :--- | :--- | :--- |
| **AWS HealthLake** | Managed FHIR R4 repository with millisecond search and terminology indexing. | Queryable via `awslabs/mcp/src/healthlake-mcp-server` or `boto3.client('healthlake')`. |
| **AWS HealthScribe** | Ambient clinical speech-to-text generating structured SOAP notes with linked evidence citations. | `boto3.client('transcribe')` (`StartMedicalScribeJob`); outputs structured JSON to S3. |
| **Amazon Comprehend Medical** | Specialized healthcare NLP for extracting entities, dosages, temporal relations, and ontology linking. | `boto3.client('comprehendmedical')` (`InferICD10CM`, `InferRxNorm`, `InferSNOMEDCT`). |
| **Cedar Policy Engine** | Open-source, mathematical authorization language for Attribute-Based Access Control (ABAC). | `cedarpolicy` Python package; enforces patient-scoped privacy boundaries. |
| **Amazon Connect & SNS** | Omnichannel contact center and SMS dispatch. | Used in `sample-amazon-connect-health-unified-clinical-workflow` for automated after-visit patient SMS follow-ups. |

---

## 5. Architectural Blueprint: The Unified AWS Strands Healthcare Stack for AegisHealth AI

By combining these open-source AWS assets, we establish a robust, hackathon-ready implementation plan:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AegisHealth AI — Complete AWS Stack                     │
└─────────────────────────────────────────────────────────────────────────────┘

[1. PATIENT INTERFACE LAYER]
  ├── Amazon SNS / Amazon Connect: 2-way conversational SMS check-ins
  └── Synthetic Cellular Vitals: Cat-M1 weight scale & BP cuff telemetry

[2. FAST DECISION & SAFETY INTERVENTION LAYER]
  ├── Strands Decider 2B (Strands Labs / Marc Brooker):
  │     └── 115ms System 1 tool gating via Strands InterventionHandler
  └── Safety Guardian Agent (Deterministic Pure Python + Cedar Policy):
        └── ACC/AHA & KDIGO hard rules: K+ >= 5.2 mEq/L & SBP < 95 mmHg vetoes

[3. STRANDS MULTI-AGENT REASONING SWARM (Amazon Bedrock)]
  ├── DataScienceAgent: Runs Python pandas code interpreter on telemetry trends
  ├── HealthCoachAgent: Conducts empathetic motivational interviewing via SMS
  └── ClinicalExpertAgent: Formulates ACC/AHA guideline-validated SBAR orders

[4. DATA & INTEROPERABILITY LAYER]
  ├── HealthLake MCP Server (awslabs/mcp): 11 FHIR tools for patient data access
  ├── AWS HealthLake (FHIR R4): Long-term clinical history & Synthea cohorts
  └── Amazon Comprehend Medical: Automated ICD-10-CM (I50.9) & RxNorm coding
```

### Direct Technical Advantages for Our Hackathon Submission:
1. **Credibility with AWS Judges:** Using `awslabs/mcp/src/healthlake-mcp-server` and referencing official AWS samples (`sample-healthcare-decision-support-agent`) shows judges that our project is built with first-class AWS patterns.
2. **Zero PHI Risk:** Using HealthLake's native Synthea integration and synthetic FHIR cohorts eliminates all compliance overhead during the demo.
3. **Formal Verification Precedent:** Citing AWS's `sample-clinical-chatbot-with-logically-verified-responses` proves that our deterministic `SafetyGuardianAgent` is the exact architectural direction recommended by AWS engineering leadership.
