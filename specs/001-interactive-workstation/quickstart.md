# Quickstart & Verification Procedures

## 1. Automated Test Suite
```bash
cd frontend && /Users/abdullahabtahi/.bun/bin/bun test
```
Verifies:
- 14-day timeline mathematical monotonicity and EWMA trajectory.
- 4 deterministic CDSS safety invariant thresholds.
- TOCTOU concurrency race prevention.
- Layer state toggles and keyframe interpolation.

## 2. Production Build Verification
```bash
cd frontend && /Users/abdullahabtahi/.bun/bin/bun run build
```
Ensures 0 TypeScript type errors and passes Rollup bundling under 350ms.

## 3. Design System Compliance
```bash
./.agents/skills/impeccable/scripts/impeccable detect frontend/index.html --json
./.agents/skills/impeccable/scripts/impeccable detect frontend/src/components --json
```
Ensures 0 craft violations (no kickers, no pure `#FFFFFF` glare, tabular numbers enforced).

