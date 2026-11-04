// 회원 유형 탭(로그인 화면) 스타일 — 기업회원 · 기관회원 중 하나를 고르는 줄이다.
// 폭에 따라 생김새가 다르다: 좁은 화면은 높이 48 의 알약 두 개, md 부터는 높이 56 의 카드 두 개(이름만).
// 글자 크기도 16 → 20 으로 커진다. 탭이 크면 PC 한 화면에 로그인 카드가 다 담기지 않아 높이를 낮게 둔다.
// 타이포 유틸(typo-*)은 반응형 variant 를 받지 못해, 이 파일에서만 text-*/font-* 를 쓴다(SHADCN.md 타이포 유틸 예외).
//
// 고른 유형은 Radix Tabs 가 data-active 로 알려 주므로 상태를 prop 으로 받지 않는다.

export const memberTypeTabListClassName = 'grid w-full grid-cols-2 items-stretch gap-2 md:gap-6'

export const memberTypeTabClassName = [
    'focus-visible:outline-ring outline-ring flex h-12 min-w-0 items-center justify-center rounded-sm border',
    'text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
    'md:h-14 md:rounded-lg md:text-xl',
    // 고르지 않은 유형 — 흰 면에 옅은 테두리. md 부터는 시안대로 테두리를 지운다.
    'bg-card border-subtle-3 text-label-foreground md:border-transparent',
    // 고른 유형 — 짙은 남색 면에 흰 글자(대비 11.26:1). 배지의 남색 짝(면·글자)을 그대로 쓴다 —
    // 팔레트 유틸로 두면 어두운 화면에서 면만 밝아지고 글자는 흰색으로 남아 읽히지 않는다[PB-06].
    'data-active:bg-badge-solid-navy data-active:border-badge-solid-navy data-active:text-badge-solid-fg',
].join(' ')
