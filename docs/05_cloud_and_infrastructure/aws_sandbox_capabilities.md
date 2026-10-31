# AWS Sandbox Environment Capabilities & Inventory

**Last Verified:** October 31, 2026  
**Account ID:** `741448938361`  
**Role ARN:** `arn:aws:sts::741448938361:assumed-role/WSParticipantRole/Participant`  
**Default Region:** `us-east-1`  
**Environment Type:** AWS Workshop Studio / Event Engine (Ephemeral Session)  

---

## 1. Verified Accessible Services & Foundation Models

All listed services and models were programmatically tested and confirmed operational via the AWS CLI and Bedrock Runtime APIs using the provisioned credentials.

### 1.1 Amazon Bedrock — Language & Reasoning Models

Invoked via the `bedrock-runtime converse` or `bedrock-runtime invoke-model` API.

| Provider | Model Name | Model ID / Inference Profile ID | Modality & Context | Test Result |
| :--- | :--- | :--- | :--- | :--- |
| **Anthropic** | Claude Opus 4.6 | `us.anthropic.claude-opus-4-6-v1` | Text, Advanced Reasoning | **Operational** |
| **Anthropic** | Claude Sonnet 4.6 | `us.anthropic.claude-sonnet-4-6` | Multimodal (Text + Vision) | **Operational** |
| **Anthropic** | Claude Opus 4.5 | `us.anthropic.claude-opus-4-5-20251101-v1:0` | Text, Deep Reasoning | **Operational** |
| **Anthropic** | Claude Sonnet 4.5 | `us.anthropic.claude-sonnet-4-5-20250929-v1:0` | Multimodal (Text + Vision) | **Operational** (~1579ms) |
| **Anthropic** | Claude Haiku 4.5 | `us.anthropic.claude-haiku-4-5-20251001-v1:0` | Fast Text Inference | **Operational** (~516ms) |
| **Amazon** | Nova Pro | `amazon.nova-pro-v1:0` | Multimodal, up to 300k context | **Operational** (~606ms) |
| **Amazon** | Nova Lite | `amazon.nova-lite-v1:0` | Multimodal, up to 300k context | **Operational** |
| **Amazon** | Nova Micro | `amazon.nova-micro-v1:0` | Text-only, 128k context | **Operational** (~334ms) |
| **Meta** | Llama 3 70B Instruct | `meta.llama3-70b-instruct-v1:0` | Text | **Operational** |
| **Meta** | Llama 3 8B Instruct | `meta.llama3-8b-instruct-v1:0` | Text | **Operational** |

*Note for Anthropic models:* Invoking direct IDs like `anthropic.claude-sonnet-4-6` with on-demand throughput returns a `ValidationException` requiring cross-region inference profiles. Always use the `us.` prefix (e.g., `us.anthropic.claude-sonnet-4-6`).

---

### 1.2 Amazon Bedrock — Vector Embedding Models

Invoked via `bedrock-runtime invoke-model` with `application/json` payload.

| Provider | Model Name | Model ID | Input / Output Format | Test Result |
| :--- | :--- | :--- | :--- | :--- |
| **Amazon** | Titan Text Embeddings v2 | `amazon.titan-embed-text-v2:0` | Body: `{"inputText": "..."}`<br>Output: Vector float array | **Operational** |
| **Cohere** | Embed English v3 | `cohere.embed-english-v3` | Body: `{"texts": [...], "input_type": "search_document"}` | **Operational** |
| **Cohere** | Embed v4 | `cohere.embed-v4:0` | Body: `{"texts": [...], "input_type": "search_document"}` | **Operational** |
| **Amazon** | Titan Multimodal Embeddings | `amazon.titan-embed-image-v1:0` | Text & Image embeddings | **Operational** |

---

### 1.3 Amazon Bedrock — Semantic Reranking Models

| Provider | Model Name | Model ID | Payload Specification | Test Result |
| :--- | :--- | :--- | :--- | :--- |
| **Cohere** | Cohere Rerank v3.5 | `cohere.rerank-v3-5:0` | Requires `api_version: 2`<br>`{"query": "...", "documents": [...], "top_n": N, "api_version": 2}` | **Operational** |

---

### 1.4 Amazon CloudWatch Logs

* **Action:** `logs:DescribeLogGroups`
* **Test Result:** **Operational**
* Allows reading and listing existing CloudWatch log groups in `us-east-1`.

---

## 2. Verified Inaccessible & Restricted Services (AccessDenied / Policy Block)

The following services, endpoints, and models were evaluated and confirmed to return `AccessDeniedException` or policy rejections under the `WSParticipantRole` role:

### 2.1 Restricted Bedrock Models (Cataloged but Not Entitled)
* **Claude 5.x Family:**
  * `us.anthropic.claude-opus-5-5` & `anthropic.claude-opus-5-5` — `AccessDeniedException`
  * `us.anthropic.claude-sonnet-5-5` & `anthropic.claude-sonnet-5-5` — `AccessDeniedException`
  * `us.anthropic.claude-sonnet-5` & `anthropic.claude-fable-5` — `AccessDeniedException`
* **Claude 4.x Family Exclusions:**
  * `us.anthropic.claude-opus-4-8` — `AccessDeniedException`
  * `us.anthropic.claude-opus-4-7` — `AccessDeniedException`
  * `us.anthropic.claude-sonnet-4-8` — `ValidationException` (Invalid model ID; does not exist)

### 2.2 Restricted AWS Infrastructure & Management APIs
* **Amazon S3:** `s3:ListAllMyBuckets` returns `AccessDenied`.
* **Amazon DynamoDB:** `dynamodb:ListTables` returns `AccessDeniedException`.
* **AWS Lambda:** `lambda:ListFunctions` returns `AccessDeniedException`.
* **Amazon Bedrock Management APIs:**
  * `bedrock:ListGuardrails` — `AccessDeniedException`
  * `bedrock:ListKnowledgeBases` — `AccessDeniedException`
  * `bedrock:ListInferenceProfiles` — `AccessDeniedException`
  * `bedrock-agent:ListAgents` — `AccessDeniedException`
* **Healthcare & NLP Services:**
  * `comprehendmedical:DetectEntitiesV2` — `AccessDeniedException`
  * `comprehend:DetectDominantLanguage` — `AccessDeniedException`
* **Messaging & Orchestration:**
  * `sqs:ListQueues` — `AccessDenied`
  * `sns:ListTopics` — `AuthorizationError`
  * `events:ListEventBuses` — `AccessDeniedException`
* **Configuration & Secrets:**
  * `ssm:DescribeParameters` — `AccessDeniedException`
  * `secretsmanager:ListSecrets` — `AccessDeniedException`

---

## 3. Session Lifecycle & Authentication Constraints

* **Credential Type:** Temporary AWS Security Token Service (STS) credentials (`ASIA...`).
* **Session Lifetime:** Typically valid for 8 to 12 hours from initial provisioning.
* **Storage Location:** Kept in project root [`.env.bedrock`](../.env.bedrock) (gitignored).
* **Reset Behavior:** Upon session expiration, all account-level cloud state is reclaimed by AWS. Re-provisioning issues a new `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN`.
