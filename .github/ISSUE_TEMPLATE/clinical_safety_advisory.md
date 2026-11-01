---
name: Clinical Safety Advisory
about: Report a physiological boundary concern or algorithmic safety risk
title: '[SAFETY]: '
labels: ['clinical-safety', 'critical-priority']
assignees: ''
---

> **NOTE:** If this issue involves active patient risk or undisclosed credentials/vulnerabilities, please review our [Security & Disclosure Policy](../SECURITY.md) and report privately.

## ⚕️ Clinical Risk Summary
Concise description of the observed or potential algorithmic failure, safety invariant bypass, or contraindication conflict.

## 🔬 Pathophysiological Scenario & Patient Profile
- Relevant Biomarkers: (e.g. Serum K+ = 5.2 mEq/L, SBP = 92 mmHg, eGFR = 28 mL/min)
- Active Medications: (e.g. Spironolactone 25mg, Sacubitril/Valsartan 49/51mg)
- Observed Algorithmic Recommendation:
- Guideline Reference: (e.g. 2022 AHA/ACC/HFSA, KDIGO 2024)

## 🛡️ Recommended Safety Boundary Clamp
What mathematical or deterministic invariant should be implemented to prevent this risk?
*(e.g., Clamp loop diuretic titration to fail-closed when SBP < 95 mmHg)*
