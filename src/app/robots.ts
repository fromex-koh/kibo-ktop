import type {MetadataRoute} from 'next'

// 내부용 — 모든 크롤러 차단. sitemap 도 노출하지 않는다. [noindex]
const robots = (): MetadataRoute.Robots => ({
    rules: {
        userAgent: '*',
        disallow: '/',
    },
})

export default robots
