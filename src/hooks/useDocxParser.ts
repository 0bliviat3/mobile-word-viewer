import { useState, useCallback } from 'react'
import * as mammoth from 'mammoth'
import { DocxParseResult } from '../types/docx-types'

/**
 * Custom hook for parsing DOCX files using mammoth.js
 */
const useDocxParser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseDocxFile = useCallback(async (file: File): Promise<DocxParseResult> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate file
      if (!file) {
        throw new Error('파일을 선택해주세요.')
      }
      
      if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        throw new Error('유효한 .docx 파일을 선택해주세요.')
      }
      
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('파일 크기는 50MB를 초과할 수 없습니다.')
      }
      
      // Use mammoth.js to convert DOCX to HTML
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      
      // Extract metadata from the document - mammoth.js doesn't expose metadata in this way
      const metadata = {
        title: undefined,
        author: undefined,
        pageCount: undefined
      }
      
      // Process messages in the document
      const messages = result.messages || []
      
      // Process images in the document
      const images = new Map<string, string>()
      messages.forEach(message => {
        if (message.type === 'warning') {
          // Handle warning messages if needed
        }
      })
      
      return {
        html: result.value,
        messages: messages,
        images,
        metadata
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '문서를 처리하는 중 알 수 없는 오류가 발생했습니다.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    parseDocxFile,
    isLoading,
    error
  }
}

export default useDocxParser