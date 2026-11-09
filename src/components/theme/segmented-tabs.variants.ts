// 세그먼트 탭(SegmentedTabs) 스타일 — 회색 트랙 안에 같은 폭의 칸이 나란히 놓이고, 고른 칸만 흰 면이 된다.
// 예: 가격정책의 회원유형 탭(기업회원 · 기관회원).
// TabsList variant="plain" 위에 얹는다 — 기본 탭 스타일과 겹치지 않게 구조만 남긴 목록에 이 모양을 씌운다.
//
// 타이포는 트리거가 아니라 목록에 둔다 — typo-* 는 data-active: 같은 접두사를 받지 못해, 목록에 두고
// 트리거(button)가 상속받게 한다(tabs.variants.ts 의 pill 과 같은 방식). 고른 칸의 굵기만 font-bold 로 바꾼다.

// 트랙 — 회색 면(segmented-track) · 반경 8 · 안쪽 여백 4 · 칸 사이 4.
export const segmentedTabsListClassName =
    'typo-body-xl-medium bg-segmented-track inline-flex w-fit max-w-full items-stretch gap-1 rounded-sm p-1'

// 칸 — 높이 40 · 최소 폭 120(글자 길이와 무관하게 칸 폭을 맞춘다) · 반경 8 · 글자는 칸 가운데.
// 고르지 않은 칸은 회색 글자, 고른 칸은 흰 면 + 파란 굵은 글자다.
// PROJECT-STYLE: 시안의 고른 글자는 #2563cc 로 팔레트에 없는 값이라, 가장 가까운 primary-strong(blue.600)을 쓴다.
export const segmentedTabsTriggerClassName = [
    'h-control-h-sm min-w-30 flex-1 justify-center rounded-sm px-4 whitespace-nowrap',
    'text-foreground-subtle not-data-[state=active]:hover:text-foreground transition-colors motion-reduce:transition-none',
    'data-active:bg-segmented-active data-active:text-primary-strong data-active:font-bold',
    'outline-ring focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
].join(' ')
