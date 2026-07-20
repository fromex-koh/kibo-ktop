import type {NextConfig} from 'next'
import releaseMetadata from './src/content/asset-versions.generated.json'

// GitHub Actions가 릴리스 커밋에 확정해 둔 버전과 현재 빌드 시각을 화면에 주입한다.
// Vercel의 얕은 git clone에서도 태그 조회 결과가 달라지지 않도록 빌드 중에는 git을 사용하지 않는다.

// 빌드 시각을 한국시간(Asia/Seoul) "2025. 10. 16. (목) 16:00" 형식으로 만든다.
const resolveBuildTime = (): string => {
    const parts = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(new Date())
    const part = (type: string): string => parts.find((p) => p.type === type)?.value ?? ''
    return `${part('year')}. ${part('month')}. ${part('day')}. (${part('weekday')}) ${part('hour')}:${part('minute')}`
}

const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_BUILD_VERSION: releaseMetadata.version,
        NEXT_PUBLIC_BUILD_TIME: resolveBuildTime(),
    },
    // 내부용 — 모든 응답에 검색 색인 차단 헤더 부착 (HTML 외 리소스까지 커버). [noindex]
    headers: async () => [
        {
            source: '/:path*',
            headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}],
        },
    ],
}

export default nextConfig
