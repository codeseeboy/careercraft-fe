"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  Palette,
  ChevronDown,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const fonts = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Calibri", value: "Calibri, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
]

const colors = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#1f2937",
  "#374151",
  "#4b5563",
  "#6b7280",
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#ca8a04",
  "#65a30d",
  "#16a34a",
  "#059669",
  "#0d9488",
  "#0891b2",
  "#0284c7",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#9333ea",
  "#c026d3",
  "#db2777",
]

export function RichTextEditor({ value, onChange, placeholder, className = "" }: RichTextEditorProps) {
  const [selectedFont, setSelectedFont] = useState(fonts[0])
  const [selectedColor, setSelectedColor] = useState("#000000")
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const applyFont = (font: (typeof fonts)[0]) => {
    setSelectedFont(font)
    execCommand("fontName", font.value)
  }

  const applyColor = (color: string) => {
    setSelectedColor(color)
    execCommand("foreColor", color)
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 flex-wrap">
        {/* Font Selection */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 min-w-[120px] justify-between bg-transparent">
              <Type className="h-4 w-4" />
              <span className="text-xs">{selectedFont.name}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-1">
              {fonts.map((font) => (
                <Button
                  key={font.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                  style={{ fontFamily: font.value }}
                  onClick={() => applyFont(font)}
                >
                  {font.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting */}
        <Button variant="outline" size="sm" onClick={() => execCommand("bold")} className="p-2">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => execCommand("italic")} className="p-2">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => execCommand("underline")} className="p-2">
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Color Selection */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Palette className="h-4 w-4" />
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: selectedColor }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="grid grid-cols-8 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => applyColor(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <Button variant="outline" size="sm" onClick={() => execCommand("justifyLeft")} className="p-2">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => execCommand("justifyCenter")} className="p-2">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => execCommand("justifyRight")} className="p-2">
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <Button variant="outline" size="sm" onClick={() => execCommand("insertUnorderedList")} className="p-2">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => execCommand("insertOrderedList")} className="p-2">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[120px] p-4 focus:outline-none"
        style={{ fontFamily: selectedFont.value, color: selectedColor }}
        onInput={updateContent}
        onBlur={updateContent}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
