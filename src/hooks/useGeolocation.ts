import { useState, useEffect, useCallback } from 'react'
import { getCurrentPosition, isInProtectedArea, formatLocationName } from '@/services/geolocation'
import type { Coordinates, ProtectedAreaResult, GeolocationState } from '@/types'

interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => Promise<void>
  clearLocation: () => void
}

export function useGeolocation(autoRequest = false): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: false,
    error: null,
    protectedArea: null,
    locationName: null
  })

  const requestLocation = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const coords = await getCurrentPosition()
      const protectedArea = isInProtectedArea(coords)
      const locationName = await formatLocationName(coords)

      setState({
        coords,
        loading: false,
        error: null,
        protectedArea,
        locationName
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to get location'
      }))
    }
  }, [])

  const clearLocation = useCallback(() => {
    setState({
      coords: null,
      loading: false,
      error: null,
      protectedArea: null,
      locationName: null
    })
  }, [])

  // Auto-request location on mount if enabled
  useEffect(() => {
    if (autoRequest) {
      requestLocation()
    }
  }, [autoRequest, requestLocation])

  return {
    ...state,
    requestLocation,
    clearLocation
  }
}

/**
 * Hook to watch position changes continuously
 */
export function useGeolocationWatch(): GeolocationState & { stopWatching: () => void } {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: true,
    error: null,
    protectedArea: null,
    locationName: null
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported'
      }))
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        const protectedArea = isInProtectedArea(coords)
        const locationName = await formatLocationName(coords)

        setState({
          coords,
          loading: false,
          error: null,
          protectedArea,
          locationName
        })
      },
      (error) => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const stopWatching = useCallback(() => {
    // The cleanup function in useEffect handles this
  }, [])

  return { ...state, stopWatching }
}
