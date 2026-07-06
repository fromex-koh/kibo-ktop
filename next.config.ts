import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 내부용 — 모든 응답에 검색 색인 차단 헤더 부착 (HTML 외 리소스까지 커버). [noindex]
  headers: async () => [
    {
      source: '/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
  ],
};

export default nextConfig;
