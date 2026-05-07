import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 2h13.856c1.584 0 2.532-.626 2.532-2.016v-6.548a2.532 2.532 0 00-2.532-2.016H15.172c-.96 0-1.79.626-1.79 2.016v6.548a2.532 2.532 0 002.532 2.016zm-10.287-5.498h9.021" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">오류 발생</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            문서를 불러오는 중 오류가 발생했습니다.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary