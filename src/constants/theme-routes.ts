// mainpage 테마(메인 랜딩 스킨)를 적용할 경로 목록. ThemeProvider 가 현재 경로를 이 목록과 비교해,
// 들어 있으면 mainpage 로 고정하고 그 밖의 화면은 기본 테마를 쓴다. 목록에 없는 경로에는 스킨이 붙지 않는다.
//
// 전달 시점에는 같은 메인 랜딩 화면이 기업 홈·기관 홈 두 경로에 있고, 컴포넌트 가이드의 목업도 같은 화면이다.
// 서비스에서 이 화면을 루트('/')에도 두면 '/' 를 목록에 추가한다.
export const THEME_ROUTE_CONFIG = {
    mainPagePaths: ['/corp/home', '/org/home', '/component-guide/main-page'],
} as const
