// next-themes 의 storageKey 로 쓰는 localStorage 키. [MD-010]

export const THEME_STORAGE_KEY = 'theme'

// 스킨 테마 3종 중 메인페이지 전용 스킨(tokens.css 의 .mainpage 블록)과 강제 적용 라우트.
// light/dark 와 같은 방식(html 클래스)으로 적용되도록 theme-provider 가 이 라우트에서 테마를 강제한다.
export const MAIN_PAGE_THEME = 'mainpage'
export const MAIN_PAGE_PATH = '/main-page'
