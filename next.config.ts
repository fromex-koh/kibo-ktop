import type { NextConfig } from 'next';
import { resolveHeadVersion } from './scripts/git-info.mjs';

// 빌드 시점의 git 버전과 시각을 화면('현재 버전' 표시)에 주입한다.
// 배포 파이프라인에서 main push → 빌드가 돌면 이 값들이 자동으로 갱신된다.
// 버전 계산은 scripts/git-info.mjs 단일 소스 — 자산별 버전(compute-asset-versions.mjs)과 로직이 갈리지 않게 한다.

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
  }).formatToParts(new Date());
  const part = (type: string): string => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('year')}. ${part('month')}. ${part('day')}. (${part('weekday')}) ${part('hour')}:${part('minute')}`;
};

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_VERSION: resolveHeadVersion(),
    NEXT_PUBLIC_BUILD_TIME: resolveBuildTime(),
  },
  // 내부용 — 모든 응답에 검색 색인 차단 헤더 부착 (HTML 외 리소스까지 커버). [noindex]
  headers: async () => [
    {
      source: '/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
  ],
};

export default nextConfig;
