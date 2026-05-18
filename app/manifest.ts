import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BudgetManager',
    short_name: 'Budget',
    description: 'A simple app to manage your daily budget and spending',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#10B981',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
