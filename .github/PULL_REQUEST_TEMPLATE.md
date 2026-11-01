## 📋 Pull Request Description

### Summary of Changes
Provide a clear, high-level summary of what this PR implements, fixes, or refactors.

### Related Issues
Fixes #

---

## ⚕️ Clinical Safety & Architectural Checklist

Please verify that all applicable items are satisfied:

- [ ] **Deterministic Safety Invariants Preserved**:
  - [ ] Serum Potassium cliff (\(\ge 5.2 \text{ mEq/L}\)) triggers fail-closed hard VETO.
  - [ ] Cardiogenic perfusion cliff (\(\text{SBP} < 95 \text{ mmHg}\)) triggers fail-closed hard VETO.
  - [ ] Renal failure cliff (\(\text{eGFR} < 30 \text{ mL/min}\)) triggers fail-closed hard VETO.
  - [ ] Lab recency (\(> 14 \text{ days}\)) triggers GUIDE steering (hold titration + order STAT BMP).
- [ ] **Zero AI Slop / Cliché Guidelines**:
  - [ ] No electric cyan, neon indigo, or purple gradients introduced.
  - [ ] No `Sparkles` icon used for clinical instrumentation.
  - [ ] Caliper needles remain non-pulsing and stable.
  - [ ] Tabular numerals applied to all physiological values.
- [ ] **Data Security & Privacy**:
  - [ ] No API keys, AWS credentials, or secrets committed.
  - [ ] Zero PHI stored in client-side storage or logs.
  - [ ] All medication commitments produce cryptographic Action Intent Tokens.

---

## 🧪 Verification & Evidence

- [ ] Unit tests pass: `bun test` in `frontend/` (68/68 passed).
- [ ] Production build succeeds without errors: `bun run build` in `frontend/`.
- [ ] Type check passes: `bunx tsc -b`.
- [ ] Lint check passes: `bun run lint`.

### Test Output Snippet
```
[Paste terminal test summary here]
```

