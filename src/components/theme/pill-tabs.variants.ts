// 알약 전환 탭 스타일 — 둥근 트랙 안 항목 중 고른 것만 진한 면 + 흰 굵은 글자. Radix Tabs 원형(TabsPrimitive)에 얹어 쓴다.
// 쓰는 곳: 플랫폼 소개 > 탄소중립(선도중소기업확인 · K-택소노미 전환). 탭 동작 · 접근성은 Radix 가 맡고 이 파일은 스타일만 담는다.
// 모바일은 트랙이 화면 폭을 넘지 않도록 항목이 반씩 나눠 서고 글이 줄바꿈된다.
// 색은 pill-tab-* 토큰 — 다크는 초록 띠 위에서 고른 면이 묻히지 않게 트랙을 중립 회색으로 둔다.

const PILL_TAB_LIST_CLASS_NAME = 'bg-pill-tab-track flex w-full max-w-160 rounded-full p-1 md:w-fit md:max-w-none'

const PILL_TAB_TRIGGER_CLASS_NAME =
    'typo-title-m-medium text-foreground outline-ring focus-visible:outline-ring flex min-h-16 flex-1 cursor-pointer items-center justify-center rounded-full px-4 py-2 text-center break-keep transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid md:flex-none md:px-12 data-[state=active]:bg-pill-tab-active data-[state=active]:text-pill-tab-active-foreground data-[state=active]:font-bold'

export {PILL_TAB_LIST_CLASS_NAME, PILL_TAB_TRIGGER_CLASS_NAME}
