import React from 'react'
import { ClinicalProvider, useClinical } from './context/ClinicalContext'
import { HeaderNav } from './components/HeaderNav'
import { OrganRail } from './components/OrganRail'
import { TwinCanvas } from './components/TwinCanvas'
import { CardiorenalStatusCard } from './components/CardiorenalStatusCard'
import { BiomarkerCalipers } from './components/BiomarkerCalipers'
import { CareStrategyGrid } from './components/CareStrategyGrid'
import { CohortWorklistView } from './components/CohortWorklistView'
import { GdmtPharmacyView } from './components/GdmtPharmacyView'
import { PulmonaryView } from './components/PulmonaryView'
import { RenalView } from './components/RenalView'
import { GenomicsView } from './components/GenomicsView'
import { SwarmTelemetryView } from './components/SwarmTelemetryView'
import { SbarDrawer } from './components/SbarDrawer'
import { SmsSimulatorDrawer } from './components/SmsSimulatorDrawer'
import { SwarmTheaterDrawer } from './components/SwarmTheaterDrawer'
import { StudioBackdrop } from './components/StudioBackdrop'
import { useClinicianShortcuts } from './hooks/useClinicianShortcuts'

export const AppContent: React.FC = () => {
  const { currentWorkspace } = useClinical()
  useClinicianShortcuts()

  return (
    <div className="h-screen w-screen flex flex-col bg-[#EAEFF5] text-[#0F172A] overflow-hidden relative">
      {/* Studio Lighting & Visual Depth Backdrop */}
      <StudioBackdrop />

      {/* Top Clinical Navigation Bar */}
      <HeaderNav />

      {/* Main Clinical Workstation Viewport */}
      <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative z-10">
        {/* Left Organ System Rail */}
        <OrganRail />

        {/* Workspace 1: Patient Acute Workstation */}
        {currentWorkspace === 'workstation' && (
          <>
            {/* Center Digital Twin Stage */}
            <div className="w-full lg:w-[44%] xl:w-[45%] 2xl:w-[46%] h-[420px] lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200/60 relative shrink-0">
              <TwinCanvas />
            </div>

            {/* Right Clinical Dashboard Column */}
            <main className="flex-1 h-full p-4 lg:p-5 flex flex-col justify-between gap-3.5 overflow-y-auto">
              {/* Top Card: Cardiovascular System Status & Biological Aging Delta */}
              <CardiorenalStatusCard />

              {/* Middle Card: Key Areas of Concern with Continuous Calipers */}
              <BiomarkerCalipers />

              {/* Bottom Card: Customized Care Strategy & Guideline Titration Grid */}
              <CareStrategyGrid />
            </main>
          </>
        )}

        {/* Workspace 2: Population Health Cohort Triage Panel */}
        {currentWorkspace === 'cohort' && (
          <CohortWorklistView />
        )}

        {/* Workspace 3: Pulmonary Bed & Fluid Dynamics Center */}
        {currentWorkspace === 'pulmonary' && (
          <PulmonaryView />
        )}

        {/* Workspace 4: Renal Function & CDSS Safety Lab */}
        {currentWorkspace === 'renal' && (
          <RenalView />
        )}

        {/* Workspace 5: Pharmacogenomics & Precision Dosing Lab */}
        {currentWorkspace === 'genomics' && (
          <GenomicsView />
        )}

        {/* Workspace 6: GDMT Regimen & Prescribing Engine */}
        {currentWorkspace === 'pharmacy' && (
          <GdmtPharmacyView />
        )}

        {/* Workspace 7: Clinical Agent Telemetry & Execution Trace */}
        {currentWorkspace === 'telemetry' && (
          <SwarmTelemetryView />
        )}
      </div>

      {/* Zero-Modal Slide-Over Drawers */}
      <SbarDrawer />
      <SmsSimulatorDrawer />
      <SwarmTheaterDrawer />
    </div>
  )
}

export default function App() {
  return (
    <ClinicalProvider>
      <AppContent />
    </ClinicalProvider>
  )
}
