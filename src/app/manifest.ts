import type {MetadataRoute} from 'next'
import {SITE_DESCRIPTION, SITE_NAME} from '@/constants/site'

// PWA 매니페스트. background_color/theme_color 는 매니페스트 규격상 실제 색상값이라 CSS 변수 불가.
const manifest = (): MetadataRoute.Manifest => ({
    name: SITE_NAME,
    short_name: '퍼블리싱 가이드',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#256ef4',
    icons: [
        {src: '/icon-192.png', sizes: '192x192', type: 'image/png'},
        {src: '/icon-512.png', sizes: '512x512', type: 'image/png'},
    ],
})

export default manifest
