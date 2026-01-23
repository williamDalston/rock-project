import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  rockName?: string
  rockType?: string
}

const BASE_URL = 'https://www.lithoshub.com'
const DEFAULT_TITLE = 'Lithos - AI Rock & Mineral Identification'
const DEFAULT_DESCRIPTION = 'Identify rocks and minerals instantly with AI. Build your geological collection, trade specimens with collectors worldwide.'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = 'website',
  rockName,
  rockType
}: SEOProps) {
  // Generate page-specific title
  const pageTitle = title
    ? `${title} | Lithos`
    : rockName
    ? `${rockName}${rockType ? ` (${rockType})` : ''} | Lithos`
    : DEFAULT_TITLE

  // Generate rock-specific description if viewing a rock
  const pageDescription = rockName
    ? `View ${rockName}${rockType ? `, a ${rockType.toLowerCase()}` : ''} specimen on Lithos. Trade with collectors worldwide.`
    : description

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />

      {/* Rock-specific structured data */}
      {rockName && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: rockName,
            description: pageDescription,
            image: image,
            category: rockType || 'Geological Specimen',
            brand: {
              '@type': 'Organization',
              name: 'Lithos'
            }
          })}
        </script>
      )}
    </Helmet>
  )
}

// Pre-defined SEO configs for different views
export const SEO_CONFIGS = {
  market: {
    title: 'Rock Marketplace',
    description: 'Browse and trade rocks and minerals with collectors worldwide. Find rare specimens and expand your collection.'
  },
  collection: {
    title: 'My Collection',
    description: 'Manage your rock and mineral collection. Track specimens, view statistics, and organize your geological finds.'
  },
  scan: {
    title: 'AI Rock Scanner',
    description: 'Identify rocks and minerals instantly using AI. Take a photo and get detailed geological information.'
  },
  feed: {
    title: 'Rock Discovery Feed',
    description: 'Discover amazing rocks and minerals from collectors worldwide. Explore trending specimens and rare finds.'
  }
}
