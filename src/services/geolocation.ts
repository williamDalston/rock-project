import type { Coordinates, ProtectedAreaResult } from '@/types'
import { checkProtectedArea } from '@/data/protectedAreas'

/**
 * Get current GPS position using browser Geolocation API
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied'))
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable'))
            break
          case error.TIMEOUT:
            reject(new Error('Location request timed out'))
            break
          default:
            reject(new Error('Unknown location error'))
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  })
}

/**
 * Check if coordinates are within a protected area
 */
export function isInProtectedArea(coords: Coordinates): ProtectedAreaResult {
  return checkProtectedArea(coords)
}

/**
 * Reverse geocode coordinates to a human-readable location name
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */
export async function formatLocationName(coords: Coordinates): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=10`,
      {
        headers: {
          'User-Agent': 'Lithos-App/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Geocoding failed')
    }

    const data = await response.json()

    // Build location string from address components
    const address = data.address || {}
    const parts: string[] = []

    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village)
    }

    if (address.state) {
      parts.push(address.state)
    }

    if (address.country && address.country !== 'United States') {
      parts.push(address.country)
    }

    return parts.length > 0 ? parts.join(', ') : `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
  } catch {
    // Fallback to coordinate string
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
  }
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coords: Coordinates): string {
  const latDir = coords.lat >= 0 ? 'N' : 'S'
  const lngDir = coords.lng >= 0 ? 'E' : 'W'

  return `${Math.abs(coords.lat).toFixed(4)}°${latDir}, ${Math.abs(coords.lng).toFixed(4)}°${lngDir}`
}

/**
 * Calculate distance between two coordinates in kilometers
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
