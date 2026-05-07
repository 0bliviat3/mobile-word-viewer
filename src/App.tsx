import React, { useState, useEffect } from 'react'
import FileSelector from './components/FileSelector'
import DocumentView from './components/DocumentView'
import Toolbar from './components/Toolbar'
import useDocxParser from './hooks/useDocxParser'
import useFileAccess from './hooks/useFileAccess'
import useZoomControl from './hooks/useZoomControl'
import LoadingSpinner from './components/LoadingSpinner'
// import ErrorBoundary from './components/ErrorBoundary'

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentContent, setDocumentContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  
  const { parseDocxFile, isLoading, error } = useDocxParser()
  const { readFile } = useFileAccess()
  const { zoomIn, zoomOut, resetZoom } = useZoomControl(zoomLevel, setZoomLevel)

  // Handle file selection and parsing
  const handleFileSelected = async (file: File) => {
    setSelectedFile(file)
    setFileName(file.name)
    setDocumentContent(null)
    
    if (file) {
      try {
        // Parse the DOCX file
        const result = await parseDocxFile(file)
        setDocumentContent(result.html)
      } catch (err) {
        console.error('Failed to parse document:', err)
      }
    }
  }

  // Reset when no file is selected
  useEffect(() => {
    if (!selectedFile) {
      setDocumentContent(null)
      setFileName('')
    }
  }, [selectedFile])

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Toolbar 
        fileName={fileName} 
        onFileSelect={() => document.getElementById('file-input')?.click()}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        zoomLevel={zoomLevel}
      />
      
      <div className="flex-1 overflow-auto">
        {selectedFile ? (
          <DocumentView 
            content={documentContent} 
            isLoading={isLoading}
            error={error}
            zoomLevel={zoomLevel}
          />
        ) : (
          <FileSelector 
            onFileSelected={handleFileSelected}
          />
        )}
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

export default App