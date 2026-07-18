const questionListClassName = 'grid grid-cols-[auto_auto_minmax(0,1fr)_auto] gap-x-2 gap-y-6'
const questionItemClassName = 'col-span-full grid grid-cols-subgrid items-start'
const questionNumberClassName = 'typo-body-xl-bold text-foreground tabular-nums flex min-h-6 items-center'
const questionBadgeClassName = 'flex min-h-6 items-start'
const questionContentClassName = 'flex min-w-0 flex-col'
const questionBodyClassName = 'typo-body-xl-regular text-label-foreground flex flex-wrap items-center gap-x-2 gap-y-2'
const questionDescriptionClassName = 'typo-caption-regular text-foreground-subtle'
const questionHelperClassName = 'typo-body-l-regular text-label-foreground mt-2'
const questionControlClassName = 'flex min-h-6 items-center'
// PROJECT-STYLE: 인라인 Select/Chip이 있는 행은 첫 줄이 40px 컨트롤 높이라
// 번호·체크박스를 그 라인 중앙(control-h-md)에 맞춘다. 순수 텍스트 행은 24px 라인 기준 상단 정렬.
const questionControlLineClassName = 'min-h-control-h-md'
// PROJECT-STYLE: 컨트롤 라인 행에서는 Badge도 40px 첫 줄 중앙에 맞춘다(칩 가이드 인라인 예시와 동일).
const questionBadgeControlLineClassName = 'min-h-control-h-md items-center'
// PROJECT-STYLE: 우측 컨트롤이 없는 문항은 본문이 컨트롤 열까지 확장되어야
// 하위 항목(QuestionOption)의 체크박스가 목록 우측 끝(메인 체크박스 열)에 정렬된다.
const questionContentFillClassName = 'col-span-2'
const questionOptionListClassName = 'flex w-full flex-col gap-2'
const questionOptionClassName = 'grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1'
const questionOptionNumberClassName = 'typo-body-xl-regular text-label-foreground tabular-nums'
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
    questionOptionListClassName,
    questionOptionClassName,
    questionOptionNumberClassName,
    questionOptionContentClassName,
}
