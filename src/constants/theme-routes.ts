// 현재 저장소에서 mainpage 테마를 쓰는 경로. handoff 생성 시 handoff/theme-routes.ts로 교체한다.
// 기업 홈·기관 홈과 컴포넌트 가이드 목업이 같은 메인 랜딩 화면이라 경로가 여러 개다.
// 전체메뉴 화면도 같은 화면 위에 메뉴만 얹은 것이라 같은 테마를 쓴다 — 빠지면 그 화면만 기본 테마로 떨어진다.
export const THEME_ROUTE_CONFIG = {
    mainPagePaths: ['/corp/home', '/org/home', '/corp/full-menu', '/org/full-menu', '/component-guide/main-page'],
} as const
