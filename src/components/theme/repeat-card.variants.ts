// PROJECT-STYLE: Figma "대표자 경력사항"·"핵심 기술 인력 현황"·"기술 개발 실적" 탭의 반복 카드 —
// 번호가 붙는 입력 묶음 한 장이다. 실측 996×414 · 라운드 8 · 안쪽 여백 24 · 줄 간격 24.
// 면은 따로 깔지 않는다 — 세 시안 모두 카드의 회색 채우기 레이어가 꺼져 있어 폼 카드의 흰 면 위에
// 테두리(subtle-3)로만 구분된다.
const repeatCardClassName = 'border-subtle-3 flex flex-col gap-6 rounded-sm border p-6'

// 머리 — [번호 제목] ... [접기/열기] [삭제].
const repeatCardHeaderClassName = 'flex items-center justify-between gap-4'
const repeatCardTitleClassName = 'typo-title-l-bold text-foreground'
const repeatCardActionsClassName = 'flex items-center gap-2'

// 접기/열기 — 글자 + 화살표 한 쌍이고, 상태에 따라 문구와 화살표가 바뀐다(시안 실측 문구 16/24 Medium · 화살표 16).
// 색 전환이 있는 컨트롤이라 평상시에도 outline-ring 을 지정해 포커스 링이 번지지 않게 한다[6.1.2].
const repeatCardToggleClassName =
    'group/repeat-toggle typo-body-xl-medium text-foreground outline-ring focus-visible:outline-ring rounded-2xs inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'
const repeatCardToggleOpenOnlyClassName = 'group-data-[state=closed]/repeat-toggle:hidden'
const repeatCardToggleClosedOnlyClassName = 'group-data-[state=open]/repeat-toggle:hidden'

// PROJECT-STYLE: 삭제는 24×24 정사각에 옅은 테두리다 — Button 의 가장 작은 아이콘 크기(icon-xs)는 32 이고
// tertiary 의 테두리는 gray.300 이라 시안(24 · subtle-3)과 다르다. 같은 시안의 조회·주소 검색 버튼은
// gray.300 이 맞으므로 tertiary 자체는 두고 이 컨트롤에서만 두 값을 덮는다.
const repeatCardDeleteClassName = 'border-subtle-3 size-6'

// 접힌 카드도 입력값을 잃지 않도록 내용을 계속 마운트해 두고 감추기만 한다(Radix 는 forceMount 면
// hidden 을 붙이지 않으므로 상태를 보고 직접 감춘다 — FormTabs 와 같은 방식).
const repeatCardContentClassName = 'flex flex-col gap-6 data-[state=closed]:hidden'

export {
    repeatCardActionsClassName,
    repeatCardClassName,
    repeatCardContentClassName,
    repeatCardDeleteClassName,
    repeatCardHeaderClassName,
    repeatCardTitleClassName,
    repeatCardToggleClassName,
    repeatCardToggleClosedOnlyClassName,
    repeatCardToggleOpenOnlyClassName,
}
