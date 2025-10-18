"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadResume } from "@/lib/api-client"
import { loadResumes } from "@/lib/store"
import { logHistory } from "@/lib/history-store"

export type ResumeChoice =
  | { type: "uploaded"; file: File; url?: string }
  | { type: "saved"; id: string; text: string }
  | { type: "none" }

export default function ResumeSourceSelector({
  onChange,
}: {
  onChange: (choice: ResumeChoice) => void
}) {
  const saved = loadResumes()
  const [selectedId, setSelectedId] = useState<string | undefined>(saved[0]?.id)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    try {
      setUploading(true)
      const result = await uploadResume(file)
      logHistory({
        type: "resume-upload",
        meta: { fileId: result.fileId, url: result.url, name: file.name, size: file.size },
      })
      onChange({ type: "uploaded", file, url: result.url })
    } catch (e: any) {
      alert(e?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        <Label>Use a saved CareerCraft resume</Label>
        <div className="flex gap-2">
          <Select
            value={selectedId}
            onValueChange={(v) => {
              setSelectedId(v)
              const r = saved.find((x) => x.id === v)
              if (r)
                onChange({ type: "saved", id: v, text: [r.summary, r.experience, r.education, r.skills].join("\n") })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a resume" />
            </SelectTrigger>
            <SelectContent>
              {saved.map((r) => (
                <SelectItem key={r.id} value={r.id!}>
                  {r.title || "Untitled Resume"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              const r = selectedId ? saved.find((x) => x.id === selectedId) : null
              if (!r) return
              onChange({
                type: "saved",
                id: selectedId!,
                text: [r.summary, r.experience, r.education, r.skills].join("\n"),
              })
            }}
          >
            Use
          </Button>
        </div>
        {saved.length === 0 && <p className="text-xs text-muted-foreground">No saved resumes found.</p>}
      </div>

      <div className="grid gap-2">
        <Label>Or upload a PDF</Label>
        <Input
          ref={fileRef}
          type="file"
          accept=".pdf"
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (!f) return
            await handleUpload(f)
          }}
          disabled={uploading}
        />
        <p className="text-xs text-muted-foreground">We upload securely to your backend and use its URL for scoring.</p>
      </div>
    </div>
  )
}
