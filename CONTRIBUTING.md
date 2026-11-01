# Contributing to Corin

Thank you for your interest in contributing to **Corin**! We welcome contributions that uphold high standards of clinical safety, architectural rigor, and developer ergonomics.

This project follows Google's Open Source best practices and community guidelines.

---

## 🏛 Code of Conduct

All contributors and participants agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating in discussions or submitting code.

---

## ⚕️ Cardinal Rule: Deterministic Clinical Safety Invariants

Corin is a clinical decision support system. Any pull request that affects clinical logic, safety guardrails, or invariant boundaries is subject to strict review:

1. **Never Weaken Safety Boundaries**: The safety invariants (Serum \(K^+ \ge 5.2 \text{ mEq/L}\), \(\text{SBP} < 95 \text{ mmHg}\), \(\text{eGFR} < 30 \text{ mL/min}\), \(\text{BMP} > 14 \text{ days}\)) are **fail-closed hard vetoes**. They must NEVER be bypassed, soft-warned, or converted into probabilistic LLM outputs.
2. **Zero Hallucination Tolerance**: Safety decisions must execute in deterministic pure functions with \(<2\text{ms}\) execution time.
3. **No Phantom Prescriptions**: All medication orders must require explicit Human-in-the-Loop (HITL) authorization and generate a cryptographic Action Intent Token.
4. **All Tests Must Pass**: Every PR must pass all 68 unit tests in `corin-cds.test.ts` without regressions.

---

## 🛠 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) 1.2+
- Node.js 20+ (for LTS compatibility)
- Python 3.12+ (for backend agent services)
- Git

### Development Setup
1. Fork and clone the repository:
   ```bash
   git clone https://github.com/<your-username>/corin.git
   cd corin
   ```
2. Install frontend dependencies:
   ```bash
   cd frontend
   bun install
   ```
3. Run the unit test suite:
   ```bash
   bun test
   ```
4. Start the development server:
   ```bash
   bun run dev
   ```

---

## 🎨 Style Guides & Quality Standards

### TypeScript & React
- Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).
- **Zero AI Slop / Cliché UI**:
  - Do NOT use electric cyan, neon indigo, or purple gradients.
  - Adhere to the porcelain daylight color palette (`#EDF1F6`, `#EAEFF5`, `#1E293B`, and clinical cobalt blue `#2563EB`).
  - Do NOT use the `Sparkles` icon for clinical operations; use semantic medical instrumentation icons (`ShieldCheck`, `Activity`).
  - Use stationary, non-pulsing caliper needles for precise engineering readouts.
- All numbers representing physiological values must use tabular numerals (`tabular-nums font-mono`).

### Python & Backend
- Follow the [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html).
- Type annotations are required on all function arguments and return types.
- Format with `ruff` or `black`.

---

## 🔄 Pull Request Workflow

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```
2. **Make Small, Focused Commits**:
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(...)`: New feature or user-facing capability
   - `fix(...)`: Bug fix or safety edge-case remediation
   - `docs(...)`: Documentation updates
   - `test(...)`: Adding or updating test suites
   - `refactor(...)`: Code cleanup without altering external behavior
3. **Verify Locally**:
   ```bash
   cd frontend
   bun test
   bun run build
   ```
4. **Submit PR**:
   - Complete the [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md).
   - Ensure the automated GitHub Actions CI workflow passes.

---

## 🔒 Security & Sensitive Data

- **NEVER commit secrets, API keys, or credentials**. Our `.gitignore` enforces strict filters, but always verify with `git status` before committing.
- Do NOT commit real patient health information (PHI). Use synthetic datasets conforming to Synthea or de-identified benchmarks only.
- For vulnerability reports, see [SECURITY.md](./SECURITY.md).
