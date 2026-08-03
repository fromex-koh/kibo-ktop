import {cn} from '@/lib/utils'
import {buttonVariants} from '@/components/theme/button.variants'

// 헤더 우측 아이콘 버튼(테마 전환·전체 메뉴) — 24px 아이콘만 두고 배경·패딩·호버 면은 만들지 않는다.
// 이 규칙(배경 없음 · 상자 = 아이콘 크기 · hover 는 아이콘 색만)은 Button 의 plain variant 가 공통으로
// 관리한다. hover 색은 모든 테마에서 모노톤 시맨틱 icon-interactive-hover 다 — 라이트는 기본 전경색과
// 충분히 구분되는 gray.300, 다크·메인페이지는 gray.200 을 토큰이 공급한다.
//
// 눌리는 범위는 보이는 24px 상자 그대로다. 최소 타깃 크기 수치는 강제하지 않으며, 인접 버튼끼리
// 겹치지 않도록 간격만 확보한다(아래 group 의 gap-5). [KWCAG 6.1.3]
export const headerIconButtonClassName = cn(buttonVariants({variant: 'plain', size: 'icon-md'}))

// 시안의 아이콘 간격 20px. 인접 버튼의 클릭 영역이 서로 겹치지 않는 간격이다. [KWCAG 6.1.3]
// 전경색을 그룹에 명시해 가이드의 .light/.dark/.mainpage 강제 테마 안에서도 아이콘 대비를 유지한다.
// 전체 메뉴가 열리면 닫기(X) 버튼만 어두운 오버레이 위에 남으므로 그 동안은 메뉴 면의 전경색을 쓴다 —
// 라이트 테마의 text-foreground(gray.900)를 그대로 두면 어두운 면에 묻혀 닫을 방법이 보이지 않는다.
// 색 전환 시간·이징은 시트가 걷히는 값과 같다 — 닫는 동안 X 아이콘만 먼저 색이 돌아오면
// 아직 어두운 면 위에서 잠깐 사라진 것처럼 보인다.
export const headerIconGroupClassName =
    'text-foreground has-[[data-header-menu-trigger][aria-expanded=true]]:text-menu-overlay-foreground ml-auto flex items-center gap-5 transition-colors duration-200 ease-in-out motion-reduce:transition-none'

// PROJECT-STYLE: GNB 드롭다운 패널 — 시안 "메뉴"(40006715:25214) 기준.
// 흰 면(popover)·radius 8(rounded-sm)·안쪽 여백 24(p-6)·항목 간격 24(gap-6)·최소 폭 144(min-w-36).
// 위치는 트리거 글자의 왼쪽선에 맞춰 헤더 아래에 붙는다 — 시안의 패널 x가 GNB 텍스트 x와 같고(62709),
// 패널 y가 헤더 하단(84548)과 같다. 트리거 상자가 헤더 아래보다 12px 위에서 끝나므로 mt-3으로 채운다.
// 셸(ui/navigation-menu)의 기본 패널 스타일은 group-data-[viewport=false] 접두사가 붙어 있어,
// 같은 접두사로 써야 덮인다(접두사 없는 유틸은 특이도에서 밀린다).
// 폭은 항목을 감싸는 만큼(min 144) 늘어난다 — 셸 기본값으로는 긴 항목이 줄바꿈된다.
//
// 나타나는 방식은 평범한 드롭다운(제자리 페이드)으로 되돌린다. 셸은 메뉴 사이를 옮길 때 data-motion 으로
// 패널을 가로로 밀고(±13rem) 열 때 확대(95%)까지 넣는데, 메뉴를 훑으면 패널이 좌우로 휙휙 미끄러져 보인다.
// [SC-01] 예외: tw-animate 의 translate/scale 변수를 직접 0·1 로 둔다 — slide-in-from-*-0 같은 유틸로는
// 못 덮는다(생성 CSS 에서 -52 규칙이 뒤에 와서 이긴다). 셸 규칙과 같은 조건을 붙여야 적용된다.
//
// 마지막 세 줄은 항목의 포커스 표시를 되살린다 — 셸이 패널 안 링크에 focus:outline-none·ring-0 을
// 걸어 두어 키보드로 들어가도 어디에 있는지 보이지 않았다[6.1.2]. 셸 규칙과 같은 자손 조건(**:)으로
// 써야 특이도가 맞고, focus-visible 이 focus 보다 뒤에 생성돼 이긴다.
export const headerNavDropdownClassName =
    'flex min-w-36 flex-col gap-6 p-6 whitespace-nowrap group-data-[viewport=false]/navigation-menu:mt-3 group-data-[viewport=false]/navigation-menu:rounded-sm group-data-[viewport=false]/navigation-menu:shadow-md group-data-[viewport=false]/navigation-menu:ring-0 data-[motion^=from-]:[--tw-enter-translate-x:0] data-[motion^=to-]:[--tw-exit-translate-x:0] group-data-[viewport=false]/navigation-menu:data-open:[--tw-enter-scale:1] group-data-[viewport=false]/navigation-menu:data-closed:[--tw-exit-scale:1] **:data-[slot=navigation-menu-link]:focus-visible:outline-2 **:data-[slot=navigation-menu-link]:focus-visible:outline-offset-2 **:data-[slot=navigation-menu-link]:focus-visible:outline-solid'

// 드롭다운 항목 — 기본은 16px Medium(label-foreground)이고, 시안처럼 hover·현재 위치를 굵기로 구분한다
// (foreground + Bold). typo-* 는 variant 를 못 받는 plain 클래스라 굵기만 font-bold 로 덮는다(pagination 과 같은 방식).
// 굵어지면 글자 폭이 약간 늘어 패널 폭도 그만큼 따라간다 — 항목 수가 적고 변화가 작아 그대로 둔다.
// 포커스 링 모서리는 rounded-2xs(4px) — 셸 기본값 rounded-md(12px)는 글자만 감싸는 24px 높이 상자에
// 비해 지나치게 둥글다. 셸 규칙이 in-data-[slot=…] 조건을 달고 있어 같은 조건으로 써야 덮인다.
// outline-ring 은 평상시에도 지정한다 — outline-color 기본값이 currentColor 라 포커스 순간 글자색에서
// 링 색으로 번지듯 전환된다(button.variants 와 같은 이유).
export const headerNavDropdownItemClassName =
    'typo-body-xl-medium text-label-foreground outline-ring hover:text-foreground focus-visible:text-foreground aria-[current=page]:text-foreground w-fit in-data-[slot=navigation-menu-content]:rounded-2xs p-0 outline-none hover:bg-transparent focus:bg-transparent hover:font-bold focus-visible:font-bold aria-[current=page]:font-bold'

// GNB 트리거 — 하위 메뉴가 있는 항목은 링크가 아니라 버튼이 된다. 셸이 붙이는 컨트롤 외형(높이·면·여백)과
// 기본 chevron 아이콘은 시안에 없으므로 지운다. 글자 크기는 사용처에서 typo 클래스로 덧붙인다.
export const headerNavTriggerClassName =
    'text-foreground min-h-11 rounded-none px-0 py-0 whitespace-nowrap hover:bg-transparent focus:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent [&>svg]:hidden'

// 전체 메뉴가 열릴 때 함께 가려지는 헤더 요소(로고·GNB·테마 버튼)의 사라짐/나타남.
// invisible 로 즉시 껐다 켜면 메뉴가 덮이는 순간 뚝 끊겨 보이므로 투명도로 전환한다.
// 자리는 그대로 두므로(레이아웃 유지) 남은 요소가 튀지 않는다. [KWCAG 6.3.1] prefers-reduced-motion 존중.
export const headerHiddenWhenMenuOpenClassName =
    'transition-opacity duration-200 ease-out motion-reduce:transition-none'
