import { MetadataRoute } from 'next';
import { SERIES } from '@/lib/series';
import { siteUrl } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/series',
    '/quiz/leaderboard'
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  const seriesRoutes = SERIES.map((series) => ({
    url: `${siteUrl}/series/${series.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...seriesRoutes];
}
