// 아코디언 — FAQ 처럼 제목을 눌러 답변을 펼치는 목록. 셸(ui/accordion)의 구조·동작·접근성은 radix 가
// 담당하고 이 파일은 스타일만 갖는다. 바닐라 정의는 vendor/shadcn-baseline/accordion.variants.ts 에 있다.
//
// PROJECT-STYLE: 바닐라는 구분선으로 이어 붙는 목록이지만, 시안(Figma "[알림마당] 자주 묻는 질문")은
// 질문마다 흰 카드가 하나씩이고 카드 사이가 16 이다. 그림자는 두지 않는다.
export const accordionClassName = 'flex w-full flex-col gap-4'

// PROJECT-STYLE: 카드 — 흰 면 · 라운드 16 · 여백 위아래 32 · 좌우 24. 바닐라의 항목 구분선은 쓰지 않는다.
export const accordionItemClassName = 'bg-card rounded-lg border-0 px-6 py-8'

// PROJECT-STYLE: 질문 줄 — 여백은 카드가 가지므로 트리거는 한 줄 높이만 차지한다(바닐라는 py-2.5).
// 타이포는 제목(typo-title-m-medium), 여닫는 화살표는 24(size-icon-lg)에 보조 전경색이다.
// outline-ring 은 평상시에도 지정한다 — outline-color 기본값이 currentColor 라 지정하지 않으면
// 포커스 순간 글자색에서 링 색으로 번지듯 전환된다(button.variants 와 같은 이유). [KWCAG 6.1.2]
export const accordionTriggerClassName =
    'group/accordion-trigger typo-title-m-medium text-foreground outline-ring rounded-2xs relative flex flex-1 items-start justify-between gap-4 py-0 text-left transition-colors outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid disabled:pointer-events-none disabled:text-disabled **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-icon-lg **:data-[slot=accordion-trigger-icon]:text-foreground-subtle'

export const accordionContentClassName =
    'overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up'

// PROJECT-STYLE: 답변 — 질문 줄에서 24 떨어진 자리에 구분선을 긋고 다시 24 아래에서 본문이 시작한다.
// 구분선 색은 목록 화면의 divider 와 같은 border-subtle-3(gray.100) 이다 — 시안의 divider 컴포넌트가 같다.
// 본문은 body-xl(16) · label-foreground 다(바닐라 14px/기본색). 아래 여백은 카드가 갖는다.
//
// 바닐라의 h-(--radix-accordion-content-height) 는 뺀다. 그 변수는 radix 가 '열기 직전'에 잰 높이라,
// 사용처가 본문 여백을 바꾸면 실제 내용보다 큰 값으로 상자가 고정돼 아래가 뜬다. 높이 애니메이션은
// Content 의 keyframes(0 ↔ 그 변수)가 담당하고 끝나면 높이가 auto 로 돌아오므로 안쪽 상자는 자동 높이로 둔다.
export const accordionContentBodyClassName =
    'typo-body-xl-regular text-label-foreground border-subtle-3 mt-6 border-t pt-6 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4'
