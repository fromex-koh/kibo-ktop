// PROJECT-STYLE: 한 문항은 [체크박스][배지][본문] 순서로 왼쪽부터 놓인다(시안 실측 — 체크박스 24 ·
// 칸 사이 8 · 배지 60). 체크박스가 없는 행은 배지나 본문이 그 자리를 그대로 차지하므로(시안 17번 문항),
// 칸을 예약하는 grid 가 아니라 flex 로 두고 gap 으로 간격을 준다.
const questionListClassName = 'flex flex-col gap-6'
const questionItemClassName = 'flex items-start gap-2'
const questionBadgeClassName = 'flex min-h-6 items-start'
const questionContentClassName = 'flex min-w-0 flex-1 flex-col'
const questionBodyClassName = 'typo-body-xl-regular text-label-foreground flex flex-wrap items-center gap-x-2 gap-y-2'
const questionDescriptionClassName = 'typo-caption-regular text-foreground-subtle'
const questionHelperClassName = 'typo-body-l-regular text-label-foreground mt-2'
// 체크박스 칸 — 본문 첫 줄(24) 높이에 맞춰 세로 중앙에 둔다.
const questionControlClassName = 'flex min-h-6 items-center'
// PROJECT-STYLE: 인라인 Select/Chip이 있는 행은 첫 줄이 40px 컨트롤 높이라
// 체크박스를 그 라인 중앙(control-h-sm)에 맞춘다. 순수 텍스트 행은 24px 라인 기준 상단 정렬.
const questionControlLineClassName = 'min-h-control-h-sm'
// PROJECT-STYLE: 컨트롤 라인(첫 줄 40px) 행의 Badge는 줄 중앙이 아니라 '첫 텍스트 줄 윗변'에 맞춘다 —
// 시안 실측 기준 배지 상단과 문장 상단이 같은 선이다. pt-2(8px)는 24px 텍스트가 40px 줄 안에서
// 중앙에 놓일 때 생기는 위 여백 (40-24)/2 다.
const questionBadgeControlLineClassName = 'min-h-control-h-sm items-start pt-2'
// PROJECT-STYLE: 문장 안에 선택값을 [ ] 로 보여주는 문항(시안 "li_복합형_셀렉트") — 문장 아래 줄에
// 선택 컨트롤이 온다. 선택값 토큰은 본문색이 아니라 primary 로 강조한다(시안 [3]·[선택] 표기).
const questionSelectClassName = 'flex w-full flex-col gap-2'
// 문장 줄 — 끝에 안내 버튼(action)이 붙으면 같은 줄에 8 간격으로 이어지고, 좁으면 다음 줄로 넘어간다.
const questionSelectSentenceClassName = 'flex flex-wrap items-center gap-x-2 gap-y-1'
const questionSelectValueClassName = 'text-primary'
// 트리거 폭 180px(시안 실측) — 문장 아래 줄에서 내용 길이와 무관하게 고정 폭이다.
const questionSelectTriggerClassName = 'w-45'
const questionOptionListClassName = 'flex w-full flex-col gap-2'
const questionOptionClassName = 'flex items-start gap-2'
const questionOptionContentClassName = 'typo-body-xl-regular text-label-foreground min-w-0 flex-1'

export {
    questionListClassName,
    questionItemClassName,
    questionBadgeClassName,
    questionBadgeControlLineClassName,
    questionContentClassName,
    questionBodyClassName,
    questionDescriptionClassName,
    questionHelperClassName,
    questionControlClassName,
    questionControlLineClassName,
    questionSelectClassName,
    questionSelectSentenceClassName,
    questionSelectValueClassName,
    questionSelectTriggerClassName,
    questionOptionListClassName,
    questionOptionClassName,
    questionOptionContentClassName,
}
