import { SeriesConfig } from './types';

export const SERIES: SeriesConfig[] = [
  {
    id: 'db',
    slug: 'dragon-ball',
    title: 'دراغون بول',
    subtitle: 'القصة الأصلية الكلاسيكية',
    image: 'https://images.unsplash.com/photo-1580477651877-1ef0c46bc659?w=600&h=400&fit=crop',
    color: 'from-orange-500 to-yellow-500',
    questionCount: 50,
  },
  {
    id: 'dbz',
    slug: 'dragon-ball-z',
    title: 'دراغون بول زد',
    subtitle: 'معارك السايان الأسطورية',
    image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=600&h=400&fit=crop', // Temporary placeholder until actual assets are verified
    color: 'from-yellow-400 to-red-500',
    questionCount: 100,
  },
  {
    id: 'dbs',
    slug: 'dragon-ball-super',
    title: 'دراغون بول سوبر',
    subtitle: 'حكام الدمار والأكوان',
    image: 'https://images.unsplash.com/photo-1506456094348-73f11da06159?w=600&h=400&fit=crop',
    color: 'from-blue-500 to-indigo-600',
    questionCount: 75,
  },
  {
    id: 'gt',
    slug: 'dragon-ball-gt',
    title: 'دراغون بول جي تي',
    subtitle: 'الرحلات الكبرى والسوبر سايان 4',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop',
    color: 'from-red-600 to-orange-600',
    questionCount: 30,
  }
];

export function getSeriesBySlug(slug: string): SeriesConfig | undefined {
  return SERIES.find((s) => s.slug === slug);
}
