import React, { useRef } from 'react'

interface FileSelectorProps {
  onFileSelected: (file: File) => void
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      onFileSelected(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        onFileSelected(file)
      }
    }
  }

  return (
    <div 
      className="flex flex-col items-center justify-center h-full p-4 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Word 문서 열기</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">drag & drop 또는 클릭하여 .docx 파일 선택</p>
      </div>

      <input
        id="file-input"
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        파일 선택
      </button>
      
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        지원되는 형식: .docx (최대 50MB)
      </p>
    </div>
  )
}

export default FileSelector