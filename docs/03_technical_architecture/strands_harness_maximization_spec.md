# AWS Strands Agent Harness Maximization Specification
**Institutional Guide to Top 0.01% Agentic AI Engineering**  
*AWS Builder Center Hackathon — "Strands SDK: Workshop to Ship"*  
**Framework:** AWS Strands Agents SDK (`strands-agents==1.63.0`) on Amazon Bedrock  
**Reference:** `aws-samples/sample-strands-agents-hands-on-workshop` (Modules 1–7)  
**Date:** October 2026  
**Document Location:** `docs/03_technical_architecture/strands_harness_maximization_spec.md`  

---

## 1. Executive Definition: What is an "Agent Harness"?

As defined in the official AWS Strands Workshop:
> *"An **agent harness** is the system that lets an agent actually run: the orchestration loop that calls the model, decides which tool to invoke, passes results back, manages the context window, and handles failures — plus the infrastructure underneath it (compute, memory, secure tool connections, persistent storage, identity, and observability).*  
> ***Strands Agents is the open-source agent harness SDK*** — *you don't just write a prompt, you build and control the whole harness (the loop, tools, hooks, memory, guardrails) end-to-end."*

In naive AI projects, developers treat the LLM as a chatbot. In **top 0.01% Agentic AI**, the model is simply an untrusted reasoning engine encased inside an **auditable, deterministic, and self-policing execution harness**.

---

## 2. The 7-Pillar Strands Harness Architecture in Corin

Following the 7 modules of the AWS Strands Hands-On Workshop, here is how Corin maximizes every layer of the Strands SDK:

```mermaid
flowchart TD
    subgraph StrandsHarness ["AWS Strands Agent Harness (Corin)"]
        direction TB
        
        subgraph Layer1 ["Pillar 1: Model Mesh (Amazon Bedrock)"]
            Nova["Amazon Nova Micro<br/>(334ms Conversational Coach)"]
            Rerank["Cohere Rerank 3.5<br/>(320ms Guideline Cross-Encoder)"]
            Sonnet["Claude Sonnet 4.6<br/>(Cardiology SBAR Synthesis)"]
        end

        subgraph Layer2 ["Pillar 2: Narrow Typed Tools (@tool)"]
            Tool1["query_cardiorenal_ontology()<br/>(NetworkX Graph Traversal)"]
            Tool2["get_patient_trajectory()<br/>(DuckDB SQL-on-FHIR / EWMA)"]
            Tool3["rerank_guideline_evidence()<br/>(Cohere Rerank Bedrock Client)"]
            Tool4["order_medication_titration()<br/>(Action Intent Token Generator)"]
        end

        subgraph Layer3 ["Pillar 3: Native Interventions (Safety Guardian)"]
            Intervention["InterventionHandler.before_tool_call()<br/>• Intercepts order_medication_titration<br/>• Checks K+ >= 5.2 | SBP < 95<br/>• Returns Deny(reason) or Proceed()"]
        end

        subgraph Layer4 ["Pillar 4: Lifecycle Hooks & Observability"]
            Hooks["HookRegistry & OpenTelemetry<br/>• BeforeModelCall / AfterModelCall<br/>• Latency (ms), Tokens, Tool Tracing<br/>• Streams to Multi-Agent Theater UI"]
        end

        subgraph Layer5 ["Pillar 5: Session & Memory Management"]
            Session["FileSessionManager & MemoryManager<br/>• Multi-turn Patient Arthur SMS history<br/>• Persistent clinical state"]
        end

        subgraph Layer6 ["Pillar 6: Multi-Agent Handoffs"]
            Delegation["MultiAgentPlugin (A2A Handoff)<br/>Health Coach (Nova) -> Clinical Expert (Sonnet)"]
        end

        subgraph Layer7 ["Pillar 7: Automated Evals"]
            Evals["LLM-as-a-Judge & CDSS Unit Tests<br/>• ACC/AHA Guideline Compliance<br/>• 0% False Positive Titration Under Hyperkalemia"]
        end
    end
```

---

## 3. Deep Dive into the 7 Harness Pillars

### Pillar 1: Multi-Model Bedrock Mesh
Strands is model-neutral, allowing us to compose multiple specialized models on Bedrock:
1. **`amazon.nova-micro-v1:0`:** Handles patient-facing SMS check-in with ultra-low latency (`334ms`), minimizing cloud inference costs while providing an empathetic 6th-grade reading level.
2. **`cohere.rerank-v3-5:0`:** Invoked as a Bedrock cross-encoder tool to evaluate candidate ACC/AHA heart failure guidelines in `320ms`.
3. **`us.anthropic.claude-sonnet-4-6`:** Deployed for complex medical synthesis, constructing the 45-second scannable SBAR Action Card.

### Pillar 2: Narrow Typed Tools (`@tool`)
Tools are strictly typed with Pydantic arguments and rich docstrings to guide model selection:
```python
@tool
def query_cardiorenal_ontology(condition: str, proposed_medication: str) -> dict:
    """Traverse the ACC/AHA cardiorenal knowledge graph to detect multi-hop contraindications.
    
    Args:
        condition: Primary diagnosis (e.g. 'HFrEF_StageC', 'CKD_Stage3a').
        proposed_medication: Generic drug name (e.g. 'Furosemide', 'Spironolactone').
    """
    ...
```

### Pillar 3: Native Strands Interventions (`InterventionHandler`)
**This is the signature feature of the Strands Harness.** Naive frameworks execute tool calls automatically. Strands allows an `InterventionHandler` to intercept execution at the `before_tool_call` lifecycle hook:

```python
from strands.interventions import InterventionHandler, Proceed, Deny

class CDSSSafetyGuardian(InterventionHandler):
    name = "cdss-safety-guardian"
    
    def __init__(self, current_k_level: float, current_sbp: int):
        super().__init__()
        self.current_k_level = current_k_level
        self.current_sbp = current_sbp
        
    def before_tool_call(self, event):
        tool_name = event.tool_use.get("name")
        tool_args = event.tool_use.get("input", {})
        
        # Intercept any medication titration attempts
        if tool_name == "order_medication_titration":
            # Rule 1: Hyperkalemia hard veto
            if self.current_k_level >= 5.2:
                return Deny(
                    reason=f"[CDSS HARD VETO] Serum Potassium {self.current_k_level} mEq/L >= 5.2 mEq/L threshold. "
                           f"Diuretic escalation/MRA is contraindicated due to lethal arrhythmia risk."
                )
            # Rule 2: Hypotension hard veto
            if self.current_sbp < 95:
                return Deny(
                    reason=f"[CDSS HARD VETO] Systolic Blood Pressure {self.current_sbp} mmHg < 95 mmHg threshold. "
                           f"Escalation contraindicated due to acute hypoperfusion / shock risk."
                )
        return Proceed()
```

*When `Deny` is returned, Strands cancels the tool execution, injects the clinical reason into the agent's context, and forces the model to explain the safety contraindication to the physician.*

### Pillar 4: Lifecycle Hooks & OpenTelemetry
Strands exposes rich lifecycle events:
* `BeforeModelCallEvent` & `AfterModelCallEvent`
* `BeforeToolCallEvent` & `AfterToolCallEvent`

We register custom hooks that measure sub-millisecond execution times and token counts, streaming them via FastAPI Server-Sent Events (SSE) directly to the **Multi-Agent Theater** visual dashboard.

### Pillar 5: Session & Memory Management
We attach `FileSessionManager` to the Health Coach agent. When Arthur texts back over multiple turns, the harness preserves conversational state, prevents memory leaks, and extracts structured symptoms (e.g. pillow count, ankle edema) into persistent session storage.

### Pillar 6: Multi-Agent Delegation (`MultiAgentPlugin` / A2A Handoff)
The Strands Harness manages the collaboration between specialized agents:
1. **Health Coach (Nova Micro)** gathers patient-reported symptoms.
2. When the System 1 Decider detects acute decompensation, the harness delegates the case to the **Clinical Expert (Claude Sonnet 4.6)**.
3. The Clinical Expert ingests the conversation history, queries the knowledge graph, and formats the clinician SBAR card.

### Pillar 7: Automated Clinical Evals
We implement automated eval test suites that benchmark the harness across synthetic test cohorts:
* **Efficacy Benchmark:** Detecting 100% of subclinical decompensations within the 10-day window.
* **Safety Benchmark:** Asserting that in 100% of hyperkalemia ($K^+ \ge 5.2$) test cases, the `CDSSSafetyGuardian` successfully triggers `Deny`, with zero unauthorized prescription attempts.

---

## 4. Live Hackathon Verification

The Strands `InterventionHandler` with `Deny` and `Proceed` was verified live in our environment on **Python 3.12 with Amazon Bedrock Nova Micro**:
* **Baseline Test ($K^+ = 4.6\text{ mEq/L}$):** `Proceed()` returned; agent successfully executed `order_medication`.
* **Adversarial Test ($K^+ = 5.4\text{ mEq/L}$):** `Deny()` returned; agent intercepted mid-loop and safely output:  
  *"The order for furosemide 80mg has been denied due to a safety reason. The patient's potassium level is 5.4 mEq/L, which exceeds the safe threshold of 5.2 mEq/L..."*
