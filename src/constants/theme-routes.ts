// 현재 저장소에서 mainpage 테마를 쓰는 경로. handoff 생성 시 handoff/theme-routes.ts로 교체한다.
// 기업 홈·기관 홈과 컴포넌트 가이드 목업이 같은 메인 랜딩 화면이라 경로가 여러 개다.
export const THEME_ROUTE_CONFIG = {
    mainPagePaths: ['/corp/home', '/org/home', '/component-guide/main-page'],
} as const
