import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/leads/', '/departments/', '/proposals/', '/api/'], // Protect CRM routes
    },
    sitemap: 'https://agent-os-neon.vercel.app/sitemap.xml',
  };
}
