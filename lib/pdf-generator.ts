import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export interface PDFOptions {
  format: "A4" | "Letter"
  orientation: "portrait" | "landscape"
  quality: number
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export class ResumeePDFGenerator {
  private static defaultOptions: PDFOptions = {
    format: "A4",
    orientation: "portrait",
    quality: 1.0,
    margins: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  }

  // Helper to temporarily replace oklch colors with hex values
  private static preprocessElement(element: HTMLElement): () => void {
    const elementsWithOklch: Array<{ element: HTMLElement; originalColor: string }> = [];
    
    // Convert oklch colors in the element and its children
    const processNode = (node: HTMLElement) => {
      const computedStyle = getComputedStyle(node);
      const bgColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      
      // Check for oklch in background color
      if (bgColor && bgColor.includes('oklch')) {
        elementsWithOklch.push({ element: node, originalColor: node.style.backgroundColor });
        node.style.backgroundColor = '#ffffff'; // Default fallback
      }
      
      // Check for oklch in text color
      if (color && color.includes('oklch')) {
        elementsWithOklch.push({ element: node, originalColor: node.style.color });
        node.style.color = '#000000'; // Default fallback
      }
      
      // Process child elements
      Array.from(node.children).forEach(child => {
        if (child instanceof HTMLElement) {
          processNode(child);
        }
      });
    };
    
    // Start processing from the root element
    processNode(element);
    
    // Return function to restore original colors
    return () => {
      elementsWithOklch.forEach(({ element, originalColor }) => {
        if (originalColor.includes('backgroundColor')) {
          element.style.backgroundColor = originalColor;
        } else {
          element.style.color = originalColor;
        }
      });
    };
  }

  static async generatePDF(
    element: HTMLElement,
    filename = "resume.pdf",
    options: Partial<PDFOptions> = {},
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options }

    try {
      // Create a clone of the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      document.body.appendChild(clonedElement);
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      
      // Apply fallback styles before rendering
      const restoreStyles = this.preprocessElement(clonedElement);
      
      // Create high-quality canvas from HTML element
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // High DPI for crisp text
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      })
      
      // Restore original styles
      restoreStyles();
      
      // Remove the cloned element
      document.body.removeChild(clonedElement);

      // Calculate dimensions
      const imgWidth = opts.format === "A4" ? 210 : 216 // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF({
        orientation: opts.orientation,
        unit: "mm",
        format: opts.format.toLowerCase() as string,
      })

      // Add image to PDF
      const imgData = canvas.toDataURL("image/png", opts.quality)
      pdf.addImage(
        imgData,
        "PNG",
        opts.margins.left,
        opts.margins.top,
        imgWidth - opts.margins.left - opts.margins.right,
        imgHeight - opts.margins.top - opts.margins.bottom,
      )

      // Save the PDF
      pdf.save(filename)
    } catch (error) {
      console.error("PDF generation failed:", error)
      throw new Error("Failed to generate PDF. Please try again.")
    }
  }
}
