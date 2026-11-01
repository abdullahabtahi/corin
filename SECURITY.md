# Security Policy

## 🔒 Security Posture & Principles

Project Corin is a clinical decision support system designed with defense-in-depth principles:

1. **Zero PHI in Client Storage**: Protected Health Information (PHI) is never stored in unencrypted browser storage (localStorage, sessionStorage, unencrypted indexedDB, or cookies).
2. **Fail-Closed Safety Invariants**: If any lab parameter is missing, out-of-bounds, or stale (>14 days), the system defaults to a fail-closed hard stop requiring explicit human clinician review.
3. **Cryptographic Action Intent Tokens**: Every order commitment is signed with a sha256 cryptographic intent token binding patient MRN, timestamp, clinician ID, and order details to prevent time-of-check to time-of-use (TOCTOU) and replay attacks.
4. **Isolated Sandboxed Execution**: All biometric trajectory calculations and algorithmic evaluations run in isolated environments without direct access to external networks.

---

## 🛡️ Supported Versions

Only the latest release of Corin on the `main` branch receives active security updates:

| Version | Supported          |
| ------- | ------------------ |
| `3.x`   | :white_check_mark: |
| `< 3.0` | :x:                |

---

## 🚨 Reporting a Vulnerability

We take the security of healthcare AI systems seriously. If you discover a security vulnerability, clinical safety flaw, or credential exposure, please **do NOT report it via public GitHub issues**.

Instead, please report the vulnerability privately:

1. **GitHub Private Vulnerability Reporting**: Submit a private advisory via the **Security** tab of this repository.
2. **Email**: Send details directly to `security@corin-cds.org` or to the repository owner at `abdullahabtahi21@gmail.com`.

### What to Include in Your Report
- A detailed description of the vulnerability.
- Steps to reproduce the issue (proof-of-concept script, request payload, or test case).
- Potential clinical or security impact (e.g., PHI exposure, safety invariant bypass, denial of service).
- Any proposed remediation or patch.

### Our Response Timeline
- **Initial acknowledgment**: Within 24 hours.
- **Triage and severity assessment**: Within 48 hours.
- **Fix development & release**: Within 7 days for critical vulnerabilities.

---

## ⚕️ Clinical Safety Disclosures

If you identify a scenario where algorithmic guidance could lead to incorrect medication titration, overlooked hyperkalemia, or compromised patient safety, treat this with the same urgency as a critical security vulnerability and follow the private reporting process outlined above.
