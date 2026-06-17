import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/editor/', '/settings/', '/api/'],
    },
    sitemap: 'https://proseportal.vercel.app/sitemap.xml',
  };
}
