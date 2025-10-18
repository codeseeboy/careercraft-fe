import { NextResponse } from "next/server"
import { z } from "zod"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

const BodySchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { prompt } = BodySchema.parse(body)

    const response = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: prompt,
      temperature: 0.7,
    })

    return NextResponse.json({ response })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get a valid response from the AI model"
    console.error("Chat API error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
