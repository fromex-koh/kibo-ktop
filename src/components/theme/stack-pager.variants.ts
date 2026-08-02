// PROJECT-STYLE: StackPager 의 레이어 전환 스타일. 조건 변형(pager-on·stack-fallback)은 globals.css 에
// 등록돼 있고, 기준값은 stack-pager.tsx 의 STACK_PAGER_QUERY 와 한 세트다.
//
// 페이지(섹션) 쪽 클래스는 StackPager 가 아니라 각 섹션이 붙인다 — StackPager 는 children 을 그대로
// 렌더하므로 자식 className 에 손대지 않는다([SC-02] 와 같은 취지). 새 풀스크린 섹션을 만들면
// stackPageClassName 을 함께 붙이고 data-stack-page 를 단다.

export const stackPagerRootClassName = 'group/stack pager-on:h-dvh pager-on:overflow-hidden'

export const stackPageClassName = [
    // 페이저가 켜진 화면에서만 고정 레이어가 된다. 꺼진 화면은 자연 흐름 그대로 둔다.
    // overflow 는 섹션마다 달라(첫 화면은 클리핑, 긴 섹션은 안쪽 스크롤) 여기서 정하지 않는다.
    'pager-on:fixed pager-on:inset-0 pager-on:h-dvh pager-on:w-full pager-on:opacity-100',
    'pager-on:transition-[translate] pager-on:duration-600 pager-on:ease-stack pager-on:will-change-transform',
    // 활성 페이지만 화면에 남고 나머지는 위아래로 비켜선다(요소 높이가 100dvh 라 full = 100dvh).
    'pager-on:data-[stack-state=active]:z-stack-active pager-on:data-[stack-state=active]:translate-y-0 pager-on:data-[stack-state=active]:pointer-events-auto',
    'pager-on:data-[stack-state=previous]:z-stack-inactive pager-on:data-[stack-state=previous]:-translate-y-full pager-on:data-[stack-state=previous]:pointer-events-none',
    'pager-on:data-[stack-state=next]:z-stack-inactive pager-on:data-[stack-state=next]:translate-y-full pager-on:data-[stack-state=next]:pointer-events-none',
    // transition="cover" — 이전 페이지를 제자리에 두고 다음 페이지가 덮는다(전환 중 빈 배경 방지).
    // 모든 레이어를 같은 z-index 로 두어 DOM 순서가 위아래를 결정한다.
    'pager-on:group-data-[stack-transition=cover]/stack:data-[stack-state]:z-stack-inactive',
    'pager-on:group-data-[stack-transition=cover]/stack:data-[stack-state=previous]:translate-y-0',
    // 페이저가 꺼졌지만 모바일도 아닌 띠에서는 섹션의 최소 설계 높이를 유지해 콘텐츠 겹침을 막는다.
    // 480px 미만(모바일 가로)은 섹션이 밀도를 낮춰 뷰포트에 맞추므로 이 구간에서 제외한다.
    'stack-fallback:min-h-180',
    'motion-reduce:transition-none',
].join(' ')
