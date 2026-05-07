import * as mammoth from 'mammoth'

/**
 * Convert a DOCX file to HTML
 */
export async function docxToHtml(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  return result.value
}