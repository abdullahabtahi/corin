import { useEffect } from 'react'
import { useClinical, type ClinicalWorkspace } from '../context/ClinicalContext'

/**
 * useClinicianShortcuts
 * 
 * High-speed ergonomic keyboard shortcuts for clinical workstation operation:
 * - [Space]: Toggle 14-day timeline playback (in Workstation)
 * - [Escape]: Dismiss active drawers, modal inspectors, and evidence citations
 * - [Cmd+Enter] / [Ctrl+Enter]: Authorize proposed GDMT order when CDSS safety guard passes
 * - [Option+1..7] / [Alt+1..7]: Direct workspace navigation (avoiding browser tab collisions)
 */
export function useClinicianShortcuts() {
  const {
    currentWorkspace,
    setCurrentWorkspace,
    isPlayingTimeline,
    setIsPlayingTimeline,
    activeDrawer,
    setActiveDrawer,
    setActiveCitation,
    cdssVerdict,
    orderLifecycle,
    orderStatus,
    authorizeOrder,
  } = useClinical()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      )

      // Escape always closes open drawers and citations
      if (e.key === 'Escape') {
        if (activeDrawer !== 'none') {
          setActiveDrawer('none')
        }
        setActiveCitation(null)
        return
      }

      if (isInput) return

      // Space: Toggle Timeline Play/Pause in Workstation
      if (e.code === 'Space') {
        if (currentWorkspace === 'workstation') {
          e.preventDefault()
          setIsPlayingTimeline((prev) => !prev)
        }
        return
      }

      // Cmd+Enter / Ctrl+Enter: Authorize Prescribing Order (HITL)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (
          currentWorkspace === 'workstation' &&
          cdssVerdict?.passed &&
          orderLifecycle !== 'COMMITTED_TO_EHR' &&
          orderStatus !== 'authorizing'
        ) {
          e.preventDefault()
          authorizeOrder()
        }
        return
      }

      // Workspace Quick Navigation: Option+1..7 / Alt+1..7
      if (e.altKey && !e.metaKey && !e.ctrlKey) {
        const workspaceKeys: Record<string, ClinicalWorkspace> = {
          '1': 'workstation',
          '2': 'cohort',
          '3': 'pulmonary',
          '4': 'renal',
          '5': 'genomics',
          '6': 'pharmacy',
          '7': 'telemetry',
        }
        const targetWs = workspaceKeys[e.key]
        if (targetWs) {
          e.preventDefault()
          setCurrentWorkspace(targetWs)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    currentWorkspace,
    setCurrentWorkspace,
    isPlayingTimeline,
    setIsPlayingTimeline,
    activeDrawer,
    setActiveDrawer,
    setActiveCitation,
    cdssVerdict,
    orderLifecycle,
    orderStatus,
    authorizeOrder,
  ])
}
