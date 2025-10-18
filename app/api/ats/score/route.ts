import { NextResponse } from "next/server"
import { z } from "zod"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"

// Text-based ATS scoring using Gemini via AI SDK.
// Accepts: { text: string }
// Returns: { atsScore: number, suggestions: string[] }
const BodySchema = z.object({
  text: z.string().min(30, "Resume text is too short to score"),
})

const OutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  suggestions: z.array(z.string()).min(1).max(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { text } = BodySchema.parse(body)

    // Prompt engineered for concise, ATS-aligned suggestions and a 0-100 score.
    const { object } = await generateObject({
      model: google("gemini-1.5-pro"),
      schema: OutputSchema,
      system:
        "You are an ATS resume evaluator. Score resumes on 0-100 for general ATS best practices and job-market readiness. " +
        "Return only: JSON with { score: integer 0-100, suggestions: array of clear, concise, actionable recommendations }. " +
        "Keep suggestions short (no fluff), no more than 4 items, and focus on quantification, keywords, clarity, and structure.",
      prompt:
        "Evaluate the following resume text strictly for ATS compliance, clarity, quantification of impact, and keyword coverage.\n\n" +
        "Resume Text:\n" +
        text +
        "\n\nReturn JSON only.",
    })

    const atsScore = object.score
    const suggestions = (object.suggestions || []).slice(0, 4)

    return NextResponse.json({ atsScore, suggestions })
  } catch (err: any) {
    const message = err?.message || "ATS scoring failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
