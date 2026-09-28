// 배포 프로젝트의 사이트 식별 정보. frontend-handoff 생성 시 handoff/site.ts로 교체된다.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kibo-ktop.vercel.app'
export const SITE_NAME = '기술평가 통합 플랫폼 퍼블리싱 가이드'
export const SITE_SHORT_NAME = '퍼블리싱 가이드'
export const SITE_DESCRIPTION =
    '기술평가 통합 플랫폼(채널계)의 프론트엔드 퍼블리싱 가이드. 웹 접근성(KWCAG 2.1)과 표준 코드 컨벤션을 준수한 마크업·컴포넌트·화면 페이지 기준을 제공합니다.'
export const SITE_OG_IMAGE = '/og-image.png'
export const SITE_OG_IMAGE_ALT = '기술평가 통합 플랫폼 퍼블리싱 가이드'
export const SITE_ALLOW_INDEXING = false

// 기술보증기금 대표 사이트 — 헤더·전체 메뉴의 외부 링크가 함께 쓴다.
export const KIBO_SITE_URL = 'https://www.kibo.or.kr/index.do'

// 기보 ONE 플랫폼 — 기업회원 로그인을 맡는 외부 사이트(중소벤처기업부 통합 인증).
// [프론트엔드 연동] 실제 로그인 진입 주소는 복귀 주소(redirect)·클라이언트 식별자가 붙은 형태라 백엔드에서 받는다.
// 여기 값은 화면 확인용 대표 주소다.
export const KIBO_ONE_PLATFORM_URL = 'https://www.kibo.or.kr/portal'

// 퍼블리싱 인덱스의 저장소·FE 전달용 링크 전용 설정 (Open Graph·사이트 메타데이터와 무관)
export const REPOSITORY_URL = process.env.NEXT_PUBLIC_REPOSITORY_URL ?? 'https://github.com/fromex-koh/kibo-ktop'
