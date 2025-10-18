"use client"

// Local history logger that mirrors a future MinIO/DB sink.
// Swap the implementations to POST to your backend when ready.

export type HistoryRecord = {
  id: string
  type:
    | "resume-upload"
    | "resume-review"
    | "resume-score"
    | "resume-analyze-ai"
    | "roadmap-generated"
    | "job-search"
    | "job-score"
    | "job-save"
    | "job-apply"
  at: string
  meta?: Record<string, unknown>
}

const KEY = "ccai:history"

export function logHistory(entry: Omit<HistoryRecord, "id" | "at"> & { meta?: Record<string, unknown> }) {
  const all = getHistory()
  const rec: HistoryRecord = {
    ...entry,
    id: `${entry.type}-${Date.now()}`,
    at: new Date().toISOString(),
  }
  localStorage.setItem(KEY, JSON.stringify([rec, ...all]))
  return rec
}

export function getHistory(): HistoryRecord[] {
  try {
    const s = localStorage.getItem(KEY)
    return s ? (JSON.parse(s) as HistoryRecord[]) : []
  } catch {
    return []
  }
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
