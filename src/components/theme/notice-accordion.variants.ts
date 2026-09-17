// 알림 아코디언(NoticeAccordion) — "꼭 알아두세요" 처럼 제목을 눌러 안내 목록을 여닫는 회색 패널.
// 동작·접근성은 셸(ui/collapsible, radix)이 맡고 이 파일은 스타일만 갖는다.
//
// 규격(Figma "인포", 혁신성장영위기업 분류근거 모달) — 면 gray.10(surface-subtle) · 반경 8 · 여백 20 /
// 머리 줄: 알림 아이콘 20 · 간격 8 · 제목 16/24 Bold · 오른쪽 끝 화살표 20 /
// 본문: 머리 줄 아래 8 · 항목 사이 8 · 14/21 Regular gray.500(foreground-subtle).
export const noticeAccordionClassName = 'bg-surface-subtle flex w-full flex-col rounded-sm p-5'

// 머리 줄 전체가 누르는 자리다. 여백은 패널이 가지므로 버튼은 한 줄 높이만 차지한다.
// outline-ring 은 평상시에도 지정한다 — outline-color 기본값이 currentColor 라 지정하지 않으면
// 포커스 순간 글자색에서 링 색으로 번지듯 전환된다(accordion.variants 와 같은 이유). [KWCAG 6.1.2]
export const noticeAccordionTriggerClassName =
    'group/notice-accordion-trigger typo-body-xl-bold text-foreground outline-ring rounded-2xs flex w-full items-center gap-2 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

// 알림 아이콘 — 시안 icon-fill/alert(채운 원 + 느낌표). lucide 는 채움 아이콘이 없어 CircleAlert 의 원을
// 글자색으로 채우고 느낌표 선만 카드색으로 덮는다(EmptyState 와 같은 방법). 두 색이 서로 반대편이라
// 라이트·다크 모두 느낌표가 보인다.
export const noticeAccordionIconClassName =
    'text-foreground size-icon-md shrink-0 [&>circle]:fill-current [&>line]:stroke-card'

// 여닫는 화살표 — 열려 있으면 위, 닫혀 있으면 아래를 가리킨다.
export const noticeAccordionChevronClassName =
    'text-foreground size-icon-md ml-auto shrink-0 transition-transform group-data-[state=open]/notice-accordion-trigger:rotate-180 motion-reduce:transition-none'

export const noticeAccordionListClassName = 'mt-2 flex list-none flex-col gap-2'

export const noticeAccordionItemClassName = 'typo-body-l-regular text-foreground-subtle flex'
