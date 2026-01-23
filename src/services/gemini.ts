import type { AIAnalysisResult, Coordinates } from '@/types'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent'

// Enhanced prompt with confidence scoring and physical test suggestions
const ANALYSIS_PROMPT = `
You are a professional Geologist and Lapidary analyzing a rock specimen.
Return a JSON object ONLY. No markdown, no code blocks.

Your response MUST follow this exact structure:
{
  "name": "Common Name (e.g., Amethyst, Obsidian, Granite)",
  "scientificName": "Scientific/Mineralogical Classification",
  "type": "One of: Igneous, Sedimentary, Metamorphic, Mineral, or Fossil",
  "description": "A sophisticated 2-3 sentence description focusing on visual characteristics, formation, and notable features.",
  "visuals": {
    "luster": "One of: Vitreous, Adamantine, Resinous, Waxy, Greasy, Silky, Pearly, Metallic, Dull, Earthy",
    "texture": "e.g., Phaneritic, Aphanitic, Glassy, Porphyritic, Vesicular, Crystalline",
    "color": "Dominant hues observed",
    "habit": "Crystal habit if visible (e.g., Cubic, Prismatic, Botryoidal, Massive)"
  },
  "confidence": {
    "primary": {
      "name": "Your top identification",
      "probability": 0.0 to 1.0 (be honest about uncertainty)
    },
    "alternatives": [
      { "name": "Second possibility", "probability": 0.0 to 1.0 },
      { "name": "Third possibility", "probability": 0.0 to 1.0 }
    ]
  },
  "physicalTest": {
    "testName": "Name of a simple physical test to confirm identification",
    "instruction": "Step-by-step instruction the user can perform",
    "expectedResult": "What result would confirm your primary identification"
  },
  "cleavage": "Describe cleavage planes if visible (e.g., 'Perfect rhombohedral', 'None - conchoidal fracture')",
  "fracture": "Type of fracture (e.g., Conchoidal, Uneven, Splintery)",
  "hardness": 1-10 (Mohs scale estimate based on visual assessment),
  "rarityScore": 1-10 (Integer, 1=Common gravel, 10=Museum-quality gem),
  "marketTitle": "A catchy, short title for a sales listing (e.g., 'Pristine Obsidian Shard', 'Cathedral Amethyst Point')"
}

IMPORTANT:
- Be honest about confidence. If the image is unclear or multiple minerals look similar, lower the probability.
- Always provide a physical test that a layperson could perform at home.
- The alternatives array should have 1-3 entries with probabilities that sum to less than or equal to 1.0 minus the primary probability.
`

// Location-specific context to improve identification
const LOCATION_CONTEXT_PROMPT = `
Additional context - The specimen was found at these coordinates: LAT, LNG
Consider regional geology when making your identification. Some locations are known for specific minerals:
- Herkimer County, NY: Double-terminated quartz ("Herkimer Diamonds")
- Tucson, AZ area: Copper minerals (Azurite, Malachite, Chrysocolla)
- Arkansas: Quartz crystals
- Colorado: Rhodochrosite, Amazonite
- California: Jade, Tourmaline
Use this context to refine your identification if relevant.
`

function cleanBase64(base64Image: string): string {
  return base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '')
}

/**
 * Identify a rock specimen using AI with optional location context
 */
export async function identifyRockWithAI(
  base64Image: string,
  coordinates?: Coordinates
): Promise<AIAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const url = `${GEMINI_API_URL}?key=${apiKey}`
  const cleanedImage = cleanBase64(base64Image)

  // Build prompt with optional location context
  let fullPrompt = ANALYSIS_PROMPT
  if (coordinates) {
    fullPrompt += '\n\n' + LOCATION_CONTEXT_PROMPT
      .replace('LAT', coordinates.lat.toFixed(4))
      .replace('LNG', coordinates.lng.toFixed(4))
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [
          { text: fullPrompt },
          { inlineData: { mimeType: 'image/jpeg', data: cleanedImage } }
        ]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3 // Lower temperature for more consistent/accurate results
      }
    })
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('No analysis result returned')
  }

  const result = JSON.parse(text)

  // Ensure confidence object exists with defaults
  if (!result.confidence) {
    result.confidence = {
      primary: { name: result.name, probability: 0.7 },
      alternatives: []
    }
  }

  // Ensure physicalTest exists with a default
  if (!result.physicalTest) {
    result.physicalTest = {
      testName: 'Hardness Test',
      instruction: 'Try scratching the specimen with a steel knife (hardness 5.5). If it scratches, the mineral is softer than steel.',
      expectedResult: `Based on the identified hardness of ${result.hardness || 'unknown'}, observe if scratching occurs.`
    }
  }

  return result as AIAnalysisResult
}

/**
 * Get confidence level category
 */
export function getConfidenceLevel(probability: number): 'high' | 'medium' | 'low' {
  if (probability >= 0.9) return 'high'
  if (probability >= 0.7) return 'medium'
  return 'low'
}

/**
 * Format confidence as percentage string
 */
export function formatConfidence(probability: number): string {
  return `${Math.round(probability * 100)}%`
}
