// 옵션 카드(OptionCard) 스타일 — Figma "평가 모형 선택 카드" 반영. 여러 선택지(평가 모형 등) 중 하나로
// 진입하는 링크 카드. 기본은 회색 테두리(subtle-3)·흰 배경이고, hover/포커스 시 파란 테두리(primary)+
// 옅은 파란 배경(blue-10)으로 강조되며 우하단 화살표가 원형 primary 버튼으로 바뀐다(별도 variant 없이 상태로만 구분).
//
// 색·타이포(Figma): 배지 = solid·info(#3674da), 제목 = h4-bold(24px)·foreground(gray.900),
// 부제 = body-xl-medium(16px)·foreground, 설명 = body-l-regular(14px)·foreground-subtle(gray.500).
// 테두리 rest = subtle-3(#e6e8ea) → hover primary(#3f7deb), 배경 rest = card(white) → hover blue-10(#fbfdff).
// 전부 기존 토큰이라 커스텀 색·arbitrary value 가 없다([PB-04]/[SC-01]).
// 간격(Figma): 패딩 pt-8/pb-6/px-10, 내용↔화살표 gap-2, 제목블록 gap-5, 배지↔제목 gap-3, 제목↔부제 0.

// 카드 루트 — 전체가 클릭 영역인 링크. group 으로 자식(화살표)의 hover/focus 상태를 함께 제어한다.
// PROJECT-STYLE: 항상 border-2 로 두께를 고정하고 색만 전환한다(rest subtle-3 → hover/focus primary).
// hover 시 1px→2px 로 두께가 바뀌면 레이아웃 시프트가 나므로, TabCard 와 같은 방식으로 두께를 고정한다.
const optionCardClassName =
    'group border-subtle-3 bg-card hover:border-primary hover:bg-blue-10 focus-visible:border-primary focus-visible:bg-blue-10 flex h-full w-full flex-col gap-2 rounded-lg border-2 px-10 pt-8 pb-6 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-2'
const optionCardBodyClassName = 'flex flex-1 flex-col gap-5'
const optionCardHeaderClassName = 'flex items-start justify-between gap-4'
const optionCardHeadingGroupClassName = 'flex min-w-0 flex-col gap-3'
const optionCardBadgeClassName = 'flex'
const optionCardTitleGroupClassName = 'flex min-w-0 flex-col'
const optionCardTitleClassName = 'typo-h4-bold text-foreground'
const optionCardSubtitleClassName = 'typo-body-xl-medium text-foreground'
const optionCardIllustrationClassName = 'flex shrink-0 items-center justify-center'
const optionCardDescriptionClassName = 'typo-body-l-regular text-foreground-subtle'
// 우하단 화살표 — rest 는 아이콘만, 강조 시 원형 primary 버튼 + 흰 아이콘. 카드가 링크라 장식(aria-hidden)이다.
const optionCardArrowClassName =
    'text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:text-primary-foreground mt-auto flex size-8 shrink-0 items-center justify-center self-end rounded-full transition-colors'
const optionCardArrowIconClassName = 'size-5'

export {
    optionCardClassName,
    optionCardBodyClassName,
    optionCardHeaderClassName,
    optionCardHeadingGroupClassName,
    optionCardBadgeClassName,
    optionCardTitleGroupClassName,
    optionCardTitleClassName,
    optionCardSubtitleClassName,
    optionCardIllustrationClassName,
    optionCardDescriptionClassName,
    optionCardArrowClassName,
    optionCardArrowIconClassName,
}
