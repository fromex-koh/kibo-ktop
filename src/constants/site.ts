// frontend-handoff 전용 사이트 식별 정보.
// OG 이미지는 디자인 작업 완료 후 handoff/og-image.png를 추가하면 같은 경로로 적용한다.
// TODO: 실제 서비스 URL 확정 후 변경한다.
export const SITE_URL = 'https://example.com'
export const SITE_NAME = 'K-TOP 개방형 기술평가 플랫폼'
export const SITE_SHORT_NAME = 'K-TOP'
export const SITE_DESCRIPTION =
    '기업의 혁신성장역량, 기술사업성, 원천기술 특성을 평가하는 개방형 기술평가 플랫폼입니다.'
export const SITE_OG_IMAGE = '/og-image.png'
export const SITE_OG_IMAGE_ALT = SITE_NAME
export const SITE_ALLOW_INDEXING = true

// 기술보증기금 대표 사이트 — 헤더·전체 메뉴의 외부 링크가 함께 쓴다.
export const KIBO_SITE_URL = 'https://www.kibo.or.kr/index.do'

// 기보 ONE 플랫폼 — 기업회원 로그인을 맡는 외부 사이트(중소벤처기업부 통합 인증).
// [프론트엔드 연동] 실제 로그인 진입 주소는 복귀 주소(redirect)·클라이언트 식별자가 붙은 형태라 백엔드에서 받는다.
// 여기 값은 화면 확인용 대표 주소다.
export const KIBO_ONE_PLATFORM_URL = 'https://www.kibo.or.kr/portal'

// 퍼블리싱 인덱스의 저장소·FE 전달용 링크 전용 설정 (Open Graph·사이트 메타데이터와 무관)
export const REPOSITORY_URL = 'https://github.com/fromex-koh/kibo-ktop'
