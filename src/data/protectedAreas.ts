import type { Coordinates, ProtectedAreaResult } from '@/types'

// Simplified bounding boxes for major US National Parks
// In production, this would be replaced with proper GeoJSON polygons
interface ProtectedArea {
  name: string
  type: 'national_park' | 'national_monument' | 'wilderness'
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export const PROTECTED_AREAS: ProtectedArea[] = [
  // Major National Parks
  {
    name: 'Yellowstone National Park',
    type: 'national_park',
    bounds: { north: 45.11, south: 44.13, east: -109.82, west: -111.15 }
  },
  {
    name: 'Yosemite National Park',
    type: 'national_park',
    bounds: { north: 38.18, south: 37.49, east: -119.20, west: -119.88 }
  },
  {
    name: 'Grand Canyon National Park',
    type: 'national_park',
    bounds: { north: 36.45, south: 35.95, east: -111.68, west: -114.00 }
  },
  {
    name: 'Zion National Park',
    type: 'national_park',
    bounds: { north: 37.51, south: 37.12, east: -112.87, west: -113.24 }
  },
  {
    name: 'Rocky Mountain National Park',
    type: 'national_park',
    bounds: { north: 40.55, south: 40.16, east: -105.49, west: -105.91 }
  },
  {
    name: 'Grand Teton National Park',
    type: 'national_park',
    bounds: { north: 44.00, south: 43.45, east: -110.40, west: -110.90 }
  },
  {
    name: 'Glacier National Park',
    type: 'national_park',
    bounds: { north: 49.00, south: 48.23, east: -113.22, west: -114.50 }
  },
  {
    name: 'Arches National Park',
    type: 'national_park',
    bounds: { north: 38.86, south: 38.57, east: -109.51, west: -109.72 }
  },
  {
    name: 'Bryce Canyon National Park',
    type: 'national_park',
    bounds: { north: 37.70, south: 37.43, east: -112.06, west: -112.30 }
  },
  {
    name: 'Joshua Tree National Park',
    type: 'national_park',
    bounds: { north: 34.13, south: 33.66, east: -115.42, west: -116.39 }
  },
  {
    name: 'Death Valley National Park',
    type: 'national_park',
    bounds: { north: 37.44, south: 35.47, east: -116.15, west: -117.68 }
  },
  {
    name: 'Sequoia National Park',
    type: 'national_park',
    bounds: { north: 36.68, south: 36.34, east: -118.35, west: -118.92 }
  },
  {
    name: 'Acadia National Park',
    type: 'national_park',
    bounds: { north: 44.41, south: 44.21, east: -68.16, west: -68.43 }
  },
  {
    name: 'Great Smoky Mountains National Park',
    type: 'national_park',
    bounds: { north: 35.79, south: 35.42, east: -83.07, west: -83.94 }
  },
  {
    name: 'Olympic National Park',
    type: 'national_park',
    bounds: { north: 48.07, south: 47.41, east: -123.03, west: -124.71 }
  },
  {
    name: 'Mount Rainier National Park',
    type: 'national_park',
    bounds: { north: 47.08, south: 46.73, east: -121.47, west: -121.97 }
  },
  {
    name: 'Crater Lake National Park',
    type: 'national_park',
    bounds: { north: 43.06, south: 42.77, east: -121.99, west: -122.26 }
  },
  {
    name: 'Badlands National Park',
    type: 'national_park',
    bounds: { north: 43.93, south: 43.46, east: -101.90, west: -102.52 }
  },
  {
    name: 'Petrified Forest National Park',
    type: 'national_park',
    bounds: { north: 35.10, south: 34.76, east: -109.52, west: -109.93 }
  },
  {
    name: 'Carlsbad Caverns National Park',
    type: 'national_park',
    bounds: { north: 32.28, south: 32.07, east: -104.38, west: -104.58 }
  },
  // National Monuments (select few)
  {
    name: 'Devils Tower National Monument',
    type: 'national_monument',
    bounds: { north: 44.60, south: 44.58, east: -104.69, west: -104.72 }
  },
  {
    name: 'Fossil Butte National Monument',
    type: 'national_monument',
    bounds: { north: 41.88, south: 41.80, east: -110.73, west: -110.82 }
  }
]

/**
 * Check if coordinates fall within a protected area
 */
export function checkProtectedArea(coords: Coordinates): ProtectedAreaResult {
  for (const area of PROTECTED_AREAS) {
    const { bounds } = area

    if (
      coords.lat <= bounds.north &&
      coords.lat >= bounds.south &&
      coords.lng >= bounds.west &&
      coords.lng <= bounds.east
    ) {
      return {
        isProtected: true,
        areaName: area.name,
        areaType: area.type
      }
    }
  }

  return { isProtected: false }
}

/**
 * Get a human-readable warning message for protected areas
 */
export function getProtectedAreaMessage(result: ProtectedAreaResult): string {
  if (!result.isProtected) return ''

  const typeLabel = result.areaType === 'national_park'
    ? 'National Park'
    : result.areaType === 'national_monument'
    ? 'National Monument'
    : 'Wilderness Area'

  return `You are in ${result.areaName}. Collection of rocks, minerals, and fossils is prohibited in ${typeLabel}s under federal law.`
}
