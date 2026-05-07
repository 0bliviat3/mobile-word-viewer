/**
 * Types for DOCX parsing results
 */

export interface DocxParseResult {
  html: string
  messages: MammothMessage[]
  images: Map<string, string>
  metadata: {
    title?: string
    author?: string
    pageCount?: number
  }
}

export interface MammothMessage {
  type: 'info' | 'warning' | 'error'
  message: string
  range?: {
    start: number
    end: number
  }
}

export interface DocxMetadata {
  title?: string
  author?: string
  pageCount?: number
}