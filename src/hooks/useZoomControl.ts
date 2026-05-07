import { useCallback } from 'react'

/**
 * Custom hook for managing zoom control
 */
const useZoomControl = (zoomLevel: number, setZoomLevel: (level: number) => void) => {
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2)) // Max zoom 200%
  }, [setZoomLevel])

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5)) // Min zoom 50%
  }, [setZoomLevel])

  const resetZoom = useCallback(() => {
    setZoomLevel(1)
  }, [setZoomLevel])

  return {
    zoomIn,
    zoomOut,
    resetZoom
  }
}

export default useZoomControl