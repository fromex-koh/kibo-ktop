// 헤더 우측 아이콘 버튼(테마 전환·전체 메뉴) — Figma 는 24px 아이콘만 두고 배경·패딩·호버 면이 없다.
// 그래서 Button 컴포넌트를 쓰지 않는다(ghost 를 써도 호버 배경과 44px 상자가 따라온다).
//
// 클릭 영역은 가상요소로 44×44 를 확보한다 — 보이는 상자는 24px 그대로라 시안과 어긋나지 않으면서
// 터치 타깃 기준을 만족한다. 아이콘 간격 20px 이면 두 영역의 중심 거리가 44px 라 서로 겹치지 않는다. [KWCAG 6.1.3]
//
// outline-ring 을 평상시에도 지정하는 이유는 button.variants.ts 와 같다 — outline-color 초깃값이
// currentColor 라, 지정하지 않으면 포커스 순간 글자색에서 ring 색으로 번지듯 전환된다. [KWCAG 6.1.2]
export const headerIconButtonClassName = [
    'relative inline-flex size-icon-lg shrink-0 cursor-pointer items-center justify-center',
    'bg-transparent p-0 text-current transition-colors',
    'outline-ring outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-4',
    "after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
    '[&_svg]:pointer-events-none [&_svg]:size-icon-lg [&_svg]:shrink-0',
].join(' ')

// 시안의 아이콘 간격 20px. 두 버튼의 44px 클릭 영역이 맞닿기만 하고 겹치지 않는 값이다.
export const headerIconGroupClassName = 'ml-auto flex items-center gap-5'
