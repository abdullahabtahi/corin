# Deep Research: Open-Source Assets, Winning Hackathon Repositories & Execution Resources

**Author Context:** Senior AI Product Leadership (Google Health / AWS AgentCore / McKinsey QuantumBlack / Palantir) & Board-Certified Physician (MD)  
**Hackathon Target:** AWS Builder Center — *Strands SDK: Workshop to Ship*  
**Analytical Scope:** Top-Winning Agent Repositories, Open-Source Toolkits, Proven "Secret Sauce" Winning Patterns, and Production Hackathon Stacks

---

## 1. Deconstruction of Winning AI & Healthcare Hackathon Projects

An analysis of champion submissions across **TreeHacks (Stanford)**, **CalHacks (UC Berkeley)**, **MIT Grand Hacks**, and **AWS Devpost Competitions** reveals consistent structural patterns that separate Grand Prize winners from the pack.

```
                         THE ANATOMY OF A WINNING HACKATHON ENTRY
                         
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 1. The High-Empathy Clinical Anchor (Human Story in First 30 Seconds)  │
   │    • Real persona facing acute danger (e.g. CHF patient at home)       │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
   ┌───────────────────────────────────▼────────────────────────────────────┐
   │ 2. The Multi-Agent Cognitive Swarm (Inspectable Agent Orchestration)   │
   │    • Specialized sub-agents: Data Scientist, Expert, Coach, Triage     │
   │    • Visual execution: tool calls, code execution, message passing     │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
   ┌───────────────────────────────────▼────────────────────────────────────┐
   │ 3. The Deterministic Safety Net ("The Adult in the Room")              │
   │    • Hard programmatic veto: CDSS drug checks, dose rules, HIPAA scrub │
   │    • Zero tolerance for ungrounded hallucination                      │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
   ┌───────────────────────────────────▼────────────────────────────────────┐
   │ 4. Native AWS Enterprise Architecture ("Workshop to Ship")             │
   │    • Strands SDK + Amazon Bedrock + DynamoDB state + MCP integration   │
   └────────────────────────────────────────────────────────────────────────┘
```

---

### Master Index of Champion Projects

| Project Name | Competition / Award | Core Architecture | What Made Them Win |
| :--- | :--- | :--- | :--- |
| **Agent Ricky** | **TreeHacks 2025**<br>*AI Agent Excellence & Innovation Award* | Multi-agent autonomous monitoring for first responders using biometric & telemetry data (HR, HRV, thermal stress). | Transformed passive wearable telemetry into autonomous, life-saving triage alerts with real-time intervention workflows. |
| **NEST**<br>(Newborn Safe Transition) | **AWS / Devpost**<br>*Build Interoperable Healthcare Agents Winner* | 5-agent swarm orchestrating complex HL7 FHIR records into a unified post-discharge maternal/infant control panel. | Solved the post-discharge fragmentation problem by pulling raw FHIR data into coordinated, role-specific agents. |
| **LoopGuard Passport** | **AWS / Devpost**<br>*Grand Prize Winner* | Governed clinical loop closure agent that tracks incidental findings and clinical silence to prevent diagnostic delays. | Addressed a massive hospital liability vector (missed follow-ups) with audit-grade safety tracking. |
| **RepoRx** | **TreeHacks 2026**<br>*QBio.AI / Fetch.ai Innovation Prize* | Multi-agent orchestration platform that mines biomedical literature and molecular profiles to repurpose FDA drugs for oncology. | Combined deep scientific literature synthesis with structured drug databases rather than generic chat. |
| **LookCloser** | **AWS / Devpost**<br>*Healthcare Agent Winner* | Multi-agent safety net parsing unstructured radiology text and clinical progress notes to flag unaddressed pulmonary nodules. | Direct bridge between unstructured narrative text and deterministic clinical follow-up protocols. |
| **Lifelink** | **UC Berkeley Hackathon**<br>*1st Prize Overall* | Autonomous agent swarm coordinating emergency blood banking, donor matching, and supply chain logistics. | Solved real-world operational friction with dynamic agent negotiation and real-time event triggers. |

---

## 2. Key Open-Source Libraries & Frameworks to Leverage

To build rapidly without re-inventing the wheel, we can compose best-in-class open-source Python packages with the **Strands SDK**:

### A. Healthcare Interoperability & Medical Coding
* **`fhir.resources`** (`pip install fhir.resources`):
  * Official Pydantic models for all HL7 FHIR Release 4 and Release 5 resources.
  * Provides strict schema validation, JSON parsing, and autocompletion for `Patient`, `Observation`, `Condition`, `MedicationRequest`, and `Encounter`.
* **`pyhealth`** (`pip install pyhealth`):
  * Comprehensive deep learning and data engineering toolkit for clinical datasets (EHR sequence modeling, length-of-stay, readmission prediction, and drug-drug interaction graphs).
* **`medplum`** (`@medplum/core` / Medplum REST API):
  * Headless, open-source healthcare platform with a fully compliant FHIR R4 backend, patient portal components, and clinical bots.
* **`python-Levenshtein` / `thefuzz`**:
  * For fuzzy clinical string matching between patient-reported brand names (e.g. "Lasix") and RxNorm generic concepts (e.g. "furosemide").

### B. Agentic Framework & AWS Cloud Core
* **`strands-agents` / `strands`** (`pip install strands-agents`):
  * The official AWS-backed agent loop framework. Supports `@tool` decorators, streaming, lifecycle hooks, multi-agent orchestration, and native MCP client adapters.
* **`mcp`** (`pip install mcp`):
  * The official Model Context Protocol Python SDK (`mcp.client.stdio`, `StdioServerParameters`) for connecting external tool servers in 3 lines of code.
* **`boto3`**:
  * AWS SDK for invoking Amazon Bedrock Foundation Models (Amazon Nova Pro, Claude 3.5 Sonnet), persisting agent memory to Amazon DynamoDB, and storing artifacts in S3.
* **`ponytail`** (Already installed in `.agents/skills/ponytail`):
  * "Lazy Senior Dev" execution mode: enforces YAGNI (You Aren't Gonna Need It), strips bloat, and delivers the smallest complete implementation that works.

### C. Data Science & Telemetry Time-Series
* **`pandas` & `numpy`**:
  * For vector calculations on continuous wearable biometrics: rolling 7-day baselines, z-score outlier detection, and heart rate variability (rMSSD) metrics.
* **`scipy.signal`**:
  * For digital signal processing (filtering noisy smartwatch actigraphy, peak detection for resting heart rate).

---

## 3. UI/UX Resources: How to Build a Winning 60-Second Demo

Hackathons are won in the first 60 seconds of judging. If the judges see a terminal window or a raw text chat box, they assume it is an ordinary LLM wrapper. 

Winning projects utilize **"Agentic UX"**—an interface where the user can see the agents think, collaborate, and execute tools.

```
                     RECOMMENDED DEMO DASHBOARD LAYOUT
                     
 ┌─────────────────────────────────────────────────────────────────────────┐
 │  Patient Profile & Vitals Telemetry  │   Live Agent Swarm Activity Log   │
 │  • Robert M. (68yo M, CHF NYHA III)  │   [08:14:02] Orchestrator started│
 │  • Resting HR: 82 bpm (+7 bpm drift) │   [08:14:03] DS Agent running    │
 │  • HRV (rMSSD): 18 ms (-28% drop)    │              python_sandbox...   │
 │  • Torso Tilt: +22° (Orthopnea)      │   [08:14:05] Expert Agent citing │
 │  ─────────────────────────────────── │              PMID: 32178224...   │
 │  Interactive Physiological Canvas    │   [08:14:07] Safety Gate check:  │
 │  [ === 14-Day Deterioration Curve =] │              CDSS APPROVED       │
 ├──────────────────────────────────────┴──────────────────────────────────┤
 │  Patient Coaching & Action Plan (Generated by Health Coach Agent)        │
 │  "Robert, your night-time heart rate has drifted up over the last 3 days│
 │   and your sleep was restless. Let's check: are you using extra pillows?"│
 └─────────────────────────────────────────────────────────────────────────┘
```

### Rapid UI Tech Stack Options

#### Option A: Streamlit + Plotly (Recommended for Fastest Hackathon Velocity)
* **Velocity:** Fully operational in under 1 hour; written 100% in Python (zero JavaScript overhead).
* **Components:**
  * `st.line_chart` / `plotly.graph_objects`: Interactive 14-day telemetry curves (HR drift, HRV drops).
  * `st.status` / `st.chat_message`: Expandable agent thought processes showing subagent handoffs in real-time.
  * `st.metric`: Big, bold clinical vital sign indicators with delta arrows ($+7\text{ bpm}$, $-28\%$).

#### Option B: Next.js + TailwindCSS + shadcn/ui (Recommended for Top Visual Polish)
* **Velocity:** 3–4 hours using `shadcn` components.
* **Key Visual Elements:**
  * *Thought Timeline Accordion*: Collapsible view showing `DataScienceAgent` code execution $\to$ `PubMed` citations $\to$ `CDSS` safety badge.
  * *Risk Alert Badge*: Dynamic color-coded badge (`LOW`, `MONITORING`, `CRITICAL DECOMPENSATION`).

---

## 4. The 5 Strategic Commandments for Winning This Hackathon

Derived from judging rubrics across AWS and major healthcare hackathons:

### 1. Lead with the "Human Cliff", Not the Tech Stack
* *Bad Pitch:* "We built a multi-agent system on Strands SDK using Bedrock Nova Pro and MCP servers."
* *Winning Pitch:* "Meet Robert, a 68-year-old grandfather discharged with heart failure. His daily bathroom scale looks fine, but inside, his body is quietly decompensating. In 4 days, he will be in the ICU—unless our Strands swarm catches the subclinical signal."

### 2. The Multi-Agent Theater Must Be Real and Visible
* Judges want to see **why** multi-agent is necessary. If one agent can do it with a prompt, it's not a multi-agent problem.
* Show the clear division of labor:
  * The **Data Science Agent** writes and executes Python math.
  * The **Expert Agent** searches PubMed for clinical evidence.
  * The **Health Coach Agent** uses motivational psychology.
  * The **Safety Guardian** can actively **VETO** unsafe outputs.

### 3. Feature a "Safety Intervention" in the Live Demo
* In the live demo, intentionally trigger a potential failure (e.g. a high sodium suggestion or unverified drug combination).
* Show the **Clinical Safety Guardian (`healthcare-cdss-patterns`) intercept and block the output** in front of the judges. This proves production viability and regulatory awareness that healthcare judges revere.

### 4. Ground Everything in Real Data & Standards
* Display real **FHIR R4 resource payloads** (or query the live SMART on FHIR sandbox).
* Cite authentic **PubMed PMIDs** (via `pubmed-mcp` or `scientific-db-pubmed-database`).
* Use Google’s **PHA telemetry schema** (`summary.csv`).

### 5. Highlight the AWS "Workshop to Ship" Primitives
* Explicitly call out AWS architectural advantages:
  * **Amazon Bedrock**: Low-latency model inference with Amazon Nova / Claude 3.5.
  * **Strands SDK**: Minimal boilerplate `@tool` definitions and native `MCPClient`.
  * **AgentCore Readiness**: Decoupled, stateless agents ready for serverless production deployment.
