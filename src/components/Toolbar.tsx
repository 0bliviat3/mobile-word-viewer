import React from 'react'

interface ToolbarProps {
  fileName: string
  onFileSelect: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  zoomLevel: number
}

const Toolbar: React.FC<ToolbarProps> = ({ fileName, onFileSelect, onZoomIn, onZoomOut, onResetZoom, zoomLevel }) => {
  return (
    <div className="flex items-center justify-between h-12 px-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
          {fileName || '선택된 문서 없음'}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={onFileSelect}
          className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="파일 선택"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          onClick={onZoomIn}
          className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="확대"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          onClick={onZoomOut}
          className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="축소"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toolbar