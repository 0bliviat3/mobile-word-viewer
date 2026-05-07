import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">문서를 불러오는 중...</p>
    </div>
  )
}

export default LoadingSpinner