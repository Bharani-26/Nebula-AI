import * as pdfjsLib from "pdfjs-dist";

// Configure pdf.js worker URL from CDN matching current library version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const pagesText: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => ("str" in item ? (item.str as string) : ""))
      .filter(Boolean)
      .join(" ");
    if (pageText.trim()) {
      pagesText.push(pageText.trim());
    }
  }

  return pagesText.join("\n\n");
}
