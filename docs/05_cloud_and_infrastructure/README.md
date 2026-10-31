# 05. Cloud & Infrastructure

This directory contains cloud environment verification, verified model endpoints, latency benchmarks, and infrastructure inventories for **Corin**.

---

## Documents

1. [**AWS Sandbox Environment Capabilities & Inventory**](./aws_sandbox_capabilities.md)
   * Programmatic verification of all accessible services and foundation models on AWS Bedrock.
   * Model latency benchmarks (Claude Sonnet 4.5: ~1579ms, Nova Pro: ~606ms, Nova Micro: ~334ms).
   * Verified cross-region inference profile IDs (`us.anthropic.claude-sonnet-4-6`, `amazon.nova-pro-v1:0`).
   * Embedding and reranking model inventory (Titan Embeddings v2, Cohere Embed v3/v4).
