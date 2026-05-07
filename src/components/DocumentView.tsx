import React from 'react'
import LoadingSpinner from './LoadingSpinner'

interface DocumentViewProps {
  content: string | null
  isLoading: boolean
  error: string | null
  zoomLevel: number
}

const DocumentView: React.FC<DocumentViewProps> = ({ 
  content, 
  isLoading, 
  error,
  zoomLevel 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md" role="alert">
          <strong className="font-bold">오류 발생!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <p className="text-gray-500 dark:text-gray-400">문서를 선택하여 내용을 표시합니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="p-4 max-w-4xl mx-auto"
      style={{ 
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top center',
        zoom: zoomLevel
      }}
    >
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  )
}

export default DocumentView