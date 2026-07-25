// PROJECT-STYLE: 가로 간격은 열마다 달라(번호·배지 뒤 8px, 본문↔체크박스 24px) 그리드 gap 대신
// 각 칸의 padding 으로 준다. 배지 칸은 비어 있을 때 자리를 차지하면 안 되므로 내용이 있을 때만 여백을 준다
// (칸 자체는 subgrid 열 순서를 지키려 항상 렌더한다).
const questionListClassName = 'grid grid-cols-[auto_auto_minmax(0,1fr)_auto] gap-x-0 gap-y-6'
const questionItemClassName = 'col-span-full grid grid-cols-subgrid items-start'
const questionNumberClassName = 'typo-body-xl-bold text-foreground tabular-nums flex min-h-6 items-center pr-2'
const questionBadgeClassName = 'flex min-h-6 items-start not-empty:pr-2'
const questionContentClassName = 'flex min-w-0 flex-col'
const questionBodyClassName = 'typo-body-xl-regular text-label-foreground flex flex-wrap items-center gap-x-2 gap-y-2'
const questionDescriptionClassName = 'typo-caption-regular text-foreground-subtle'
const questionHelperClassName = 'typo-body-l-regular text-label-foreground mt-2'
// PROJECT-STYLE: 본문↔우측 체크박스 간격은 24px 다(시안 실측 — 본문 끝 948 → 체크박스 972).
const questionControlClassName = 'flex min-h-6 items-center pl-6'
// PROJECT-STYLE: 인라인 Select/Chip이 있는 행은 첫 줄이 40px 컨트롤 높이라
// 번호·체크박스를 그 라인 중앙(control-h-md)에 맞춘다. 순수 텍스트 행은 24px 라인 기준 상단 정렬.
const questionControlLineClassName = 'min-h-control-h-md'
// PROJECT-STYLE: 컨트롤 라인(첫 줄 40px) 행의 Badge는 줄 중앙이 아니라 '첫 텍스트 줄 윗변'에 맞춘다 —
// 시안 실측 기준 배지 상단과 문장 상단이 같은 선이다. pt-2(8px)는 24px 텍스트가 40px 줄 안에서
// 중앙에 놓일 때 생기는 위 여백 (40-24)/2 다.
const questionBadgeControlLineClassName = 'min-h-control-h-md items-start pt-2'
// PROJECT-STYLE: 우측 컨트롤이 없는 문항은 본문이 컨트롤 열까지 확장되어야
// 하위 항목(QuestionOption)의 체크박스가 목록 우측 끝(메인 체크박스 열)에 정렬된다.
const questionContentFillClassName = 'col-span-2'
// PROJECT-STYLE: 문장 안에 선택값을 [ ] 로 보여주는 문항(시안 "li_복합형_셀렉트") — 문장 아래 줄에
// 선택 컨트롤이 온다. 선택값 토큰은 본문색이 아니라 primary 로 강조한다(시안 [3]·[선택] 표기).
const questionSelectClassName = 'flex w-full flex-col gap-2'
const questionSelectValueClassName = 'text-primary'
// 트리거 폭 180px(시안 실측) — 문장 아래 줄에서 내용 길이와 무관하게 고정 폭이다.
const questionSelectTriggerClassName = 'w-45'
const questionOptionListClassName = 'flex w-full flex-col gap-2'
const questionOptionClassName = 'grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-0 gap-y-1'
const questionOptionNumberClassName = 'typo-body-xl-regular text-label-foreground tabular-nums pr-2'
const questionOptionContentClassName = 'typo-body-xl-regular text-label-foreground min-w-0'

export {
    questionListClassName,
    questionItemClassName,
    questionNumberClassName,
    questionBadgeClassName,
    questionBadgeControlLineClassName,
    questionContentClassName,
    questionBodyClassName,
    questionDescriptionClassName,
    questionHelperClassName,
    questionContentFillClassName,
    questionControlClassName,
    questionControlLineClassName,
    questionSelectClassName,
    questionSelectValueClassName,
    questionSelectTriggerClassName,
    questionOptionListClassName,
    questionOptionClassName,
    questionOptionNumberClassName,
    questionOptionContentClassName,
}
