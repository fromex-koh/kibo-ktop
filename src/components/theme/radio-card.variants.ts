// 라디오 카드(RadioCard) 스타일 — Figma "[혁신성장지수 평가 Tech-Index]"의 평가모형 선택 카드.
// 겉모습은 OptionCard(링크 카드)와 같은 계열이지만, 누르면 이동하지 않고 하나를 고르는 라디오다.
// hover 와 선택이 같은 강조다 — 파란 테두리(primary) + 옅은 파란 면(blue-10). 올려 본 모습이 곧 고른 모습이라
// 무엇이 바뀔지 미리 보인다(링크 카드의 hover 강조와도 같은 색이다).
//
// 색·타이포(Figma): 배지 = solid·info(#3674da), 제목 = h2-bold(28px)·foreground(gray.900),
// 설명 = body-l-regular(14px)·foreground-subtle(gray.500).
// 테두리 rest = subtle-3(#e6e8ea) → 선택 primary(#3f7deb), 면 rest = card(white) → 선택 blue-10(#fbfdff).
// 간격(Figma): 패딩 pt-8/pb-6/px-10, 헤더↔설명 gap-3, 배지↔제목 gap-3.
//
// PROJECT-STYLE: 항상 border-2 로 두께를 고정하고 색만 전환한다(OptionCard 와 같은 이유) —
// 고를 때 1px→2px 로 두께가 바뀌면 카드가 커지며 옆 카드까지 밀린다.

// 카드 묶음 — 2단은 xl(1280)부터다. 카드 한 장에 제목 28px·설명 두 줄·148px 일러스트가 나란히 들어가야 해서
// 태블릿 폭(md~xl)에서 2단으로 쪼개면 설명이 여러 줄로 접히고 일러스트가 눌린다(OptionCard 배치와 같다).
const radioCardGroupClassName = 'grid w-full gap-6 xl:grid-cols-2'

// 카드 = 라디오 버튼 자체다. 고른 상태는 Radix 가 data-state=checked 로 주고, 프로젝트에 등록된
// data-checked 변형(shadcn/tailwind.css)이 그 선택자를 가리킨다 — chip.variants 와 같은 방식이다.
const radioCardClassName =
    'group border-subtle-3 bg-card interactive:hover:border-primary interactive:hover:bg-blue-10 data-checked:border-primary data-checked:bg-blue-10 flex h-full w-full cursor-pointer flex-col gap-2 rounded-lg border-2 px-10 pt-8 pb-6 text-left transition-colors outline-none outline-ring focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-2'
const radioCardBodyClassName = 'flex flex-1 flex-col gap-3'
// 제목 묶음과 일러스트는 md 부터 좌우로 나란히 놓고, 모바일에서는 세로로 쌓는다 — 좁은 폭에서 옆에 붙이면
// 일러스트(148 고정)가 폭을 가져가 제목·설명이 잘린다. 읽기 순서(제목 → 일러스트)는 두 배치 모두 같다[7.3.1].
const radioCardHeaderClassName = 'flex flex-col items-start gap-4 md:flex-row md:justify-between'
const radioCardHeadingGroupClassName = 'flex min-w-0 flex-col items-start gap-3'
const radioCardTitleClassName = 'typo-h2-bold text-foreground block'
// break-keep — 한국어 문장이 좁은 폭에서 단어 중간("잠재/력을")에서 쪼개지지 않게 한다.
const radioCardDescriptionClassName = 'typo-body-l-regular text-foreground-subtle block break-keep'
const radioCardIllustrationClassName = 'flex shrink-0 items-center justify-center'

export {
    radioCardGroupClassName,
    radioCardClassName,
    radioCardBodyClassName,
    radioCardHeaderClassName,
    radioCardHeadingGroupClassName,
    radioCardTitleClassName,
    radioCardDescriptionClassName,
    radioCardIllustrationClassName,
}
