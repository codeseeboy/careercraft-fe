"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface AdvancedTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  enableAI?: boolean
}

export function AdvancedTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className = "",
  enableAI = false,
}: AdvancedTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFormat = (command: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let formattedText = selectedText

    switch (command) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      case "list":
        formattedText = selectedText
          .split("\n")
          .map((line) => `• ${line}`)
          .join("\n")
        break
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end)
    onChange(newValue)

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + formattedText.length)
    }, 0)
  }

  return (
    <div className={`border rounded-lg ${isFocused ? "ring-2 ring-blue-500" : ""} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("underline")}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("list")} className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="border-0 focus:ring-0 resize-none"
        rows={6}
      />
    </div>
  )
}
