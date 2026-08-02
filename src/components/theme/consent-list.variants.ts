// PROJECT-STYLE: Figma "동의" 행 — [필수/선택 배지][제목 + 내용보기][동의/비동의 컨트롤] 한 줄 구성.
// 제목은 20px Medium(label-foreground), 설명은 16px Regular(foreground-subtle)에 대시 마커가 붙는다.
// 배지는 제목 줄(32px) 중앙에, 우측 컨트롤은 항목 전체 높이의 중앙에 정렬한다(시안 실측).
// 항목 간격 40px — 시안의 [기업]·[개인] 동의서 카드 모두 행 간격이 40px 다(행 높이 32·60 모두 동일 간격).
const consentListClassName = 'flex list-none flex-col gap-10'

const consentItemClassName = 'grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2'

// 배지 칸 — 제목 줄 높이(32px) 안에서 세로 중앙.
const consentBadgeClassName = 'flex min-h-8 items-center'

const consentContentClassName = 'flex min-w-0 flex-col gap-1'

// 제목 줄 — 제목과 "내용보기" 같은 인라인 액션이 나란히 온다. 좁은 폭에서는 줄바꿈한다.
const consentTitleRowClassName = 'flex min-h-8 flex-wrap items-center gap-2'

const consentTitleClassName = 'typo-title-l-medium text-label-foreground'

// 안내 문구 — 대시 마커와 본문 사이 간격은 ListMarker 가 자기 폭에 포함하므로 행에 gap 을 두지 않는다.
const consentDescriptionClassName = 'typo-body-xl-regular text-foreground-subtle flex'

// 우측 컨트롤 — 시안은 항목 전체 높이 기준 중앙 정렬이라 설명 유무와 관계없이 가운데 온다.
const consentControlClassName = 'flex shrink-0 items-center self-center pl-4'

export {
    consentBadgeClassName,
    consentContentClassName,
    consentControlClassName,
    consentDescriptionClassName,
    consentItemClassName,
    consentListClassName,
    consentTitleClassName,
    consentTitleRowClassName,
}
