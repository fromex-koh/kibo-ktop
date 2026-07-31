// PROJECT-STYLE: 시안 text_input(40006650:29690)의 focused 상태에 붙는 지우기 버튼 스타일이다.
// gap-6 — 입력 영역과 지우기 버튼 사이가 24px 이다(시안: 글자 영역 284 + 24 + 아이콘 20 + 좌우 여백 16 = 360).
// InputGroup 기본 gap-2 를 덮는다.
const clearableInputGroupClassName = 'gap-6'

// h-full — 애드온에 검색 버튼처럼 상자 높이를 채우는 액션이 함께 들어올 수 있다.
const clearableInputAddonClassName = 'h-full p-0'

// 평상시엔 숨기고 필드에 포커스가 있는 동안에만 드러낸다 — 시안은 focused 에만 지우기 버튼이 있고
// completed(값은 있으나 포커스 없음)에는 없다. display 가 아니라 visibility 로 감춰야 버튼을 누르는
// 순간(포커스가 입력 → 버튼으로 옮겨가는 사이)에도 사라지지 않는다.
// 애드온이 아니라 버튼에 거는 이유 — 애드온에 함께 놓인 다른 요소(검색 버튼 등)는 계속 보여야 한다.
const clearableInputClearButtonClassName = 'invisible group-focus-within/input-group:visible'

// 시안 icon/fill-circle-clear-gray — gray.200 원 안에 흰 X. Icon 의 solid 는 gray.700 원(강조용)이라
// 같은 배지 모양에 옅은 색만 바꿔 쓴다.
const clearableInputIconClassName = 'bg-icon-solid-subtle text-icon-solid-subtle-foreground size-icon-md'

export {
    clearableInputGroupClassName,
    clearableInputAddonClassName,
    clearableInputClearButtonClassName,
    clearableInputIconClassName,
}
