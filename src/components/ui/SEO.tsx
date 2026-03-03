import { Helmet } from 'react-helmet-async'

const DEFAULT_IMAGE_ALT = 'Free rock identifier – identify rocks and minerals from a photo with AI'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  path?: string
  type?: 'website' | 'article' | 'product'
  rockName?: string
  rockType?: string
}

const BASE_URL = 'https://www.lithoshub.com'
const DEFAULT_TITLE = 'Free Rock Identifier – Identify Rocks & Minerals from Photo with AI'
const DEFAULT_DESCRIPTION = 'Identify any rock or mineral from a photo in seconds. Free AI rock identifier: take a picture for instant name, rarity, hardness & geology. No app download—works in browser. Collect and trade specimens worldwide.'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  path,
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

  // Dynamic canonical URL based on current page
  const canonicalUrl = path ? `${BASE_URL}${path}` : `${BASE_URL}${window.location.pathname}`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* BreadcrumbList structured data */}
      {path && path !== '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: BASE_URL
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: title || 'Page',
                item: canonicalUrl
              }
            ]
          })}
        </script>
      )}

      {/* HowTo schema on scan page for "how to identify a rock" queries */}
      {path === '/scan' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Identify a Rock or Mineral from a Photo',
            description: 'Use Lithos free rock identifier to identify any rock or mineral from a photo in seconds. No app download.',
            url: `${BASE_URL}/scan`,
            step: [
              { '@type': 'HowToStep', name: 'Open the rock identifier', text: 'Go to Lithos and tap Identify or open the scan page.', url: `${BASE_URL}/scan` },
              { '@type': 'HowToStep', name: 'Take or upload a photo', text: 'Take a clear photo of your rock or mineral, or upload one from your device.' },
              { '@type': 'HowToStep', name: 'Get your identification', text: 'The AI shows the species name, scientific name, rarity, hardness, and other geological properties.' }
            ]
          })}
        </script>
      )}

      {/* Rock-specific structured data */}
      {rockName && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: rockName,
            description: pageDescription,
            image: image,
            url: canonicalUrl,
            category: rockType || 'Geological Specimen',
            brand: {
              '@type': 'Organization',
              name: 'Lithos',
              url: BASE_URL
            },
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              price: '0',
              priceCurrency: 'USD'
            }
          })}
        </script>
      )}
    </Helmet>
  )
}

// Pre-defined SEO configs for different views (keyword-rich for organic traffic)
export const SEO_CONFIGS = {
  market: {
    title: 'Free Rock Identifier & Marketplace – Identify & Trade Rocks from Photo',
    description: 'Identify rocks and minerals from a photo with AI, then browse and trade specimens with collectors worldwide. Free rock identifier, rare finds, and trending geology on Lithos.',
    path: '/'
  },
  collection: {
    title: 'My Rock Collection – Track & Organize Your Specimens',
    description: 'Manage your rock and mineral collection. Track specimens you identified from photos, view stats, earn XP, and organize your geological finds. Free on Lithos.',
    path: '/collection'
  },
  scan: {
    title: 'Identify Rocks from Photo – Free AI Rock & Mineral Identifier',
    description: 'Identify any rock or mineral from a photo in seconds. Free AI rock identifier: upload or take a picture for instant name, rarity, hardness, and geological details. No app download—works in browser.',
    path: '/scan'
  },
  feed: {
    title: 'Rock Discovery Feed – Trending Specimens & Rare Finds',
    description: 'Discover rocks and minerals from collectors worldwide. Explore trending specimens, rare geological finds, and crystals. Identify yours with our free rock identifier.',
    path: '/feed'
  }
}
