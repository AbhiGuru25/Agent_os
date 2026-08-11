import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // We index the main entry point. 
  // IMPORTANT: We do NOT index /leads or /departments because those are private CRM routes.
  const baseUrl = 'https://agent-os-neon.vercel.app';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    }
  ];
}
