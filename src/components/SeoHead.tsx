import React, { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    category?: string;
  };
  breadcrumbs?: Array<{ name: string; path: string }>;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath = '/',
  ogImage = '/pwa-512x512.png',
  ogType = 'website',
  noIndex = false,
  article,
  breadcrumbs
}) => {
  useEffect(() => {
    // 1. Dynamic Page Title
    const formattedTitle = title.includes('CryptoPacket') ? title : `${title} — CryptoPacket`;
    document.title = formattedTitle;

    // Helper to safely set or update a meta tag by selector
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to safely set link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Calculate Canonical URL (resolve fully with host or fallback)
    const rawOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://cryptopacket.com';
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const fullCanonicalUrl = `${rawOrigin}${cleanPath}`;
    const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${rawOrigin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

    // 2. Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Robots
    const robotsDirective = noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsDirective);

    // 4. Canonical URL
    setLinkTag('canonical', fullCanonicalUrl);

    // 5. OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullCanonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullImageUrl);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'CryptoPacket');

    // 6. Twitter / X Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullImageUrl);

    // 7. Schema.org JSON-LD Structured Data
    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CryptoPacket',
        url: rawOrigin,
        description: 'Independent community platform for verified crypto red packets.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${rawOrigin}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CryptoPacket',
        url: rawOrigin,
        logo: `${rawOrigin}/pwa-512x512.png`
      }
    ];

    if (ogType === 'article' && article) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: [fullImageUrl],
        datePublished: article.publishedTime || new Date().toISOString(),
        dateModified: article.modifiedTime || article.publishedTime || new Date().toISOString(),
        articleSection: article.category || 'Crypto Red Packets',
        publisher: {
          '@type': 'Organization',
          name: 'CryptoPacket',
          logo: {
            '@type': 'ImageObject',
            url: `${rawOrigin}/pwa-512x512.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullCanonicalUrl
        }
      });
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((bc, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: bc.name,
          item: `${rawOrigin}${bc.path.startsWith('/') ? bc.path : `/${bc.path}`}`
        }))
      });
    }

    let scriptElement = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'schema-jsonld';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemas);
  }, [title, description, canonicalPath, ogImage, ogType, noIndex, article, breadcrumbs]);

  return null;
};
