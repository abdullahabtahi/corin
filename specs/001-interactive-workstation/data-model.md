# Phase 1 Data Model: Telemetry Keyframes & Living Workstation State

```typescript
// Timeline Day Data Contract
export interface DayTelemetryPoint {
  day: number;                  // -14 to 0
  date: string;                 // e.g. "Oct 18"
  weight_raw: number;           // lbs
  weight_ewma: number;          // lbs (alpha = 0.28)
  resting_hr: number;           // bpm
  potassium: number;            // mEq/L
  systolic_bp: number;          // mmHg
  z_score: number;              // statistical deviation
  orthopnea_pillows: number;    // clinical pillows
  risk_score: number;           // 0 to 100
  clinical_event?: string;      // notable event annotation
}

// Anatomical Layer Inspection Modes
export type AnatomicalLayer = 'synthesis' | 'vascular' | 'pulmonary' | 'renal';

// Extended Clinical Context State
export interface WorkstationInteractiveState {
  scrubberDay: number;          // Current scrubbed day: -14 to 0
  isPlayingTimeline: boolean;   // Scrubber playback state
  playbackSpeed: 1 | 2 | 4;     // Playback multiplier
  activeLayer: AnatomicalLayer; // Currently selected anatomical layer
  setScrubberDay: (day: number) => void;
  setIsPlayingTimeline: (playing: boolean) => void;
  setPlaybackSpeed: (speed: 1 | 2 | 4) => void;
  setActiveLayer: (layer: AnatomicalLayer) => void;
}
```

