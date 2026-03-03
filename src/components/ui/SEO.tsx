import { Helmet } from 'react-helmet-async'

const DEFAULT_IMAGE_ALT = 'Lithos - AI rock and mineral identifier: identify rocks from a photo'

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
const DEFAULT_TITLE = 'Lithos - AI Rock Identifier | Identify Rocks & Minerals from Photo'
const DEFAULT_DESCRIPTION = 'Free AI rock identifier: take a photo and identify rocks and minerals instantly. Get species name, rarity, and geological details. Build your collection and trade with collectors worldwide.'
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

// Pre-defined SEO configs for different views
export const SEO_CONFIGS = {
  market: {
    title: 'Rock Marketplace - Trade Specimens with Collectors Worldwide',
    description: 'Browse and trade rocks and minerals with collectors worldwide. Find rare specimens, explore trending geology finds, and expand your collection on Lithos.',
    path: '/'
  },
  collection: {
    title: 'My Rock Collection - Track & Organize Specimens',
    description: 'Manage your rock and mineral collection. Track specimens, view statistics, earn XP, and organize your geological finds with Lithos.',
    path: '/collection'
  },
  scan: {
    title: 'AI Rock Identifier - Identify Rocks & Minerals from Photo',
    description: 'Identify any rock or mineral from a photo. Free AI rock scanner: upload a picture for instant identification, rarity score, hardness, and geological details. No app download required.',
    path: '/scan'
  },
  feed: {
    title: 'Rock Discovery Feed - Trending Specimens & Rare Finds',
    description: 'Discover amazing rocks and minerals from collectors worldwide. Explore trending specimens, rare geological finds, and beautiful crystals.',
    path: '/feed'
  }
}
