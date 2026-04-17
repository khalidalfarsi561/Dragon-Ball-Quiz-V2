import { SeriesConfig } from './types';

export const SERIES: SeriesConfig[] = [
  {
    id: 'db',
    slug: 'dragon-ball',
    title: 'دراغون بول',
    subtitle: 'القصة الأصلية الكلاسيكية',
    image: 'https://picsum.photos/seed/dragonball/600/400',
    color: 'from-orange-500 to-yellow-500',
    questionCount: 50,
    difficulty: 'easy',
  },
  {
    id: 'dbz',
    slug: 'dragon-ball-z',
    title: 'دراغون بول زد',
    subtitle: 'معارك السايان الأسطورية',
    image: 'https://picsum.photos/seed/dragonballz/600/400',
    color: 'from-yellow-400 to-red-500',
    questionCount: 100,
    difficulty: 'medium',
  },
  {
    id: 'dbs',
    slug: 'dragon-ball-super',
    title: 'دراغون بول سوبر',
    subtitle: 'حكام الدمار والأكوان',
    image: 'https://picsum.photos/seed/dragonballsuper/600/400',
    color: 'from-blue-500 to-indigo-600',
    questionCount: 75,
    difficulty: 'hard',
  },
  {
    id: 'gt',
    slug: 'dragon-ball-gt',
    title: 'دراغون بول جي تي',
    subtitle: 'الرحلات الكبرى والسوبر سايان 4',
    image: 'https://picsum.photos/seed/dragonballgt/600/400',
    color: 'from-red-600 to-orange-600',
    questionCount: 30,
    difficulty: 'medium',
  },
  {
    id: 'db-movies',
    slug: 'dragon-ball-movies',
    title: 'أفلام دراغون بول',
    subtitle: 'أقوى الخصوم والتحولات الأسطورية',
    image: 'https://picsum.photos/seed/dragonballmovies/600/400',
    color: 'from-purple-600 via-pink-600 to-red-600',
    questionCount: 40,
    difficulty: 'legendary',
  }
];

export function getSeriesBySlug(slug: string): SeriesConfig | undefined {
  return SERIES.find((s) => s.slug === slug);
}
