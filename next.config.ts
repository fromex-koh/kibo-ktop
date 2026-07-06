import type { NextConfig } from 'next';
import { execSync } from 'node:child_process';

// 빌드 시점의 git 버전과 시각을 화면('현재 버전' 표시)에 주입한다.
// 배포 파이프라인에서 main push → 빌드가 돌면 이 값들이 자동으로 갱신된다.
// 태그가 있으면 최신 태그(vX.Y.Z), 없으면 short commit SHA 를 버전으로 쓴다.
const resolveBuildVersion = (): string => {
  try {
    return execSync('git describe --tags --always', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
};

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
    NEXT_PUBLIC_BUILD_VERSION: resolveBuildVersion(),
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
