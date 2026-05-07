import { useCallback } from 'react'

/**
 * Custom hook for file access operations
 */
const useFileAccess = () => {
  const readFile = useCallback((file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
      reader.onerror = (e) => reject(new Error('파일 읽기 실패'))
      reader.readAsArrayBuffer(file)
    })
  }, [])

  return {
    readFile
  }
}

export default useFileAccess