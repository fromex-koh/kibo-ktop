// 사이트 전역 메타데이터 상수 — layout(메타데이터)·robots·sitemap 이 공유한다.
// 외부 URL 은 환경변수로 관리하고, 로컬 기본값을 폴백으로 둔다. [NA-001] [MD-003]

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// 저장소(GitHub 등) URL — 홈 화면 '저장소' 링크에 사용. 외부 URL 이므로 환경변수로 관리. [NA-001]
export const REPOSITORY_URL =
  process.env.NEXT_PUBLIC_REPOSITORY_URL ?? 'https://github.com/fromex-koh/kibo-ktop';

export const SITE_NAME = '기술평가 통합 플랫폼 (채널계) 퍼블리싱 가이드';

export const SITE_DESCRIPTION =
  '기술평가 통합 플랫폼(채널계)의 프론트엔드 퍼블리싱 가이드. 웹 접근성(KWCAG 2.1)과 표준 코드 컨벤션을 준수한 마크업·컴포넌트·화면 페이지 기준을 제공합니다.';
