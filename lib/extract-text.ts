export async function extractTextFromFile(file: File): Promise<string> {
  const type = file.type.toLowerCase()
  if (type.includes("pdf")) {
    return await extractPdfText(file)
  }
  if (type.startsWith("text/")) {
    return await file.text()
  }

  // Graceful fallback: try to read as text
  try {
    return await file.text()
  } catch {
    return ""
  }
}

async function extractPdfText(file: File): Promise<string> {
  // Load pdfjs-dist dynamically to keep bundle smaller
  const pdfjs = await import("pdfjs-dist/build/pdf")
  // @ts-ignore
  const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry")
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

  const arrayBuf = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuf }).promise
  let text = ""
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text +=
      content.items
        .map((it: any) => ("str" in it ? (it as any).str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim() + "\n"
  }
  return text.trim()
}
