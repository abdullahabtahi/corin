import { useState, useEffect, useRef, useCallback } from 'react'
import type { SwarmTraceNode } from '../types/clinical'
import { INITIAL_SWARM_TRACE, CorinAPI } from '../lib/api'

export interface SwarmStreamEvent {
  type: 'agent_start' | 'agent_chunk' | 'agent_complete' | 'guardian_verdict' | 'order_update' | 'stream_end'
  node_id: string
  model?: string
  latency_ms?: number
  chunk?: string
  status?: 'COMPLETE' | 'RUNNING' | 'VETOED' | 'PENDING'
  summary?: string
  timestamp?: string
}

export interface UseSwarmStreamOptions {
  patientId?: string
  autoStart?: boolean
  isVetoed?: boolean
  vetoReason?: string | null
}

export function useSwarmStream({
  patientId = 'P-94021',
  autoStart = false,
  isVetoed = false,
  vetoReason = null
}: UseSwarmStreamOptions = {}) {
  const [nodes, setNodes] = useState<SwarmTraceNode[]>(INITIAL_SWARM_TRACE)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const [totalLatencyMs, setTotalLatencyMs] = useState<number>(2716)
  const [streamError, setStreamError] = useState<string | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const replayTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    replayTimersRef.current.forEach((t) => clearTimeout(t))
    replayTimersRef.current = []
  }, [])

  // Offline high-fidelity recorded replay engine
  const startRecordedReplay = useCallback(() => {
    clearTimers()
    setIsStreaming(true)
    setStreamError(null)

    // Reset all nodes to PENDING
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        status: 'PENDING' as const
      }))
    )

    const schedule = [
      { id: 'decider', startDelay: 60, runDuration: 220, latency: 4 },
      { id: 'datascience', startDelay: 300, runDuration: 350, latency: 650 },
      { id: 'coach', startDelay: 680, runDuration: 320, latency: 334 },
      { id: 'reranker', startDelay: 1030, runDuration: 300, latency: 320 },
      { id: 'expert', startDelay: 1360, runDuration: 620, latency: 1420 },
      { id: 'guardian', startDelay: 2010, runDuration: 260, latency: 1.8 }
    ]

    schedule.forEach(({ id, startDelay, runDuration }) => {
      // Mark node RUNNING
      const t1 = setTimeout(() => {
        setActiveNodeId(id)
        setNodes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: 'RUNNING' } : n))
        )
      }, startDelay)
      replayTimersRef.current.push(t1)

      // Mark node COMPLETE (or VETOED if guardian and isVetoed is true)
      const t2 = setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) => {
            if (n.id !== id) return n
            if (id === 'guardian' && isVetoed) {
              return {
                ...n,
                status: 'VETOED',
                summary: `Deterministic check: Hard Veto Active. ${vetoReason || 'Safety cliff violation.'}`
              }
            }
            return {
              ...n,
              status: 'COMPLETE'
            }
          })
        )
      }, startDelay + runDuration)
      replayTimersRef.current.push(t2)
    })

    // End of replay stream
    const finalTimer = setTimeout(() => {
      setActiveNodeId(null)
      setIsStreaming(false)
      setTotalLatencyMs(2730)
    }, 2350)
    replayTimersRef.current.push(finalTimer)
  }, [clearTimers, isVetoed, vetoReason])

  // Connection management: Live SSE if live backend is enabled, else replay on demand
  useEffect(() => {
    if (!CorinAPI.USE_LIVE_BACKEND || typeof EventSource === 'undefined') {
      setIsLiveConnected(false)
      if (autoStart) {
        startRecordedReplay()
      }
      return () => {
        clearTimers()
      }
    }

    const sseUrl = `${CorinAPI.BASE_URL}/stream/events?patient_id=${encodeURIComponent(patientId)}`
    let es: EventSource

    try {
      es = new EventSource(sseUrl)
      eventSourceRef.current = es

      es.onopen = () => {
        setIsLiveConnected(true)
        setStreamError(null)
      }

      es.onmessage = (event) => {
        try {
          const data: SwarmStreamEvent = JSON.parse(event.data)
          if (data.type === 'agent_start') {
            setIsStreaming(true)
            setActiveNodeId(data.node_id)
            setNodes((prev) =>
              prev.map((n) => (n.id === data.node_id ? { ...n, status: 'RUNNING' } : n))
            )
          } else if (data.type === 'agent_complete' || data.type === 'guardian_verdict') {
            setNodes((prev) =>
              prev.map((n) =>
                n.id === data.node_id
                  ? {
                      ...n,
                      status: data.status || 'COMPLETE',
                      latency_ms: data.latency_ms ?? n.latency_ms,
                      summary: data.summary || n.summary
                    }
                  : n
              )
            )
          } else if (data.type === 'stream_end') {
            setActiveNodeId(null)
            setIsStreaming(false)
          }
        } catch {
          // ignore malformed frame
        }
      }

      es.onerror = () => {
        setIsLiveConnected(false)
        setIsStreaming(false)
        setStreamError('Live SSE disconnected. Switched to high-fidelity recorded trace playback.')
        es.close()
      }
    } catch {
      setIsLiveConnected(false)
    }

    return () => {
      if (es) es.close()
      clearTimers()
    }
  }, [patientId, autoStart, clearTimers, startRecordedReplay])

  return {
    nodes,
    isStreaming,
    isLiveConnected,
    activeNodeId,
    totalLatencyMs,
    streamError,
    startRecordedReplay
  }
}
