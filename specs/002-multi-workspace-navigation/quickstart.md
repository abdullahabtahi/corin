# Quickstart: Multi-Workspace Verification

## 1. Automated Test Suite
```bash
cd frontend && /Users/abdullahabtahi/.bun/bin/bun test
```
Verifies:
- Workspace switching state consistency (`workstation`, `cohort`, `pharmacy`).
- Cohort patient selection handoff.
- GDMT Quadruple Therapy compliance calculations.
- Persistent patient header state.

## 2. Production Build Check
```bash
cd frontend && /Users/abdullahabtahi/.bun/bin/bun run build
```

## 3. Impeccable Design Audit
```bash
./.agents/skills/impeccable/scripts/impeccable detect frontend/index.html --json
./.agents/skills/impeccable/scripts/impeccable detect frontend/src/components --json
```

