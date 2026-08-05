import type {MetadataRoute} from 'next'
import {SITE_ALLOW_INDEXING} from '@/constants/publishing-guide'

const robots = (): MetadataRoute.Robots => ({
    rules: {
        userAgent: '*',
        ...(SITE_ALLOW_INDEXING ? {allow: '/'} : {disallow: '/'}),
    },
})

export default robots
