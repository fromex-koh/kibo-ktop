// [원본 저장소 전용] 프론트엔드 전달본(frontend-handoff)에는 포함되지 않는다 —
// scripts/build-frontend-handoff.mjs 가 이 파일과 경유 주소(app/component-guide/open-screen)를 지우고,
// 퍼블리싱 인덱스의 링크를 화면 주소로 되돌린다.

// 퍼블리싱 인덱스가 화면을 새 탭으로 열 때 거쳐 가는 주소(app/component-guide/open-screen/route.ts).
// 새 탭을 인덱스 탭과 다른 프로세스에서 시작하게 한다 — 이유는 그 파일의 주석에 적혀 있다.
export const SCREEN_OPEN_PATH = '/component-guide/open-screen'
export const SCREEN_OPEN_TARGET_PARAM = 'to'

export const toScreenOpenHref = (screenPath: string): string =>
    `${SCREEN_OPEN_PATH}?${SCREEN_OPEN_TARGET_PARAM}=${encodeURIComponent(screenPath)}`
