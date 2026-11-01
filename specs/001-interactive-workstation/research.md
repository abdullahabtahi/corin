# Phase 0 Research: Interactive Workstation Mathematics & Shader Mechanics

## 1. Physiological Rhythm Synchronization
- **Heart Rate Cycle Formula:**
  $$\text{Period (s)} = \frac{60}{\text{RHR}} = \frac{60}{82} \approx 0.7317\text{ s}$$
- **Systolic Ejection vs. Diastolic Filling:**
  - Systolic contraction occupies ~35% of the cycle ($256\text{ms}$).
  - Diastolic filling occupies ~65% of the cycle ($475\text{ms}$).
- **Implementation:** Custom CSS keyframes `hemodynamic-cardiac-cycle` bound to CSS custom property `--hr-period: 731ms`.

## 2. 14-Day Trajectory Interpolation Math
- **Input Keyframes:** 14 discrete telemetry days from `Day -14` (Oct 18) to `Day 0` (Oct 31).
- **Interpolation Function:**
  $$w(t) = w_{\lfloor t \rfloor} + (t - \lfloor t \rfloor)(w_{\lceil t \rceil} - w_{\lfloor t \rfloor})$$
  Evaluated in real-time in React state to provide butter-smooth 60fps scrubbing.

## 3. Shader Layer Color Chemistry (WCAG AAA)
- **Vascular Congestion:** `rgba(59, 130, 246, 0.45)` with `box-shadow: 0 0 24px rgba(59, 130, 246, 0.5)`.
- **Pulmonary Fluid Stasis:** `rgba(245, 158, 11, 0.40)` with alveolar transudate stippling.
- **Renal Filtration:** `rgba(16, 185, 129, 0.40)` with glomerular safety halo.

