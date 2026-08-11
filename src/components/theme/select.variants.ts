// PROJECT-STYLE: dark:disabled:hover:bg-field-disabled 는 색을 모드별로 나눈 것이 아니라(같은 토큰),
// shadcn 셸의 dark:hover:bg-input/50 을 같은 변형 깊이에서 덮기 위한 방어다. 셸의 그 규칙이 사라지면 함께 지운다.
// PROJECT-STYLE: 시안 select_box(40006650:30085·30099·30113)는 default·focused·completed 의 글자색이
// 모두 gray.700(#32363b) 이다 — Input·Textarea·DatePicker 처럼 선택 전을 옅은 gray.500 으로 두지 않는다.
// 그래서 placeholder 도 같은 text-label-foreground 로 둔다 — 셸이 data-placeholder:text-muted-foreground 를
// 갖고 있어 지우기만 해서는 안 되고 같은 변형에서 명시적으로 덮어야 한다.
// 목록에서 고르는 컨트롤이라 값이 비어도 '선택해 주세요' 자체가 안내 문구 역할을 한다는 판단으로 보인다.
// disabled 일 때만 흐려지도록 disabled:data-placeholder:text-disabled 는 남긴다.
// PROJECT-STYLE: 검사에 걸린 칸(aria-invalid)은 focus-visible 이 아니라 focus 에도 포커스 표시를 낸다.
// 제출 버튼을 마우스로 누른 뒤 첫 오류 칸으로 포커스를 옮기면 브라우저가 :focus-visible 을 켜지 않아
// 표시가 보이지 않는다 — 어디로 이동했는지 알 수 없으면 안 된다[6.1.2].
const selectTriggerClassName =
    'group/select-trigger border-control bg-surface text-label-foreground focus-visible:border-primary outline-ring focus-visible:outline-ring data-[state=open]:border-primary data-[state=open]:outline-ring aria-invalid:border-destructive data-placeholder:text-label-foreground data-[size=default]:data-[project-size=lg]:h-control-h-md aria-readonly:bg-field-disabled disabled:border-control disabled:bg-field-disabled disabled:text-disabled disabled:data-placeholder:text-disabled disabled:hover:bg-field-disabled dark:disabled:hover:bg-field-disabled data-[size=default]:data-[project-size=md]:h-control-h-sm flex items-center justify-between gap-1.5 rounded-sm border whitespace-nowrap typo-body-xl-regular transition-colors outline-none select-none focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid aria-invalid:focus:outline-2 aria-invalid:focus:outline-offset-2 aria-invalid:focus:outline-solid disabled:cursor-not-allowed disabled:opacity-100 aria-invalid:ring-0 data-[size=default]:px-4 data-[project-size=md]:px-4 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 data-[state=open]:outline-2 data-[state=open]:outline-offset-2 data-[state=open]:outline-solid [&>svg]:size-5 [&_svg]:text-foreground disabled:[&_svg]:text-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0'
// PROJECT-STYLE: 시안 select_text(40006671:23491) — 면·테두리 없이 글자와 화살표만 두는 선택 컨트롤.
// 목록은 시스템 드롭다운(네이티브 select)이 그리므로 여기서는 트리거 겉모습만 정의한다.
// 상자 높이 대신 글자 줄 높이가 크기를 정한다 — lg 24/36 Bold · md 20/30 Medium · sm 16/24 Medium,
// 화살표는 24 · 20 · 16. 안쪽 여백은 좌우 4 뿐이고 위아래는 0 이다 — 시안 상자 높이(36·30·24)가
// 글자 줄 높이와 같고 hover 면도 같은 상자다. 글자↔화살표 간격 4, hover·pressed 는 gray.50 면 + radius 4.
// 포커스링은 select 요소에 그려지므로 select 에도 같은 radius(4)를 준다 — 안 주면 둥근 면 위에 각진 링이 그려진다.
// 화살표는 select 위에 겹쳐 놓고 pointer-events-none 을 준다 — 화살표 위를 눌러도 목록이 열려야 하고,
// 네이티브 화살표는 appearance-none 으로 지운다([ST-005] 아이콘 배치 목적의 absolute 허용 범위).
const selectTextWrapperClassName =
    'group/select-text text-foreground interactive:hover:bg-accent-subtle interactive:active:bg-accent-subtle relative inline-flex w-fit items-center rounded-2xs transition-colors has-[select:disabled]:cursor-not-allowed has-[select:disabled]:text-disabled'
// 오른쪽 여백 = 화살표 + 간격 4 + 바깥 여백 4 (lg 24→32 · md 20→28 · sm 16→24)
const selectTextControlClassName =
    'text-foreground outline-ring w-full cursor-pointer appearance-none rounded-2xs border-0 bg-transparent py-0 pl-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring disabled:cursor-not-allowed disabled:text-disabled group-data-[project-size=lg]/select-text:pr-8 group-data-[project-size=lg]/select-text:text-2xl group-data-[project-size=lg]/select-text:leading-9 group-data-[project-size=lg]/select-text:font-bold group-data-[project-size=md]/select-text:pr-7 group-data-[project-size=md]/select-text:text-xl group-data-[project-size=md]/select-text:leading-[--spacing(7.5)] group-data-[project-size=md]/select-text:font-medium group-data-[project-size=sm]/select-text:pr-6 group-data-[project-size=sm]/select-text:text-base group-data-[project-size=sm]/select-text:leading-6 group-data-[project-size=sm]/select-text:font-medium'
const selectTextIconClassName =
    'pointer-events-none absolute right-1 shrink-0 group-data-[project-size=lg]/select-text:size-icon-lg group-data-[project-size=md]/select-text:size-icon-md group-data-[project-size=sm]/select-text:size-icon-sm'
// PROJECT-STYLE: shadcn 원본 드롭다운은 rounded-lg + ring-1 + 여백 없음이지만,
// Figma 는 radius 8 · gray.200 테두리 1px · 안쪽 여백 8px 이라 rounded-sm/border-subtle-2/p-2 를 쓰고 ring 은 끈다.
// 폭은 트리거와 같다(시안 40006671:23294 — 트리거 360, 패널 360). 셸은 안쪽 뷰포트에 트리거 폭만큼
// min-width 를 걸어 두는데, 그러면 패널이 그 위에 안쪽 여백 16 + 테두리 2 만큼 더 넓어진다(378).
// 뷰포트의 min-width 를 풀고 패널 자체를 트리거 폭으로 잡아 시안과 맞춘다.
// [SC-01] 예외: --radix-select-trigger-width 는 Radix 가 런타임에 재는 값이라 토큰으로 대체할 수 없다.
// 목록은 Portal 로 body 끝에 붙는다 — 셸 기본 z-50 이면 모달(z-modal 1500) 위에서 열 때 카드 뒤로 숨는다.
// 헤더(1200)·모달(1500)보다 위인 z-popover(1600)를 쓴다(DatePicker 달력과 같은 자리)[CD-002].
//
// 높이 — 시안(40006952:36462)의 목록은 208(위아래 여백 8 + 항목 48 × 4)이다. 항목이 더 많으면 그 높이에서
// 멈추고 목록 안에서 스크롤한다. 화면 아래 공간이 208 보다 좁을 때는 radix 가 알려주는 남은 높이를 따른다 —
// 둘 중 작은 값이라 화면 밖으로 밀려나지 않는다([SC-01] 예외: 토큰 --spacing 과 radix 런타임 변수를 묶는 계산).
const selectContentClassName =
    'border-subtle-2 z-popover max-h-[min(--spacing(52),var(--radix-select-content-available-height))] w-(--radix-select-trigger-width) rounded-sm border p-2 ring-0 [&_[data-position=popper]]:min-w-0'
// PROJECT-STYLE: 옵션은 Figma 스펙(높이 48 · radius 8 · 좌우 여백 8 · 16px Regular)을 따른다.
// hover/키보드 하이라이트는 primary-subtle(blue.50) 면, 선택된 옵션은 배경 없이
// select-selected-foreground(navy.600) + Medium 로만 구분한다. 시안에 체크 아이콘이 없어
// 셸이 그리는 인디케이터 칸은 숨기고(구조는 그대로) 좌우 여백을 대칭으로 맞춘다.
// 셸 기본 cursor-default 대신 cursor-pointer 를 쓴다 — 눌러서 값을 고르는 항목이라 손가락 커서가 맞다.
// 비활성 항목은 data-disabled:pointer-events-none 이 걸려 있어 이 커서가 적용되지 않는다.
const selectItemClassName =
    "text-label-foreground focus:bg-primary-subtle focus:text-label-foreground not-data-[variant=destructive]:focus:**:text-inherit data-[state=checked]:text-select-selected-foreground data-disabled:text-disabled h-control-h-md rounded-sm relative flex w-full cursor-pointer items-center gap-1.5 px-2 outline-hidden typo-body-xl-regular select-none data-[state=checked]:font-medium data-disabled:pointer-events-none data-disabled:opacity-100 [&>span:first-child]:hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"

export {
    selectContentClassName,
    selectItemClassName,
    selectTextControlClassName,
    selectTextIconClassName,
    selectTextWrapperClassName,
    selectTriggerClassName,
}
